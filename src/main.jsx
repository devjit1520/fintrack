import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext";
import AuthProvider from "./context/AuthContext";

import ActivityProvider from "./context/ActivityContext";
import ProfileProvider from "./context/ProfileContext";
import FinanceProvider from "./context/FinanceContext";
import BudgetProvider from "./context/BudgetContext";
import GoalProvider from "./context/GoalContext";

import ErrorBoundary from "./components/common/ErrorBoundary";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ActivityProvider>
              <ProfileProvider>
                <FinanceProvider>
                  <BudgetProvider>
                    <GoalProvider>
                      <App />
                    </GoalProvider>
                  </BudgetProvider>
                </FinanceProvider>
              </ProfileProvider>
            </ActivityProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);