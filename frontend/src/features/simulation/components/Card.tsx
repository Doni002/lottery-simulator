import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div className="w-full min-w-[352px] max-w-[792px] min-h-[632px] rounded-[24px] bg-white p-6 md:p-16 opacity-100 shadow-[2px_2px_10px_0px_#0000001A] flex flex-col gap-8">
      <h2 className="text-[32px] leading-[100%] font-bold capitalize md:text-[40px]">
        Result
      </h2>
      {children}
    </div>
  );
}