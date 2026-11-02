import type { CSSProperties } from "react";

/** Typed helper for inline CSS custom properties, e.g. style={vars({ "--i": 2 })} */
export const vars = (values: Record<string, string | number>) => values as CSSProperties;
