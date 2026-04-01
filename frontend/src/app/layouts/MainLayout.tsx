import { type ReactNode } from 'react';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-page-bg)]">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
