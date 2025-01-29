import React from "react";
import { List, Icon, ActionPanel, Action, Color, Toast, showToast } from "@raycast/api";
import { useState, useEffect } from "react";
import { getStatus, snoozeProtection, Status } from "./api";

export default function Command() {
  const [status, setStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snoozeEndTime, setSnoozeEndTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    if (!snoozeEndTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = snoozeEndTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setSnoozeEndTime(null);
        setRemainingTime("");
        fetchStatus();
        return;
      }
      
      const seconds = Math.floor(diff / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      
      setRemainingTime(
        hours > 0 
          ? `${hours}h ${minutes}m ${remainingSeconds}s`
          : minutes > 0
          ? `${minutes}m ${remainingSeconds}s`
          : `${remainingSeconds}s`
      );
    }, 100);
    
    return () => clearInterval(interval);
  }, [snoozeEndTime]);

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

  async function handleSnooze(duration: number) {
    try {
      await snoozeProtection(duration);
      setStatus((prev) => (prev ? { ...prev, protection_enabled: false } : null));
      setSnoozeEndTime(new Date(Date.now() + duration));
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
        title="Current Status"
        icon={{
          source: status?.protection_enabled ? Icon.CheckCircle : Icon.Clock,
          tintColor: status?.protection_enabled ? Color.Green : Color.Orange
        }}
        accessories={[
          {
            text: status?.protection_enabled 
              ? "Protection Active" 
              : remainingTime ? `Snoozed (${remainingTime})` : "Protection Disabled",
            icon: {
              source: status?.protection_enabled ? Icon.CheckCircle : Icon.Clock,
              tintColor: status?.protection_enabled ? Color.Green : Color.Orange
            }
          }
        ]}
      />
      <List.Section title="Snooze Options">
        <List.Item
          title="Snooze for 1 Minute"
          icon={Icon.Clock}
          actions={
            <ActionPanel>
              <Action
                title="Snooze for 1 Minute"
                onAction={() => handleSnooze(60 * 1000)}
                icon={Icon.Clock}
              />
            </ActionPanel>
          }
        />
        <List.Item
          title="Snooze for 10 Minutes"
          icon={Icon.Clock}
          actions={
            <ActionPanel>
              <Action
                title="Snooze for 10 Minutes"
                onAction={() => handleSnooze(10 * 60 * 1000)}
                icon={Icon.Clock}
              />
            </ActionPanel>
          }
        />
        <List.Item
          title="Snooze for 1 Hour"
          icon={Icon.Clock}
          actions={
            <ActionPanel>
              <Action
                title="Snooze for 1 Hour"
                onAction={() => handleSnooze(60 * 60 * 1000)}
                icon={Icon.Clock}
              />
            </ActionPanel>
          }
        />
        <List.Item
          title="Snooze for 8 Hours"
          icon={Icon.Clock}
          actions={
            <ActionPanel>
              <Action
                title="Snooze for 8 Hours"
                onAction={() => handleSnooze(8 * 60 * 60 * 1000)}
                icon={Icon.Clock}
              />
            </ActionPanel>
          }
        />
        <List.Item
          title="Snooze Until Tomorrow"
          icon={Icon.Clock}
          actions={
            <ActionPanel>
              <Action
                title="Snooze Until Tomorrow"
                onAction={handleSnoozeUntilTomorrow}
                icon={Icon.Clock}
              />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
} 