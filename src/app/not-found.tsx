import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,34,68,0.08),transparent)]" />

      <div className="relative z-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-xana-red/20 bg-xana-red/5">
          <AlertTriangle className="h-10 w-10 text-xana-red" />
        </div>

        <h1 className="mb-2 font-display text-6xl font-black tracking-wider">
          <span className="bg-gradient-to-r from-xana-red to-carthage-gold bg-clip-text text-transparent">404</span>
        </h1>

        <p className="mb-2 font-display text-xl font-bold text-white/80">Secteur introuvable</p>
        <p className="mb-8 max-w-md text-sm text-white/40">
          XANA a peut-être corrompu cette zone de Lyoko. La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-lyoko-blue to-lyoko-green px-6 py-2.5 text-sm font-semibold text-dark-bg transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_25px_rgba(0,212,255,0.4)]"
          >
            <Home size={16} /> Retour à l&apos;accueil
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-white/15 px-6 py-2.5 text-sm font-medium text-white/70 transition-all hover:border-lyoko-blue/30 hover:text-lyoko-blue"
          >
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
