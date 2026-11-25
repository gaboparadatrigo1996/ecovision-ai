import type { ReactNode } from "react";
import { createPortal } from "react-dom";

/** Keep viewport controls outside transformed/animated stage containers. */
export function MobileActionBar({ children }: { children: ReactNode }) {
  return createPortal(<div className="mobile-action-bar">{children}</div>, document.body);
}
