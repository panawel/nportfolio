import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-16 text-center">
      <p className="font-mono text-sm text-muted-foreground">&gt; running find_page.py...</p>
      <h1 className="mt-4 -rotate-1 text-6xl font-medium tracking-tight text-foreground sm:text-7xl">404</h1>
      <p className="mt-3 font-mono text-sm text-destructive">[FAILED] page not found</p>
      <p className="mt-4 max-w-sm text-muted-foreground">
        This route doesn&apos;t exist — logged as a defect, closing it by sending you home.
      </p>
      <Link
        href="/"
        className="shadow-hard mt-8 rotate-1 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-transform duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-hard-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        Back to Home
      </Link>
    </main>
  );
}
