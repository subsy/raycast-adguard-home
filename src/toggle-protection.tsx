import React from "react";
import { List, Icon, ActionPanel, Action, Color, Toast, showToast } from "@raycast/api";
import { useState, useEffect } from "react";
import { getStatus, toggleProtection, Status, getAdGuardHomeUrl, snoozeProtection } from "./api";

export default function Command() {
  const [status, setStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchStatus() {
    try {
      const data = await getStatus();
      setStatus(data);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to fetch status",
        message: String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleProtection() {
    if (!status) return;
    try {
      const newState = !status.protection_enabled;
      await toggleProtection(newState);
      setStatus((prev) => (prev ? { ...prev, protection_enabled: newState } : null));
      showToast({
        style: Toast.Style.Success,
        title: `Protection ${newState ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to toggle protection",
        message: String(error),
      });
    }
  }

  async function handleSnooze(duration: number) {
    try {
      await snoozeProtection(duration);
      setStatus((prev) => (prev ? { ...prev, protection_enabled: false } : null));
      showToast({
        style: Toast.Style.Success,
        title: "Protection snoozed",
        message: `Will resume in ${duration / (60 * 1000)} minutes`,
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to snooze protection",
        message: String(error),
      });
    }
  }

  async function handleSnoozeUntilTomorrow() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const duration = tomorrow.getTime() - now.getTime();
    await handleSnooze(duration);
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <List isLoading={isLoading}>
      <List.Item
        title="Protection Status"
        subtitle={status?.protection_enabled ? "Protection is Active" : "Protection is Disabled"}
        icon={{
          source: status?.protection_enabled ? Icon.CheckCircle : Icon.XMarkCircle,
          tintColor: status?.protection_enabled ? Color.Green : Color.Red,
        }}
        accessories={[
          {
            text: status?.protection_enabled ? "Enabled" : "Disabled",
            icon: {
              source: status?.protection_enabled ? Icon.CheckCircle : Icon.XMarkCircle,
              tintColor: status?.protection_enabled ? Color.Green : Color.Red,
            },
          },
        ]}
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action
                title={status?.protection_enabled ? "Disable Protection" : "Enable Protection"}
                onAction={handleToggleProtection}
                icon={{
                  source: status?.protection_enabled ? Icon.XMarkCircle : Icon.CheckCircle,
                  tintColor: status?.protection_enabled ? Color.Red : Color.Green,
                }}
              />
              {status?.protection_enabled && (
                <ActionPanel.Submenu
                  title="Snooze Protection"
                  icon={Icon.Clock}
                >
                  <Action
                    title="Snooze for 1 Minute"
                    onAction={() => handleSnooze(60 * 1000)}
                    icon={Icon.Clock}
                  />
                  <Action
                    title="Snooze for 10 Minutes"
                    onAction={() => handleSnooze(10 * 60 * 1000)}
                    icon={Icon.Clock}
                  />
                  <Action
                    title="Snooze for 1 Hour"
                    onAction={() => handleSnooze(60 * 60 * 1000)}
                    icon={Icon.Clock}
                  />
                  <Action
                    title="Snooze for 8 Hours"
                    onAction={() => handleSnooze(8 * 60 * 60 * 1000)}
                    icon={Icon.Clock}
                  />
                  <Action
                    title="Snooze Until Tomorrow"
                    onAction={() => handleSnoozeUntilTomorrow()}
                    icon={Icon.Clock}
                  />
                </ActionPanel.Submenu>
              )}
            </ActionPanel.Section>
            <ActionPanel.Section>
              <Action.OpenInBrowser title="Open in Adguard Home" url={`${getAdGuardHomeUrl()}/#`} />
              <Action
                title="Refresh Status"
                icon={Icon.ArrowClockwise}
                onAction={fetchStatus}
                shortcut={{ modifiers: ["cmd"], key: "r" }}
              />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
    </List>
  );
}
