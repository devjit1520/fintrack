import clsx from "clsx";

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  helperText = "",
  icon: Icon,
  required = false,
  disabled = false,
  min,
  max,
  step,
  autoComplete,
  className = "",
}) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {label}

          {required && (
            <span className="ml-1 text-rose-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="group relative">
        {Icon && (
          <Icon
            size={18}
            className={clsx(
              "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2",
              "transition-colors duration-200",
              error
                ? "text-rose-500"
                : "text-slate-400 group-focus-within:text-cyan-500"
            )}
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={clsx(
            "h-12 w-full rounded-xl border bg-white",
            "text-sm font-medium text-slate-900",
            "outline-none transition-all duration-200",
            "placeholder:text-slate-400",
            "dark:bg-slate-950/70 dark:text-white",
            "dark:placeholder:text-slate-500",
            "disabled:cursor-not-allowed disabled:opacity-60",
            Icon ? "pl-11 pr-4" : "px-4",
            error
              ? [
                  "border-rose-400",
                  "focus:border-rose-500",
                  "focus:ring-4 focus:ring-rose-500/10",
                ]
              : [
                  "border-slate-200",
                  "focus:border-cyan-500",
                  "focus:ring-4 focus:ring-cyan-500/10",
                  "dark:border-slate-700",
                  "dark:focus:border-cyan-500",
                ]
          )}
        />
      </div>

      {error ? (
        <p
          id={errorId}
          className="mt-1.5 text-xs font-medium text-rose-500"
        >
          {error}
        </p>
      ) : (
        helperText && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

export default FormField;