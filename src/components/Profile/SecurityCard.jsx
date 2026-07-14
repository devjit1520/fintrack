import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import ProfileCard from "./ProfileCard";
import useProfile from "../../hooks/useProfile";

function SecuritySwitch({
  checked,
  onChange,
  label,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`
        relative
        h-8
        w-14
        shrink-0
        rounded-full
        transition-colors
        focus:outline-none
        focus:ring-4
        focus:ring-cyan-500/20
        ${
          checked
            ? "bg-cyan-500"
            : "bg-slate-300 dark:bg-slate-700"
        }
      `}
    >
      <motion.span
        animate={{
          x: checked ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 32,
        }}
        className="
          absolute
          left-1
          top-1
          h-6
          w-6
          rounded-full
          bg-white
          shadow
        "
      />
    </button>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  onToggleVisible,
  error,
  placeholder,
  autoComplete,
}) {
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
        <LockKeyhole
          size={17}
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
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
            pl-11
            pr-12
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:ring-4
            dark:bg-slate-950
            dark:text-white
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

        <button
          type="button"
          onClick={onToggleVisible}
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
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
        >
          {visible ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

function getSecurityScore({
  twoFactorEnabled,
  passwordUpdatedAt,
}) {
  let score = 45;

  if (twoFactorEnabled) {
    score += 35;
  }

  if (passwordUpdatedAt) {
    score += 20;
  }

  return Math.min(score, 100);
}

function formatUpdatedDate(value) {
  if (!value) {
    return "Not updated yet";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not updated yet";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

function SecurityCard() {
  const {
    profile,
    updateSecurity,
  } = useProfile();

  const security =
    profile.security || {
      twoFactorEnabled: false,
      passwordUpdatedAt: "",
    };

  const [twoFactorEnabled, setTwoFactorEnabled] =
    useState(
      security.twoFactorEnabled ?? false
    );

  const [formData, setFormData] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [visibility, setVisibility] =
    useState({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });

  const [errors, setErrors] =
    useState({});

  const [saved, setSaved] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    setTwoFactorEnabled(
      security.twoFactorEnabled ?? false
    );
  }, [security.twoFactorEnabled]);

  useEffect(() => {
    if (!saved) return;

    const timeout =
      window.setTimeout(() => {
        setSaved(false);
      }, 2500);

    return () =>
      window.clearTimeout(timeout);
  }, [saved]);

  const score = useMemo(
    () =>
      getSecurityScore({
        twoFactorEnabled,
        passwordUpdatedAt:
          security.passwordUpdatedAt,
      }),
    [
      twoFactorEnabled,
      security.passwordUpdatedAt,
    ]
  );

  const scoreLabel =
    score >= 80
      ? "Strong"
      : score >= 60
      ? "Good"
      : "Needs attention";

  const scoreColor =
    score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 60
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  const progressColor =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
      ? "bg-amber-500"
      : "bg-red-500";

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

    setSaved(false);
  };

  const toggleVisibility = (field) => {
    setVisibility((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.currentPassword) {
      nextErrors.currentPassword =
        "Current password is required.";
    }

    if (!formData.newPassword) {
      nextErrors.newPassword =
        "New password is required.";
    } else if (
      formData.newPassword.length < 8
    ) {
      nextErrors.newPassword =
        "Password must contain at least 8 characters.";
    } else if (
      !/[A-Z]/.test(
        formData.newPassword
      )
    ) {
      nextErrors.newPassword =
        "Add at least one uppercase letter.";
    } else if (
      !/[a-z]/.test(
        formData.newPassword
      )
    ) {
      nextErrors.newPassword =
        "Add at least one lowercase letter.";
    } else if (
      !/[0-9]/.test(
        formData.newPassword
      )
    ) {
      nextErrors.newPassword =
        "Add at least one number.";
    } else if (
      !/[^A-Za-z0-9]/.test(
        formData.newPassword
      )
    ) {
      nextErrors.newPassword =
        "Add at least one special character.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword =
        "Confirm your new password.";
    } else if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword ===
        formData.newPassword
    ) {
      nextErrors.newPassword =
        "New password must be different from the current password.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleUpdatePassword = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      await new Promise((resolve) =>
        window.setTimeout(
          resolve,
          500
        )
      );

      updateSecurity({
        passwordUpdatedAt:
          new Date().toISOString(),
      });

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setErrors({});
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTwoFactorChange = () => {
    const nextValue =
      !twoFactorEnabled;

    setTwoFactorEnabled(nextValue);

    updateSecurity({
      twoFactorEnabled: nextValue,
    });

    setSaved(true);
  };

  return (
    <ProfileCard title="Security">
      <div className="space-y-6">
        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-5
            dark:border-slate-800
            dark:bg-slate-950
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-100
                  text-cyan-600
                  dark:bg-cyan-900/40
                  dark:text-cyan-400
                "
              >
                <ShieldCheck size={23} />
              </div>

              <div>
                <p
                  className="
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Security score
                </p>

                <p
                  className={`
                    mt-1
                    text-sm
                    font-medium
                    ${scoreColor}
                  `}
                >
                  {scoreLabel}
                </p>
              </div>
            </div>

            <p
              className="
                text-3xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {score}%
            </p>
          </div>

          <div
            className="
              mt-4
              h-3
              overflow-hidden
              rounded-full
              bg-slate-200
              dark:bg-slate-800
            "
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${score}%`,
              }}
              transition={{
                duration: 0.7,
              }}
              className={`
                h-full
                rounded-full
                ${progressColor}
              `}
            />
          </div>
        </div>

        <div
          className="
            flex
            items-center
            justify-between
            gap-5
            rounded-2xl
            border
            border-slate-200
            p-4
            dark:border-slate-800
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-violet-100
                text-violet-600
                dark:bg-violet-900/40
                dark:text-violet-400
              "
            >
              <Smartphone size={20} />
            </div>

            <div>
              <h4
                className="
                  font-medium
                  text-slate-900
                  dark:text-white
                "
              >
                Two-factor authentication
              </h4>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Add an additional protection
                layer to your account.
              </p>
            </div>
          </div>

          <SecuritySwitch
            checked={twoFactorEnabled}
            onChange={
              handleTwoFactorChange
            }
            label="Toggle two-factor authentication"
          />
        </div>

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            p-4
            dark:border-slate-800
          "
        >
          <div className="flex items-center gap-3">
            <KeyRound
              size={20}
              className="text-cyan-500"
            />

            <div>
              <p
                className="
                  font-medium
                  text-slate-900
                  dark:text-white
                "
              >
                Last password update
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {formatUpdatedDate(
                  security.passwordUpdatedAt
                )}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={
            handleUpdatePassword
          }
          className="space-y-5"
        >
          <div>
            <h3
              className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              Change password
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Use a strong password containing
              uppercase, lowercase, number and
              special characters.
            </p>
          </div>

          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={
              formData.currentPassword
            }
            onChange={handleChange}
            visible={
              visibility.currentPassword
            }
            onToggleVisible={() =>
              toggleVisibility(
                "currentPassword"
              )
            }
            error={
              errors.currentPassword
            }
            placeholder="Enter current password"
            autoComplete="current-password"
          />

          <PasswordField
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            visible={
              visibility.newPassword
            }
            onToggleVisible={() =>
              toggleVisibility(
                "newPassword"
              )
            }
            error={errors.newPassword}
            placeholder="Enter new password"
            autoComplete="new-password"
          />

          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
            visible={
              visibility.confirmPassword
            }
            onToggleVisible={() =>
              toggleVisibility(
                "confirmPassword"
              )
            }
            error={
              errors.confirmPassword
            }
            placeholder="Confirm new password"
            autoComplete="new-password"
          />

          {saved && (
            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-emerald-200
                bg-emerald-50
                px-4
                py-3
                text-sm
                font-medium
                text-emerald-700
                dark:border-emerald-900
                dark:bg-emerald-950/30
                dark:text-emerald-400
              "
            >
              <CheckCircle2 size={18} />

              Security settings updated
              successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
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
            {isSaving ? (
              <>
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                />
                Updating...
              </>
            ) : (
              <>
                <Save size={18} />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </ProfileCard>
  );
}

export default SecurityCard;