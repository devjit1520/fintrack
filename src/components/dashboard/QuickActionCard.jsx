import Card from "../common/Card";

function QuickActionCard({
  title,
  icon: Icon,
  color,
}) {
  return (
    <Card className="cursor-pointer hover:scale-105">
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color}`}
        >
          <Icon size={28} className="text-white" />
        </div>

        <h3 className="font-semibold text-white">
          {title}
        </h3>
      </div>
    </Card>
  );
}

export default QuickActionCard;