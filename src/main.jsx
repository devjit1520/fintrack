import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App";
import "./index.css";

import {
  ThemeProvider,
} from "./context/ThemeContext";

import AuthProvider from "./context/AuthContext";
import ActivityProvider from "./context/ActivityContext";
import FinanceProvider from "./context/FinanceContext";
import GoalProvider from "./context/GoalContext";
import BudgetProvider from "./context/BudgetContext";
import ProfileProvider from "./context/ProfileContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ActivityProvider>
            <FinanceProvider>
              <GoalProvider>
                <BudgetProvider>
                  <ProfileProvider>
                    <App />
                  </ProfileProvider>
                </BudgetProvider>
              </GoalProvider>
            </FinanceProvider>
          </ActivityProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);