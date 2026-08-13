import type { DragEvent } from 'react'
import { fillLevel, ingredientIcon } from '../../lib/coffeeGame'
import type { Ingredient, Station } from '../../lib/coffeeGame'

type Props = { station: Station; now: number; index: number; selected: boolean; onSelect: () => void; onMake: () => void; onServe: () => void; onTrash: () => void; onDropIngredient: (ingredient: Ingredient) => void }

const ingredients: Ingredient[] = ['vanilla', 'strawberry', 'chocolate']
const isIngredient = (value: string): value is Ingredient => ingredients.includes(value as Ingredient)

export function BrewStation({ station, now, index, selected, onSelect, onMake, onServe, onTrash, onDropIngredient }: Props) {
  const level = fillLevel(station, now)
  const ready = station.status === 'brewing' && level >= .82 && level <= 1.08
  const hasIngredients = Object.values(station.recipe).some(Boolean)
  const showFinishedScoops = hasIngredients && station.status !== 'empty' && level >= .82
  const scoops = ingredients.flatMap((item) => Array.from({ length: station.recipe[item] }, () => item))
  const dropIngredient = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    const ingredient = event.dataTransfer.getData('ingredient')
    if (isIngredient(ingredient)) onDropIngredient(ingredient)
  }
  return <article className={`brew-station ${selected ? 'selected' : ''} ${ready ? 'ready' : ''}`} onClick={onSelect} onDragOver={(event) => event.preventDefault()} onDrop={dropIngredient}>
    <div className="machine-top"><span>0{index + 1}</span><i /></div>
    <div className="spout" />
    <div className="ice-cream-cone">
      {showFinishedScoops && <div className="ice-cream-scoop">
        {scoops.map((item, scoopIndex) => <i className={item} key={`${item}-${scoopIndex}`} />)}
      </div>}
      <div className="coffee-fill" style={{ height: `${Math.min(level, 1) * 78}%` }} />
      {hasIngredients && station.status === 'empty' && <div className="boil-bubbles"><i /><i /><i /></div>}
      {station.status === 'overflow' && <div className="spill" />}
    </div>
    <div className="recipe-dots">{ingredients.flatMap((item) => Array.from({ length: station.recipe[item] }, (_, count) => <i className={item} key={`${item}-${count}`}>{ingredientIcon[item]}</i>))}</div>
    {station.status === 'empty' ? <button className="brew-button" onClick={(event) => { event.stopPropagation(); onMake() }}>MAKE</button> : station.status === 'overflow' ? <button className="trash-button" onClick={(event) => { event.stopPropagation(); onTrash() }}>TOSS CONE</button> : <button className={`serve-button ${ready ? 'lit' : ''}`} onClick={(event) => { event.stopPropagation(); onServe() }}>{ready ? 'SERVE!' : 'MAKING'}</button>}
  </article>
}
