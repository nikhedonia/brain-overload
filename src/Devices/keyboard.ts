import { useEffect } from "react";

export function useKeyboard(
  handler: (x: string) => void,
  event: "keyup" | "keydown" | "keypress" = "keyup"
) {
  useEffect(() => {
    function onKeyUp(e: KeyboardEvent) {
      handler(e.key.toLowerCase());
    }
    window.addEventListener(event, onKeyUp);
    return () => window.removeEventListener(event, onKeyUp);
  }, []);
}

export function useKeyboardAction(
  event: "keydown" | "keyup" | "keypress",
  actionMap: { [k: string]: (k: string) => void }
) {
  return useKeyboard((x) => {
    const action = actionMap[x];
    action && action(x);
  }, event);
}
