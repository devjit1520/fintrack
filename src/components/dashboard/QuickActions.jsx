import {
  PlusCircle,
  MinusCircle,
  Download,
  Target,
} from "lucide-react";

import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function QuickActions({ setDefaultType , openGoal, }) {
  const { exportCSV } = useFinance();

  const scrollToForm = (type) => {
    const form = document.getElementById("transaction-form");

    if (form) {
      form.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      window.dispatchEvent(
        new CustomEvent("transactionType", {
          detail: type,
        })
      );
    }
  };

  const actions = [
    
   {
      title: "Set Goal",
      icon: Target,
      color: "bg-purple-500/20 text-purple-400",
      onClick: openGoal,
    },
    {
      title: "Export Data",
      icon: Download,
      color: "bg-blue-500/20 text-blue-400",
      onClick: exportCSV,
    },

  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="cursor-pointer hover:scale-105"
          >
            <button
              onClick={item.onClick}
              className="flex w-full flex-col items-center gap-4"
            >
              <div className={`rounded-2xl p-4 ${item.color}`}>
                <Icon size={28} />
              </div>

              <span className="font-semibold text-white">
                {item.title}
              </span>
            </button>
          </Card>
        );
      })}
    </div>
  );
}

export default QuickActions;