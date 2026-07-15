import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LockKeyhole,
  Mail,
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

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [errors, setErrors] =
    useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState(
      location.state?.message || ""
    );

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    if (
      !authLoading &&
      isAuthenticated
    ) {
      navigate("/", {
        replace: true,
      });
    }
  }, [
    authLoading,
    isAuthenticated,
    navigate,
  ]);

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
    setMessage("");
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.password) {
      nextErrors.password =
        "Password is required.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        return;
      }

      const destination =
        location.state?.from?.pathname ||
        "/";

      navigate(destination, {
        replace: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-xl
        dark:border-slate-800
        dark:bg-slate-900
        sm:p-8
      "
    >
      <div>
        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-[0.25em]
            text-cyan-500
          "
        >
          Welcome back
        </p>

        <h2
          className="
            mt-3
            text-3xl
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          Sign in to FinTrack
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-6
            text-slate-500
            dark:text-slate-400
          "
        >
          Access your personal finance dashboard and
          continue managing your money.
        </p>
      </div>

      {message && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
            text-sm
            text-emerald-700
            dark:border-emerald-900
            dark:bg-emerald-950/30
            dark:text-emerald-400
          "
        >
          {message}
        </div>
      )}

      {authError && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-600
            dark:border-red-900
            dark:bg-red-950/30
          "
        >
          {authError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-5"
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
          onTogglePassword={() =>
            setShowPassword((current) => !current)
          }
        />

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            text-sm
          "
        >
          <label className="flex items-center gap-2 text-slate-500">
            <input
              type="checkbox"
              className="
                h-4
                w-4
                rounded
                border-slate-300
                accent-cyan-500
              "
            />

            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="
              font-medium
              text-cyan-600
              transition
              hover:text-cyan-700
            "
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="
            w-full
            rounded-xl
            bg-cyan-500
            px-5
            py-3
            font-semibold
            text-white
            transition
            hover:bg-cyan-600
            focus:outline-none
            focus:ring-4
            focus:ring-cyan-500/20
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {submitting ? (
            <AuthLoader text="Signing in..." />
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p
        className="
          mt-7
          text-center
          text-sm
          text-slate-500
        "
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          className="
            font-semibold
            text-cyan-600
            hover:text-cyan-700
          "
        >
          Create account
        </Link>
      </p>
    </div>
  );
}

export default Login;