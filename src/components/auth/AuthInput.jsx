import {
  Eye,
  EyeOff,
} from "lucide-react";

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
  disabled = false,
  showPassword = false,
  onTogglePassword,
}) {
  const isPassword =
    type === "password";

  const resolvedType =
    isPassword && showPassword
      ? "text"
      : type;

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`
              pointer-events-none
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              ${
                error
                  ? "text-rose-400"
                  : "text-slate-500"
              }
            `}
          />
        )}

        <input
          id={name}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
            h-12
            w-full
            rounded-xl
            border
            bg-gradient-to-r
            from-[#03091a]
            to-[#050d23]
            text-sm
            text-white
            outline-none
            transition
            duration-300
            placeholder:text-slate-600
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${Icon ? "pl-12" : "pl-4"}
            ${isPassword ? "pr-12" : "pr-4"}
            ${
              error
                ? "border-rose-400/60 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10"
                : "border-white/[0.12] hover:border-cyan-400/25 focus:border-cyan-400/70 focus:bg-[#040c20] focus:ring-4 focus:ring-cyan-400/10"
            }
          `}
        />

        {isPassword &&
          onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              disabled={disabled}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-cyan-300 disabled:cursor-not-allowed"
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
        <p className="mt-1.5 text-xs font-medium text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthInput;