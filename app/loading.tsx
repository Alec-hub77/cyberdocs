export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse" aria-live="polite" aria-label="Завантаження сторінки">
      <div className="mb-2 h-7 w-48 bg-raised" />
      <div className="mb-8 h-4 w-80 max-w-full bg-surface" />
      <div className="space-y-3">
        <div className="h-28 border border-line bg-surface/60" />
        <div className="h-28 border border-line bg-surface/60" />
        <div className="h-28 border border-line bg-surface/60" />
      </div>
    </div>
  );
}
