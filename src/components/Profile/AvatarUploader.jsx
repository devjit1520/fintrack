import {
  useRef,
  useState,
} from "react";

import {
  Camera,
  ImagePlus,
  Trash2,
} from "lucide-react";

import useProfile from "../../hooks/useProfile";

import {
  imageToBase64,
} from "../../utils/imageToBase64";

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
    profile,
    updateAvatar,
    removeAvatar,
  } = useProfile();

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fallbackAvatar =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      profile.name || "FinTrack User"
    )}&background=06b6d4&color=ffffff&size=256`;

  const avatarSource =
    profile.avatar || fallbackAvatar;

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      !ALLOWED_TYPES.includes(file.type)
    ) {
      setError(
        "Please select a JPG, PNG or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(
        "Image size must be less than 2 MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const convertedImage =
        await imageToBase64(file);

      updateAvatar(convertedImage);
    } catch (uploadError) {
      console.error(uploadError);

      setError(
        "Unable to upload this image."
      );
    } finally {
      setIsUploading(false);

      event.target.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    removeAvatar();
    setError("");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img
          src={avatarSource}
          alt={profile.name}
          className="
            h-36
            w-36
            rounded-full
            border-4
            border-white
            object-cover
            shadow-xl
            ring-2
            ring-cyan-500
            dark:border-slate-900
          "
        />

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
            bg-cyan-500
            text-white
            shadow-lg
            transition
            hover:scale-105
            hover:bg-cyan-600
            disabled:cursor-not-allowed
            disabled:opacity-60
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
                border-t-transparent
              "
            />
          ) : (
            <Camera size={19} />
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div
        className="
          mt-4
          flex
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
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-slate-700
            transition
            hover:border-cyan-500
            hover:text-cyan-600
            disabled:opacity-60
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-white
          "
        >
          <ImagePlus size={16} />

          {profile.avatar
            ? "Change Photo"
            : "Upload Photo"}
        </button>

        {profile.avatar && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-2
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-100
              dark:border-red-900
              dark:bg-red-950/30
              dark:hover:bg-red-950/50
            "
          >
            <Trash2 size={16} />
            Remove
          </button>
        )}
      </div>

      <p
        className="
          mt-3
          text-center
          text-xs
          text-slate-500
          dark:text-slate-400
        "
      >
        JPG, PNG or WEBP. Maximum 2 MB.
      </p>

      {error && (
        <p
          className="
            mt-2
            text-center
            text-sm
            font-medium
            text-red-500
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default AvatarUploader;