"use client";

import { useState } from "react";
import { events } from "../data/events";
import { vars } from "../lib/css";

type Filter = "all" | "pre" | "wedding";

export default function Events() {
  const [filter, setFilter] = useState<Filter>("all");
  const filteredEvents = events.filter((event) => filter === "all" || event.category === filter);

  return (
    <>
      <div className="event-filters" role="group" aria-label="कार्यक्रम फ़िल्टर">
        <button className={filter === "all" ? "active" : ""} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
          सभी कार्यक्रम
        </button>
        <button className={filter === "pre" ? "active" : ""} aria-pressed={filter === "pre"} onClick={() => setFilter("pre")}>
          पूर्व-विवाह
        </button>
        <button className={filter === "wedding" ? "active" : ""} aria-pressed={filter === "wedding"} onClick={() => setFilter("wedding")}>
          विवाह दिवस
        </button>
      </div>
      <div className="event-list" data-stagger>
        {filteredEvents.map((event, index) => (
          <article className="event-card" key={`${filter}-${event.title}`} style={vars({ "--i": index })}>
            <div className="event-date">
              <strong>{event.day}</strong>
              <span>{event.month}</span>
              <small>{event.weekday}</small>
            </div>
            <div className="event-symbol" aria-hidden="true">{event.icon}</div>
            <div className="event-details">
              <div className="event-title-row">
                <h3>{event.title}</h3>
                <span className="event-number">0{events.indexOf(event) + 1}</span>
              </div>
              <p>{event.description}</p>
              <div className="event-meta">
                <span>◷ {event.time}</span>
                <span>⌖ {event.venue}, {event.city}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
