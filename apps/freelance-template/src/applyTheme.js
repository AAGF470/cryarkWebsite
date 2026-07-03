// Theme = recipe + one brand color. The recipe fixes typography, neutrals,
// rhythm, corners, shadows, and expression defaults; the client's accent
// colors it. See @shared/lib/recipes for the catalog.
import { applyRecipe } from '@shared/lib/recipes'

export function applyTheme(accentColor, recipeId = 'bold-trade') {
  return applyRecipe(recipeId, accentColor)
}
