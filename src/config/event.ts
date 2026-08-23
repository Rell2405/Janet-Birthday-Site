export type AttendanceStatus = "attending" | "not-attending" | "undecided";

export interface EventFeatures {
  itinerary: boolean;
  faq: boolean;
  travel: boolean;
  rsvp: boolean;
  playlist: boolean;
  photoGallery: boolean;
  countdown: boolean;
  invitationOnlyDetails: boolean;
}

export interface EventConfig {
  identity: {
    siteName: string;
    honoree: string;
    title: string;
    description: string;
    socialImageAlt: string;
  };
  schedule: {
    startsAt: string | null;
    timeZone: string | null;
    rsvpDeadline: string | null;
  };
  rsvp: {
    maxPartySize: number;
    allowUpdates: boolean;
    retentionDaysAfterEvent: number;
    fallbackContact: string | null;
  };
  features: EventFeatures;
}

export const eventConfig = {
  identity: {
    siteName: "Janet's Journey",
    honoree: "Janet",
    title: "Janet's Island Week · Jamaica 2027",
    description:
      "A seven-day birthday celebration shaped by island time, beautiful tables, and Jamaica's north coast.",
    socialImageAlt: "Janet's Island Week — Jamaica 2027",
  },
  schedule: {
    startsAt: "2027-05-24T17:30:00-05:00",
    timeZone: "America/Jamaica",
    rsvpDeadline: null,
  },
  rsvp: {
    maxPartySize: 10,
    allowUpdates: true,
    retentionDaysAfterEvent: 30,
    fallbackContact: null,
  },
  features: {
    itinerary: true,
    faq: true,
    travel: true,
    rsvp: false,
    playlist: false,
    photoGallery: false,
    countdown: false,
    invitationOnlyDetails: false,
  },
} satisfies EventConfig;
