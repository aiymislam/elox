import { useState } from 'react'

type Props = { onStart: (names: string[]) => void }
const starterNames = ['Mira', 'Rowan', 'Jules', 'Sage', 'Iris', 'Orin', 'Vesper']

export function SetupScreen({ onStart }: Props) {
  const [names, setNames] = useState(starterNames)

  const updateName = (index: number, value: string) => {
    setNames((current) => current.map((name, itemIndex) => itemIndex === index ? value : name))
  }

  return (
    <main className="setup-page">
      <div className="moon" aria-hidden="true" />
      <section className="setup-card">
        <p className="eyebrow">A social deduction game</p>
        <h1>Bell <span>&</span> Ember</h1>
        <p className="lead">By dusk, the village debates. By midnight, the Shadow moves.</p>
        <div className="rule-strip">
          <span><b>7</b> players</span><i />
          <span><b>2</b> shadows</span><i />
          <span><b>1</b> device</span>
        </div>
        <div className="name-grid">
          {names.map((name, index) => (
            <label key={index}><span>{String(index + 1).padStart(2, '0')}</span>
              <input value={name} maxLength={14} onChange={(event) => updateName(index, event.target.value)} aria-label={`Player ${index + 1}`} />
            </label>
          ))}
        </div>
        <button className="primary-button" disabled={names.some((name) => !name.trim())} onClick={() => onStart(names.map((name) => name.trim()))}>
          Light the first lantern <span>→</span>
        </button>
        <p className="footnote">Pass the device. Keep your role secret.</p>
      </section>
    </main>
  )
}
