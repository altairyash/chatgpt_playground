import type { Metadata } from "next";
import WorkspaceClient from "../components/WorkspaceClient";

export const metadata: Metadata = {
  title: "Research Workspace | CiteGlance",
  description:
    "Record AI buyer-intent answers and citations, turn evidence into channel-specific content, and compare later rechecks.",
  alternates: { canonical: "/workspace" },
};

export default function WorkspacePage() {
  return <WorkspaceClient />;
}
