import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";

import AuthProvider from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import DebtProvider from "./context/DebtContext";

import "./index.css";

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <DebtProvider>
            <App />

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,

                style: {
                  borderRadius: "14px",
                },
              }}
            />
          </DebtProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);