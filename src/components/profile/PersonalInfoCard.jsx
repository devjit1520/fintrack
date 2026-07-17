import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  Globe2,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Save,
  Sparkles,
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

function getProfileFormData(
  profile = {}
) {
  return {
    firstName:
      profile.firstName || "",
    lastName:
      profile.lastName || "",
    role: profile.role || "",
    email: profile.email || "",
    phone: profile.phone || "",
    city: profile.city || "",
    state: profile.state || "",
    country:
      profile.country || "",
    website:
      profile.website || "",
    bio: profile.bio || "",
  };
}

/* =========================================================
   FORM FIELD
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
        className="
          mb-2
          block
          text-xs
          font-bold
          uppercase
          tracking-[0.08em]
          text-slate-500
          dark:text-slate-400
        "
      >
        {label}
      </label>

      <div className="relative">
        <div
          className={`
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            flex
            h-8
            w-8
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            ${
              error
                ? "bg-rose-500/10 text-rose-500"
                : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
            }
          `}
        >
          <Icon size={15} />
        </div>

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={
            Boolean(error)
          }
          className={`
            h-13
            w-full
            rounded-2xl
            border
            bg-slate-50/80
            py-3
            pl-14
            pr-4
            text-sm
            text-slate-950
            outline-none
            transition
            duration-200
            placeholder:text-slate-400
            hover:bg-white
            focus:bg-white
            focus:ring-4
            dark:bg-slate-950/40
            dark:text-white
            dark:hover:bg-slate-950/60
            dark:focus:bg-slate-950/70
            ${
              error
                ? `
                  border-rose-500
                  focus:border-rose-500
                  focus:ring-rose-500/10
                `
                : `
                  border-slate-200
                  hover:border-cyan-500/30
                  focus:border-cyan-500
                  focus:ring-cyan-500/10
                  dark:border-white/10
                `
            }
          `}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="
            mt-2
            flex
            items-center
            gap-1.5
            text-xs
            font-medium
            text-rose-500
          "
        >
          <AlertCircle size={13} />

          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200/80
        bg-slate-50/60
        p-5
        dark:border-white/10
        dark:bg-slate-950/25
        sm:p-6
      "
    >
      <div
        className="
          mb-5
          flex
          items-start
          gap-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            from-cyan-500/15
            to-blue-500/10
            text-cyan-600
            dark:text-cyan-400
          "
        >
          <Icon size={18} />
        </div>

        <div>
          <h3
            className="
              font-bold
              text-slate-950
              dark:text-white
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   PERSONAL INFORMATION CARD
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

  const savedProfileData = useMemo(
    () =>
      getProfileFormData(profile),
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

  useEffect(() => {
    setFormData(
      savedProfileData
    );
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
      window.clearTimeout(
        timeoutId
      );
    };
  }, [saved]);

  const hasChanges = useMemo(
    () =>
      Object.keys(
        EMPTY_FORM
      ).some(
        (fieldName) =>
          formData[fieldName] !==
          savedProfileData[fieldName]
      ),
    [
      formData,
      savedProfileData,
    ]
  );

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );

    setErrors(
      (current) => ({
        ...current,
        [name]: "",
      })
    );

    setSaved(false);
    setSaveError("");
  };

  const validateForm = () => {
    const nextErrors =
      createEmptyErrors();

    if (
      !formData.firstName.trim()
    ) {
      nextErrors.firstName =
        "First name is required.";
    }

    if (
      !formData.lastName.trim()
    ) {
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

    if (
      !formData.country.trim()
    ) {
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
      formData.bio.trim()
        .length > 300
    ) {
      nextErrors.bio =
        "Bio cannot exceed 300 characters.";
    }

    setErrors(nextErrors);

    return !Object.values(
      nextErrors
    ).some(Boolean);
  };

  const handleSubmit = async (
    event
  ) => {
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

      const result =
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

      if (
        result?.success === false
      ) {
        throw new Error(
          result.error ||
            "Unable to save profile."
        );
      }

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

  const handleReset = () => {
    setFormData(
      savedProfileData
    );

    setErrors(
      createEmptyErrors()
    );

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
        {/* Information banner */}

        <div
          className="
            flex
            flex-col
            gap-4
            rounded-2xl
            border
            border-cyan-500/20
            bg-gradient-to-r
            from-cyan-500/[0.08]
            via-blue-500/[0.05]
            to-violet-500/[0.08]
            p-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-cyan-500/10
                text-cyan-600
                dark:text-cyan-400
              "
            >
              <Sparkles size={18} />
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-bold
                  text-slate-950
                  dark:text-white
                "
              >
                Keep your profile current
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                "
              >
                These details appear throughout your FinTrack account.
              </p>
            </div>
          </div>

          <span
            className={`
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              px-3
              py-1.5
              text-xs
              font-bold
              ${
                hasChanges
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }
            `}
          >
            {hasChanges ? (
              <AlertCircle size={14} />
            ) : (
              <CheckCircle2
                size={14}
              />
            )}

            {hasChanges
              ? "Unsaved changes"
              : "Profile up to date"}
          </span>
        </div>

        {/* Identity */}

        <FormSection
          icon={UserRound}
          title="Identity & contact"
          description="Update your name, profession and contact information."
        >
          <div
            className="
              grid
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            <FormField
              label="First Name"
              name="firstName"
              icon={UserRound}
              placeholder="Enter first name"
              autoComplete="given-name"
              value={
                formData.firstName
              }
              error={
                errors.firstName
              }
              onChange={handleChange}
            />

            <FormField
              label="Last Name"
              name="lastName"
              icon={UserRound}
              placeholder="Enter last name"
              autoComplete="family-name"
              value={
                formData.lastName
              }
              error={
                errors.lastName
              }
              onChange={handleChange}
            />

            <FormField
              label="Profession"
              name="role"
              icon={
                BriefcaseBusiness
              }
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
              value={
                formData.website
              }
              error={errors.website}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        {/* Location */}

        <FormSection
          icon={MapPin}
          title="Location"
          description="Add your current city, state and country."
        >
          <div
            className="
              grid
              gap-5
              md:grid-cols-3
            "
          >
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

            <FormField
              label="Country"
              name="country"
              icon={MapPin}
              placeholder="India"
              autoComplete="country-name"
              value={
                formData.country
              }
              error={errors.country}
              onChange={handleChange}
            />
          </div>
        </FormSection>

        {/* Bio */}

        <FormSection
          icon={BriefcaseBusiness}
          title="Professional summary"
          description="Write a concise introduction about your experience and skills."
        >
          <div>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              maxLength={300}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short professional description..."
              className={`
                w-full
                resize-none
                rounded-2xl
                border
                bg-white
                px-4
                py-3.5
                text-sm
                leading-7
                text-slate-950
                outline-none
                transition
                placeholder:text-slate-400
                focus:ring-4
                dark:bg-slate-950/50
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
                      hover:border-cyan-500/30
                      focus:border-cyan-500
                      focus:ring-cyan-500/10
                      dark:border-white/10
                    `
                }
              `}
            />

            <div
              className="
                mt-2
                flex
                items-center
                justify-between
                gap-4
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              <span>
                Keep it clear and professional.
              </span>

              <span
                className={
                  formData.bio.length >
                  270
                    ? "font-bold text-amber-500"
                    : ""
                }
              >
                {formData.bio.length}/300
              </span>
            </div>

            {errors.bio && (
              <p
                className="
                  mt-2
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  font-medium
                  text-rose-500
                "
              >
                <AlertCircle
                  size={13}
                />

                {errors.bio}
              </p>
            )}
          </div>
        </FormSection>

        {/* Feedback messages */}

        {saved && (
          <div
            role="status"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-emerald-500/20
              bg-emerald-500/10
              px-4
              py-3
              text-sm
              font-medium
              text-emerald-700
              dark:text-emerald-400
            "
          >
            <CheckCircle2
              size={18}
            />

            Profile saved successfully.
          </div>
        )}

        {saveError && (
          <div
            role="alert"
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-rose-500/20
              bg-rose-500/10
              px-4
              py-3
              text-sm
              font-medium
              text-rose-700
              dark:text-rose-400
            "
          >
            <AlertCircle size={18} />

            {saveError}
          </div>
        )}

        {/* Actions */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            rounded-2xl
            border
            border-slate-200/80
            bg-slate-50/70
            p-4
            dark:border-white/10
            dark:bg-slate-950/25
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-xs
              leading-5
              text-slate-500
              dark:text-slate-400
            "
          >
            Save changes to update your profile header and account information.
          </p>

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={handleReset}
              disabled={
                !hasChanges ||
                isSaving
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-300
                bg-white
                px-5
                py-3
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-slate-200
                dark:hover:bg-white/[0.07]
              "
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
              className="
                group
                relative
                inline-flex
                min-w-44
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-xl
                bg-gradient-to-r
                from-cyan-500
                via-blue-600
                to-violet-600
                px-5
                py-3
                font-bold
                text-white
                shadow-lg
                shadow-cyan-500/20
                transition
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:shadow-blue-500/25
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
              "
            >
              <span
                className="
                  absolute
                  inset-0
                  -translate-x-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/25
                  to-transparent
                  transition-transform
                  duration-700
                  group-hover:translate-x-full
                "
              />

              <span
                className="
                  relative
                  flex
                  items-center
                  gap-2
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

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />

                    Save Changes
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </form>
    </ProfileCard>
  );
}

export default PersonalInfoCard;