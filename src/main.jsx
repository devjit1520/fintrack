import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import FinanceProvider from "./context/FinanceContext";
import GoalProvider from "./context/GoalContext";
import BudgetProvider from "./context/BudgetContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>

      <FinanceProvider>

        <GoalProvider>

          <BudgetProvider>

            <BrowserRouter>

              <App />

            </BrowserRouter>

          </BudgetProvider>

        </GoalProvider>

      </FinanceProvider>

    </ThemeProvider>
  </StrictMode>
);