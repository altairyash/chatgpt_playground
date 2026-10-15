import type { ReactNode } from "react";

export default function Template({ children }: Readonly<{ children: ReactNode }>) {
  return <div className="cg4-route-view">{children}</div>;
}
