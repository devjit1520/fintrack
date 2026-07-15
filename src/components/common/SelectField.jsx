import { ChevronDown } from "lucide-react";
import clsx from "clsx";

function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  error = "",
  required = false,
  disabled = false,
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

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={clsx(
            "h-12 w-full appearance-none rounded-xl border",
            "bg-white px-4 pr-11 text-sm font-medium",
            "text-slate-900 outline-none",
            "transition-all duration-200",
            "dark:bg-slate-950/70 dark:text-white",
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
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default SelectField;