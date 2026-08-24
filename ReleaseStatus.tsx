interface Props {
  enabled: boolean;
  lastChanged: Date | null;
}

export function ReleaseStatus({
  enabled,
  lastChanged,
}: Props) {
  return (
    <div
      className={`release-status ${
        enabled ? "enabled" : "disabled"
      }`}
    >
      <span className="status-dot" />

      <div>
        <strong>
          Customer Insights{" "}
          {enabled ? "LIVE" : "OFF"}
        </strong>

        <small>
          {lastChanged
            ? `Updated ${lastChanged.toLocaleTimeString()}`
            : "Controlled by LaunchDarkly"}
        </small>
      </div>
    </div>
  );
}

