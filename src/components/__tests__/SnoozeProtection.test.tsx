import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Command from "../../snooze-protection";
import { getStatus, snoozeProtection } from "../../api";
import { showToast } from "@raycast/api";

// Mock the API functions
jest.mock("../../api", () => ({
  getStatus: jest.fn(),
  snoozeProtection: jest.fn(),
}));

describe("SnoozeProtection", () => {
  jest.setTimeout(10000); // Increase timeout for all tests in this suite

  const mockStatus = {
    protection_enabled: true,
    filtering_enabled: true,
    dns_queries: 100,
    blocked_today: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getStatus as jest.Mock).mockResolvedValue(mockStatus);
  });

  it("renders snooze options", async () => {
    jest.useFakeTimers();
    render(<Command />);

    await waitFor(() => {
      expect(screen.getByTestId("list-section")).toHaveAttribute('data-title', 'Snooze Options');
      expect(screen.getAllByText("Snooze for 1 Minute")[0]).toBeInTheDocument();
      expect(screen.getAllByText("Snooze for 10 Minutes")[0]).toBeInTheDocument();
    }, { timeout: 10000 });

    jest.useRealTimers();
  });

  it("shows current status", async () => {
    render(<Command />);

    await waitFor(() => {
      expect(screen.getByText("Protection Active")).toBeInTheDocument();
    });
  });

  it("handles snooze action", async () => {
    const user = userEvent.setup();
    (snoozeProtection as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Command />);

    // Find and click the 1 minute snooze button
    const snoozeButton = await screen.findByRole("button", { name: "Snooze for 1 Minute" }, { timeout: 10000 });
    await user.click(snoozeButton);

    await waitFor(() => {
      expect(snoozeProtection).toHaveBeenCalledWith(60 * 1000);
      expect(showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Protection snoozed"
      }));
    }, { timeout: 10000 });
  });

  it("shows countdown timer when snoozed", async () => {
    const user = userEvent.setup();
    (snoozeProtection as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Command />);

    // Find and click the 1 minute snooze button
    const snoozeButton = await screen.findByRole("button", { name: "Snooze for 1 Minute" });
    await user.click(snoozeButton);

    await waitFor(() => {
      expect(screen.getByText(/Snoozed \(\d+s\)/)).toBeInTheDocument();
    });
  });

  it("handles snooze error", async () => {
    const user = userEvent.setup();
    const error = new Error("API Error");
    (snoozeProtection as jest.Mock).mockRejectedValueOnce(error);

    render(<Command />);

    const snoozeButton = await screen.findByRole("button", { name: "Snooze for 1 Minute" });
    await user.click(snoozeButton);

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Failed to snooze protection",
        message: error.toString()
      }));
    });
  });
}); 