import type { DragEvent } from 'react'
import { fillLevel, ingredientIcon } from '../../lib/coffeeGame'
import type { Ingredient, Station } from '../../lib/coffeeGame'

type ProductMode = 'coffee' | 'iceCream'
type Props = { station: Station; now: number; index: number; selected: boolean; productMode: ProductMode; onSelect: () => void; onMake: () => void; onServe: () => void; onTrash: () => void; onDropIngredient: (ingredient: Ingredient) => void }

const isIngredient = (value: string): value is Ingredient => ['bean', 'milk', 'sugar'].includes(value)

export function BrewStation({ station, now, index, selected, productMode, onSelect, onMake, onServe, onTrash, onDropIngredient }: Props) {
  const level = fillLevel(station, now)
  const ready = station.status === 'brewing' && level >= .82 && level <= 1.08
  const ingredients: Ingredient[] = ['bean', 'milk', 'sugar']
  const hasIngredients = Object.values(station.recipe).some(Boolean)
  const dropIngredient = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    const ingredient = event.dataTransfer.getData('ingredient')
    if (isIngredient(ingredient)) onDropIngredient(ingredient)
  }
  return <article className={`brew-station ${selected ? 'selected' : ''} ${ready ? 'ready' : ''}`} onClick={onSelect} onDragOver={(event) => event.preventDefault()} onDrop={dropIngredient}>
    <div className="machine-top"><span>0{index + 1}</span><i /></div>
    <div className="spout" />
    <div className={`coffee-cup ${productMode === 'iceCream' ? 'ice-cream-cup' : ''}`}>
      {productMode === 'iceCream' && <div className="ice-cream-scoop"><i /><i /><i /></div>}
      <div className="coffee-fill" style={{ height: `${Math.min(level, 1) * 78}%` }} />
      {hasIngredients && station.status === 'empty' && <div className="boil-bubbles"><i /><i /><i /></div>}
      {station.status === 'overflow' && <div className="spill" />}
    </div>
    <div className="recipe-dots">{ingredients.flatMap((item) => Array.from({ length: station.recipe[item] }, (_, count) => <i className={item} key={`${item}-${count}`}>{ingredientIcon[item]}</i>))}</div>
    {station.status === 'empty' ? <button className="brew-button" onClick={(event) => { event.stopPropagation(); onMake() }}>MAKE</button> : station.status === 'overflow' ? <button className="trash-button" onClick={(event) => { event.stopPropagation(); onTrash() }}>TOSS CUP</button> : <button className={`serve-button ${ready ? 'lit' : ''}`} onClick={(event) => { event.stopPropagation(); onServe() }}>{ready ? 'SERVE!' : 'POURING'}</button>}
  </article>
}
