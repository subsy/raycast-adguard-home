import React from "react";
import { List, ActionPanel, Action } from "@raycast/api";
import { useState, useEffect } from "react";
import { getCustomRules, CustomRule, getAdGuardHomeUrl } from "./api";
import { CustomRules } from "./components/CustomRules";

export default function Command() {
  const [customRules, setCustomRules] = useState<CustomRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCustomRules() {
    try {
      const data = await getCustomRules();
      setCustomRules(data);
    } catch (error) {
      setCustomRules([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomRules();
  }, []);

  return (
    <CustomRules
      rules={customRules}
      isLoading={isLoading}
      onRuleChange={fetchCustomRules}
    />
  );
} 