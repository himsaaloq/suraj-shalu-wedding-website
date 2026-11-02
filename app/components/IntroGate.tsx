
"use client";

import { useEffect, useRef, useState } from "react";
import { FloralDivider } from "./Ornaments";

type Phase = "closed" | "opening" | "done";

export default function IntroGate() {
  const [phase, setPhase] = useState<Phase>("closed");
  const timers = useRef<number[]>([]);

  const setInert = (on: boolean) => {
    document
      .querySelectorAll<HTMLElement>("main > :not(.intro-gate)")
      .forEach((el) => {
        if (on) {
          el.setAttribute("inert", "");
        } else {
          el.removeAttribute("inert");
        }
      });
  };

  useEffect(() => {
    if (!document.documentElement.classList.contains("intro")) {
      setPhase("done");
      return;
    }

    setInert(true);

    return () => {
      timers.current.forEach((id) => {
        window.clearTimeout(id);
      });

      setInert(false);
    };
  }, []);

  const open = () => {
    if (phase !== "closed") return;

    // Start music immediately within the user's click.
    window.dispatchEvent(new Event("invitation:open"));

    // Begin the existing royal door-opening animation.
    setPhase("opening");
    setInert(false);

    timers.current.push(
      window.setTimeout(() => {
        document.documentElement.classList.remove("intro");
      }, 250),

      window.setTimeout(() => {
        setPhase("done");
      }, 1900)
    );
  };

  if (phase === "done") return null;

  return (
    <div
      className={
        phase === "opening"
          ? "intro-gate is-opening"
          : "intro-gate"
      }
      role="dialog"
      aria-modal="true"
      aria-label="शुभ विवाह निमंत्रण"
    >
      <div
        className="gate-panel left"
        aria-hidden="true"
      >
        <i className="gate-mandala">✺</i>

        <div className="corner-ornaments">
          <i className="ornament tl">❧</i>
          <i className="ornament bl">❧</i>
        </div>
      </div>

      <div
        className="gate-panel right"
        aria-hidden="true"
      >
        <i className="gate-mandala">✺</i>

        <div className="corner-ornaments">
          <i className="ornament tr">❧</i>
          <i className="ornament br">❧</i>
        </div>
      </div>

      <div className="gate-center">
        <div className="gate-mantra">
          ॥ ॐ श्री गणेशाय नमः ॥
        </div>

        <FloralDivider />

        <p className="gate-sub">शुभ विवाह</p>

        <div className="gate-names">
          Suraj <em>&amp;</em> Shalu
        </div>

        <p className="gate-hindi">
          आप सपरिवार सादर आमंत्रित हैं
        </p>

        <button
          type="button"
          className="gate-seal"
          onClick={open}
        >
          <span
            className="gate-seal-disc"
            aria-hidden="true"
          >
            श्री
          </span>

          <span className="gate-seal-label">
            निमंत्रण खोलें
          </span>
        </button>
      </div>
    </div>
  );
}
