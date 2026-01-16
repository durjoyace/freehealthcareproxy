import { AlertTriangle } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-50 border-t border-amber-200 px-4 py-2 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-xs text-amber-800">
        <AlertTriangle className="h-3 w-3 flex-shrink-0" />
        <span>Administrative help only — not medical or legal advice.</span>
      </div>
    </div>
  );
}
