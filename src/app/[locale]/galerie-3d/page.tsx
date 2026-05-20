"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTranslation } from "@/lib/translation-context";
import { useSound } from "@/lib/sound-manager";
import {
    Lock, Eye, RotateCw, ChevronDown, Sparkles,
    Sword, Users, Ship, Building2, Star,
} from "lucide-react";

/* ═══ MODÈLES 3D ═══ */
interface Model3D {
    id: string;
    sketchfabId: string;
    name: string;
    description: string;
    category: "personnages" | "monstres" | "vehicules" | "lieux";
    unlockLevel: number;
    color: string;
}

const MODELS: Model3D[] = [
    // ── Personnages ──
    {
        id: "aelita",
        sketchfabId: "32e296e3be7b4751b8519582f3563b4b",
        name: "Aelita",
        description: "La gardienne de Lyoko, fille de Franz Hopper. Maîtrise les champs d'énergie.",
        category: "personnages",
        unlockLevel: 1,
        color: "#ff69b4",
    },
    {
        id: "ulrich",
        sketchfabId: "7a203f32ce4d42ffbee48f39e3864ad4",
        name: "Ulrich Stern",
        description: "Samouraï de Lyoko. Maîtrise la super-vitesse et la triplication.",
        category: "personnages",
        unlockLevel: 2,
        color: "#fbbf24",
    },
    {
        id: "yumi",
        sketchfabId: "810978d77b8c435e9b7fd4a7f3196075",
        name: "Yumi Ishiyama",
        description: "Geisha de Lyoko. Experte en télékinésie et combat à l'éventail.",
        category: "personnages",
        unlockLevel: 3,
        color: "#ff2244",
    },
    {
        id: "odd",
        sketchfabId: "2bb21d8d6947400cb48c6e0d307420f9",
        name: "Odd Della Robbia",
        description: "Le chat de Lyoko. Agile et rapide, tire des flèches laser.",
        category: "personnages",
        unlockLevel: 4,
        color: "#a855f7",
    },
    {
        id: "william",
        sketchfabId: "50954bac5a6c43919d7780be49b77061",
        name: "William Dunbar",
        description: "Ancien prisonnier de XANA. Manie le Zweihänder géant.",
        category: "personnages",
        unlockLevel: 6,
        color: "#1e3a5f",
    },
    {
        id: "jeremy",
        sketchfabId: "f87283f5b8ec4e4f84b8a45ff9403525",
        name: "Jérémie Belpois",
        description: "Le génie informatique. Opère le supercalculateur depuis l'usine.",
        category: "personnages",
        unlockLevel: 8,
        color: "#00d4ff",
    },
    {
        id: "odd_s1",
        sketchfabId: "37abd2469ad645aab1a20803992c4bf2",
        name: "Odd — Saison 1",
        description: "Version originale d'Odd avec son look de chat violet distinctif.",
        category: "personnages",
        unlockLevel: 10,
        color: "#c084fc",
    },
    // ── Monstres ──
    {
        id: "blok",
        sketchfabId: "84607458b0a444da8817c2c47de2d735",
        name: "Blok",
        description: "Monstre cubique de XANA. Tire des rayons laser et des anneaux de feu.",
        category: "monstres",
        unlockLevel: 2,
        color: "#ff6644",
    },
    {
        id: "cockroach",
        sketchfabId: "aedb0e997f3649fe85babbccfeba1ce7",
        name: "Kankrelat",
        description: "Le plus petit monstre de XANA. Rapide et agile mais fragile.",
        category: "monstres",
        unlockLevel: 3,
        color: "#8b5e3c",
    },
    {
        id: "megatank",
        sketchfabId: "0bd3c4269fb8450bbf7401b3e7eafeca",
        name: "Megatank",
        description: "Un monstre sphérique massif qui se déploie pour tirer un laser dévastateur.",
        category: "monstres",
        unlockLevel: 5,
        color: "#ff2244",
    },
    {
        id: "krab",
        sketchfabId: "99f7b9e64b2540988f3790eec59b1e86",
        name: "Krabe",
        description: "Monstre quadrupède agile, capable de grimper sur toutes les surfaces.",
        category: "monstres",
        unlockLevel: 7,
        color: "#f87171",
    },
    {
        id: "creeper",
        sketchfabId: "23840cf8faa74a1b83caebcb2ba78dda",
        name: "Creeper",
        description: "Résident du 5ème territoire (Carthage). Se déplace en rampant.",
        category: "monstres",
        unlockLevel: 10,
        color: "#4ade80",
    },
    {
        id: "tarantula",
        sketchfabId: "91d1b09f0728451bab846e9dc066a8e4",
        name: "Tarentule",
        description: "Un guerrier redoutable de XANA avec des lasers intégrés à ses bras.",
        category: "monstres",
        unlockLevel: 12,
        color: "#fb7185",
    },
    {
        id: "scyphozoa",
        sketchfabId: "368307dc1add438990516f0747096c8b",
        name: "La Méduse",
        description: "La Scyphozoa. Elle draine l'énergie ou vole la mémoire des guerriers de Lyoko.",
        category: "monstres",
        unlockLevel: 15,
        color: "#a78bfa",
    },
    {
        id: "kolossus",
        sketchfabId: "e4958d34ca024322b47f10eada4ca53a",
        name: "Le Kolossus",
        description: "Le monstre ultime de XANA, une créature de lave et d'énergie numérique.",
        category: "monstres",
        unlockLevel: 25,
        color: "#f59e0b",
    },
    {
        id: "kalamar",
        sketchfabId: "f30a364812774e7ba9c518631aba3a1f",
        name: "Kalamar",
        description: "Prévu pour percer la coque du Skidbladnir dans la Mer Numérique.",
        category: "monstres",
        unlockLevel: 18,
        color: "#38bdf8",
    },
    {
        id: "manta",
        sketchfabId: "080040b1b7fc4152853f20ed162d13cb",
        name: "Manta Noire",
        description: "Monstre volant majestueux mais mortel, vivant dans le 5ème territoire.",
        category: "monstres",
        unlockLevel: 14,
        color: "#334155",
    },

    // ── Véhicules ──
    {
        id: "overboard",
        sketchfabId: "7758ed7bb793439bbfed5ed81c5adc72",
        name: "Overboard",
        description: "Véhicule volant d'Odd. Un skateboard aérien ultra-rapide.",
        category: "vehicules",
        unlockLevel: 5,
        color: "#a855f7",
    },
    {
        id: "odd_overboard",
        sketchfabId: "4ea5cd5f5b5b4f9ca0d62b7d7ff6b33f",
        name: "Odd sur l'Overboard",
        description: "Odd chevauchant son Overboard personnalisé dans Lyoko.",
        category: "vehicules",
        unlockLevel: 7,
        color: "#c084fc",
    },
    {
        id: "navskid",
        sketchfabId: "2624c02d9944415cbfe227af4234dfd0",
        name: "Nav-Skid",
        description: "Module de navigation individuel pour explorer la Mer Numérique.",
        category: "vehicules",
        unlockLevel: 9,
        color: "#00d4ff",
    },
    {
        id: "skidbladnir",
        sketchfabId: "f582ad13496447d9aba2e58030977048",
        name: "Skidbladnir",
        description: "Le sous-marin numérique conçu par Jérémie pour la Mer Numérique.",
        category: "vehicules",
        unlockLevel: 12,
        color: "#00ff88",
    },
    // ── Lieux & Objets ──
    {
        id: "tower",
        sketchfabId: "45d5311611d44ac4a3c3d106f16640ca",
        name: "Tour de Lyoko",
        description: "Les tours que XANA active pour lancer ses attaques. Aelita les désactive.",
        category: "lieux",
        unlockLevel: 1,
        color: "#00d4ff",
    },
    {
        id: "sword",
        sketchfabId: "d334bac516d9471389c11b30394d3c26",
        name: "Épée de William",
        description: "Le Zweihänder géant que manie William dans le monde virtuel.",
        category: "lieux",
        unlockLevel: 6,
        color: "#4a5568",
    },
    {
        id: "fabric",
        sketchfabId: "4b9b4b81455c42ec8dfdd6a96a19a7f1",
        name: "L'Usine",
        description: "L'ancienne usine Renault où se cache le supercalculateur de Franz Hopper.",
        category: "lieux",
        unlockLevel: 15,
        color: "#78716c",
    },
    {
        id: "sector5",
        sketchfabId: "4505a5ebd1bc45c6bd24f0aefc396cc6",
        name: "Secteur 5 (Carthage)",
        description: "Le centre de Lyoko, sanctuaire du Supercalculateur et refuge de XANA.",
        category: "lieux",
        unlockLevel: 20,
        color: "#3b82f6",
    },
    {
        id: "supercomputer",
        sketchfabId: "674360e54d3d46328325e838e12d4d3c",
        name: "Supercalculateur",
        description: "La machine quantique surpuissante qui héberge le monde virtuel de Lyoko.",
        category: "lieux",
        unlockLevel: 22,
        color: "#00d4ff",
    },

];

const CATEGORY_CONFIG = {
    personnages: { labelKey: "gallery.filters.warriors", icon: Users, color: "#00d4ff" },
    monstres: { labelKey: "gallery.filters.monsters", icon: Sword, color: "#ff2244" },
    vehicules: { labelKey: "gallery.filters.vehicles", icon: Ship, color: "#00ff88" },
    lieux: { labelKey: "gallery.filters.places", icon: Building2, color: "#fbbf24" },
};

/* ═══ PAGE ═══ */
export default function Galerie3DPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { play } = useSound();
    const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const userLevel = user?.level ?? 0;
    const totalUnlocked = MODELS.filter((m) => userLevel >= m.unlockLevel).length;

    const categories = ["personnages", "monstres", "vehicules", "lieux"] as const;

    const handleSelect = (model: Model3D) => {
        if (userLevel < model.unlockLevel) {
            play("error");
            return;
        }
        play("click");
        setSelectedModel(model);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Header */}
            <div className="relative overflow-hidden border-b border-lyoko-blue/10 bg-gradient-to-br from-dark-surface via-dark-bg to-dark-surface py-12">
                {/* Animated grid background */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center lg:px-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lyoko-blue/20 bg-lyoko-blue/8 px-4 py-1.5">
                        <RotateCw size={14} className="text-lyoko-blue" />
                        <span className="font-display text-xs font-bold tracking-wider text-lyoko-blue">
                            {t("gallery.interactive_models")}
                        </span>
                    </div>

                    <h1 className="font-display text-[clamp(1.5rem,4vw,3rem)] font-black uppercase tracking-wider text-white" dangerouslySetInnerHTML={{ __html: t("gallery.title").replace('3D', '<span class="text-lyoko-blue">3D</span>') }}>
                    </h1>
                    <p className="mx-auto mt-2 max-w-lg text-sm text-white/50">
                        {t("gallery.description")}
                    </p>

                    {/* Stats */}
                    <div className="mt-6 flex justify-center gap-6">
                        <div className="text-center">
                            <p className="font-display text-2xl font-black text-lyoko-blue">{totalUnlocked}</p>
                            <p className="text-[0.65rem] text-white/40">{t("gallery.stats.unlocked")}</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="font-display text-2xl font-black text-white/60">{MODELS.length}</p>
                            <p className="text-[0.65rem] text-white/40">{t("gallery.stats.total")}</p>
                        </div>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="text-center">
                            <p className="font-display text-2xl font-black text-carthage-gold">
                                <Star size={20} className="inline mb-0.5" /> {userLevel}
                            </p>
                            <p className="text-[0.65rem] text-white/40">{t("gallery.stats.your_level")}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                {/* ═══ 3D VIEWER (selected model) ═══ */}
                {selectedModel && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-lyoko-blue/20 bg-dark-surface shadow-[0_0_40px_rgba(0,212,255,0.1)]">
                        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ background: selectedModel.color, boxShadow: `0 0 8px ${selectedModel.color}60` }}
                                />
                                <h2 className="font-display text-sm font-bold text-white">{selectedModel.name}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedModel(null)}
                                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/50 hover:bg-white/5"
                            >
                                {t("gallery.close")}
                            </button>
                        </div>
                        <div className="relative" style={{ paddingBottom: "50%" }}>
                            <iframe
                                title={selectedModel.name}
                                src={`https://sketchfab.com/models/${selectedModel.sketchfabId}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0`}
                                className="absolute inset-0 h-full w-full border-0"
                                allow="autoplay; fullscreen; xr-spatial-tracking"
                                allowFullScreen
                            />
                        </div>
                        <div className="border-t border-white/5 px-5 py-3">
                            <p className="text-sm text-white/60">{selectedModel.description}</p>
                        </div>
                    </div>
                )}

                {/* ═══ CATEGORY FILTERS ═══ */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${!activeCategory
                            ? "border-lyoko-blue/40 bg-lyoko-blue/15 text-lyoko-blue"
                            : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                            }`}
                    >
                        <Sparkles size={13} /> {t("gallery.filters.all")} ({MODELS.length})
                    </button>
                    {categories.map((cat) => {
                        const cfg = CATEGORY_CONFIG[cat];
                        const Icon = cfg.icon;
                        const count = MODELS.filter((m) => m.category === cat).length;
                        const active = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(active ? null : cat)}
                                className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${active
                                    ? "border-white/20 bg-white/[0.06] text-white"
                                    : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                                    }`}
                            >
                                <Icon size={13} style={{ color: cfg.color }} /> {t(cfg.labelKey)} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* ═══ MODELS GRID ═══ */}
                {categories
                    .filter((cat) => !activeCategory || activeCategory === cat)
                    .map((cat) => {
                        const cfg = CATEGORY_CONFIG[cat];
                        const Icon = cfg.icon;
                        const items = MODELS.filter((m) => m.category === cat);
                        if (items.length === 0) return null;

                        return (
                            <div key={cat} className="mb-8">
                                <div className="mb-4 flex items-center gap-2">
                                    <Icon size={16} style={{ color: cfg.color }} />
                                    <h3 className="font-display text-sm font-bold text-white">
                                        {t(cfg.labelKey)}
                                    </h3>
                                    <div className="ml-auto h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {items.map((model) => {
                                        const isUnlocked = userLevel >= model.unlockLevel;
                                        const isSelected = selectedModel?.id === model.id;

                                        return (
                                            <button
                                                key={model.id}
                                                onClick={() => handleSelect(model)}
                                                className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${isSelected
                                                    ? "border-lyoko-blue/40 bg-lyoko-blue/[0.08] shadow-[0_0_25px_rgba(0,212,255,0.15)]"
                                                    : isUnlocked
                                                        ? "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                                                        : "cursor-not-allowed border-white/[0.04] bg-white/[0.01] opacity-50"
                                                    }`}
                                            >
                                                {/* Thumbnail via Sketchfab */}
                                                <div className="relative h-40 overflow-hidden bg-dark-bg">
                                                    {isUnlocked ? (
                                                        <img
                                                            src={`https://media.sketchfab.com/models/${model.sketchfabId}/thumbnails/a0f3ca23ff8e47ee90c58cb64d7e2db4/820236086b164c6db7aa8bbcf8136e8a.jpeg`}
                                                            alt={model.name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            onError={(e) => {
                                                                // Fallback: show a colored gradient
                                                                (e.target as HTMLImageElement).style.display = "none";
                                                            }}
                                                        />
                                                    ) : null}

                                                    {/* Locked overlay */}
                                                    {!isUnlocked && (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/80">
                                                            <Lock size={24} className="mb-2 text-white/20" />
                                                            <span className="text-xs font-bold text-white/30">
                                                                {t("gallery.level_required").replace('%{level}', model.unlockLevel.toString())}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Glow accent */}
                                                    {isUnlocked && (
                                                        <div
                                                            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                                                            style={{
                                                                background: `linear-gradient(transparent, ${model.color}10)`,
                                                            }}
                                                        />
                                                    )}

                                                    {/* View badge */}
                                                    {isUnlocked && (
                                                        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-[0.6rem] font-bold text-white/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                                            <Eye size={10} /> {t("gallery.view_3d")}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="p-4">
                                                    <div className="mb-1 flex items-center gap-2">
                                                        <div
                                                            className="h-2 w-2 rounded-full"
                                                            style={{ background: isUnlocked ? model.color : "rgba(255,255,255,0.1)" }}
                                                        />
                                                        <h4 className="font-display text-sm font-bold text-white">
                                                            {model.name}
                                                        </h4>
                                                    </div>
                                                    <p className="text-[0.7rem] leading-relaxed text-white/40">
                                                        {isUnlocked ? model.description : t("gallery.model_locked")}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
