"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * The opening hero: our own printer footage, full-bleed, with the brand
 * line set over it.
 *
 * Media — `public/media/hero/printer-*.mp4` are H.264 re-encodes of the
 * original `Media/HeroPage.MOV` (a 44 MB portrait HEVC clip straight off the
 * phone, which is both too heavy for a hero and not decodable in every
 * browser). The 720p file is served to phone-width viewports via the
 * `<source media>` switch, the 1080p one everywhere else. The poster is the
 * clip's own first frame, rendered as a real image *underneath* the video:
 * it paints first, the video takes over the moment it has a frame, and if
 * the video can't load at all the poster simply stays.
 *
 * Motion — three independent layers so nothing ever fights over a property:
 *   .hero-frame     scroll  → scale / radius (desktop only)
 *   .hero-clip      intro   → clip-path reveal
 *   .hero-parallax  pointer → x / y drift
 *   .hero-media     intro   → scale settle
 * All of it lives in gsap.matchMedia, so it is torn down on unmount and
 * never runs under prefers-reduced-motion. The pre-hydration hidden state
 * comes from CSS keyed on `data-pending` (see globals.css) so the server
 * HTML never flashes the finished composition before the intro starts.
 */

const POSTER = "/media/hero/printer-poster.jpg";
const HEADLINE = [
  ["Ideas", "take"],
  ["physical", "form."],
];

// Module-level on purpose: the full-length intro plays once per page load.
// Coming back to "/" via client navigation gets a brisker cut of it.
let introPlayed = false;

function scrollToSection(id: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // React doesn't reliably serialise `muted` into the server HTML, and
  // browsers refuse to autoplay anything not muted — so set it for real and
  // start playback by hand. Under reduced motion the poster stands in.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    video.play().catch(() => {
      /* autoplay blocked (e.g. low-power mode) — the poster remains */
    });
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    // ---- Intro + scroll hand-off -------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const navItems = gsap.utils.toArray<HTMLElement>("[data-site-header] [data-nav-item]");

      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });

      // 1–2. Dark stage, then the footage opens up. Phones get a plain fade
      // instead of animating a clip-path over a playing video.
      if (isDesktop) {
        intro.fromTo(
          q(".hero-clip"),
          { clipPath: "inset(22% 34% 22% 34% round 28px)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            opacity: 1,
            duration: 1.8,
            ease: "expo.inOut",
            clearProps: "clipPath",
          },
          0.1
        );
      } else {
        intro.fromTo(
          q(".hero-clip"),
          { opacity: 0 },
          { opacity: 1, duration: 1.4, ease: "power2.out" },
          0.1
        );
      }

      // 7. …while the footage itself eases back into its resting scale.
      intro.fromTo(
        q(".hero-media"),
        { scale: isDesktop ? 1.26 : 1.14 },
        { scale: 1.06, duration: 2.8, ease: "power3.out" },
        0.1
      );

      // 3. Brand mark and nav settle in from above.
      if (navItems.length) {
        intro.fromTo(
          navItems,
          { y: -14, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.08, clearProps: "transform,opacity" },
          0.95
        );
      }

      intro
        .fromTo(q(".hero-eyebrow"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 1.05)
        // 4. Headline: every character rises out of its own mask.
        .fromTo(
          q(".hero-char"),
          { yPercent: 118 },
          { yPercent: 0, duration: 1.15, stagger: 0.024 },
          1.15
        )
        // 5–6. Supporting line, then the CTAs.
        .fromTo(q(".hero-copy"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 1.75)
        .fromTo(
          q(".hero-cta"),
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
          1.9
        )
        .fromTo(
          q(".hero-meta"),
          { opacity: 0 },
          { opacity: 1, duration: 1.2, stagger: 0.12, ease: "power2.out" },
          2.2
        );

      if (introPlayed) intro.timeScale(1.7);
      introPlayed = true;

      // Every from-state above is now applied inline, so the CSS pre-hide
      // can let go without anything flashing.
      root.removeAttribute("data-pending");

      // Scroll: the hero is sticky and the collection sheet rides up over
      // it, so over exactly one hero-height of scroll the copy lifts away
      // and the footage sinks back. Once fully covered, stop decoding video.
      const stage = root.parentElement ?? root;
      const video = videoRef.current;
      const handoff = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${root.offsetHeight}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onLeave: () => video?.pause(),
          onEnterBack: () => {
            video?.play().catch(() => {});
          },
        },
      });
      handoff
        .to(q(".hero-content"), { y: -90, opacity: 0, duration: 0.55 }, 0)
        .to(q(".hero-dim"), { opacity: 0.6, duration: 1 }, 0);
    });

    // ---- Desktop only: the frame draws in as the sheet arrives ---------
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      const stage = root.parentElement ?? root;
      gsap.to(q(".hero-frame"), {
        scale: 0.93,
        borderRadius: 28,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${root.offsetHeight}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
    });

    // ---- Real mouse only: a few pixels of depth -------------------------
    mm.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        const mediaX = gsap.quickTo(q(".hero-parallax"), "x", { duration: 1.4, ease: "power3.out" });
        const mediaY = gsap.quickTo(q(".hero-parallax"), "y", { duration: 1.4, ease: "power3.out" });
        const titleX = gsap.quickTo(q(".hero-title"), "x", { duration: 1.1, ease: "power3.out" });
        const titleY = gsap.quickTo(q(".hero-title"), "y", { duration: 1.1, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          mediaX(nx * -22);
          mediaY(ny * -14);
          titleX(nx * 8);
          titleY(ny * 5);
        };
        root.addEventListener("pointermove", onMove);
        return () => root.removeEventListener("pointermove", onMove);
      }
    );

    // Fonts landing late can change the hero's height; keep triggers honest.
    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      data-hero
      data-pending=""
      className="dark relative top-0 z-0 h-svh min-h-[600px] w-full overflow-hidden bg-[#070708] text-[#f2f2f0] [@media(min-height:600px)]:sticky"
    >
      <noscript>
        <style>{`[data-hero][data-pending] .hero-clip,[data-hero][data-pending] [data-hero-anim]{opacity:1!important}`}</style>
      </noscript>

      {/* Footage ------------------------------------------------------- */}
      <div className="hero-frame absolute inset-0 overflow-hidden will-change-transform">
        <div className="hero-clip absolute inset-0">
          <div className="hero-parallax absolute inset-0">
            {/* Graded down in CSS: the raw clip is a brightly lit room, and
                pulling most of the colour out lets the type and the single
                accent carry the frame. */}
            <div className="hero-media absolute inset-0 [filter:saturate(0.28)_contrast(1.1)_brightness(0.86)]">
              <Image
                src={POSTER}
                alt=""
                fill
                sizes="100vw"
                loading="eager"
                fetchPriority="high"
                className="object-cover object-center md:object-[50%_42%]"
              />
              {!videoFailed && (
                <video
                  ref={videoRef}
                  aria-hidden
                  tabIndex={-1}
                  autoPlay
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover object-center md:object-[50%_42%]"
                >
                  <source
                    src="/media/hero/printer-720.mp4"
                    type="video/mp4"
                    media="(max-width: 767px)"
                  />
                  {/* An unplayable <video> reports the failure on its last
                      <source>, not on the element itself. */}
                  <source
                    src="/media/hero/printer-1080.mp4"
                    type="video/mp4"
                    onError={() => setVideoFailed(true)}
                  />
                </video>
              )}
            </div>
          </div>

          {/* One overlay, four jobs: an even tint to quiet the room, a
              left-hand falloff for the copy, a floor that melts into the
              section colour, and a soft ceiling behind the navbar. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: [
                "linear-gradient(180deg, rgba(7,7,8,0.72) 0%, rgba(7,7,8,0) 20%)",
                "linear-gradient(0deg, rgba(7,7,8,0.96) 0%, rgba(7,7,8,0.62) 26%, rgba(7,7,8,0) 62%)",
                "linear-gradient(90deg, rgba(7,7,8,0.9) 0%, rgba(7,7,8,0.62) 36%, rgba(7,7,8,0) 76%)",
                "rgba(7,7,8,0.38)",
              ].join(","),
            }}
          />
        </div>
      </div>

      {/* Scroll-driven dimmer, above the footage and below the copy. */}
      <div aria-hidden className="hero-dim pointer-events-none absolute inset-0 bg-[#070708] opacity-0" />

      {/* Copy ---------------------------------------------------------- */}
      <div className="hero-content relative z-10 mx-auto flex h-full w-full max-w-[1400px] flex-col justify-end px-5 pb-24 pt-24 md:px-8 md:pb-8">
        <div className="hero-title will-change-transform">
          <p
            data-hero-anim
            className="hero-eyebrow inline-flex items-center gap-2.5 rounded-full bg-white/[0.06] py-1.5 pl-3 pr-4 text-[10px] font-medium uppercase tracking-[0.16em] text-white/80 ring-1 ring-inset ring-white/15 backdrop-blur-md md:text-[11px]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Printed in-house, layer by layer
          </p>

          <h1
            data-hero-anim
            aria-label="Ideas take physical form."
            className="hero-headline text-display mt-5 uppercase md:mt-6"
          >
            {HEADLINE.map((line, lineIndex) => (
              <span key={lineIndex} aria-hidden className="block">
                {line.map((word, wordIndex) => (
                  <span
                    key={word}
                    className={`-my-[0.08em] inline-block overflow-hidden py-[0.08em] align-bottom ${
                      wordIndex < line.length - 1 ? "mr-[0.24em]" : ""
                    }`}
                  >
                    {Array.from(word).map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className={`hero-char inline-block will-change-transform ${
                          char === "." ? "text-accent" : ""
                        }`}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>

        <p
          data-hero-anim
          className="hero-copy mt-6 max-w-[38ch] text-[15px] leading-relaxed text-white/70 md:mt-8 md:max-w-[44ch] md:text-[17px]"
        >
          From digital imagination to tangible objects. Designed with precision. Made to exist.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-9">
          {/* Both CTAs use the shared `.btn-fill` system (globals.css): they
              stay exactly where they are, and hover is a left-to-right
              brand-colour fill. The dark translucent backing keeps the
              labels readable over whatever frame of footage is behind. */}
          <div data-hero-anim className="hero-cta">
            <a
              href="#collection"
              onClick={scrollToSection("collection")}
              className="btn-fill btn-fill--on-media flex h-14 w-full items-center justify-between gap-5 rounded-full px-7 text-[12px] font-semibold uppercase tracking-[0.14em] sm:w-auto"
            >
              Explore collection
              <ArrowDown size={16} aria-hidden />
            </a>
          </div>

          <div data-hero-anim className="hero-cta">
            <a
              href="#create"
              onClick={scrollToSection("create")}
              className="btn-fill btn-fill--on-media btn-fill--quiet flex h-14 w-full items-center justify-between gap-5 rounded-full px-7 text-[12px] font-semibold uppercase tracking-[0.14em] sm:w-auto"
            >
              Create something
              <ArrowUpRight size={16} aria-hidden />
            </a>
          </div>
        </div>

        {/* Baseline: scroll cue on one side, brand statement on the other. */}
        <div aria-hidden className="mt-8 h-px bg-white/10 md:mt-12" />
        <div className="flex items-center justify-between gap-6 pt-4 md:pt-5">
          <a
            data-hero-anim
            href="#collection"
            onClick={scrollToSection("collection")}
            className="hero-meta group flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/55 transition-colors duration-300 hover:text-white"
          >
            <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-white/20">
              <span className="hero-scroll-line absolute inset-x-0 top-0 h-1/2 bg-white" />
            </span>
            Scroll
          </a>
          <p
            data-hero-anim
            className="hero-meta text-right text-[10px] font-medium uppercase tracking-[0.2em] text-white/55"
          >
            Designed digitally. <span className="block text-white/85 sm:inline">Built physically.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
