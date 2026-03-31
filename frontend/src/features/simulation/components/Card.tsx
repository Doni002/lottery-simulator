import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return (
    <div>
      <div>Card</div>
      {children}
    </div>
  );
}