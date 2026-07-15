function AuthLoader({ text = "Please wait..." }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <span
        className="
          h-4
          w-4
          animate-spin
          rounded-full
          border-2
          border-white
          border-t-transparent
        "
      />

      {text}
    </span>
  );
}

export default AuthLoader;