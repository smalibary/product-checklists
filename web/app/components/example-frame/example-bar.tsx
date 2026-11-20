import "./example-bar.css";

// The browser strip at the top of every example's card: three dots and an address pill.
export function ExampleBar({ address }: { address: string }) {
  return (
    <div className="ex-bar" aria-hidden="true">
      <span className="ex-dots">
        <i />
        <i />
        <i />
      </span>
      <span className="ex-address">{address}</span>
    </div>
  );
}
