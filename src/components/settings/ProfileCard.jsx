import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Camera,
} from "lucide-react";

function ProfileCard() {
  const user = {
    name: "Devjit Mondal",
    email: "devjit@example.com",
    phone: "+91 9876543210",
    location: "West Bengal, India",
    role: "Frontend Developer",
    joined: "July 2026",
    avatar:
      "https://ui-avatars.com/api/?name=Devjit+Mondal&background=0f172a&color=06b6d4&size=200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Header */}
      <div className="flex flex-col items-center">
        <div className="relative">

          <img
            src={user.avatar}
            alt={user.name}
            className="h-32 w-32 rounded-full border-4 border-cyan-500 object-cover"
          />

          <button className="absolute bottom-1 right-1 rounded-full bg-cyan-500 p-2 text-white transition hover:scale-110">
            <Camera size={16} />
          </button>

        </div>

        <h2 className="mt-5 text-2xl font-bold text-white">
          {user.name}
        </h2>

        <p className="text-cyan-400">
          {user.role}
        </p>
      </div>

      <div className="mt-8 space-y-5">

        <ProfileItem
          icon={<Mail size={18} />}
          label="Email"
          value={user.email}
        />

        <ProfileItem
          icon={<Phone size={18} />}
          label="Phone"
          value={user.phone}
        />

        <ProfileItem
          icon={<MapPin size={18} />}
          label="Location"
          value={user.location}
        />

        <ProfileItem
          icon={<Briefcase size={18} />}
          label="Profession"
          value={user.role}
        />

        <ProfileItem
          icon={<Calendar size={18} />}
          label="Member Since"
          value={user.joined}
        />

      </div>

      <button className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition hover:scale-[1.02]">
        Edit Profile
      </button>
    </motion.div>
  );
}

function ProfileItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-800/50 p-4">

      <div className="rounded-xl bg-cyan-500/20 p-3 text-cyan-400">
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-400">
          {label}
        </p>

        <h4 className="font-semibold text-white">
          {value}
        </h4>
      </div>

    </div>
  );
}

export default ProfileCard;