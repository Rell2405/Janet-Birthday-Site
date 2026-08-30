export type TabId =
  | "welcome"
  | "resort"
  | "things-to-know"
  | "what-to-wear"
  | "book-your-stay";

export interface SiteTab {
  id: TabId;
  label: string;
  path: string;
}

export const siteTabs: SiteTab[] = [
  { id: "welcome", label: "Welcome", path: "/" },
  { id: "resort", label: "The Resort", path: "/resort/" },
  {
    id: "things-to-know",
    label: "Things to Know, Before You Go",
    path: "/things-to-know/",
  },
  { id: "what-to-wear", label: "What to Wear", path: "/what-to-wear/" },
  { id: "book-your-stay", label: "Book Your Stay", path: "/book-your-stay/" },
];

export function pathWithBase(path: string, base: string): string {
  const normalizedBase = base === "/" ? "" : base.replace(/\/$/, "");
  return `${normalizedBase}${path}`;
}
