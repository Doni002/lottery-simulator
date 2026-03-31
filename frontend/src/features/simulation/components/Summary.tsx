export function Summary() {
  return (
    <div className="h-[103px] w-full max-w-[325px] min-w-[288px] rounded-[10px] bg-[#A5D9C8] p-4 opacity-100 flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between text-[16px] text-white">
        <span>Number of tickets:</span>
        <span>1 234 567</span>
      </div>

      <div className="flex items-center justify-between text-[14px] text-white">
        <span>Years spent:</span>
        <span>158</span>
      </div>

      <div className="flex items-center justify-between text-[14px] text-white">
        <span>Cost of tickets:</span>
        <span>370 370 100,00 Ft</span>
      </div>
    </div>
  );
}
