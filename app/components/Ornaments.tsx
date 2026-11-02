import type { CSSProperties } from "react";

export function FloralDivider({ style }: { style?: CSSProperties }) {
  return (
    <div className="floral-divider" aria-hidden="true" style={style}>
      <span />✦<span />
    </div>
  );
}

export function CornerOrnaments() {
  return (
    <div className="corner-ornaments" aria-hidden="true">
      <i className="ornament tl">❧</i>
      <i className="ornament tr">❧</i>
      <i className="ornament bl">❧</i>
      <i className="ornament br">❧</i>
    </div>
  );
}
