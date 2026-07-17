import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import AuthInput from "../../components/auth/AuthInput";
import AuthLoader from "../../components/auth/AuthLoader";

import useAuth from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    loading: authLoading,
    isAuthenticated,
    authError,
    clearAuthError,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] =
    useState(false);
  const [rememberMe, setRememberMe] =
    useState(false);
  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] = useState(
    location.state?.message || ""
  );

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [
    authLoading,
    isAuthenticated,
    navigate,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    clearAuthError();
    setMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    const email = formData.email.trim();

    if (!email) {
      nextErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password =
        "Password is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      clearAuthError();

      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!result?.success) {
        return;
      }

      const previousLocation =
        location.state?.from;

      const destination =
        typeof previousLocation === "string"
          ? previousLocation
          : previousLocation?.pathname ||
            "/dashboard";

      navigate(destination, {
        replace: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy =
    submitting || authLoading;

  return (
    <div className="w-full">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-semibold text-cyan-300">
          <Sparkles size={14} />
          Welcome back
        </div>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-[38px] sm:leading-tight">
          Sign in to your
          <span className="ml-2 bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
            account
          </span>
        </h2>

        <p className="mt-2.5 max-w-md text-sm leading-6 text-slate-400">
          Continue managing your transactions,
          budgets, savings goals, and analytics.
        </p>
      </div>

      {/* Security information */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.035] px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
          <ShieldCheck size={18} />
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            Protected account access
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            Your session is securely managed through
            Supabase.
          </p>
        </div>
      </div>

      {/* Success message */}
      {message && (
        <motion.div
          initial={{
            opacity: 0,
            y: -6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm text-emerald-300"
        >
          <CheckCircle2
            size={17}
            className="mt-0.5 shrink-0"
          />

          <p className="leading-5">
            {message}
          </p>
        </motion.div>
      )}

      {/* Authentication error */}
      {authError && (
        <motion.div
          initial={{
            opacity: 0,
            y: -6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-4 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-300"
          role="alert"
        >
          <TriangleAlert
            size={17}
            className="mt-0.5 shrink-0"
          />

          <p className="leading-5">
            {authError}
          </p>
        </motion.div>
      )}

      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        className="mt-5 space-y-4"
        noValidate
      >
        <AuthInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email}
          autoComplete="email"
          disabled={isBusy}
        />

        <AuthInput
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          icon={LockKeyhole}
          error={errors.password}
          autoComplete="current-password"
          showPassword={showPassword}
          disabled={isBusy}
          onTogglePassword={() =>
            setShowPassword(
              (current) => !current
            )
          }
        />

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2.5 text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(
                  event.target.checked
                )
              }
              disabled={isBusy}
              className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-cyan-400"
            />

            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="
            group
            relative
            flex
            w-full
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-cyan-300
            via-sky-400
            to-blue-500
            px-5
            py-3.5
            font-semibold
            text-slate-950
            shadow-xl
            shadow-cyan-500/20
            transition
            duration-300
            hover:-translate-y-0.5
            hover:shadow-cyan-400/35
            focus:outline-none
            focus:ring-4
            focus:ring-cyan-400/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />

          <span className="relative flex items-center gap-2">
            {isBusy ? (
              <AuthLoader text="Signing in..." />
            ) : (
              <>
                Sign in to dashboard

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </span>
        </button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/[0.09]" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          New to FinTrack?
        </span>

        <div className="h-px flex-1 bg-white/[0.09]" />
      </div>

      {/* Register button */}
      <Link
        to="/register"
        className="
          group
          relative
          flex
          w-full
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-cyan-400/20
          bg-gradient-to-r
          from-cyan-400/[0.06]
          via-blue-500/[0.05]
          to-violet-500/[0.06]
          px-5
          py-3
          text-sm
          font-semibold
          text-white
          transition
          hover:border-cyan-400/40
          hover:text-cyan-200
        "
      >
        <span className="absolute inset-0 opacity-0 transition group-hover:bg-gradient-to-r group-hover:from-cyan-400/10 group-hover:to-violet-500/10 group-hover:opacity-100" />

        <span className="relative">
          Create a new account
        </span>
      </Link>
    </div>
  );
}

export default Login;