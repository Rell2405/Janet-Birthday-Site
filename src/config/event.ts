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
  experience: {
    passportTitle: string;
    passportCountry: string;
    authority: string;
    passenger: string;
    origin: string;
    destination: string;
    destinationShort: string;
    dateLabel: string;
    boardingTime: string;
    flight: string;
    gate: string;
    seat: string;
    cabin: string;
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
    title: "Janet's Journey · First Class to Jamaica",
    description:
      "A modern, secure boarding experience — open the passport and prepare for takeoff to Jamaica.",
    socialImageAlt: "US passport — Janet's Journey, First Class to Jamaica",
  },
  experience: {
    passportTitle: "PASSPORT",
    passportCountry: "United States of America",
    authority: "Ministry of Wanderlust",
    passenger: "JANET",
    origin: "ATL · Atlanta",
    destination: "MBJ · Montego Bay",
    destinationShort: "Jamaica",
    dateLabel: "24 MAY",
    boardingTime: "10:45 AM",
    flight: "JB 246",
    gate: "B7",
    seat: "1A",
    cabin: "FIRST CLASS",
  },
  schedule: {
    startsAt: null,
    timeZone: null,
    rsvpDeadline: null,
  },
  rsvp: {
    maxPartySize: 10,
    allowUpdates: true,
    retentionDaysAfterEvent: 30,
    fallbackContact: null,
  },
  features: {
    itinerary: false,
    faq: false,
    travel: false,
    rsvp: false,
    playlist: false,
    photoGallery: false,
    countdown: false,
    invitationOnlyDetails: false,
  },
} satisfies EventConfig;
