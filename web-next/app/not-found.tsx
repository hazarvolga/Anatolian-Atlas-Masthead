import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-semibold mb-3">Page not found</h1>
        <p className="text-text-secondary mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
