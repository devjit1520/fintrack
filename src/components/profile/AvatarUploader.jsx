import { useRef, useState } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";

import useProfile from "../../hooks/useProfile";
import { imageToBase64 } from "../../utils/imageToBase64";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function AvatarUploader() {
  const inputRef = useRef(null);
  const { profile = {}, updateAvatar, removeAvatar } = useProfile() || {};

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const displayName = profile.name || "FinTrack User";
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName
  )}&background=06b6d4&color=ffffff&size=256&bold=true`;

  const avatarSource = profile.avatar || fallbackAvatar;

  const openFilePicker = () => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 2 MB.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      const convertedImage = await imageToBase64(file);
      await Promise.resolve(updateAvatar?.(convertedImage));
    } catch (uploadError) {
      console.error("Avatar upload failed:", uploadError);
      setError("Unable to upload this image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await Promise.resolve(removeAvatar?.());
      setError("");
    } catch (removeError) {
      console.error("Avatar removal failed:", removeError);
      setError("Unable to remove the profile image.");
    }
  };

  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="relative">
        <div className="rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 p-1 shadow-xl shadow-cyan-500/20">
          <img
            src={avatarSource}
            alt={`${displayName} profile`}
            className="h-32 w-32 rounded-full border-4 border-white bg-slate-100 object-cover dark:border-slate-900 dark:bg-slate-800 sm:h-36 sm:w-36"
          />
        </div>

        <button
          type="button"
          onClick={openFilePicker}
          disabled={isUploading}
          aria-label="Upload profile photo"
          className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-cyan-500 text-white shadow-lg transition hover:scale-105 hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-900"
        >
          {isUploading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
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

      <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-600 disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-cyan-400"
        >
          <ImagePlus size={15} />
          {profile.avatar ? "Change" : "Upload"}
        </button>

        {profile.avatar && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/15 disabled:opacity-60 dark:text-rose-400"
          >
            <Trash2 size={15} />
            Remove
          </button>
        )}
      </div>

      <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400 lg:text-left">
        JPG, PNG or WEBP · Maximum 2 MB
      </p>

      {error && (
        <p className="mt-2 max-w-56 text-center text-xs font-medium text-rose-500 lg:text-left">
          {error}
        </p>
      )}
    </div>
  );
}

export default AvatarUploader;
