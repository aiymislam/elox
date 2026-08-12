import { ingredientIcon } from '../../lib/coffeeGame'
import type { Ingredient, Order } from '../../lib/coffeeGame'

export function OrderTicket({ order, number }: { order: Order; number: number }) {
  const ingredients: Ingredient[] = ['bean', 'milk', 'sugar']
  return <article className="order-ticket">
    <div><span>ORDER</span><b>#{String(number).padStart(2, '0')}</b></div>
    <section>
      {ingredients.filter((item) => order[item] > 0).map((item) => <p key={item} className={item}>
        <i>{ingredientIcon[item]}</i><span>{Array.from({ length: order[item] }, (_, index) => <b key={index}>{ingredientIcon[item]}</b>)}</span>
      </p>)}
    </section>
  </article>
}
