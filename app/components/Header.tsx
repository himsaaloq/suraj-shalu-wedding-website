"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TARGET_VOLUME = 0.85;

export default function Header() {
  const [musicOn, setMusicOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [musicNotice, setMusicNotice] = useState("");

  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeFrame = useRef<number | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const resumeOnVisible = useRef(false);

  const showNotice = useCallback((message: string) => {
    setMusicNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setMusicNotice(""), 4000);
  }, []);

  const fadeTo = useCallback((target: number, duration: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeFrame.current) cancelAnimationFrame(fadeFrame.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      audio.volume = Math.min(1, Math.max(0, from + (target - from) * progress));
      if (progress < 1) {
        fadeFrame.current = requestAnimationFrame(step);
      } else {
        fadeFrame.current = null;
        onDone?.();
      }
    };
    fadeFrame.current = requestAnimationFrame(step);
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      setMusicOn(false);
      showNotice("संगीत बंद है");
      fadeTo(0, 450, () => audio.pause());
      return;
    }
    try {
      audio.volume = 0;
      await audio.play();
      setMusicOn(true);
      showNotice("संगीत चालू है");
      fadeTo(TARGET_VOLUME, 1400);
    } catch {
      showNotice("संगीत जोड़ने के लिए public/music/wedding-instrumental.mp3 फ़ाइल रखें।");
    }
  };

  // Header shadow once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Pause music when the tab is hidden, resume when the visitor returns.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden && musicOn && !audio.paused) {
        resumeOnVisible.current = true;
        audio.pause();
      } else if (!document.hidden && resumeOnVisible.current) {
        resumeOnVisible.current = false;
        audio.play().catch(() => setMusicOn(false));
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [musicOn]);

  useEffect(
    () => () => {
      if (fadeFrame.current) cancelAnimationFrame(fadeFrame.current);
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    },
    [],
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <audio ref={audioRef} loop preload="none">
        <source src="/music/wedding-instrumental.mp3" type="audio/mpeg" />
      </audio>

      <header className={scrolled ? "site-header scrolled" : "site-header"}>
        <a className="brand" href="#home" aria-label="शुभ विवाह — होम">
          <span className="brand-seal">श्री</span>
          <span className="brand-copy">
            <b>शुभ विवाह</b>
            <small>SURAJ &amp; SHALU</small>
          </span>
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label="मेन्यू खोलें"
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="main-nav" className={menuOpen ? "main-nav open" : "main-nav"} aria-label="मुख्य नेविगेशन">
          <a href="#couple" onClick={closeMenu}>युगल</a>
          <a href="#events" onClick={closeMenu}>कार्यक्रम</a>
          <a href="#venue" onClick={closeMenu}>स्थान</a>
          <button
            className={musicOn ? "music-toggle playing" : "music-toggle"}
            onClick={toggleMusic}
            aria-pressed={musicOn}
          >
            {musicOn ? "♫ संगीत बंद करें" : "♫ संगीत सुनें"}
          </button>
        </nav>
      </header>
      {musicNotice && (
        <div className="music-notice" role="status">
          {musicNotice}
        </div>
      )}
    </>
  );
}
