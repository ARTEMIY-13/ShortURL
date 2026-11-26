export default function FormField({ id, label, error, type = 'text', action, ...inputProps }) {
  return (
    <div className="pfield">
      <label htmlFor={id}>{label}</label>
      <div className="fwrap">
        <input
          id={id}
          type={type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
        {action}
      </div>
      {error && <div className="ferr" id={`${id}-error`} role="alert">{error}</div>}
    </div>
  )
}
