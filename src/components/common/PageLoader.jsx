import { motion } from "framer-motion";
import {
  Landmark,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/* =========================================================
   ANIMATION SETTINGS
========================================================= */

const dotAnimation = {
  initial: {
    opacity: 0.25,
    y: 0,
  },

  animate: {
    opacity: [0.25, 1, 0.25],
    y: [0, -4, 0],
  },
};

/* =========================================================
   PAGE LOADER
========================================================= */

function PageLoader() {
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        min-h-dvh
        items-center
        justify-center
        overflow-hidden
        bg-slate-50
        px-5
        dark:bg-[#020617]
      "
    >
      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Top blue glow */}

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -left-32
            -top-40
            h-[430px]
            w-[430px]
            rounded-full
            bg-cyan-500/[0.12]
            blur-[120px]
          "
        />

        {/* Right violet glow */}

        <motion.div
          animate={{
            scale: [1.05, 0.95, 1.05],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -right-36
            top-1/4
            h-[420px]
            w-[420px]
            rounded-full
            bg-violet-500/[0.12]
            blur-[130px]
          "
        />

        {/* Bottom glow */}

        <motion.div
          animate={{
            x: [-20, 20, -20],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -bottom-48
            left-1/3
            h-[400px]
            w-[400px]
            rounded-full
            bg-blue-500/[0.1]
            blur-[130px]
          "
        />

        {/* Grid */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            dark:opacity-[0.04]
            [background-image:linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)]
            [background-size:42px_42px]
          "
        />
      </div>

      {/* ===================================================
          MAIN LOADER
      =================================================== */}

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
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        className="
          relative
          z-10
          w-full
          max-w-[430px]
        "
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-slate-200/80
            bg-white/90
            p-6
            shadow-2xl
            shadow-slate-950/[0.08]
            backdrop-blur-2xl
            dark:border-white/[0.08]
            dark:bg-[#081326]/90
            dark:shadow-black/30
            sm:p-8
          "
        >
          {/* Inner glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-44
              w-44
              rounded-full
              bg-blue-500/[0.09]
              blur-[70px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              -left-16
              h-44
              w-44
              rounded-full
              bg-violet-500/[0.08]
              blur-[75px]
            "
          />

          <div className="relative">
            {/* =================================================
                BRAND BADGE
            ================================================== */}

            <div
              className="
                flex
                justify-center
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-blue-500/15
                  bg-blue-500/[0.06]
                  px-3
                  py-1.5
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-blue-600
                  dark:border-cyan-400/15
                  dark:bg-cyan-400/[0.06]
                  dark:text-cyan-300
                "
              >
                <Sparkles size={11} />

                Finance Manager
              </div>
            </div>

            {/* =================================================
                ANIMATED LOGO
            ================================================== */}

            <div
              className="
                relative
                mx-auto
                mt-7
                flex
                h-28
                w-28
                items-center
                justify-center
              "
            >
              {/* Outer ring */}

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  inset-0
                  rounded-full
                  border
                  border-dashed
                  border-blue-500/25
                "
              />

              {/* Middle ring */}

              <motion.div
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  inset-3
                  rounded-full
                  border
                  border-dashed
                  border-violet-500/30
                "
              />

              {/* Pulse */}

              <motion.div
                animate={{
                  scale: [1, 1.13, 1],
                  opacity: [0.2, 0.45, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  h-20
                  w-20
                  rounded-[26px]
                  bg-blue-500/20
                  blur-xl
                "
              />

              {/* Logo */}

              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  relative
                  flex
                  h-[70px]
                  w-[70px]
                  items-center
                  justify-center
                  rounded-[23px]
                  border
                  border-white/20
                  bg-gradient-to-br
                  from-cyan-400
                  via-blue-500
                  to-violet-600
                  text-white
                  shadow-xl
                  shadow-blue-500/30
                "
              >
                <Landmark size={30} />
              </motion.div>
            </div>

            {/* =================================================
                BRAND
            ================================================== */}

            <div className="mt-6 text-center">
              <h1
                className="
                  text-2xl
                  font-black
                  tracking-[-0.04em]
                  text-slate-950
                  dark:text-white
                  sm:text-3xl
                "
              >
                Fin
                <span
                  className="
                    bg-gradient-to-r
                    from-cyan-500
                    via-blue-500
                    to-violet-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  Track
                </span>
              </h1>

              <p
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Preparing your financial workspace
              </p>
            </div>

            {/* =================================================
                PROGRESS BAR
            ================================================== */}

            <div className="mt-7">
              <div
                className="
                  h-2
                  w-full
                  overflow-hidden
                  rounded-full
                  bg-slate-200
                  dark:bg-white/[0.07]
                "
              >
                <motion.div
                  initial={{
                    x: "-100%",
                  }}
                  animate={{
                    x: "340%",
                  }}
                  transition={{
                    duration: 1.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="
                    h-full
                    w-[30%]
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-400
                    via-blue-500
                    to-violet-500
                    shadow-[0_0_12px_rgba(59,130,246,0.55)]
                  "
                />
              </div>
            </div>

            {/* =================================================
                LOADING TEXT
            ================================================== */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.13em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Loading
              </span>

              <div
                className="
                  flex
                  items-center
                  gap-1
                "
              >
                {[0, 1, 2].map(
                  (dot) => (
                    <motion.span
                      key={dot}
                      variants={
                        dotAnimation
                      }
                      initial="initial"
                      animate="animate"
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay:
                          dot * 0.16,
                      }}
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-blue-500
                        dark:bg-cyan-400
                      "
                    />
                  )
                )}
              </div>
            </div>

            {/* =================================================
                SECURITY STATUS
            ================================================== */}

            <div
              className="
                mt-7
                flex
                items-center
                justify-center
                gap-2
                border-t
                border-slate-200/80
                pt-5
                dark:border-white/[0.07]
              "
            >
              <ShieldCheck
                size={13}
                className="
                  text-emerald-500
                "
              />

              <p
                className="
                  text-[9px]
                  font-semibold
                  text-slate-400
                  dark:text-slate-500
                "
              >
                Loading your secure financial data
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            BOTTOM TEXT
        =================================================== */}

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          className="
            mt-5
            text-center
            text-[9px]
            font-semibold
            tracking-wide
            text-slate-400
            dark:text-slate-600
          "
        >
          FinTrack • Personal Finance Manager
        </motion.p>
      </motion.div>
    </div>
  );
}

export default PageLoader;