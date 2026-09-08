"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="uk">
      <body style={{ background: "#050805", color: "#d7ffe4", fontFamily: "monospace" }}>
        <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center", padding: "0 16px" }}>
          <p style={{ color: "#ff5c5c", marginBottom: 16 }}>
            Критична помилка застосунку. Перевірте налаштування Supabase (env-змінні) і спробуйте оновити сторінку.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "transparent",
              border: "1px solid #33e86b",
              color: "#5cf98c",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            спробувати ще раз
          </button>
        </div>
      </body>
    </html>
  );
}
