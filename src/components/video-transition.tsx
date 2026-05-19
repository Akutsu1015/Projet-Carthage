"use client";

import { useState, useRef, useCallback, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { SkipForward } from "lucide-react";

const TRANSITION_VIDEOS = [
  "/videos/Code-Lyoko-Season-5-Aelita-transition.mp4",
  "/videos/Code-Lyoko-Season-5-Yumi-transition.mp4",
  "/videos/Code-Lyoko-Season-5-William-transition.mp4",
  "/videos/Code-Lyoko-Season-5-Ulrich-transition.mp4",
  "/videos/Code-Lyoko-Season-5-Sissi-transition.mp4",
  "/videos/Code-Lyoko-Season-5-Jeremy-transition.mp4",
];

function pickRandom() {
  return TRANSITION_VIDEOS[Math.floor(Math.random() * TRANSITION_VIDEOS.length)];
}

interface TransitionCtx {
  playTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionCtx>({ playTransition: () => {} });

export function useVideoTransition() {
  return useContext(TransitionContext);
}

export function VideoTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [fading, setFading] = useState(false);
  const targetRef = useRef<string>("");
  const pendingSrc = useRef<string>("");

  const navigate = useCallback(() => {
    if (targetRef.current) {
      router.push(targetRef.current);
    }
  }, [router]);

  const playTransition = useCallback((href: string) => {
    targetRef.current = href;
    pendingSrc.current = pickRandom();
    setVisible(true);
    setShowSkip(false);
    setFading(false);

    // Show skip button after 1s
    setTimeout(() => setShowSkip(true), 1000);
  }, []);

  // Play the video once the overlay is visible and the ref is attached
  useEffect(() => {
    if (visible && pendingSrc.current && videoRef.current) {
      const v = videoRef.current;
      v.src = pendingSrc.current;
      pendingSrc.current = "";
      v.load();
      v.play().catch(() => {
        // Autoplay blocked — navigate directly
        setVisible(false);
        navigate();
      });
    }
  }, [visible, navigate]);

  const handleEnded = useCallback(() => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      setFading(false);
      navigate();
    }, 300);
  }, [navigate]);

  const handleSkip = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      setFading(false);
      navigate();
    }, 200);
  }, [navigate]);

  const handleError = useCallback(() => {
    setVisible(false);
    navigate();
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ playTransition }}>
      {children}

      {/* ═══ Fullscreen Video Overlay ═══ */}
      {visible && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            onEnded={handleEnded}
            onError={handleError}
            className="h-full w-full object-cover"
          />

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute bottom-8 right-8 flex items-center gap-2 rounded-lg border border-white/20 bg-white/[0.08] px-5 py-2.5 font-display text-xs font-semibold tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/15"
            style={{
              opacity: showSkip ? 1 : 0,
              transition: "opacity 0.5s ease",
              pointerEvents: showSkip ? "auto" : "none",
            }}
          >
            SKIP <SkipForward size={14} />
          </button>

          {/* Loading indicator (while video loads) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-lyoko-blue" />
          </div>
        </div>
      )}
    </TransitionContext.Provider>
  );
}
