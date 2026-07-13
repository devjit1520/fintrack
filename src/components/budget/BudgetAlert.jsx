import useBudget from "../../hooks/useBudget";
import useFinance from "../../hooks/useFinance";

function BudgetAlert() {
  const { budgets } = useBudget();
  const { transactions } = useFinance();


  const overBudget = budgets.filter((budget) => {

    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category
      )
      .reduce(
        (sum, t) => sum + Number(t.amount),
        0
      );


    return spent > budget.amount;
  });



  if (!overBudget.length) return null;



  return (
    <div
      className="
        rounded-2xl

        border
        border-red-500/30

        bg-red-500/10

        p-5
      "
    >

      <h2
        className="
          text-xl
          font-bold

          text-red-500

          dark:text-red-400
        "
      >
        ⚠ Budget Alert
      </h2>



      <ul
        className="
          mt-3

          space-y-2

          text-slate-700

          dark:text-slate-300
        "
      >

        {overBudget.map((item) => (

          <li key={item.id}>
            {item.category} budget exceeded.
          </li>

        ))}

      </ul>


    </div>
  );
}

export default BudgetAlert;