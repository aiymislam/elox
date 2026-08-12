export type Ingredient = 'vanilla' | 'strawberry' | 'chocolate'
export type Recipe = Record<Ingredient, number>
export type Order = Recipe & { id: string }
export type Station = {
  recipe: Recipe
  orderId: string | null
  startedAt: number | null
  status: 'empty' | 'brewing' | 'overflow'
}

export const EMPTY_RECIPE: Recipe = { vanilla: 0, strawberry: 0, chocolate: 0 }
export const GAME_SECONDS = 120
export const TARGET_ORDERS = 15
export const BREW_TIME = 5200

const choices: Recipe[] = [
  { vanilla: 1, strawberry: 0, chocolate: 0 }, { vanilla: 1, strawberry: 0, chocolate: 1 },
  { vanilla: 1, strawberry: 1, chocolate: 0 }, { vanilla: 1, strawberry: 1, chocolate: 1 },
  { vanilla: 2, strawberry: 0, chocolate: 1 }, { vanilla: 2, strawberry: 1, chocolate: 0 },
  { vanilla: 2, strawberry: 1, chocolate: 1 }, { vanilla: 1, strawberry: 2, chocolate: 1 },
]

export const makeOrder = (): Order => ({ ...choices[Math.floor(Math.random() * choices.length)], id: crypto.randomUUID() })
export const makeStation = (): Station => ({ recipe: { ...EMPTY_RECIPE }, orderId: null, startedAt: null, status: 'empty' })
export const sameRecipe = (one: Recipe, two: Recipe) => one.vanilla === two.vanilla && one.strawberry === two.strawberry && one.chocolate === two.chocolate
export const fillLevel = (station: Station, now: number) => station.startedAt ? (now - station.startedAt) / BREW_TIME : 0
export const ingredientIcon: Record<Ingredient, string> = { vanilla: 'V', strawberry: 'S', chocolate: 'C' }
export const ingredientName: Record<Ingredient, string> = { vanilla: 'Vanilla', strawberry: 'Strawberry', chocolate: 'Chocolate' }
