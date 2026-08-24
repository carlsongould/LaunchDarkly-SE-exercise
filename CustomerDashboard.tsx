import { CustomerInsights } from "./CustomerInsights";
import { ReleaseStatus } from "./ReleaseStatus";

interface Props {
  insightsEnabled: boolean;
  lastChanged: Date | null;
}

export function CustomerDashboard({
  insightsEnabled,
  lastChanged,
}: Props) {
  return (
    <main className="app">
      <header className="page-header">
        <div>
          <p className="eyebrow">Observabilit.AI COMPANY</p>
          <h1>Customer Dashboard</h1>
        </div>

        <ReleaseStatus
          enabled={insightsEnabled}
          lastChanged={lastChanged}
        />
      </header>

      <section className="customer-card">
        <div className="customer-header">
          <div>
            <p className="eyebrow">CUSTOMER</p>
            <h2>Jane Smith</h2>
            <p>Enterprise · Acme Tools</p>
          </div>

          <span className="healthy">● Healthy</span>
        </div>

        <div className="metrics">
          <div>
            <span>Revenue</span>
            <strong>$1.2M</strong>
          </div>

          <div>
            <span>Users</span>
            <strong>8,421</strong>
          </div>

          <div>
            <span>Engagement</span>
            <strong>87%</strong>
          </div>
        </div>

        {insightsEnabled && <CustomerInsights />}
      </section>
    </main>
  );
}

