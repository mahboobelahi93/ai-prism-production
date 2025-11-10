import { useEffect, useState } from "react";

const defaultSuggestedActions = [
  {
    title: "I want to generate report",
    label: "Chat start",
    action: "I want to generate report and lets start",
  },
  {
    title: "Help me to start report writing",
    label: "Help me to start report writing",
    action: "Help me to start report writing",
  },
];

export function useSuggestedActions() {
  const [suggestedActions, setSuggestedActions] = useState(
    defaultSuggestedActions,
  );

  // You can add logic here to update suggested actions based on the conversation context

  return { suggestedActions };
}
