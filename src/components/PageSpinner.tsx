/**
 * Instant-loading fallback shown by each route's loading.tsx while its
 * Server Component data resolves, so navigation (via <Link> or router.push)
 * feels immediate instead of leaving the screen blank until data is ready.
 */
export function PageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
    </div>
  );
}
