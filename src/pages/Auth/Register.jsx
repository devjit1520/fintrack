import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { motion } from "framer-motion";

import {
  ArrowRight,
  Check,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";

import AuthInput from "../../components/auth/AuthInput";
import AuthLoader from "../../components/auth/AuthLoader";

import useAuth from "../../hooks/useAuth";

/* =========================================================
   PASSWORD REQUIREMENT
========================================================= */

function PasswordRequirement({
  passed,
  children,
}) {
  return (
    <div
      className={`
        flex
        items-center
        gap-1.5
        whitespace-nowrap
        text-[10px]
        font-medium
        transition
        sm:text-[11px]
        ${
          passed
            ? "text-emerald-300"
            : "text-slate-500"
        }
      `}
    >
      <span
        className={`
          flex
          h-4
          w-4
          shrink-0
          items-center
          justify-center
          rounded-full
          ${
            passed
              ? "bg-emerald-400/10"
              : "bg-white/[0.04]"
          }
        `}
      >
        {passed ? (
          <Check size={10} />
        ) : (
          <X size={9} />
        )}
      </span>

      {children}
    </div>
  );
}

/* =========================================================
   REGISTER COMPONENT
========================================================= */

function Register() {
  const navigate = useNavigate();

  const {
    register,
    loading: authLoading,
    isAuthenticated,
    authError,
    clearAuthError,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  /* =======================================================
     PASSWORD STATUS
  ======================================================= */

  const passwordChecks = useMemo(
    () => ({
      minimumLength:
        formData.password.length >= 8,

      uppercase:
        /[A-Z]/.test(formData.password),

      lowercase:
        /[a-z]/.test(formData.password),

      number:
        /[0-9]/.test(formData.password),
    }),
    [formData.password]
  );

  const completedChecks =
    Object.values(passwordChecks).filter(
      Boolean
    ).length;

  const passwordStrength =
    completedChecks * 25;

  const strengthLabel = useMemo(() => {
    if (!formData.password) {
      return "Not entered";
    }

    if (passwordStrength === 100) {
      return "Strong";
    }

    if (passwordStrength >= 50) {
      return "Medium";
    }

    return "Weak";
  }, [
    formData.password,
    passwordStrength,
  ]);

  /* =======================================================
     AUTH EFFECTS
  ======================================================= */

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated
    ) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [
    authLoading,
    isAuthenticated,
    navigate,
  ]);

  /* =======================================================
     FORM INPUT
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    clearAuthError();
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    const nextErrors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      nextErrors.name =
        "Full name is required.";
    } else if (name.length < 2) {
      nextErrors.name =
        "Enter your complete name.";
    }

    if (!email) {
      nextErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password =
        "Password is required.";
    } else if (
      !passwordChecks.minimumLength
    ) {
      nextErrors.password =
        "Use at least 8 characters.";
    } else if (
      !passwordChecks.uppercase
    ) {
      nextErrors.password =
        "Add one uppercase letter.";
    } else if (
      !passwordChecks.lowercase
    ) {
      nextErrors.password =
        "Add one lowercase letter.";
    } else if (
      !passwordChecks.number
    ) {
      nextErrors.password =
        "Add one number.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword =
        "Confirm your password.";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (!acceptedTerms) {
      nextErrors.terms =
        "Accept the terms to continue.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  /* =======================================================
     REGISTER
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      clearAuthError();

      const result = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!result?.success) {
        return;
      }

      if (
        result.requiresEmailConfirmation
      ) {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Account created successfully. Check your email and confirm your account before signing in.",
          },
        });

        return;
      }

      navigate("/dashboard", {
        replace: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy =
    submitting || authLoading;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="w-full"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-[11px] font-semibold text-cyan-300">
            <Sparkles size={13} />

            Create your FinTrack account
          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-[35px] sm:leading-tight">
            Create your
            <span className="ml-2 bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              account
            </span>
          </h2>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-400 sm:text-sm">
            Access transactions, budgets, goals,
            analytics, backups, and personal finance
            tools.
          </p>
        </div>

        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 sm:flex">
          <UserRound size={20} />
        </div>
      </div>

      {/* =====================================================
          SECURITY STRIP
      ====================================================== */}

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
          <ShieldCheck size={16} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-white sm:text-sm">
            Protected personal dashboard
          </p>

          <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-xs">
            Secure registration powered by Supabase.
          </p>
        </div>
      </div>

      {/* =====================================================
          AUTH ERROR
      ====================================================== */}

      {authError && (
        <motion.div
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-3 flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-3.5 py-2.5 text-xs text-rose-300"
          role="alert"
        >
          <TriangleAlert
            size={16}
            className="mt-0.5 shrink-0"
          />

          <p className="leading-5">
            {authError}
          </p>
        </motion.div>
      )}

      {/* =====================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="mt-4"
        noValidate
      >
        {/* Name and email */}
        <div className="grid gap-3 sm:grid-cols-2">
          <AuthInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            icon={UserRound}
            error={errors.name}
            autoComplete="name"
            disabled={isBusy}
          />

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
        </div>

        {/* Passwords */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <AuthInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            icon={LockKeyhole}
            error={errors.password}
            autoComplete="new-password"
            showPassword={showPassword}
            disabled={isBusy}
            onTogglePassword={() =>
              setShowPassword(
                (current) => !current
              )
            }
          />

          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
            placeholder="Repeat your password"
            icon={LockKeyhole}
            error={errors.confirmPassword}
            autoComplete="new-password"
            showPassword={
              showConfirmPassword
            }
            disabled={isBusy}
            onTogglePassword={() =>
              setShowConfirmPassword(
                (current) => !current
              )
            }
          />
        </div>

        {/* ===================================================
            PASSWORD STRENGTH
        =================================================== */}

        <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <LockKeyhole
                size={13}
                className="text-slate-500"
              />

              <p className="text-[11px] font-medium text-slate-400">
                Password strength
              </p>
            </div>

            <span
              className={`
                text-[11px]
                font-semibold
                ${
                  passwordStrength === 100
                    ? "text-emerald-300"
                    : passwordStrength >= 50
                      ? "text-amber-300"
                      : "text-rose-300"
                }
              `}
            >
              {strengthLabel}
            </span>
          </div>

          <div className="mt-2 flex gap-1.5">
            {[1, 2, 3, 4].map(
              (segment) => (
                <span
                  key={segment}
                  className={`
                    h-1
                    flex-1
                    rounded-full
                    transition-all
                    ${
                      completedChecks >= segment
                        ? passwordStrength === 100
                          ? "bg-emerald-400"
                          : passwordStrength >= 50
                            ? "bg-amber-400"
                            : "bg-rose-400"
                        : "bg-white/[0.08]"
                    }
                  `}
                />
              )
            )}
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 sm:grid-cols-4">
            <PasswordRequirement
              passed={
                passwordChecks.minimumLength
              }
            >
              8 characters
            </PasswordRequirement>

            <PasswordRequirement
              passed={
                passwordChecks.uppercase
              }
            >
              Uppercase
            </PasswordRequirement>

            <PasswordRequirement
              passed={
                passwordChecks.lowercase
              }
            >
              Lowercase
            </PasswordRequirement>

            <PasswordRequirement
              passed={passwordChecks.number}
            >
              One number
            </PasswordRequirement>
          </div>
        </div>

        {/* ===================================================
            TERMS
        =================================================== */}

        <div className="mt-3">
          <label
            className={`
              flex
              cursor-pointer
              items-center
              gap-3
              rounded-xl
              border
              px-3.5
              py-2.5
              transition
              ${
                errors.terms
                  ? "border-rose-400/30 bg-rose-400/[0.05]"
                  : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
              }
            `}
          >
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => {
                setAcceptedTerms(
                  event.target.checked
                );

                setErrors((current) => ({
                  ...current,
                  terms: "",
                }));
              }}
              disabled={isBusy}
              className="h-4 w-4 shrink-0 rounded border-white/20 bg-slate-900 accent-cyan-400"
            />

            <span className="text-[11px] leading-5 text-slate-400 sm:text-xs">
              I agree to the{" "}
              <span className="font-semibold text-cyan-300">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-semibold text-cyan-300">
                Privacy Policy
              </span>
              .
            </span>
          </label>

          {errors.terms && (
            <p className="mt-1 text-[11px] font-medium text-rose-400">
              {errors.terms}
            </p>
          )}
        </div>

        {/* ===================================================
            SUBMIT
        =================================================== */}

        <button
          type="submit"
          disabled={isBusy}
          className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-cyan-500 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/15 transition hover:from-cyan-200 hover:to-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBusy ? (
            <AuthLoader text="Creating account..." />
          ) : (
            <>
              Create my account

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>

      {/* =====================================================
          LOGIN LINK
      ====================================================== */}

      <p className="mt-3 text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-cyan-300 transition hover:text-cyan-200"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}

export default Register;