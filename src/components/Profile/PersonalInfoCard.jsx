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

const emptyErrors = {
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

function PersonalInfoCard() {
  const {
    profile,
    updateProfile,
  } = useProfile();

  const [formData, setFormData] =
    useState({
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
    });

  const [errors, setErrors] =
    useState(emptyErrors);

  const [saved, setSaved] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    setFormData({
      firstName:
        profile.firstName || "",
      lastName:
        profile.lastName || "",
      role:
        profile.role || "",
      email:
        profile.email || "",
      phone:
        profile.phone || "",
      city:
        profile.city || "",
      state:
        profile.state || "",
      country:
        profile.country || "",
      website:
        profile.website || "",
      bio:
        profile.bio || "",
    });
  }, [profile]);

  useEffect(() => {
    if (!saved) return;

    const timeout =
      window.setTimeout(() => {
        setSaved(false);
      }, 2500);

    return () =>
      window.clearTimeout(timeout);
  }, [saved]);

  const hasChanges = useMemo(() => {
    return (
      formData.firstName !==
        (profile.firstName || "") ||
      formData.lastName !==
        (profile.lastName || "") ||
      formData.role !==
        (profile.role || "") ||
      formData.email !==
        (profile.email || "") ||
      formData.phone !==
        (profile.phone || "") ||
      formData.city !==
        (profile.city || "") ||
      formData.state !==
        (profile.state || "") ||
      formData.country !==
        (profile.country || "") ||
      formData.website !==
        (profile.website || "") ||
      formData.bio !==
        (profile.bio || "")
    );
  }, [formData, profile]);

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
  };

  const validateForm = () => {
    const nextErrors = {
      ...emptyErrors,
    };

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
      formData.bio.length > 300
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

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      updateProfile({
        firstName:
          formData.firstName.trim(),

        lastName:
          formData.lastName.trim(),

        role:
          formData.role.trim(),

        email:
          formData.email.trim(),

        phone:
          formData.phone.trim(),

        city:
          formData.city.trim(),

        state:
          formData.state.trim(),

        country:
          formData.country.trim(),

        website:
          formData.website.trim(),

        bio:
          formData.bio.trim(),
      });

      await new Promise(
        (resolve) =>
          window.setTimeout(
            resolve,
            350
          )
      );

      setSaved(true);
    } catch (error) {
      console.error(
        "Unable to save profile:",
        error
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName:
        profile.firstName || "",
      lastName:
        profile.lastName || "",
      role:
        profile.role || "",
      email:
        profile.email || "",
      phone:
        profile.phone || "",
      city:
        profile.city || "",
      state:
        profile.state || "",
      country:
        profile.country || "",
      website:
        profile.website || "",
      bio:
        profile.bio || "",
    });

    setErrors(emptyErrors);
    setSaved(false);
  };

  const baseInputClass = `
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    px-4
    py-3
    text-slate-900
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-cyan-500
    focus:ring-4
    focus:ring-cyan-500/10
    dark:border-slate-700
    dark:bg-slate-950
    dark:text-white
  `;

  const Field = ({
    label,
    name,
    icon: Icon,
    type = "text",
    placeholder = "",
    autoComplete,
  }) => (
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
        <Icon
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
          type={type}
          value={
            formData[name] || ""
          }
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            ${baseInputClass}
            pl-11
            ${
              errors[name]
                ? `
                  border-red-500
                  focus:border-red-500
                  focus:ring-red-500/10
                `
                : ""
            }
          `}
        />
      </div>

      {errors[name] && (
        <p
          className="
            mt-2
            text-sm
            text-red-500
          "
        >
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <ProfileCard title="Personal Information">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <Field
            label="First Name"
            name="firstName"
            icon={UserRound}
            placeholder="Enter first name"
            autoComplete="given-name"
          />

          <Field
            label="Last Name"
            name="lastName"
            icon={UserRound}
            placeholder="Enter last name"
            autoComplete="family-name"
          />

          <Field
            label="Profession"
            name="role"
            icon={BriefcaseBusiness}
            placeholder="Frontend Developer"
            autoComplete="organization-title"
          />

          <Field
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="name@example.com"
            autoComplete="email"
          />

          <Field
            label="Phone"
            name="phone"
            type="tel"
            icon={Phone}
            placeholder="+91 9876543210"
            autoComplete="tel"
          />

          <Field
            label="Portfolio Website"
            name="website"
            type="url"
            icon={Globe2}
            placeholder="https://yourportfolio.com"
            autoComplete="url"
          />

          <Field
            label="City"
            name="city"
            icon={MapPin}
            placeholder="Kolkata"
            autoComplete="address-level2"
          />

          <Field
            label="State"
            name="state"
            icon={MapPin}
            placeholder="West Bengal"
            autoComplete="address-level1"
          />

          <div className="md:col-span-2">
            <Field
              label="Country"
              name="country"
              icon={MapPin}
              placeholder="India"
              autoComplete="country-name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bio"
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
            "
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
              ${baseInputClass}
              resize-none
              ${
                errors.bio
                  ? `
                    border-red-500
                    focus:border-red-500
                    focus:ring-red-500/10
                  `
                  : ""
              }
            `}
          />

          <div
            className="
              mt-2
              flex
              justify-between
              gap-4
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            <span>
              Add a brief professional
              introduction.
            </span>

            <span>
              {formData.bio.length}/300
            </span>
          </div>

          {errors.bio && (
            <p
              className="
                mt-2
                text-sm
                text-red-500
              "
            >
              {errors.bio}
            </p>
          )}
        </div>

        {saved && (
          <div
            className="
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
            Your profile information has
            been saved successfully.
          </div>
        )}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            border-t
            border-slate-200
            pt-5
            dark:border-slate-800
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={
              !hasChanges ||
              isSaving
            }
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-300
              px-5
              py-3
              font-medium
              text-slate-700
              transition
              hover:bg-slate-100
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-slate-700
              dark:text-slate-200
              dark:hover:bg-slate-800
            "
          >
            <RotateCcw size={17} />
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              !hasChanges ||
              isSaving
            }
            className="
              flex
              min-w-40
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