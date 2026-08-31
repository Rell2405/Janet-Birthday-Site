export type AttendanceStatus = "attending" | "not-attending" | "undecided";

export interface EventFeatures {
  itinerary: boolean;
  faq: boolean;
  travel: boolean;
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
  };
  features: EventFeatures;
}

export const eventConfig = {
  identity: {
    siteName: "Janet Turns 60",
    honoree: "Janet",
    title: "Janet’s Island in Bloom · Jamaica 2027",
    description:
      "Celebrate Janet’s 60th birthday at Dreams Rose Hall Resort & Spa in Montego Bay, Jamaica, June 17–21, 2027.",
    socialImageAlt: "Janet’s Island in Bloom — celebrating 60 years in Jamaica",
  },
  schedule: {
    startsAt: "2027-06-17T12:00:00-05:00",
    timeZone: "America/Jamaica",
  },
  features: {
    itinerary: true,
    faq: false,
    travel: false,
    playlist: false,
    photoGallery: false,
    countdown: false,
    invitationOnlyDetails: false,
  },
} satisfies EventConfig;
