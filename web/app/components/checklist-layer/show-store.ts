const STORAGE_KEY = "checklist-layer:show";
const CHANGE_EVENT = "checklist-layer:change";

let memory: boolean | null = null;

export function readShow(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v !== null) return v !== "0";
  } catch {}
  return memory ?? true;
}

export function writeShow(next: boolean) {
  memory = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeShow(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
