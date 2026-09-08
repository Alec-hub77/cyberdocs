import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="mb-3 text-term-500">$ cat requested_page</p>
      <p className="mb-6 text-sm text-rose">cat: сторінку не знайдено (404)</p>
      <Link href="/" className="border border-line px-4 py-2 text-sm text-ink hover:border-term-600">
        cd ~
      </Link>
    </div>
  );
}
