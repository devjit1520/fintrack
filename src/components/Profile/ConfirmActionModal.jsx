import {
  AlertTriangle,
  X,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useEffect,
  useState,
} from "react";

function ConfirmActionModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "CONFIRM",
  buttonText = "Confirm",
  loading = false,
}) {
  const [typedValue, setTypedValue] =
    useState("");

  useEffect(() => {
    if (!open) {
      setTypedValue("");
    }
  }, [open]);

  useEffect(() => {
    function handleEscape(event) {
      if (
        event.key === "Escape" &&
        !loading
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleEscape
      );
  }, [loading, onClose]);

  const canConfirm =
    typedValue.trim() ===
    confirmText;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !loading
            ) {
              onClose();
            }
          }}
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/70
            p-4
            backdrop-blur-sm
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.97,
            }}
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-red-200
              bg-white
              p-6
              shadow-2xl
              dark:border-red-900
              dark:bg-slate-900
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-100
                  text-red-600
                  dark:bg-red-950/50
                "
              >
                <AlertTriangle
                  size={23}
                />
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  rounded-lg
                  p-2
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  dark:hover:bg-slate-800
                "
              >
                <X size={19} />
              </button>
            </div>

            <h2
              className="
                mt-5
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {title}
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
              {description}
            </p>

            <p
              className="
                mt-5
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              Type{" "}
              <span className="font-bold text-red-600">
                {confirmText}
              </span>{" "}
              to continue.
            </p>

            <input
              type="text"
              value={typedValue}
              onChange={(event) =>
                setTypedValue(
                  event.target.value
                )
              }
              disabled={loading}
              className="
                mt-3
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
                focus:border-red-500
                focus:ring-4
                focus:ring-red-500/10
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
              placeholder={confirmText}
            />

            <div
              className="
                mt-6
                flex
                flex-col-reverse
                gap-3
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="
                  rounded-xl
                  border
                  border-slate-300
                  px-5
                  py-3
                  font-medium
                  text-slate-700
                  transition
                  hover:bg-slate-100
                  dark:border-slate-700
                  dark:text-slate-200
                  dark:hover:bg-slate-800
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={
                  !canConfirm ||
                  loading
                }
                className="
                  flex
                  min-w-36
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-600
                  px-5
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Processing..."
                  : buttonText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmActionModal;