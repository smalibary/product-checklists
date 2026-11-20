import { Key } from "@phosphor-icons/react/dist/ssr";
import { useMet } from "../../components/checklist-layer/met-context";

const ROWS = ["qwertyuiop", "asdfghjkl"];

// Item 18 is the whole keyboard: it sits below the button, or (unticked) slides up over it.
// Item 5 is the @ key and the saved address above the keys; item 6 is the saved-password chip.
export function Keyboard() {
  const { isMet } = useMet();
  return (
    <div className="ml-kb" data-item="18" data-covers={!isMet(18)} aria-hidden="true">
      <div className="ml-kb-bar">
        {isMet(5) && <span>name@example.com</span>}
        {isMet(6) && (
          <span>
            <Key size={12} /> Saved passwords
          </span>
        )}
      </div>
      {ROWS.map((row) => (
        <div className="ml-kb-row" key={row} data-len={row.length}>
          {[...row].map((k) => (
            <i key={k}>{k}</i>
          ))}
        </div>
      ))}
      <div className="ml-kb-row" data-bottom="true">
        <i>123</i>
        <i>{isMet(5) ? "@" : ","}</i>
        <i data-wide="true">space</i>
        <i>.</i>
        <i data-go="true">go</i>
      </div>
    </div>
  );
}
