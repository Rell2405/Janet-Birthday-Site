export type TabId =
  | "welcome"
  | "resort"
  | "birthday-weekend"
  | "book-your-stay"
  | "things-to-know";

export interface SiteTab {
  id: TabId;
  label: string;
  path: string;
}

export const siteTabs: SiteTab[] = [
  { id: "welcome", label: "Welcome", path: "/" },
  { id: "resort", label: "The Resort", path: "/resort/" },
  {
    id: "birthday-weekend",
    label: "Birthday Weekend",
    path: "/birthday-weekend/",
  },
  { id: "book-your-stay", label: "Book Your Stay", path: "/book-your-stay/" },
  {
    id: "things-to-know",
    label: "Things to Know, Before You Go",
    path: "/things-to-know/",
  },
];

export function pathWithBase(path: string, base: string): string {
  const normalizedBase = base === "/" ? "" : base.replace(/\/$/, "");
  return `${normalizedBase}${path}`;
}
