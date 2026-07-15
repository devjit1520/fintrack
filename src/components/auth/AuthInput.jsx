import { Eye, EyeOff } from "lucide-react";

function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  autoComplete,
  showPassword,
  onTogglePassword,
}) {
  const passwordField = type === "password";

  const inputType =
    passwordField && showPassword
      ? "text"
      : type;

  return (
    <div>
      <label
        htmlFor={name}
        className="
          mb-2
          block
          text-sm
          font-medium
          text-slate-700
          dark:text-slate-300
        "
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full
            rounded-xl
            border
            bg-white
            py-3
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:ring-4
            dark:bg-slate-950
            dark:text-white
            ${Icon ? "pl-11" : "pl-4"}
            ${
              passwordField
                ? "pr-12"
                : "pr-4"
            }
            ${
              error
                ? `
                  border-red-500
                  focus:border-red-500
                  focus:ring-red-500/10
                `
                : `
                  border-slate-200
                  focus:border-cyan-500
                  focus:ring-cyan-500/10
                  dark:border-slate-700
                `
            }
          `}
        />

        {passwordField && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-slate-100
              hover:text-slate-700
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthInput;