export type Ingredient = 'vanilla' | 'strawberry' | 'chocolate' | 'sprinkles' | 'rareSprinkles' | 'superRareSprinkles' | 'epicSprinkles' | 'mythicSprinkles' | 'legendarySprinkles' | 'ultraSprinkles'
export type Recipe = Record<Ingredient, number>
export type Order = Recipe & { id: string }
export type Station = {
  recipe: Recipe
  orderId: string | null
  targetRecipe: Recipe | null
  startedAt: number | null
  status: 'empty' | 'brewing' | 'overflow'
}

export const ingredients: Ingredient[] = ['vanilla', 'strawberry', 'chocolate', 'sprinkles', 'rareSprinkles', 'superRareSprinkles', 'epicSprinkles', 'mythicSprinkles', 'legendarySprinkles', 'ultraSprinkles']
export const scoopIngredients: Ingredient[] = ['vanilla', 'strawberry', 'chocolate']
export const sprinkleIngredients: Ingredient[] = ['sprinkles', 'rareSprinkles', 'superRareSprinkles', 'epicSprinkles', 'mythicSprinkles', 'legendarySprinkles', 'ultraSprinkles']
export const EMPTY_RECIPE: Recipe = { vanilla: 0, strawberry: 0, chocolate: 0, sprinkles: 0, rareSprinkles: 0, superRareSprinkles: 0, epicSprinkles: 0, mythicSprinkles: 0, legendarySprinkles: 0, ultraSprinkles: 0 }
export const GAME_SECONDS = 120
export const TARGET_ORDERS = 15
export const BREW_TIME = 5200

const baseChoices: Recipe[] = [
  { ...EMPTY_RECIPE, vanilla: 1 }, { ...EMPTY_RECIPE, vanilla: 1, chocolate: 1 },
  { ...EMPTY_RECIPE, vanilla: 1, strawberry: 1 }, { ...EMPTY_RECIPE, vanilla: 1, strawberry: 1, chocolate: 1 },
  { ...EMPTY_RECIPE, vanilla: 2, chocolate: 1 }, { ...EMPTY_RECIPE, vanilla: 2, strawberry: 1 },
  { ...EMPTY_RECIPE, vanilla: 2, strawberry: 1, chocolate: 1 }, { ...EMPTY_RECIPE, vanilla: 1, strawberry: 2, chocolate: 1 },
]

export const makeOrder = (rarityLevel = 0): Order => {
  const recipe = { ...baseChoices[Math.floor(Math.random() * baseChoices.length)] }
  recipe[sprinkleIngredients[Math.min(rarityLevel, sprinkleIngredients.length - 1)]] = 1
  return { ...recipe, id: crypto.randomUUID() }
}
export const makeStation = (): Station => ({ recipe: { ...EMPTY_RECIPE }, orderId: null, targetRecipe: null, startedAt: null, status: 'empty' })
export const sameRecipe = (one: Recipe, two: Recipe) => ingredients.every((item) => one[item] === two[item])
export const sameScoops = (one: Recipe, two: Recipe) => scoopIngredients.every((item) => one[item] === two[item])
export const fillLevel = (station: Station, now: number) => station.startedAt ? (now - station.startedAt) / BREW_TIME : 0
export const ingredientIcon: Record<Ingredient, string> = { vanilla: 'V', strawberry: 'S', chocolate: 'C', sprinkles: '★', rareSprinkles: '◆', superRareSprinkles: '◇', epicSprinkles: '✹', mythicSprinkles: '✧', legendarySprinkles: '✷', ultraSprinkles: '✦' }
export const ingredientName: Record<Ingredient, string> = { vanilla: 'Vanilla', strawberry: 'Strawberry', chocolate: 'Chocolate', sprinkles: 'Sprinkles', rareSprinkles: 'Rare', superRareSprinkles: 'Super Rare', epicSprinkles: 'Epic', mythicSprinkles: 'Mythic', legendarySprinkles: 'Legendary', ultraSprinkles: 'Ultra' }
