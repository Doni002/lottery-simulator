interface ResultCardProps {
  matchCount: number;
  value: number;
}

export function ResultCard({ matchCount, value }: ResultCardProps) {
  return (
    <div className="bg-white w-full md:w-[127px] h-[72px] flex flex-col items-center justify-center gap-2">
      <span className="text-center text-[12px] font-bold leading-[100%] text-[#060658]">
        {matchCount} matches
      </span>
      <span className="text-[16px] font-bold leading-[100%] text-[#060658]">
        {value.toLocaleString('pt-BR')}
      </span>
    </div>
  );
}
