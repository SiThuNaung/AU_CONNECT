import Link from "next/link";

export default function PostNotFoundPage() {
  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">Post not available</h1>
        <p className="mt-3 text-sm text-neutral-600">
          This post was deleted, so this notification can no longer be opened.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/notifications"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to notifications
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
