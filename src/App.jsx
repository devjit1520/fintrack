import { useState } from "react";
import Loader from "./components/loader/Loader";
import AnimatedBackground from "./components/background/AnimatedBackground";
import FloatingActionButton from "./components/common/FloatingActionButton";
import BackToTop from "./components/common/BackToTop";


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

    <BackToTop />

    <FloatingActionButton />
  </>
);
}

export default App;