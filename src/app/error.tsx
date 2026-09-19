"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-16 text-center">
      <p className="font-mono text-sm text-destructive">[FAILED] unhandled_exception</p>
      <h1 className="mt-4 -rotate-1 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">Something broke</h1>
      <p className="mt-4 max-w-sm text-muted-foreground">
        An unexpected error occurred while rendering this page. Try again, or head back home.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="shadow-hard rotate-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-transform duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-hard-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="-rotate-1 rounded-full border-2 border-foreground px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:rotate-0 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
