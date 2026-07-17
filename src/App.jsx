import { useState } from "react";
import Loader from "./components/loader/Loader";
import AnimatedBackground from "./components/background/AnimatedBackground";
import FloatingActionButton from "./components/common/FloatingActionButton";
import BackToTop from "./components/common/BackToTop";

import { Toaster } from "react-hot-toast";


import AppRoutes from "./routes/AppRoutes";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <Loader
        onFinish={() => setLoading(false)}
      />
    );
  }

  return (
  <>
    <AnimatedBackground />

    <AppRoutes />

    <Toaster
  position="top-right"
  toastOptions={{
    duration: 3500,

    style: {
      borderRadius: "14px",
      padding: "14px 16px",
      fontSize: "14px",
      fontWeight: "600",
    },

    success: {
      duration: 3000,
    },

    error: {
      duration: 4500,
    },
  }}
/>

    <BackToTop />

    {/* <FloatingActionButton /> */}
  </>
);
}

export default App;