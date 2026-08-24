import { useEffect, useState } from "react";
import { ldClient, customerContext } from "./launchdarkly";
import { CustomerDashboard } from "./components/CustomerDashboard";
import "./styles.css";

const FLAG_KEY = "customer-insights-enabled";

function App() {
  const [insightsEnabled, setInsightsEnabled] = useState(false);
  const [lastChanged, setLastChanged] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeFlag = async () => {
      try {
        await ldClient.waitForInitialization();

        const currentValue = ldClient.variation(
          FLAG_KEY,
          false
        ) as boolean;

        if (mounted) {
          setInsightsEnabled(currentValue);
        }
      } catch (error) {
        console.error(
          "Failed to initialize LaunchDarkly:",
          error
        );

        if (mounted) {
          setInsightsEnabled(false);
        }
      }
    };

    initializeFlag();

    const handleFlagChange = () => {
      const newValue = ldClient.variation(
        FLAG_KEY,
        false
      ) as boolean;

      if (mounted) {
        setInsightsEnabled(newValue);
        setLastChanged(new Date());
      }
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
      customer={customerContext}
    />
  );
}

export default App;