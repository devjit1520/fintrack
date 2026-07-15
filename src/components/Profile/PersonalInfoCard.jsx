import {
  BriefcaseBusiness,
  Globe2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  UserRound,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import useProfile from "../../hooks/useProfile";
import ProfileCard from "./ProfileCard";

/* =========================================================
   FORM DEFAULTS
========================================================= */

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  country: "",
  website: "",
  bio: "",
};

function createEmptyErrors() {
  return {
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    website: "",
    bio: "",
  };
}

function getProfileFormData(profile = {}) {
  return {
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    role: profile.role || "",
    email: profile.email || "",
    phone: profile.phone || "",
    city: profile.city || "",
    state: profile.state || "",
    country: profile.country || "",
    website: profile.website || "",
    bio: profile.bio || "",
  };
}

/* =========================================================
   FORM FIELD

   Keep this component OUTSIDE PersonalInfoCard.
   Otherwise the input remounts after every keystroke.
========================================================= */

function FormField({
  label,
  name,
  icon: Icon,
  type = "text",
  placeholder = "",
  autoComplete = "off",
  value,
  error,
  onChange,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`
            w-full
            rounded-xl
            border
            bg-white
            py-3
            pl-11
            pr-4
            text-sm
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
                  border-rose-500
                  focus:border-rose-500
                  focus:ring-rose-500/10
                  dark:border-rose-500
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
      </div>

      {error && (
        <p
          role="alert"
          className="mt-2 text-sm text-rose-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function PersonalInfoCard() {
  const profileContext =
    useProfile() || {};

  const profile =
    profileContext.profile || {};

  const updateProfile =
    profileContext.updateProfile;

  const [formData, setFormData] =
    useState(EMPTY_FORM);

  const [errors, setErrors] =
    useState(createEmptyErrors);

  const [saved, setSaved] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  /* =======================================================
     PROFILE VALUES
  ======================================================= */

  const savedProfileData = useMemo(
    () => getProfileFormData(profile),
    [
      profile.firstName,
      profile.lastName,
      profile.role,
      profile.email,
      profile.phone,
      profile.city,
      profile.state,
      profile.country,
      profile.website,
      profile.bio,
    ]
  );

  /*
    This runs only when the actual saved profile changes.
    It does not run after every form keystroke.
  */

  useEffect(() => {
    setFormData(savedProfileData);
  }, [savedProfileData]);

  useEffect(() => {
    if (!saved) {
      return undefined;
    }

    const timeoutId =
      window.setTimeout(() => {
        setSaved(false);
      }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [saved]);

  /* =======================================================
     CHANGE DETECTION
  ======================================================= */

  const hasChanges = useMemo(() => {
    return Object.keys(EMPTY_FORM).some(
      (fieldName) =>
        formData[fieldName] !==
        savedProfileData[fieldName]
    );
  }, [
    formData,
    savedProfileData,
  ]);

  /* =======================================================
     INPUT HANDLER
  ======================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentFormData) => ({
        ...currentFormData,
        [name]: value,
      })
    );

    setErrors(
      (currentErrors) => ({
        ...currentErrors,
        [name]: "",
      })
    );

    setSaved(false);
    setSaveError("");
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    const nextErrors =
      createEmptyErrors();

    if (!formData.firstName.trim()) {
      nextErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName =
        "Last name is required.";
    }

    if (!formData.role.trim()) {
      nextErrors.role =
        "Profession is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    if (
      formData.phone.trim() &&
      !/^[0-9+\-\s()]{7,20}$/.test(
        formData.phone.trim()
      )
    ) {
      nextErrors.phone =
        "Enter a valid phone number.";
    }

    if (!formData.city.trim()) {
      nextErrors.city =
        "City is required.";
    }

    if (!formData.country.trim()) {
      nextErrors.country =
        "Country is required.";
    }

    if (
      formData.website.trim() &&
      !/^https?:\/\/.+/i.test(
        formData.website.trim()
      )
    ) {
      nextErrors.website =
        "Website must start with http:// or https://";
    }

    if (
      formData.bio.trim().length > 300
    ) {
      nextErrors.bio =
        "Bio cannot exceed 300 characters.";
    }

    setErrors(nextErrors);

    return !Object.values(
      nextErrors
    ).some(Boolean);
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      isSaving ||
      !hasChanges ||
      !validateForm()
    ) {
      return;
    }

    if (
      typeof updateProfile !==
      "function"
    ) {
      setSaveError(
        "Profile service is unavailable."
      );

      return;
    }

    setIsSaving(true);
    setSaved(false);
    setSaveError("");

    try {
      const firstName =
        formData.firstName.trim();

      const lastName =
        formData.lastName.trim();

      const city =
        formData.city.trim();

      const state =
        formData.state.trim();

      const country =
        formData.country.trim();

      await Promise.resolve(
        updateProfile({
          firstName,
          lastName,

          name: [
            firstName,
            lastName,
          ]
            .filter(Boolean)
            .join(" "),

          role:
            formData.role.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          city,
          state,
          country,

          location: [
            city,
            state,
            country,
          ]
            .filter(Boolean)
            .join(", "),

          website:
            formData.website.trim(),

          bio:
            formData.bio.trim(),
        })
      );

      setSaved(true);
    } catch (error) {
      console.error(
        "Unable to save profile:",
        error
      );

      setSaveError(
        error?.message ||
          "Unable to save profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    setFormData(savedProfileData);
    setErrors(createEmptyErrors());
    setSaved(false);
    setSaveError("");
  };

  return (
    <ProfileCard title="Personal Information">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="First Name"
            name="firstName"
            icon={UserRound}
            placeholder="Enter first name"
            autoComplete="given-name"
            value={formData.firstName}
            error={errors.firstName}
            onChange={handleChange}
          />

          <FormField
            label="Last Name"
            name="lastName"
            icon={UserRound}
            placeholder="Enter last name"
            autoComplete="family-name"
            value={formData.lastName}
            error={errors.lastName}
            onChange={handleChange}
          />

          <FormField
            label="Profession"
            name="role"
            icon={BriefcaseBusiness}
            placeholder="Frontend Developer"
            autoComplete="organization-title"
            value={formData.role}
            error={errors.role}
            onChange={handleChange}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="name@example.com"
            autoComplete="email"
            value={formData.email}
            error={errors.email}
            onChange={handleChange}
          />

          <FormField
            label="Phone"
            name="phone"
            type="tel"
            icon={Phone}
            placeholder="+91 9876543210"
            autoComplete="tel"
            value={formData.phone}
            error={errors.phone}
            onChange={handleChange}
          />

          <FormField
            label="Portfolio Website"
            name="website"
            type="url"
            icon={Globe2}
            placeholder="https://yourportfolio.com"
            autoComplete="url"
            value={formData.website}
            error={errors.website}
            onChange={handleChange}
          />

          <FormField
            label="City"
            name="city"
            icon={MapPin}
            placeholder="Kolkata"
            autoComplete="address-level2"
            value={formData.city}
            error={errors.city}
            onChange={handleChange}
          />

          <FormField
            label="State"
            name="state"
            icon={MapPin}
            placeholder="West Bengal"
            autoComplete="address-level1"
            value={formData.state}
            error={errors.state}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <FormField
              label="Country"
              name="country"
              icon={MapPin}
              placeholder="India"
              autoComplete="country-name"
              value={formData.country}
              error={errors.country}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Bio */}

        <div>
          <label
            htmlFor="bio"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Bio
          </label>

          <textarea
            id="bio"
            name="bio"
            rows={5}
            maxLength={300}
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a short description about yourself..."
            className={`
              w-full
              resize-none
              rounded-xl
              border
              bg-white
              px-4
              py-3
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:ring-4
              dark:bg-slate-950
              dark:text-white
              ${
                errors.bio
                  ? `
                    border-rose-500
                    focus:border-rose-500
                    focus:ring-rose-500/10
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

          <div className="mt-2 flex justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Add a brief professional introduction.
            </span>

            <span>
              {formData.bio.length}/300
            </span>
          </div>

          {errors.bio && (
            <p className="mt-2 text-sm text-rose-500">
              {errors.bio}
            </p>
          )}
        </div>

        {/* Messages */}

        {saved && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-400"
          >
            Profile saved successfully.
          </div>
        )}

        {saveError && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-700 dark:text-rose-400"
          >
            {saveError}
          </div>
        )}

        {/* Buttons */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            disabled={
              !hasChanges ||
              isSaving
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw size={17} />

            Reset
          </button>

          <button
            type="submit"
            disabled={
              !hasChanges ||
              isSaving
            }
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                Saving...
              </>
            ) : (
              <>
                <Save size={17} />

                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </ProfileCard>
  );
}

export default PersonalInfoCard;