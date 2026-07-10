import AnalyticsCards from "../../components/dashboard/AnalyticsCards";
import AnalyticsOverview from "../../components/analytics/AnalyticsOverview";

function Analytics() {
  return (
    <section className="space-y-8">
      <AnalyticsCards />

      <AnalyticsOverview />
    </section>
  );
}

export default Analytics;