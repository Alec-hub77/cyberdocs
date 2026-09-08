"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import ConfirmDeleteButton from "@/components/ui/ConfirmDeleteButton";
import { useAdminToken } from "@/components/forms/AdminTokenField";
import { apiRequest } from "@/lib/api-client";

export default function ArticleActions({ slug }: { slug: string }) {
  const router = useRouter();
  const [token] = useAdminToken();

  async function handleDelete() {
    try {
      await apiRequest(`/api/articles/${slug}`, { method: "DELETE", token });
      router.push("/articles");
      router.refresh();
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <span className="flex items-center gap-1.5">
      <Link
        href={`/articles/${slug}/edit`}
        className="flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-term-600 hover:text-term-400"
      >
        <Pencil size={13} /> редагувати
      </Link>
      <ConfirmDeleteButton onConfirm={handleDelete} label="Видалити статтю" />
    </span>
  );
}
