#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────────────────────────
# leadfinder.py — score local-business websites for outreach potential.
#
# Feed it candidates (from browsing Google Maps/Yelp for a category + area),
# it probes each site once — like a single browser visit — and scores how
# badly the business needs a new website. High score = hot lead.
#
# Usage:
#   python3 tools/leadfinder.py leads.txt          # file: "Name | domain" per line
#   python3 tools/leadfinder.py gtc.us.com foo.com # or domains as args
#
# leads.txt lines:  Sunset Salon | sunsetsalon.com     (or just a domain;
#                   "Name |" with no domain = business with NO website = hottest)
#
# Output: ranked table + leads-scored-YYYYMMDD.csv (import into the tracker).
# Signals: dead DNS/site, broken TLS, 5xx/4xx, EOL PHP, no mobile viewport,
# stale copyright year, 2000s HTML, no HTTPS, ancient servers, slow response.
# One GET per site, honest User-Agent, 12s timeout. No crawling.
# ─────────────────────────────────────────────────────────────────────────────
import sys, re, ssl, csv, socket, datetime, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

UA = "Mozilla/5.0 (compatible; GuillenSolutions-SiteCheck/1.0; +https://guillensolutions.com)"
THIS_YEAR = datetime.date.today().year


import subprocess, tempfile, os

# curl exit codes → lead signals (curl is far more reliable against real-world
# hosts/WAFs than urllib; these map to the failure modes that matter).
CURL_DNS, CURL_CONN, CURL_TIMEOUT = (6,), (7, 52, 56), (28,)
CURL_TLS = (35, 53, 54, 58, 59, 60, 77, 82, 83)

def curl_probe(url):
    """Return (status, headers dict, body, seconds, final_url) or raise LeadSignal."""
    hf = tempfile.NamedTemporaryFile(delete=False, suffix=".h")
    bf = tempfile.NamedTemporaryFile(delete=False, suffix=".b")
    hf.close(); bf.close()
    try:
        r = subprocess.run(
            ["curl", "-sL", "-m", "12", "-A", UA, "-D", hf.name, "-o", bf.name,
             "-w", "%{http_code}|%{time_total}|%{url_effective}", url],
            capture_output=True, text=True, timeout=20)
        if r.returncode != 0:
            raise LeadSignal(r.returncode)
        code, t, final = r.stdout.strip().split("|", 2)
        raw = open(hf.name, errors="replace").read()
        block = [b for b in raw.strip().split("\n\n") if b.strip()][-1] if raw.strip() else ""
        headers = {}
        for line in block.splitlines()[1:]:
            if ":" in line:
                k, _, v = line.partition(":")
                headers[k.strip().lower()] = v.strip()
        body = open(bf.name, errors="replace").read(400_000)
        return int(code), headers, body, float(t), final
    finally:
        os.unlink(hf.name); os.unlink(bf.name)

class LeadSignal(Exception):
    def __init__(self, curl_code): self.curl_code = curl_code

def probe(name, domain):
    sig, score = [], 0
    if not domain:
        return dict(name=name, domain="(none)", score=95, verdict="NO WEBSITE",
                    signals="no website listed at all", http="-")
    domain = re.sub(r"^https?://", "", domain).strip().strip("/")
    status = headers = body = None; elapsed = 0.0; used = ""
    for scheme in ("https://", "http://"):
        try:
            status, headers, body, elapsed, final = curl_probe(scheme + domain)
            used = scheme
            break
        except LeadSignal as e:
            c = e.curl_code
            if c in CURL_DNS:
                return dict(name=name, domain=domain, score=95, verdict="DOMAIN DEAD",
                            signals="DNS does not resolve", http="-")
            if c in CURL_TLS:
                sig.append("broken HTTPS (TLS failure)"); score += 45; continue
            if scheme == "http://":
                why = "timed out" if c in CURL_TIMEOUT else f"unreachable (curl {c})"
                return dict(name=name, domain=domain, score=min(95, score + 90),
                            verdict="SITE DOWN", signals="; ".join(sig + [why]), http="-")
        except Exception as e:
            if scheme == "http://":
                return dict(name=name, domain=domain, score=min(95, score + 90),
                            verdict="SITE DOWN", signals=f"probe failed ({type(e).__name__})", http="-")
    if body is None:
        return dict(name=name, domain=domain, score=min(95, score + 90),
                    verdict="SITE DOWN", signals="; ".join(sig) or "unreachable", http="-")
    if used == "http://" and not any("TLS" in x for x in sig):
        sig.append("no HTTPS"); score += 25

    if status and status >= 500: sig.append(f"server error {status}"); score += 45
    elif status and status >= 400: sig.append(f"error {status}"); score += 30
    powered = headers.get("x-powered-by", "")
    m = re.search(r"PHP/(\d+)\.(\d+)", powered)
    if m:
        maj, mnr = int(m.group(1)), int(m.group(2))
        if maj < 8: sig.append(f"end-of-life PHP {maj}.{mnr} (no security patches)"); score += 30
    if re.search(r"Apache/2\.[02]\b", headers.get("server", "")): sig.append("very old Apache"); score += 10
    low = body.lower()
    if body and "viewport" not in low: sig.append("not mobile-responsive (no viewport)"); score += 25
    if re.search(r"<frameset|<font |\.swf\b|msofooter", low): sig.append("2000s-era HTML"); score += 25
    g = re.search(r'name=["\']generator["\'] content=["\']([^"\']+)', low)
    if g:
        gen = g.group(1)
        sig.append(f"built with: {gen.split(';')[0][:40]}")
        if re.search(r"wordpress [1-5]\.|homestead|weebly|godaddy", gen, re.I): score += 15
    yrs = [int(y) for y in re.findall(r"(?:©|&copy;|copyright)\D{0,20}(20\d\d)", low)]
    if yrs and max(yrs) < THIS_YEAR - 1: sig.append(f"copyright stuck at {max(yrs)}"); score += 20
    if elapsed > 4: sig.append(f"slow ({elapsed:.1f}s)"); score += 10
    score = min(score, 100)
    verdict = ("HOT — pitch now" if score >= 60 else
               "WARM — worth a look" if score >= 30 else "healthy")
    if not sig: sig = ["no obvious problems"]
    return dict(name=name, domain=domain, score=score, verdict=verdict,
                signals="; ".join(sig), http=f"{used}{status}")

def parse_input(argv):
    out = []
    if len(argv) == 1 and argv[0].endswith((".txt", ".csv")):
        for line in open(argv[0]):
            line = line.strip()
            if not line or line.startswith("#"): continue
            if "|" in line:
                n, _, d = line.partition("|")
                out.append((n.strip(), d.strip()))
            else:
                out.append((line, line))
    else:
        out = [(a, a) for a in argv]
    return out

def main():
    if len(sys.argv) < 2:
        print(__doc__ or "usage: leadfinder.py <leads.txt | domains...>"); sys.exit(1)
    cands = parse_input(sys.argv[1:])
    with ThreadPoolExecutor(max_workers=8) as ex:
        results = list(ex.map(lambda c: probe(*c), cands))
    results.sort(key=lambda r: -r["score"])
    w = max(len(r["name"]) for r in results) + 2
    print(f"\n{'SCORE':>5}  {'NAME':<{w}} {'VERDICT':<20} SIGNALS")
    for r in results:
        print(f"{r['score']:>5}  {r['name']:<{w}} {r['verdict']:<20} {r['signals']}  [{r['domain']} {r['http']}]")
    out = f"leads-scored-{datetime.date.today():%Y%m%d}.csv"
    with open(out, "w", newline="") as f:
        cw = csv.writer(f)
        cw.writerow(["Business", "Domain", "Score", "Verdict", "Signals", "HTTP"])
        for r in results: cw.writerow([r["name"], r["domain"], r["score"], r["verdict"], r["signals"], r["http"]])
    print(f"\n→ {out}")

if __name__ == "__main__":
    main()
