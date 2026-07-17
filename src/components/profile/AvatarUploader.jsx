import {
  useRef,
  useState,
} from "react";

import {
  Camera,
  ImagePlus,
  Trash2,
  UserRound,
} from "lucide-react";

import useProfile from "../../hooks/useProfile";
import { imageToBase64 } from "../../utils/imageToBase64";

const MAX_FILE_SIZE =
  2 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function AvatarUploader() {
  const inputRef = useRef(null);

  const {
    profile = {},
    updateAvatar,
    removeAvatar,
  } = useProfile() || {};

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const displayName =
    profile.name ||
    [
      profile.firstName,
      profile.lastName,
    ]
      .filter(Boolean)
      .join(" ") ||
    "FinTrack User";

  const fallbackAvatar =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=0ea5e9&color=ffffff&size=256&bold=true`;

  const avatarSource =
    profile.avatar || fallbackAvatar;

  const openFilePicker = () => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  };

  const handleImageChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      setError(
        "Please select a JPG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      setError(
        "Image size must be less than 2 MB."
      );

      event.target.value = "";
      return;
    }

    if (
      typeof updateAvatar !==
      "function"
    ) {
      setError(
        "Profile image service is unavailable."
      );

      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const convertedImage =
        await imageToBase64(file);

      const result =
        await Promise.resolve(
          updateAvatar(
            convertedImage
          )
        );

      if (
        result?.success === false
      ) {
        throw new Error(
          result.error ||
            "Unable to upload image."
        );
      }
    } catch (uploadError) {
      console.error(
        "Avatar upload failed:",
        uploadError
      );

      setError(
        uploadError?.message ||
          "Unable to upload this image."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveAvatar =
    async () => {
      if (
        typeof removeAvatar !==
        "function"
      ) {
        setError(
          "Profile image service is unavailable."
        );

        return;
      }

      try {
        setIsUploading(true);
        setError("");

        const result =
          await Promise.resolve(
            removeAvatar()
          );

        if (
          result?.success === false
        ) {
          throw new Error(
            result.error ||
              "Unable to remove image."
          );
        }
      } catch (removeError) {
        console.error(
          "Avatar removal failed:",
          removeError
        );

        setError(
          removeError?.message ||
            "Unable to remove the profile image."
        );
      } finally {
        setIsUploading(false);
      }
    };

  return (
    <div
      className="
        flex
        h-full
        flex-col
        items-center
        rounded-3xl
        border
        border-slate-200/70
        bg-white/60
        p-5
        text-center
        backdrop-blur-xl
        dark:border-white/10
        dark:bg-white/[0.025]
      "
    >
      <div className="relative">
        <div
          className="
            absolute
            -inset-3
            rounded-full
            bg-gradient-to-br
            from-cyan-400/30
            via-blue-500/30
            to-violet-500/30
            blur-xl
          "
        />

        <div
          className="
            relative
            rounded-full
            bg-gradient-to-br
            from-cyan-400
            via-blue-500
            to-violet-500
            p-1
            shadow-xl
            shadow-cyan-500/20
          "
        >
          <img
            src={avatarSource}
            alt={`${displayName} profile`}
            className="
              h-32
              w-32
              rounded-full
              border-4
              border-white
              bg-slate-100
              object-cover
              dark:border-[#0c1528]
              dark:bg-slate-800
              sm:h-36
              sm:w-36
            "
          />
        </div>

        <button
          type="button"
          onClick={openFilePicker}
          disabled={isUploading}
          aria-label="Upload profile photo"
          className="
            absolute
            bottom-1
            right-1
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border-4
            border-white
            bg-gradient-to-br
            from-cyan-400
            to-blue-600
            text-white
            shadow-lg
            transition
            hover:scale-105
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-cyan-500/30
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:border-[#0c1528]
          "
        >
          {isUploading ? (
            <span
              className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-white
                border-r-transparent
              "
            />
          ) : (
            <Camera size={18} />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="sr-only"
        />
      </div>

      <div className="mt-5">
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            text-sm
            font-bold
            text-slate-950
            dark:text-white
          "
        >
          <UserRound
            size={16}
            className="text-cyan-500"
          />

          Profile photo
        </div>

        <p
          className="
            mt-1
            text-xs
            text-slate-500
            dark:text-slate-400
          "
        >
          JPG, PNG or WEBP
        </p>
      </div>

      <div
        className="
          mt-4
          flex
          w-full
          flex-wrap
          justify-center
          gap-2
        "
      >
        <button
          type="button"
          onClick={openFilePicker}
          disabled={isUploading}
          className="
            inline-flex
            flex-1
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-cyan-500/20
            bg-cyan-500/10
            px-3
            py-2.5
            text-xs
            font-bold
            text-cyan-700
            transition
            hover:border-cyan-500/40
            hover:bg-cyan-500/15
            disabled:opacity-60
            dark:text-cyan-300
          "
        >
          <ImagePlus size={15} />

          {profile.avatar
            ? "Change"
            : "Upload"}
        </button>

        {profile.avatar && (
          <button
            type="button"
            onClick={
              handleRemoveAvatar
            }
            disabled={isUploading}
            className="
              inline-flex
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-rose-500/20
              bg-rose-500/10
              px-3
              py-2.5
              text-xs
              font-bold
              text-rose-600
              transition
              hover:bg-rose-500/15
              disabled:opacity-60
              dark:text-rose-400
            "
          >
            <Trash2 size={15} />

            Remove
          </button>
        )}
      </div>

      <p
        className="
          mt-3
          text-[10px]
          leading-5
          text-slate-500
          dark:text-slate-400
        "
      >
        Maximum image size: 2 MB
      </p>

      {error && (
        <p
          role="alert"
          className="
            mt-3
            text-xs
            font-medium
            text-rose-500
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default AvatarUploader;