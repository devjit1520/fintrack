import { Outlet } from "react-router-dom";

import ActivityProvider from "../context/ActivityContext";
import ProfileProvider from "../context/ProfileContext";
import FinanceProvider from "../context/FinanceContext";
import BudgetProvider from "../context/BudgetContext";
import GoalProvider from "../context/GoalContext";
import NotificationProvider from "../context/NotificationContext";

function ProtectedAppProviders() {
  return (
    <ActivityProvider>
      <ProfileProvider>
        <FinanceProvider>
          <BudgetProvider>
            <GoalProvider>
              <NotificationProvider>
                <Outlet />
              </NotificationProvider>
            </GoalProvider>
          </BudgetProvider>
        </FinanceProvider>
      </ProfileProvider>
    </ActivityProvider>
  );
}

export default ProtectedAppProviders;