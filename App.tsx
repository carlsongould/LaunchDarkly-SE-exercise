import { useEffect, useState } from "react";
import { ldClient } from "./launchdarkly";
import { CustomerDashboard } from "./components/CustomerDashboard";
import "./styles.css";

const FLAG_KEY = "customer-insights-enabled";

function App() {
  const [insightsEnabled, setInsightsEnabled] = useState(false);
  const [lastChanged, setLastChanged] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeFlag = async () => {
      await ldClient.waitForInitialization();

      const currentValue = ldClient.variation(
        FLAG_KEY,
        false
      ) as boolean;

      if (mounted) {
        setInsightsEnabled(currentValue);
      }
    };

    initializeFlag();

    const handleFlagChange = () => {
      const newValue = ldClient.variation(
        FLAG_KEY,
        false
      ) as boolean;

      setInsightsEnabled(newValue);
      setLastChanged(new Date());
    };

    ldClient.on(`change:${FLAG_KEY}`, handleFlagChange);

    return () => {
      mounted = false;
      ldClient.off(`change:${FLAG_KEY}`, handleFlagChange);
    };
  }, []);

  return (
    <CustomerDashboard
      insightsEnabled={insightsEnabled}
      lastChanged={lastChanged}
    />
  );
}

export default App;
