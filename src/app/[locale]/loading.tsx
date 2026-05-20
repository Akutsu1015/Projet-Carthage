import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-lyoko-blue" />
        <p className="text-sm text-white/40">Chargement...</p>
      </div>
    </div>
  );
}
