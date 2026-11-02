import Header from "./components/Header";
import Countdown from "./components/Countdown";
import Events from "./components/Events";
import ScrollEffects from "./components/ScrollEffects";
import IntroGate from "./components/IntroGate";
import { CornerOrnaments, FloralDivider } from "./components/Ornaments";
import { vars } from "./lib/css";

// Fixed values (no Math.random) so server and client render identically.
const sparkles = [
  { x: "6%", s: 5, t: 15, w: 0, dx: 24 },
  { x: "14%", s: 3, t: 19, w: 4, dx: -18 },
  { x: "22%", s: 6, t: 17, w: 9, dx: 30 },
  { x: "31%", s: 4, t: 21, w: 2, dx: -26 },
  { x: "39%", s: 3, t: 16, w: 11, dx: 16 },
  { x: "47%", s: 5, t: 20, w: 6, dx: -22 },
  { x: "55%", s: 4, t: 18, w: 13, dx: 28 },
  { x: "63%", s: 6, t: 22, w: 1, dx: -30 },
  { x: "71%", s: 3, t: 17, w: 8, dx: 20 },
  { x: "79%", s: 5, t: 19, w: 14, dx: -16 },
  { x: "86%", s: 4, t: 16, w: 5, dx: 26 },
  { x: "93%", s: 6, t: 21, w: 10, dx: -24 },
];

const reveal = (delay = 0) => vars({ "--d": `${delay}ms` });

export default function Home() {
  return (
    <main>
      <IntroGate />
      <ScrollEffects />
      <Header />

      <section className="hero" id="home">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="sparkles" aria-hidden="true">
          {sparkles.map((sparkle, index) => (
            <i
              key={index}
              style={vars({
                "--x": sparkle.x,
                "--s": `${sparkle.s}px`,
                "--t": `${sparkle.t}s`,
                "--w": `-${sparkle.w}s`,
                "--dx": `${sparkle.dx}px`,
              })}
            />
          ))}
        </div>
        <div className="hero-inner">
          <div className="ganesh-mantra">॥ ॐ श्री गणेशाय नमः ॥</div>
          <FloralDivider />
          <p className="eyebrow">WITH THE BLESSINGS OF OUR FAMILIES</p>
          <p className="hero-subtitle">शुभ विवाह</p>
          <h1><span className="name">Suraj</span> <em>&amp;</em> <span className="name">Shalu</span></h1>
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
        <p className="section-kicker" data-reveal style={reveal(0)}>A CELEBRATION OF LOVE &amp; TRADITION</p>
        <h2 data-reveal style={reveal(100)}>दो दिल, एक पवित्र बंधन</h2>
        <p className="section-intro" data-reveal style={reveal(200)}>ईश्वर की असीम कृपा एवं आप सभी के स्नेहाशीष से</p>
        <div className="couple-photos" data-stagger>
          <div className="photo-frame" style={vars({ "--i": 0 })}>
            <div className="photo-img">
              <picture>
                <source srcSet="/images/suraj.webp" type="image/webp" />
                <img src="/images/suraj.jpg" alt="Suraj" width={560} height={1038} loading="lazy" decoding="async" />
              </picture>
            </div>
            <span>आयुष्मान सूरज</span>
          </div>

          <div className="photo-frame" style={vars({ "--i": 1 })}>
            <div className="photo-img">
              <picture>
                <source srcSet="/images/shalu.webp" type="image/webp" />
                <img src="/images/shalu.jpg" alt="Shalu" width={560} height={907} loading="lazy" decoding="async" />
              </picture>
            </div>
            <span>आयुष्मती शालू</span>
          </div>
        </div>
        <div className="invitation-card" data-reveal="zoom" data-stagger>
          <CornerOrnaments />
          <div className="card-top-symbol" style={vars({ "--i": 1 })}>ॐ</div>
          <p className="card-label" style={vars({ "--i": 2 })}>विवाह निमंत्रण</p>
          <div className="name-block" style={vars({ "--i": 3 })}><span>आयुष्मान</span><strong>सूरज</strong></div>
          <div className="card-and" style={vars({ "--i": 4 })}>✦ <span>एवं</span> ✦</div>
          <div className="name-block" style={vars({ "--i": 5 })}><span>आयुष्मती</span><strong>शालू</strong></div>
          <FloralDivider style={vars({ "--i": 6 })} />
          <p className="card-blessing" style={vars({ "--i": 7 })}>आपकी गरिमामयी उपस्थिति एवं शुभाशीर्वाद<br />हमारे लिए अमूल्य होंगे।</p>
          <div className="card-date" style={vars({ "--i": 8 })}>११ दिसंबर २०२६</div>
        </div>
      </section>

      <section className="countdown-section">
        <p className="section-kicker gold-text" data-reveal style={reveal(0)}>THE WEDDING CELEBRATION</p>
        <h2 data-reveal style={reveal(100)}>शुभ घड़ी का इंतज़ार</h2>
        <p className="countdown-caption" data-reveal style={reveal(200)}>बारात प्रस्थान · 11 दिसंबर 2026 · रात 8 बजे</p>
        <Countdown />
      </section>

      <section className="events-section section-space" id="events">
        <p className="section-kicker" data-reveal style={reveal(0)}>SAVE THE DATES</p>
        <h2 data-reveal style={reveal(100)}>मांगलिक कार्यक्रम</h2>
        <p className="section-intro" data-reveal style={reveal(200)}>हर रस्म में खुशियों के रंग, हर पल में अपनों का संग।</p>
        <Events />
      </section>

      <section className="venue-section section-space" id="venue">
        <p className="section-kicker gold-text" data-reveal style={reveal(0)}>JOIN US FOR THE CELEBRATION</p>
        <h2 data-reveal style={reveal(100)}>आपका स्वागत है</h2>
        <p className="venue-intro" data-reveal style={reveal(200)}>राजस्थान की पावन धरा पर आपके आगमन की प्रतीक्षा रहेगी।</p>
        <div className="venue-grid" data-stagger>
          <article className="venue-card" style={vars({ "--i": 0 })}>
            <div className="venue-icon">⌂</div>
            <p className="venue-eyebrow">PRE-WEDDING CELEBRATIONS</p>
            <h3>भीलवाड़ा</h3>
            <p>निवास स्थान एवं सामुदायिक भवन</p>
            <a href="https://maps.app.goo.gl/K8SMwhK5jPckuRoF6" target="_blank" rel="noopener noreferrer">
              भीलवाड़ा का नक्शा देखें ↗
            </a>
          </article>
          <article className="venue-card featured" style={vars({ "--i": 1 })}>
            <div className="venue-icon">♜</div>
            <p className="venue-eyebrow">WEDDING CEREMONY</p>
            <h3>चित्तौड़गढ़</h3>
            <p>विवाह स्थल · शुभ लग्न अनुसार</p>
            <a href="https://maps.app.goo.gl/7KUXuRFzh4hBq4hTA" target="_blank" rel="noopener noreferrer">
              चित्तौड़गढ़ का नक्शा देखें ↗
            </a>
          </article>
        </div>
        <p className="venue-note" data-reveal style={reveal(300)}>सटीक venue address उपलब्ध होने पर यहाँ अपडेट किया जा सकता है।</p>
      </section>

      <section className="closing-section section-space" data-stagger>
        <div className="closing-flower" aria-hidden="true" style={vars({ "--i": 0 })}>❀</div>
        <p className="section-kicker" style={vars({ "--i": 1 })}>WITH LOVE &amp; BLESSINGS</p>
        <h2 style={vars({ "--i": 2 })}>पधारो सा!</h2>
        <p className="closing-copy" style={vars({ "--i": 3 })}>आपकी उपस्थिति इस शुभ अवसर की शोभा बढ़ाएगी।<br />नवयुगल को अपना स्नेह और आशीर्वाद प्रदान करें।</p>
        <div className="closing-names" style={vars({ "--i": 4 })}>सूरज <span>&amp;</span> शालू</div>
        <div className="closing-date" style={vars({ "--i": 5 })}>११ · १२ · २०२६</div>
        <FloralDivider style={vars({ "--i": 6 })} />
      </section>

      <footer className="site-footer">MADE WITH LOVE FOR THE WEDDING OF SURAJ &amp; SHALU <span>✦</span> 2026</footer>
    </main>
  );
}
