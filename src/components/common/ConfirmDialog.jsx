import {
  AlertTriangle,
  Trash2,
} from "lucide-react";

import ModalShell from "./ModalShell";
import Button from "./Button";

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm action",
  description = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
}) {
  const isDanger = variant === "danger";

  return (
    <ModalShell
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      description={description}
      size="sm"
      closeOnBackdrop={!loading}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>

          <Button
            variant={isDanger ? "danger" : "primary"}
            leftIcon={isDanger ? Trash2 : undefined}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col items-center py-3 text-center">
        <div
          className={[
            "flex size-20 items-center justify-center",
            "rounded-3xl border",
            isDanger
              ? [
                  "border-rose-500/20",
                  "bg-rose-500/10",
                  "text-rose-500",
                ].join(" ")
              : [
                  "border-amber-500/20",
                  "bg-amber-500/10",
                  "text-amber-500",
                ].join(" "),
          ].join(" ")}
        >
          <AlertTriangle
            size={34}
            strokeWidth={1.8}
          />
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
          This action cannot be undone
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
          The selected transaction will be permanently removed from your
          finance records.
        </p>
      </div>
    </ModalShell>
  );
}

export default ConfirmDialog;