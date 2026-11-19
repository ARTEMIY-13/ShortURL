export default function Segmented({ label, options, value, onChange }) {
  return (
    <div className="lang" role="group" aria-label={label}>
      {options.map(([id, text]) => (
        <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)}>{text}</button>
      ))}
    </div>
  )
}
