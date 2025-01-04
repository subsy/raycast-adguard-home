import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CustomRules } from "../CustomRules";
import { addCustomRule, removeCustomRule } from "../../api";

// Mock the Raycast API
jest.mock("@raycast/api", () => ({
  List: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ActionPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Action: ({ onAction, title }: { onAction: () => void; title: string }) => (
    <button onClick={onAction}>{title}</button>
  ),
  Icon: {
    Globe: "globe",
    CheckCircle: "check",
    XMarkCircle: "x",
    Filter: "filter",
    ExclamationMark: "!",
    Trash: "trash",
    Plus: "plus",
  },
  Color: {
    Blue: "blue",
    Green: "green",
    Red: "red",
    Orange: "orange",
    Purple: "purple",
  },
  showToast: jest.fn(),
  confirmAlert: jest.fn().mockResolvedValue(true),
}));

// Mock the API functions
jest.mock("../../api", () => ({
  addCustomRule: jest.fn(),
  removeCustomRule: jest.fn(),
}));

describe("CustomRules", () => {
  const mockRules = [
    { enabled: true, text: "||example.com^" },
    { enabled: false, text: "@@allowlist.com" },
    { enabled: true, text: "127.0.0.1 blocked.com" },
  ];

  const mockOnRuleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders rules with correct types", () => {
    render(
      <CustomRules
        rules={mockRules}
        isLoading={false}
        onRuleChange={mockOnRuleChange}
      />
    );

    expect(screen.getByText("||example.com^")).toBeInTheDocument();
    expect(screen.getByText("Domain")).toBeInTheDocument();

    expect(screen.getByText("@@allowlist.com")).toBeInTheDocument();
    expect(screen.getByText("Allowlist")).toBeInTheDocument();

    expect(screen.getByText("127.0.0.1 blocked.com")).toBeInTheDocument();
    expect(screen.getByText("Hosts Block")).toBeInTheDocument();
  });

  it("handles rule removal", async () => {
    (removeCustomRule as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <CustomRules
        rules={mockRules}
        isLoading={false}
        onRuleChange={mockOnRuleChange}
      />
    );

    const removeButtons = screen.getAllByTitle("Remove Rule");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(removeCustomRule).toHaveBeenCalledWith("||example.com^");
      expect(mockOnRuleChange).toHaveBeenCalled();
    });
  });

  it("handles rule addition", async () => {
    (addCustomRule as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <CustomRules
        rules={mockRules}
        isLoading={false}
        onRuleChange={mockOnRuleChange}
      />
    );

    // Open add form
    fireEvent.click(screen.getByTitle("Add Rule"));

    // Fill and submit form
    const input = screen.getByPlaceholderText("Enter filtering rule (e.g., ||example.com^)");
    fireEvent.change(input, { target: { value: "||newdomain.com^" } });
    fireEvent.click(screen.getByText("Add Rule"));

    await waitFor(() => {
      expect(addCustomRule).toHaveBeenCalledWith("||newdomain.com^");
      expect(mockOnRuleChange).toHaveBeenCalled();
    });
  });

  it("shows loading state", () => {
    render(
      <CustomRules
        rules={[]}
        isLoading={true}
        onRuleChange={mockOnRuleChange}
      />
    );

    expect(screen.getByRole("list")).toHaveAttribute("aria-busy", "true");
  });

  it("handles API errors gracefully", async () => {
    const error = new Error("API Error");
    (removeCustomRule as jest.Mock).mockRejectedValueOnce(error);

    render(
      <CustomRules
        rules={mockRules}
        isLoading={false}
        onRuleChange={mockOnRuleChange}
      />
    );

    const removeButtons = screen.getAllByTitle("Remove Rule");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Failed to remove rule")).toBeInTheDocument();
    });
  });
}); 