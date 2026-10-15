import type { Metadata } from "next";
import FreeTools from "../components/FreeTools";

export const metadata: Metadata = {
  title: "Free Website Tools: robots.txt, llms.txt & Open Graph | CiteGlance",
  description:
    "Free browser-based website tools to build robots.txt rules, create an llms.txt starter, and generate Open Graph metadata. No account required.",
  alternates: { canonical: "/free-tools" },
};

export default function FreeToolsPage() {
  return <FreeTools />;
}
