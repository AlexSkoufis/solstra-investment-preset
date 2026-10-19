"use client";

import { useRef } from "react";
import { Button, Logo } from "./ui/Button";
import { gsap, MQ, revealLines, useGsap } from "@/lib/motion";

const columns = [
  { title: "About", links: ["Our story", "Leadership", "Stewardship", "Careers", "News"] },
  { title: "Investors", links: ["Institutional", "Professional", "Individual", "Fund centre"] },
  { title: "Shareholders", links: ["Investor relations", "Results & reports", "Board & governance", "Share price"] },
];

const legal = ["Privacy", "Cookies", "Accessibility", "Legal & regulatory", "Modern slavery statement"];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGsap(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      revealLines(ref.current!.querySelector(".footer__cta-title")!);
      gsap.from(".footer__wordmark span", {
        yPercent: 140,
        duration: 1.6,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: ".footer__wordmark", start: "top 95%", once: true },
      });
      gsap.from(".footer__col, .footer__contact", {
        y: 24, opacity: 0, stagger: 0.07, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".footer__nav", start: "top 90%", once: true },
      });
    });
  }, ref);

  return (
    <footer ref={ref} className="footer section--dark" data-header="dark">
      <div className="container">
        <div className="footer__cta">
          <h2 className="footer__cta-title">
            Let’s start a <em>conversation</em>.
          </h2>
          <div className="footer__cta-actions">
            <Button href="#footer-contact" variant="solid" cursor="Open">
              Contact us
            </Button>
            <a className="footer__tel link" href="tel:+442000000000">
              +44 (0)20 0000 0000
            </a>
          </div>
        </div>

        <div className="footer__nav">
          <a href="#top" className="footer__logo" aria-label="Back to top">
            <Logo />
          </a>
          {columns.map((c) => (
            <nav key={c.title} className="footer__col" aria-label={c.title}>
              <p className="label">{c.title}</p>
              <ul>
                {c.links.map((l) => (
                  <li key={l}>
                    <a className="link" href="#top">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <address id="footer-contact" className="footer__contact">
            <p className="label">London</p>
            <p>
              Meridian House
              <br />
              12 Orbit Yard
              <br />
              London EC2X 0XX
            </p>
            <p className="label label--mono">51.5155° N — 0.0922° W</p>
          </address>
        </div>

        <div className="footer__legal">
          <p>
            The value of investments and the income from them can go down as well as up and you may get back less than
            you originally invested. Solstra Capital is a fictional company created for demonstration purposes; all
            names, figures and addresses on this page are placeholders. Registered office: Meridian House, 12 Orbit
            Yard, London EC2X 0XX.
          </p>
          <ul>
            {legal.map((l) => (
              <li key={l}>
                <a className="link" href="#top">
                  {l}
                </a>
              </li>
            ))}
          </ul>
          <div className="footer__credit">
            <p className="label">Homepage preset · fictional brand for demonstration</p>
            <a className="link" href="https://coreconcepts.design/" target="_blank" rel="noopener">
              Designed by CoreConcepts Design <span aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <p className="footer__wordmark" aria-hidden="true">
        {"Solstra".split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </p>
    </footer>
  );
}
