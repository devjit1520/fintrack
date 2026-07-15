import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import AuthInput from "../../components/auth/AuthInput";
import AuthLoader from "../../components/auth/AuthLoader";

import useAuth from "../../hooks/useAuth";

function Register() {
  const navigate = useNavigate();

  const {
    register,
    loading: authLoading,
    isAuthenticated,
    authError,
    clearAuthError,
  } = useAuth();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [errors, setErrors] =
    useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

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
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name =
        "Full name is required.";
    }

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
    } else if (
      formData.password.length < 8
    ) {
      nextErrors.password =
        "Use at least 8 characters.";
    } else if (
      !/[A-Z]/.test(formData.password)
    ) {
      nextErrors.password =
        "Add at least one uppercase letter.";
    } else if (
      !/[a-z]/.test(formData.password)
    ) {
      nextErrors.password =
        "Add at least one lowercase letter.";
    } else if (
      !/[0-9]/.test(formData.password)
    ) {
      nextErrors.password =
        "Add at least one number.";
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

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        return;
      }

      if (
        result.requiresEmailConfirmation
      ) {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Account created. Please check your email and confirm your account before signing in.",
          },
        });

        return;
      }

      navigate("/", {
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
          Start your journey
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
          Create your account
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
          Create a private FinTrack account and start
          managing your own financial data.
        </p>
      </div>

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
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Devjit Mondal"
          icon={UserRound}
          error={errors.name}
          autoComplete="name"
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
        />

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
          onTogglePassword={() =>
            setShowPassword((current) => !current)
          }
        />

        <AuthInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          icon={LockKeyhole}
          error={errors.confirmPassword}
          autoComplete="new-password"
          showPassword={showConfirmPassword}
          onTogglePassword={() =>
            setShowConfirmPassword(
              (current) => !current
            )
          }
        />

        <label
          className="
            flex
            items-start
            gap-3
            text-sm
            leading-6
            text-slate-500
          "
        >
          <input
            type="checkbox"
            required
            className="
              mt-1
              h-4
              w-4
              rounded
              accent-cyan-500
            "
          />

          <span>
            I agree to the Terms of Service and Privacy
            Policy.
          </span>
        </label>

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
            <AuthLoader text="Creating account..." />
          ) : (
            "Create Account"
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
        Already have an account?{" "}
        <Link
          to="/login"
          className="
            font-semibold
            text-cyan-600
            hover:text-cyan-700
          "
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Register;