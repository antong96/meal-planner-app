import * as React from "react";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={"animate-spin rounded-full border-4 border-gray-300 border-t-primary w-8 h-8 " + (className || "")}></div>
  );
}