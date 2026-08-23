import type { CollectionEntry } from "astro:content";

export function sortItinerary(
  left: CollectionEntry<"itinerary">,
  right: CollectionEntry<"itinerary">,
): number {
  return (
    left.data.date.localeCompare(right.data.date) ||
    left.data.startTime.localeCompare(right.data.startTime) ||
    left.data.order - right.data.order ||
    left.data.title.localeCompare(right.data.title)
  );
}

export function sortFaq(
  left: CollectionEntry<"faq">,
  right: CollectionEntry<"faq">,
): number {
  return (
    left.data.order - right.data.order ||
    left.data.question.localeCompare(right.data.question)
  );
}

export function sortTravel(
  left: CollectionEntry<"travel">,
  right: CollectionEntry<"travel">,
): number {
  return (
    left.data.order - right.data.order ||
    left.data.title.localeCompare(right.data.title)
  );
}

export function formatCalendarDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatClockTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

