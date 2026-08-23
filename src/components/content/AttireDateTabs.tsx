import { useId, useState, type KeyboardEvent } from "react";

import animalPrints from "@/assets/events/animal-prints.webp";
import islandInBloom from "@/assets/events/island-in-bloom.webp";
import shadesOfBlue from "@/assets/events/shades-of-blue.webp";
import whiteLights from "@/assets/events/white-lights.webp";

const dates = [
  {
    label: "Friday, June 18",
    period: "Morning & afternoon",
    image: {
      src: shadesOfBlue,
      alt: "Shades of Blue pool party attire board for Friday, June 18, with blue swimwear and resort-style inspiration.",
    },
  },
  {
    label: "Friday, June 18",
    period: "Nighttime",
    image: {
      src: whiteLights,
      alt: "White Lights all-white attire board for the Friday, June 18 evening celebration.",
    },
  },
  {
    label: "Saturday, June 19",
    period: "Morning & afternoon",
    image: {
      src: animalPrints,
      alt: "Animal Prints pool party attire board for Saturday, June 19, with leopard, zebra, and other print inspiration.",
    },
  },
  {
    label: "Saturday, June 19",
    period: "Nighttime",
    image: {
      src: islandInBloom,
      alt: "Island in Bloom tropical cocktail attire board for Janet’s Saturday, June 19 birthday celebration.",
    },
  },
] as const;

export default function AttireDateTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const id = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? dates.length - 1
          : event.key === "ArrowRight"
            ? (activeIndex + 1) % dates.length
            : (activeIndex - 1 + dates.length) % dates.length;

    setActiveIndex(nextIndex);
    document.getElementById(`${id}-tab-${nextIndex}`)?.focus();
  }

  const activeDate = dates[activeIndex];

  return (
    <section
      aria-label="Attire inspiration by date"
      className="attire-gallery"
    >
      <div
        aria-label="Choose an event date"
        className="attire-tabs"
        role="tablist"
      >
        {dates.map((date, index) => (
          <button
            aria-controls={`${id}-panel-${index}`}
            aria-selected={activeIndex === index}
            className="attire-tab"
            id={`${id}-tab-${index}`}
            key={`${date.label}-${date.period}`}
            onClick={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
            role="tab"
            tabIndex={activeIndex === index ? 0 : -1}
            type="button"
          >
            <span>{date.label}</span>
            <span>{date.period}</span>
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`${id}-tab-${activeIndex}`}
        className="attire-panel"
        id={`${id}-panel-${activeIndex}`}
        role="tabpanel"
        tabIndex={0}
      >
        <img
          alt={activeDate.image.alt}
          className="attire-image"
          decoding="async"
          fetchPriority={activeIndex === 0 ? "high" : "auto"}
          height={activeDate.image.src.height}
          loading={activeIndex === 0 ? "eager" : "lazy"}
          src={activeDate.image.src.src}
          width={activeDate.image.src.width}
        />
      </div>
    </section>
  );
}
