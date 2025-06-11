"use client";
import ElevenPlaces from "@/components/ElevenPlaces";
import LoveReasons from "@/components/LoveReasons";
import ScrollSection from "@/components/ScrollSection";
import { motion} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// TimelineMonths component
const months = [
  { name: "June", dir: "june1" },
  { name: "July", dir: "july" },
  { name: "August", dir: "august" },
  { name: "September", dir: "september" },
  { name: "October", dir: "october" },
  { name: "November", dir: "november" },
  { name: "December", dir: "december" },
  { name: "January", dir: "january" },
  { name: "February", dir: "february" },
  { name: "March", dir: "march" },
  { name: "April", dir: "april" },
  { name: "May", dir: "may" },
  { name: "June", dir: "june2" },
];

function TimelineMonths() {
  return (
    <div className="relative flex flex-col items-center py-16">
      {/* Vertical timeline line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-lavender-dark to-lavender-light z-0" style={{ transform: "translateX(-50%)" }} />
      <div className="space-y-32 w-full max-w-4xl z-10">
        {months.map((month, i) => (
          <TimelineMonthItem
            key={month.name + i}
            month={month.name}
            dir={month.dir}
            side={i % 2 === 0 ? "left" : "right"}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineMonthItem({ month, dir, side }: { month: string; dir: string; side: "left" | "right" }) {
  // Animate in when in view
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hovered, setHovered] = useState(false);

  // Assume 9 images per month, named 1.jpg ... 9.jpg in /public/{dir}/
  const images = Array.from({ length: 9 }, (_, i) => `/${dir}/${i + 1}.jpg`);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: side === "left" ? -100 : 100 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative flex items-center w-full"
      style={{ minHeight: 320 }}
    >
      {/* Month label */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-0 -translate-x-full text-right" : "right-0 translate-x-full text-left"} w-32 text-3xl font-bold text-lavender-dark`}>
        {month}
      </div>
      {/* Timeline dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-lavender-dark border-4 border-white shadow-lg z-10" />
      {/* Photo grid */}
      <motion.div
        className={`mx-auto grid grid-cols-3 gap-2 bg-white rounded-xl shadow-lg p-3 border-2 border-lavender-light transition-all duration-300`}
        style={{
          marginLeft: side === "left" ? 80 : "auto",
          marginRight: side === "right" ? 80 : "auto",
          maxWidth: hovered ? 1024 : 320, // Zoom in much more
          zIndex: hovered ? 50 : 1,
          boxShadow: hovered ? "0 8px 48px 8px #a5b4fc" : undefined,
          position: hovered ? "relative" : "static",
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {images.map((src, idx) => (
          <div
            key={src}
            className="relative rounded overflow-hidden bg-gray-100 transition-all duration-300"
            style={{
              width: hovered ? 320 : 96,   // 320px when zoomed
              height: hovered ? 320 : 96,  // 320px when zoomed
            }}
          >
            <Image
              src={src}
              alt={`${month} memory ${idx + 1}`}
              fill
              className="object-cover"
              sizes={hovered ? "320px" : "96px"}
              loading="lazy"
              style={{
                transition: "transform 0.3s",
                transform: hovered ? "scale(1.04)" : "scale(1)",
                imageRendering: "auto",
              }}
              // Optionally, you can add priority={hovered} for even better quality on hover
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function DecryptingDoor({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showDoorOpen, setShowDoorOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowDoorOpen(true), 500);
          setTimeout(onDone, 1800);
          return 100;
        }
        return p + Math.floor(Math.random() * 13) + 7;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: showDoorOpen ? 0 : 1 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-lavender-dark to-lavender-light"
      style={{ pointerEvents: "none" }}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Door with animation */}
        <div className="relative flex items-center justify-center">
          {/* Door frame */}
          <div className="w-64 h-80 bg-gray-300 border-8 border-gray-700 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
            {/* Door panels */}
            <motion.div
              initial={false}
              animate={showDoorOpen ? { x: "-120%" } : { x: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute left-0 top-0 w-1/2 h-full bg-gray-400 border-r-4 border-gray-700"
              style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
            />
            <motion.div
              initial={false}
              animate={showDoorOpen ? { x: "120%" } : { x: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute right-0 top-0 w-1/2 h-full bg-gray-400 border-l-4 border-gray-700"
              style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
            />
            {/* Lock */}
            <motion.div
              initial={{ scale: 1 }}
              animate={showDoorOpen ? { scale: 0 } : { scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
            >
              <span role="img" aria-label="lock">🔒</span>
            </motion.div>
            {/* Progress bar */}
            {!showDoorOpen && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-400">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-green-400"
                  />
                </div>
                <div className="text-center text-xs mt-2 text-gray-700 font-mono tracking-widest">
                  {progress < 100 ? (
                    <>
                      <span className="animate-pulse">beep boop... decrypting</span>
                    </>
                  ) : (
                    <span>ACCESS GRANTED</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Door open animation */}
        {showDoorOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl font-bold text-lavender-night mt-8"
          >
            Door Unlocked!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function HeartUnlockSuspense({ onDone }: { onDone: () => void }) {
  const [showShine, setShowShine] = useState(true);
  const [showMemory, setShowMemory] = useState(false);

  // After 2.5s, fade out and call onDone after memory line
  useEffect(() => {
    const t = setTimeout(() => setShowShine(false), 2500);
    const t2 = setTimeout(() => setShowMemory(true), 3200);
    const t3 = setTimeout(onDone, 4800);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: showShine || showMemory ? 1 : 0 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-gradient-to-br from-lavender-light to-lavender-dark"
      style={{ pointerEvents: "none" }}
    >
      <div className="flex flex-col items-center space-y-8">
        <div className="flex flex-row items-center gap-12">
          <Image src="/generaltao.png" alt="General Tao" width={180} height={180} className="drop-shadow-2xl" />
          <span
            className="text-[10rem] relative"
            style={{
              filter: "drop-shadow(0 0 32px #f472b6) drop-shadow(0 0 64px #f472b6)",
              animation: "shineHeart 1.2s infinite alternate",
            }}
          >
            ❤️
            <style>{`
              @keyframes shineHeart {
                0% { filter: drop-shadow(0 0 16px #f472b6) drop-shadow(0 0 32px #f472b6) brightness(1.1);}
                100% { filter: drop-shadow(0 0 48px #f472b6) drop-shadow(0 0 96px #f472b6) brightness(1.4);}
              }
            `}</style>
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-4xl font-extrabold text-lavender-night text-center drop-shadow-lg"
        >
          You&apos;ve done it! You’ve unlocked Will’s heart!
        </motion.div>
        {showMemory && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold text-lavender-night text-center drop-shadow"
          >
            Let&apos;s take a stroll down memory lane...
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function RaveLasers({ active }: { active: boolean }) {
  // Only render lasers if active
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Rainbow laser lines */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{
            opacity: [0.7, 0.2, 0.7],
            scaleX: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: i * 0.18,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${(i / 12) * 100}%`,
            top: 0,
            width: "8px",
            height: "100%",
            background: `linear-gradient(180deg, hsl(${i * 30},100%,60%) 0%, #fff0 100%)`,
            filter: "blur(1px) brightness(1.3)",
            mixBlendMode: "screen",
            zIndex: 1,
            opacity: 0.7,
            borderRadius: 8,
            pointerEvents: "none",
          }}
        />
      ))}
      {/* Diagonal lasers */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={"diag" + i}
          initial={{ opacity: 0.5, x: -200, y: 0 }}
          animate={{
            opacity: [0.5, 0.2, 0.5],
            x: [0, 200, 0],
            y: [0, 400, 0],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            repeat: Infinity,
            delay: i * 0.3,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${10 + i * 15}%`,
            top: 0,
            width: "6px",
            height: "100%",
            background: `linear-gradient(120deg, hsl(${i * 60},100%,60%) 0%, #fff0 100%)`,
            filter: "blur(2px) brightness(1.2)",
            mixBlendMode: "screen",
            zIndex: 1,
            borderRadius: 8,
            pointerEvents: "none",
            transform: `rotate(${20 + i * 10}deg)`,
          }}
        />
      ))}
    </div>
  );
}

const concerts = [
  { name: "Lost in Dreams", color: "#a5b4fc" },
  { name: "Wave to Earth", color: "#f472b6" },
  { name: "Escape", color: "#facc15" },
  { name: "Sabai", color: "#38bdf8" },
  { name: "Ray Volpe", color: "#f87171" },
  { name: "Beyond", color: "#34d399" },
];

function ConcertRaveSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % concerts.length);
    }, 2200);
    return () => clearTimeout(t);
  }, [activeIdx]);

  return (
    <div className="relative min-h-[420px] flex items-center justify-center overflow-hidden bg-black rounded-xl my-12 shadow-2xl border-4 border-lavender-dark">
      <RaveLasers active={true} />
      {concerts.map((concert, i) => (
        <motion.div
          key={concert.name}
          initial={false}
          animate={i === activeIdx
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: i < activeIdx ? -200 : 200, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
          style={{ pointerEvents: i === activeIdx ? "auto" : "none" }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-extrabold mb-6"
            style={{
              color: "#fff",
              textShadow: `0 0 32px ${concert.color}, 0 0 64px #fff8`,
              letterSpacing: 2,
            }}
          >
            {concert.name}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function CatRockstarRave() {
  return (
    <div className="flex flex-col items-center justify-center py-20 relative min-h-[420px]">
      {/* Rave lasers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{
              opacity: [0.7, 0.2, 0.7],
              scaleX: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              delay: i * 0.18,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: `${(i / 12) * 100}%`,
              top: 0,
              width: "10px",
              height: "100%",
              background: `linear-gradient(180deg, hsl(${i * 30},100%,70%) 0%, #fff0 100%)`,
              filter: "blur(2px) brightness(1.3)",
              mixBlendMode: "screen",
              zIndex: 1,
              opacity: 0.7,
              borderRadius: 8,
              pointerEvents: "none",
            }}
          />
        ))}
        {/* Spotlights */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={"spot" + i}
            initial={{ opacity: 0.5, scaleY: 0.7 }}
            animate={{
              opacity: [0.5, 0.2, 0.5],
              scaleY: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 2.5 + Math.random(),
              repeat: Infinity,
              delay: i * 0.5,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: `${30 + i * 20}%`,
              top: 0,
              width: "80px",
              height: "100%",
              background: `linear-gradient(180deg, #fff7 0%, #f472b6 80%, #fff0 100%)`,
              filter: "blur(8px)",
              mixBlendMode: "screen",
              zIndex: 2,
              opacity: 0.5,
              borderRadius: 40,
              pointerEvents: "none",
            }}
          />
        ))}
      </div>
      {/* Cat gif */}
      <div className="relative z-10 flex flex-col items-center">
        <img
          src="/cat.gif"
          alt="Cat Rockstar"
        />
      </div>
    </div>
  );
}

export default function LovePage() {
  const [showDecrypt, setShowDecrypt] = useState(true);
  const [showSuspense, setShowSuspense] = useState(false);

  return (
    <main className="bg-white text-lavender-night overflow-y-scroll">
      {/* Background music */}
      <audio src="/honeymoon.mp3" autoPlay loop controls={false} style={{ display: "none" }} />
      {/* Decrypting Door Suspense */}
      {showDecrypt && <DecryptingDoor onDone={() => { setShowDecrypt(false); setShowSuspense(true); }} />}
      {/* Heart Unlock Suspense */}
      {showSuspense && !showDecrypt && <HeartUnlockSuspense onDone={() => setShowSuspense(false)} />}
      {/* Main content */}
      {!showDecrypt && !showSuspense && (
        <>
          {/* Timeline months grid */}
          <TimelineMonths />

          {/* Rave Concerts Section with lasers */}
          <ScrollSection
            title="6 Concerts We've Been To"
            titleEffect="scaleUpRotate"
            contentWidth="md"
          >
            <ConcertRaveSection />
          </ScrollSection>

          <ScrollSection title="11 Places We've Been" titleEffect="slideInLeft">
            <ElevenPlaces />
          </ScrollSection>

          <ScrollSection title="24 Reasons I Love You" titleEffect="tilt">
            <LoveReasons />
          </ScrollSection>

          <ScrollSection title="A Letter for You" titleEffect="scaleUpRotate">
            <p className="text-2xl text-center leading-relaxed px-4 whitespace-pre-line">
{`hi barfa
i hope you liked this little game/experience thing i made it took a lot of javascript understanding and chat gpt tokens :). i didn’t eat dinner until 10 pm LOL and i ran to the taco stand hopefully there’s no salsa on my keyboard i ate it rlly fast. ANYWAYS I CANT BELIEVE ITS OUR ONE YEAR AYAYAYAYAYAYAYAY
i seriously mean it when i say you are the best girlfriend i have ever dated, maybe even met in my life. this year may not have been all sunshine and rainbows but when i was working on this especially the timeline part, i nearly shed a tear/felt super nostalgic multiple times. I don’t look back on photos often but seeing how far we’ve come makes me so so grateful to have u as my safety and my home.

time to GLAZE YA. I think in many ways this year I’ve had a lot of old values challenged and questioned and a lot of rewiring has gone on to undo traumas and past beliefs etc. Its such a breath of fresh air to date some one that can provide me so many new perspectives and intellectual conversations late at night and really make me think about what I should value and pursue in my life. You’re so talented, more than you give yourself credit for. I have never met a better crocheter, teacher, UNISHACK project manager LOL. Even if you’re not breezing through hard math and CS, you have the people skills necessary for success, and that alone has shown me so much too. I know it’s hard to believe sometimes, but many times you said you’re pimply or greasy I’ve looked at you like there’s nobody else I want to kiss, be with, show toes on FaceTime, watch youtube conspiracies and make grilled cheese with. rip im tearing up bc of how happy you make me when i really reflect on it. You truly are beautiful inside and out, which I can’t say about many people. Thank you for showing me what else there is to live and be adventurous for. You changed my life <3

i know we haven’t been on many dates recently and usually spending our time indoors CARDLING which don’t get me wrong i like too.. (sad why u have to go so there’s no more cardles :/ SAD) but i feel like time just goes by so quickly when im spending it with you. why are u making me unc faster bruh. I know we both have our fair share of internal issues and arguments but I hope you know at the end of the day my heart lies with you. Even if you don’t fully believe me or trust it, I see a future with you and even if that answer may change or waver on your end, I know deep down this is how i feel and i hope we make it through long distance because who else will I raise cats with in SF, or New York City, or end up out in LA as the song playing right now says :’). I am tearing up once more please excuse me.

Thank you for changing my life. I love you so much <3
I LARV YA I LARV YA I LARV YASORRY FOR PARTY ROCKIN
`}
            </p>
          </ScrollSection>
          {/* Cat Rockstar Rave */}
          <CatRockstarRave />
        </>
      )}
    </main>
  );
}
