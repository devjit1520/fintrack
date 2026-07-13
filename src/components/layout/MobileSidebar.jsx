import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { navigation } from "../../data/navigation";
import SidebarItem from "./SidebarItem";
import Logo from "./Logo";

function MobileSidebar({ open, onClose }) {
  return (
    <AnimatePresence>

      {open && (
        <>

          {/* Background */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />

          {/* Sidebar */}

          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
            className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-800 bg-slate-950 lg:hidden"
          >

            <div className="flex items-center justify-between p-5">

              <Logo />

              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-slate-800"
              >
                <X size={24} />
              </button>

            </div>

            <nav className="flex-1 space-y-2 p-4">

              {navigation.map((item) => (
                <div
                  key={item.id}
                  onClick={onClose}
                >
                  <SidebarItem {...item} />
                </div>
              ))}

            </nav>

            <div className="border-t border-slate-800 p-5">

              <div className="rounded-2xl bg-slate-900 p-5">

                <h3 className="font-semibold">
                  FinTrack Pro
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  React • Tailwind CSS
                </p>

              </div>

            </div>

          </motion.aside>

        </>
      )}

    </AnimatePresence>
  );
}

export default MobileSidebar;