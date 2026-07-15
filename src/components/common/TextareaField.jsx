import clsx from "clsx";

function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  error = "",
  helperText = "",
  required = false,
  disabled = false,
  maxLength,
  className = "",
}) {
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

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        className={clsx(
          "w-full resize-none rounded-xl border bg-white",
          "px-4 py-3 text-sm font-medium text-slate-900",
          "outline-none transition-all duration-200",
          "placeholder:text-slate-400",
          "dark:bg-slate-950/70 dark:text-white",
          "dark:placeholder:text-slate-500",
          "disabled:cursor-not-allowed disabled:opacity-60",
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

      <div className="mt-1.5 flex items-center justify-between gap-3">
        <div>
          {error ? (
            <p className="text-xs font-medium text-rose-500">
              {error}
            </p>
          ) : (
            helperText && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {helperText}
              </p>
            )
          )}
        </div>

        {maxLength && (
          <p className="shrink-0 text-xs text-slate-400">
            {String(value || "").length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}

export default TextareaField;