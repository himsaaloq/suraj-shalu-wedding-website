"use client";

import { useEffect, useState } from "react";

const digits = (value: number) => String(value).padStart(2, "0");

const countdownLabels: Record<string, string> = {
  days: "दिन",
  hours: "घंटे",
  minutes: "मिनट",
  seconds: "सेकंड",
};

// Baraat Prasthan — 11 Dec 2026, 8:00 PM IST
const TARGET = new Date("2026-12-11T20:00:00+05:30").getTime();

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: "--", hours: "--", minutes: "--", seconds: "--" });

  useEffect(() => {
    const update = () => {
      const difference = Math.max(0, TARGET - Date.now());
      setTimeLeft({
        days: digits(Math.floor(difference / 86_400_000)),
        hours: digits(Math.floor((difference % 86_400_000) / 3_600_000)),
        minutes: digits(Math.floor((difference % 3_600_000) / 60_000)),
        seconds: digits(Math.floor((difference % 60_000) / 1_000)),
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    const onVisibility = () => {
      if (!document.hidden) update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="countdown" data-stagger aria-label="बारात प्रस्थान तक शेष समय">
      {Object.entries(timeLeft).map(([key, value], index) => (
        <div className="countdown-unit" key={key} style={{ "--i": index } as React.CSSProperties}>
          <strong key={value}>{value}</strong>
          <span>{countdownLabels[key]}</span>
        </div>
      ))}
    </div>
  );
}
