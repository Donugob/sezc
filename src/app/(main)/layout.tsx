import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEZC 2026 — Redefining Legal Practice | Owerri',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      {children}
    </div>
  );
}
