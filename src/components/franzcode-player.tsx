"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, GripHorizontal } from "lucide-react";
import { motion } from "framer-motion";

// The "Franz'code" original soundtrack mapping
const PLAYLIST = [
    { file: "Binary Daydream.mp3", title: "Réveil Virtuel" },
    { file: "Binary Daydream (1).mp3", title: "Réveil Virtuel (Part II)" },
    { file: "Bitshift Breeze.mp3", title: "Secteur Banquise" },
    { file: "Bitshift Breeze (1).mp3", title: "Secteur Banquise (Part II)" },
    { file: "Coffee Steam, Quiet Dreams.mp3", title: "Nuit au Labo" },
    { file: "Coffee Steam, Quiet Dreams (1).mp3", title: "Nuit au Labo (Part II)" },
    { file: "Deep Coding Run.mp3", title: "Plongée dans le Réseau" },
    { file: "Deep Coding Run (1).mp3", title: "Plongée dans le Réseau (Part II)" },
    { file: "Deep Coding Sequence.mp3", title: "Séquence de Compilation" },
    { file: "Deep Coding Sequence (1).mp3", title: "Séquence de Compilation (Part II)" },
    { file: "Drizzle & Drive.mp3", title: "Trajet vers l'Usine" },
    { file: "Drizzle & Drive (1).mp3", title: "Trajet vers l'Usine (Part II)" },
    { file: "Midnight Compile.mp3", title: "Retour vers le Passé" },
    { file: "Midnight Compile (1).mp3", title: "Retour vers le Passé (Part II)" },
    { file: "Midnight Compile (2).mp3", title: "Retour vers le Passé (Part III)" },
    { file: "Midnight Compile (3).mp3", title: "Retour vers le Passé (Part IV)" },
    { file: "Midnight Compile (4).mp3", title: "Retour vers le Passé (Part V)" },
    { file: "Midnight Compile (5).mp3", title: "Retour vers le Passé (Part VI)" },
    { file: "Midnight Merge.mp3", title: "Fusion de Données" },
    { file: "Midnight Merge (1).mp3", title: "Fusion de Données (Part II)" },
    { file: "Rising Through Time.mp3", title: "L'Âme de Franz Hopper" },
    { file: "Rising Through Time (1).mp3", title: "L'Âme de Franz Hopper (Part II)" },
    { file: "Root Access.mp3", title: "Accès Carthage" },
    { file: "Root Access (1).mp3", title: "Accès Carthage (Part II)" },
    { file: "Root Access (2).mp3", title: "Accès Carthage (Part III)" },
    { file: "Root Access (3).mp3", title: "Accès Carthage (Part IV)" },
    { file: "Root Access (4).mp3", title: "Accès Carthage (Part V)" },
    { file: "Root Access (5).mp3", title: "Accès Carthage (Part VI)" },
    { file: "Silent Currents.mp3", title: "Mer Numérique" },
    { file: "Silent Currents (1).mp3", title: "Mer Numérique (Part II)" },
];

export default function FranzCodePlayer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentTrack = PLAYLIST[currentTrackIndex];

    // Handle Play/Pause synchronization
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.warn("Audio autoplay blocked", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrackIndex]);

    // Handle Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Format time (seconds to M:SS)
    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
        setIsPlaying(true);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev === 0 ? PLAYLIST.length - 1 : prev - 1));
        setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const seekTime = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
            audioRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <motion.div
            drag
            dragMomentum={false}
            className="fixed top-6 right-6 z-50 flex flex-col items-end cursor-move"
        >
            {/* Grab Handle for Dragging */}
            <div className="absolute -top-3 -right-3 p-1 rounded-full bg-black/50 border border-white/10 text-white/30 hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100 peer-hover:opacity-100">
                <GripHorizontal size={14} />
            </div>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src={`/Music/${currentTrack.file}`}
                onTimeUpdate={handleTimeUpdate}
                onEnded={nextTrack}
                autoPlay={isPlaying}
            />

            {/* Floating Toggle Button (Always visible) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`group flex items-center gap-2 rounded-full border border-lyoko-blue/30 bg-dark-card/90 px-3 py-2 shadow-lg backdrop-blur-md transition-all hover:bg-lyoko-blue/20 hover:border-lyoko-blue/60 ${isOpen ? 'ring-2 ring-lyoko-green/50' : ''}`}
            >
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-lyoko-blue/20 text-carthage-gold">
                    {isPlaying ? (
                        <Music className="h-4 w-4 animate-bounce" />
                    ) : (
                        <Music className="h-4 w-4" />
                    )}
                    {isPlaying && (
                        <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-lyoko-green">
                            <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse"></span>
                        </div>
                    )}
                </div>
                <div className="hidden text-left sm:block pr-2">
                    <div className="text-[10px] uppercase text-white/50">Carthage Music</div>
                    <div className="text-xs font-bold text-lyoko-green w-24 truncate">{currentTrack.title}</div>
                </div>
            </button>

            {/* Dropdown Menu Interface */}
            {isOpen && (
                <div className="mt-2 w-[320px] rounded-2xl border border-lyoko-blue/30 bg-dark-card/95 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 animate-in slide-in-from-top-2 origin-top-right">

                    {/* Header & Mini Controls */}
                    <div className="flex flex-col border-b border-white/10 bg-gradient-to-br from-lyoko-blue/20 to-transparent p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black/50 border border-lyoko-blue/30 relative">
                                <div className={`absolute inset-0 rounded-full border border-lyoko-green/30 ${isPlaying ? 'animate-[ping_3s_ease-out_infinite] opacity-50' : 'opacity-0'}`}></div>
                                <Music className="h-5 w-5 text-lyoko-green" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[10px] text-white/50 uppercase tracking-wider">Carthage Music</span>
                                <span className="text-sm font-bold text-white truncate">{currentTrack.title}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress || 0}
                                onChange={handleSeek}
                                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-lyoko-green outline-none"
                            />
                            <div className="mt-1 flex justify-between font-mono text-[9px] text-white/40">
                                <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                                <span>{formatTime(audioRef.current?.duration || 0)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-2 flex items-center justify-center gap-4">
                            <button onClick={prevTrack} className="text-white/50 hover:text-white transition-colors">
                                <SkipBack className="h-4 w-4" fill="currentColor" />
                            </button>
                            <button onClick={togglePlay} className="flex h-10 w-10 items-center justify-center rounded-full bg-lyoko-green text-black hover:scale-105 transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)]">
                                {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 ml-0.5" fill="currentColor" />}
                            </button>
                            <button onClick={nextTrack} className="text-white/50 hover:text-white transition-colors">
                                <SkipForward className="h-4 w-4" fill="currentColor" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Tracklist */}
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar bg-black/40">
                        {PLAYLIST.map((track, idx) => {
                            const isSelected = idx === currentTrackIndex;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentTrackIndex(idx);
                                        setIsPlaying(true);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-left border-b border-white/5 transition-colors ${isSelected ? 'bg-lyoko-blue/20 text-lyoko-green' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <span className="w-4 text-[10px] font-mono opacity-50 text-right">{idx + 1}</span>
                                    <div className="flex flex-col truncate">
                                        <span className={`text-xs truncate ${isSelected ? 'font-bold' : ''}`}>{track.title}</span>
                                    </div>
                                    {isSelected && isPlaying && <Music className="h-3 w-3 ml-auto animate-pulse" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Volume Footer */}
                    <div className="flex items-center gap-3 border-t border-white/10 p-3 bg-dark-card">
                        <button onClick={toggleMute} className="text-white/50 hover:text-lyoko-green">
                            {isMuted || volume === 0 ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                                setVolume(parseFloat(e.target.value));
                                if (isMuted) setIsMuted(false);
                            }}
                            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-lyoko-blue outline-none"
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
