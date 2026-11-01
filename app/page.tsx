"use client";

import { useEffect, useRef, useState } from "react";

type WeddingEvent = {
  day: string;
  month: string;
  weekday: string;
  title: string;
  time: string;
  venue: string;
  city: string;
  icon: string;
  description: string;
  category: "pre" | "wedding";
};

const events: WeddingEvent[] = [
  { day: "05", month: "दिसंबर", weekday: "शनिवार", title: "लग्न / विनायक", time: "दोपहर 3:00 बजे", venue: "निवास स्थान", city: "भीलवाड़ा", icon: "🪔", description: "श्री गणेश पूजन एवं शुभ लग्न की मंगल शुरुआत।", category: "pre" },
  { day: "10", month: "दिसंबर", weekday: "गुरुवार", title: "हल्दी", time: "दोपहर 12:00 बजे", venue: "सामुदायिक भवन", city: "भीलवाड़ा", icon: "🌼", description: "हल्दी, हँसी और अपनों के संग खुशियों के रंग।", category: "pre" },
  { day: "10", month: "दिसंबर", weekday: "गुरुवार", title: "मायरा", time: "दोपहर 2:00 बजे", venue: "सामुदायिक भवन", city: "भीलवाड़ा", icon: "🎁", description: "परिवार की परंपराओं और स्नेह का पावन अवसर।", category: "pre" },
  { day: "10", month: "दिसंबर", weekday: "गुरुवार", title: "मंगल कलश", time: "शाम 4:00 बजे", venue: "निवास स्थान", city: "भीलवाड़ा", icon: "🏺", description: "मंगल कलश के साथ शुभता और समृद्धि का स्वागत।", category: "pre" },
  { day: "10", month: "दिसंबर", weekday: "गुरुवार", title: "प्रीति भोज", time: "शाम 7:30 बजे से", venue: "सामुदायिक भवन", city: "भीलवाड़ा", icon: "🍽️", description: "स्नेहभोज में पधारकर नवयुगल को आशीर्वाद दें।", category: "pre" },
  { day: "11", month: "दिसंबर", weekday: "शुक्रवार", title: "बारात प्रस्थान", time: "रात 8:00 बजे", venue: "निवास स्थान", city: "भीलवाड़ा", icon: "🐎", description: "शुभ विवाह की ओर मंगलमय बारात प्रस्थान।", category: "wedding" },
  { day: "11", month: "दिसंबर", weekday: "शुक्रवार", title: "फेरे / परिणय संस्कार", time: "रात्रि में शुभ लग्न अनुसार", venue: "विवाह स्थल", city: "चित्तौड़गढ़", icon: "💍", description: "अग्नि को साक्षी मानकर सात फेरों का पवित्र बंधन।", category: "wedding" },
];

const digits = (value: number) => String(value).padStart(2, "0");
const countdownLabels: Record<string, string> = {
  days: "दिन",
  hours: "घंटे",
  minutes: "मिनट",
  seconds: "सेकंड",
};

function FloralDivider() {
  return <div className="floral-divider" aria-hidden="true"><span />✦<span /></div>;
}

function CornerOrnaments() {
  return (
    <div className="corner-ornaments" aria-hidden="true">
      <i className="ornament tl">❧</i><i className="ornament tr">❧</i>
      <i className="ornament bl">❧</i><i className="ornament br">❧</i>
    </div>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: "--", hours: "--", minutes: "--", seconds: "--" });

  useEffect(() => {
    const target = new Date("2026-12-11T20:00:00+05:30").getTime();
    const update = () => {
      const difference = Math.max(0, target - Date.now());
      setTimeLeft({
        days: digits(Math.floor(difference / 86_400_000)),
        hours: digits(Math.floor((difference % 86_400_000) / 3_600_000)),
        minutes: digits(Math.floor((difference % 3_600_000) / 60_000)),
        seconds: digits(Math.floor((difference % 60_000) / 1_000)),
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="countdown" aria-label="बारात प्रस्थान तक शेष समय">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div className="countdown-unit" key={key}>
          <strong>{value}</strong><span>{countdownLabels[key]}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [musicOn, setMusicOn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "pre" | "wedding">("all");
  const [musicNotice, setMusicNotice] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const filteredEvents = events.filter((event) => filter === "all" || event.category === filter);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
      setMusicNotice("संगीत बंद है");
      return;
    }
    try {
      await audio.play();
      setMusicOn(true);
      setMusicNotice("संगीत चालू है");
    } catch {
      setMusicNotice("संगीत जोड़ने के लिए public/music/wedding-instrumental.mp3 फ़ाइल रखें।");
    }
    window.setTimeout(() => setMusicNotice(""), 4000);
  };

  const closeMenu = () => setMenuOpen(false);
  const cityMap = (city: string) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(city + ", Rajasthan, India")}`;

  return (
    <main>
      <audio ref={audioRef} loop preload="none">
        <source src="/music/wedding-instrumental.mp3" type="audio/mpeg" />
      </audio>

      <header className="site-header">
        <a className="brand" href="#home" aria-label="शुभ विवाह — होम">
          <span className="brand-seal">श्री</span>
          <span className="brand-copy"><b>शुभ विवाह</b><small>SURAJ &amp; SHALU</small></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="मेन्यू खोलें">
          <span /><span /><span />
        </button>
        <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="मुख्य नेविगेशन">
          <a href="#couple" onClick={closeMenu}>युगल</a>
          <a href="#events" onClick={closeMenu}>कार्यक्रम</a>
          <a href="#venue" onClick={closeMenu}>स्थान</a>
          <button className="music-toggle" onClick={toggleMusic}>{musicOn ? "♫ संगीत बंद करें" : "♫ संगीत सुनें"}</button>
        </nav>
      </header>
      {musicNotice && <div className="music-notice" role="status">{musicNotice}</div>}

      <section className="hero" id="home">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="hero-inner">
          <div className="ganesh-mantra">॥ ॐ श्री गणेशाय नमः ॥</div>
          <FloralDivider />
          <p className="eyebrow">WITH THE BLESSINGS OF OUR FAMILIES</p>
          <p className="hero-subtitle">शुभ विवाह</p>
          <h1>Suraj <em>&amp;</em> Shalu</h1>
          <p className="hero-hindi">आयुष्मान सूरज <span>एवं</span> आयुष्मती शालू</p>
          <div className="hero-date"><span>११</span><i /> <span>दिसंबर</span><i /> <span>२०२६</span></div>
          <p className="hero-invite">आप सपरिवार सादर आमंत्रित हैं</p>
          <a className="hero-cta" href="#couple">आमंत्रण देखें <span>✧</span></a>
          <p className="hero-location">भीलवाड़ा · चित्तौड़गढ़, राजस्थान</p>
        </div>
        <div className="side-motif left" aria-hidden="true">❋</div>
        <div className="side-motif right" aria-hidden="true">❋</div>
        <div className="scroll-cue" aria-hidden="true"><span /> SCROLL TO EXPLORE</div>
      </section>

      <section className="couple-section section-space" id="couple">
        <p className="section-kicker">A CELEBRATION OF LOVE &amp; TRADITION</p>
        <h2>दो दिल, एक पवित्र बंधन</h2>
        <p className="section-intro">ईश्वर की असीम कृपा एवं आप सभी के स्नेहाशीष से</p>
        <div className="couple-photos">
  <div className="photo-frame">
    <img src="/images/suraj.jpg" alt="Suraj" />
    <span>आयुष्मान सूरज</span>
  </div>

  <div className="photo-frame">
    <img src="/images/shalu.jpg" alt="Shalu" />
    <span>आयुष्मती शालू</span>
  </div>
</div>
        <div className="invitation-card">
          <CornerOrnaments />
          <div className="card-top-symbol">ॐ</div>
          <p className="card-label">विवाह निमंत्रण</p>
          <div className="name-block"><span>आयुष्मान</span><strong>सूरज</strong></div>
          <div className="card-and">✦ <span>एवं</span> ✦</div>
          <div className="name-block"><span>आयुष्मती</span><strong>शालू</strong></div>
          <FloralDivider />
          <p className="card-blessing">आपकी गरिमामयी उपस्थिति एवं शुभाशीर्वाद<br />हमारे लिए अमूल्य होंगे।</p>
          <div className="card-date">११ दिसंबर २०२६</div>
        </div>
      </section>

      <section className="countdown-section">
        <p className="section-kicker gold-text">THE WEDDING CELEBRATION</p>
        <h2>शुभ घड़ी का इंतज़ार</h2>
        <p className="countdown-caption">बारात प्रस्थान · 11 दिसंबर 2026 · रात 8 बजे</p>
        <Countdown />
      </section>

      <section className="events-section section-space" id="events">
        <p className="section-kicker">SAVE THE DATES</p>
        <h2>मांगलिक कार्यक्रम</h2>
        <p className="section-intro">हर रस्म में खुशियों के रंग, हर पल में अपनों का संग।</p>
        <div className="event-filters" role="group" aria-label="कार्यक्रम फ़िल्टर">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>सभी कार्यक्रम</button>
          <button className={filter === "pre" ? "active" : ""} onClick={() => setFilter("pre")}>पूर्व-विवाह</button>
          <button className={filter === "wedding" ? "active" : ""} onClick={() => setFilter("wedding")}>विवाह दिवस</button>
        </div>
        <div className="event-list">
          {filteredEvents.map((event, index) => (
            <article className="event-card" key={event.title}>
              <div className="event-date"><strong>{event.day}</strong><span>{event.month}</span><small>{event.weekday}</small></div>
              <div className="event-symbol" aria-hidden="true">{event.icon}</div>
              <div className="event-details">
                <div className="event-title-row"><h3>{event.title}</h3><span className="event-number">0{events.indexOf(event) + 1}</span></div>
                <p>{event.description}</p>
                <div className="event-meta"><span>◷ {event.time}</span><span>⌖ {event.venue}, {event.city}</span></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="venue-section section-space" id="venue">
        <p className="section-kicker gold-text">JOIN US FOR THE CELEBRATION</p>
        <h2>आपका स्वागत है</h2>
        <p className="venue-intro">राजस्थान की पावन धरा पर आपके आगमन की प्रतीक्षा रहेगी।</p>
        <div className="venue-grid">
          <article className="venue-card">
            <div className="venue-icon">⌂</div>
            <p className="venue-eyebrow">PRE-WEDDING CELEBRATIONS</p>
            <h3>भीलवाड़ा</h3>
            <p>निवास स्थान एवं सामुदायिक भवन</p>
                      <a
  href="https://maps.app.goo.gl/K8SMwhK5jPckuRoF6"
  target="_blank"
  rel="noopener noreferrer"
>
  भीलवाड़ा का नक्शा देखें ↗
</a>
          </article>
          <article className="venue-card featured">
            <div className="venue-icon">♜</div>
            <p className="venue-eyebrow">WEDDING CEREMONY</p>
            <h3>चित्तौड़गढ़</h3>
            <p>विवाह स्थल · शुभ लग्न अनुसार</p>
           <a
  href="https://maps.app.goo.gl/7KUXuRFzh4hBq4hTA"
  target="_blank"
  rel="noopener noreferrer"
>
  चित्तौड़गढ़ का नक्शा देखें ↗
</a>
          </article>
        </div>
        <p className="venue-note">सटीक venue address उपलब्ध होने पर यहाँ अपडेट किया जा सकता है।</p>
      </section>

      <section className="closing-section section-space">
        <div className="closing-flower" aria-hidden="true">❀</div>
        <p className="section-kicker">WITH LOVE &amp; BLESSINGS</p>
        <h2>पधारो सा!</h2>
        <p className="closing-copy">आपकी उपस्थिति इस शुभ अवसर की शोभा बढ़ाएगी।<br />नवयुगल को अपना स्नेह और आशीर्वाद प्रदान करें।</p>
        <div className="closing-names">सूरज <span>&amp;</span> शालू</div>
        <div className="closing-date">११ · १२ · २०२६</div>
        <FloralDivider />
      </section>

      <footer className="site-footer">MADE WITH LOVE FOR THE WEDDING OF SURAJ &amp; SHALU <span>✦</span> 2026</footer>
    </main>
  );
}
