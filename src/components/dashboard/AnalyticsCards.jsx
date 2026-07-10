import CountUp from "react-countup";
import Card from "../common/Card";
import useFinance from "../../hooks/useFinance";

function AnalyticsCards() {
  const { transactions = [] } = useFinance();

  const totalTransactions = transactions.length;

  const highestIncome =
    transactions
      .filter((item) => item.type === "income")
      .reduce(
        (max, item) => Math.max(max, Number(item.amount)),
        0
      );

  const highestExpense =
    transactions
      .filter((item) => item.type === "expense")
      .reduce(
        (max, item) => Math.max(max, Number(item.amount)),
        0
      );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTotal = transactions
    .filter((item) => {
      const date = new Date(item.date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce(
      (total, item) => total + Number(item.amount),
      0
    );

  const analytics = [
    {
      id: 1,
      title: "Transactions",
      value: totalTransactions,
      color: "text-cyan-400",
      prefix: "",
    },
    {
      id: 2,
      title: "Highest Income",
      value: highestIncome,
      color: "text-green-400",
      prefix: "₹",
    },
    {
      id: 3,
      title: "Highest Expense",
      value: highestExpense,
      color: "text-red-400",
      prefix: "₹",
    },
    {
      id: 4,
      title: "This Month",
      value: monthlyTotal,
      color: "text-purple-400",
      prefix: "₹",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {analytics.map((item) => (
        <Card key={item.id}>
          <p className="text-sm text-slate-400">
            {item.title}
          </p>

          <h2 className={`mt-4 text-3xl font-bold ${item.color}`}>
  {item.prefix}
  {Number(item.value).toLocaleString("en-IN")}
</h2>
        </Card>
      ))}
    </div>
  );
}

export default AnalyticsCards;