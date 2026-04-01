import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="w-full min-w-[352px] max-w-[792px] rounded-[24px] bg-white p-6 opacity-100 shadow-[var(--shadow-card)] flex flex-col gap-8 md:p-12">
      <h2 className="text-[32px] leading-[100%] capitalize md:text-[40px]">
        Result
      </h2>
      {children}
    </div>
  );
}