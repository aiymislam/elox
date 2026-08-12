export type Ingredient = 'bean' | 'milk' | 'sugar'
export type Recipe = Record<Ingredient, number>
export type Order = Recipe & { id: string }
export type Station = {
  recipe: Recipe
  orderId: string | null
  startedAt: number | null
  status: 'empty' | 'brewing' | 'overflow'
}

export const EMPTY_RECIPE: Recipe = { bean: 0, milk: 0, sugar: 0 }
export const GAME_SECONDS = 120
export const TARGET_ORDERS = 15
export const BREW_TIME = 5200

const choices: Recipe[] = [
  { bean: 1, milk: 0, sugar: 0 }, { bean: 1, milk: 0, sugar: 1 },
  { bean: 1, milk: 1, sugar: 0 }, { bean: 1, milk: 1, sugar: 1 },
  { bean: 2, milk: 0, sugar: 1 }, { bean: 2, milk: 1, sugar: 0 },
  { bean: 2, milk: 1, sugar: 1 }, { bean: 1, milk: 2, sugar: 1 },
]

export const makeOrder = (): Order => ({ ...choices[Math.floor(Math.random() * choices.length)], id: crypto.randomUUID() })
export const makeStation = (): Station => ({ recipe: { ...EMPTY_RECIPE }, orderId: null, startedAt: null, status: 'empty' })
export const sameRecipe = (one: Recipe, two: Recipe) => one.bean === two.bean && one.milk === two.milk && one.sugar === two.sugar
export const fillLevel = (station: Station, now: number) => station.startedAt ? (now - station.startedAt) / BREW_TIME : 0
export const ingredientIcon: Record<Ingredient, string> = { bean: '●', milk: '◒', sugar: '◆' }
export const ingredientName: Record<Ingredient, string> = { bean: 'Beans', milk: 'Milk', sugar: 'Sugar' }
