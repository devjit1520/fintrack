import { motion } from "framer-motion";

function ProfileCard({ title, children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="
        bg-white
        dark:bg-slate-800
        rounded-3xl
        shadow-sm
        border
        border-slate-200
        dark:border-slate-700
        p-6
      "
    >
      <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">
        {title}
      </h2>

      {children}
    </motion.div>
  );
}

export default ProfileCard;