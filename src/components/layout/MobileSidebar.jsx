import {
  useEffect,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";

import navigation from "../../data/navigation";
import SidebarItem from "./SidebarItem";

/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function MobileSidebar({
  open,
  onClose,
}) {
  /* =======================================================
     LOCK PAGE SCROLL AND HANDLE ESCAPE
  ======================================================= */

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleEscape = (
      event
    ) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    open,
    onClose,
  ]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* =================================================
              BACKDROP
          ================================================== */}

          <motion.button
            type="button"
            aria-label="Close mobile sidebar"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-[90]
              cursor-default
              bg-slate-950/70
              backdrop-blur-sm
              lg:hidden
            "
          />

          {/* =================================================
              SIDEBAR DRAWER
          ================================================== */}

          <motion.aside
            initial={{
              x: "-100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "-100%",
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
            className="
              fixed
              inset-y-0
              left-0
              z-[100]
              flex
              w-[min(86vw,320px)]
              flex-col
              overflow-hidden
              border-r
              border-slate-200
              bg-white
              shadow-2xl
              shadow-slate-950/40
              dark:border-slate-800
              dark:bg-[#020617]
              lg:hidden
            "
          >
            {/* =================================================
                BRAND HEADER
            ================================================== */}

            <div
              className="
                flex
                h-20
                shrink-0
                items-center
                justify-between
                border-b
                border-slate-200
                px-5
                dark:border-slate-800
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div
                    className="
                      absolute
                      -inset-1.5
                      rounded-2xl
                      bg-gradient-to-br
                      from-cyan-400/30
                      to-violet-500/30
                      blur-lg
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-cyan-400
                      via-blue-500
                      to-violet-600
                      text-white
                      shadow-lg
                      shadow-cyan-500/20
                    "
                  >
                    <WalletCards size={22} />
                  </div>
                </div>

                <div className="min-w-0">
                  <h2
                    className="
                      truncate
                      text-lg
                      font-black
                      text-slate-950
                      dark:text-white
                    "
                  >
                    FinTrack
                  </h2>

                  <p
                    className="
                      truncate
                      text-[11px]
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Personal Finance Manager
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-500
                  transition
                  hover:bg-slate-100
                  hover:text-slate-950
                  dark:hover:bg-slate-800
                  dark:hover:text-white
                "
              >
                <X size={21} />
              </button>
            </div>

            {/* =================================================
                NAVIGATION
            ================================================== */}

            <nav
              className="
                min-h-0
                flex-1
                space-y-2
                overflow-y-auto
                overscroll-contain
                px-4
                py-5
              "
            >
              <p
                className="
                  mb-3
                  px-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-slate-400
                "
              >
                Main navigation
              </p>

              {navigation.map(
                (item) => (
                  <SidebarItem
                    key={
                      item.id ||
                      item.path
                    }
                    item={item}
                    onClick={() => {
                      onClose?.();
                    }}
                  />
                )
              )}
            </nav>

            {/* =================================================
                BOTTOM CARD
            ================================================== */}

            <div
              className="
                shrink-0
                border-t
                border-slate-200
                p-4
                dark:border-slate-800
              "
            >
              <div
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-cyan-500/15
                  bg-gradient-to-br
                  from-cyan-500/[0.09]
                  via-blue-500/[0.05]
                  to-violet-500/[0.09]
                  p-4
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-24
                    w-24
                    rounded-full
                    bg-violet-500/15
                    blur-2xl
                  "
                />

                <div className="relative flex items-start gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-emerald-500/10
                      text-emerald-500
                    "
                  >
                    <ShieldCheck size={18} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-sm
                        font-bold
                        text-slate-950
                        dark:text-white
                      "
                    >
                      FinTrack Pro
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        leading-5
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Your financial data stays protected and
                      organized.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileSidebar;