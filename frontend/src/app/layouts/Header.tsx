export function Header() {
  return (
    <header className="box-border flex h-[60px] items-center pl-5 bg-[linear-gradient(270deg,_#F6F0C6_0%,_#D9135D_0.01%,_rgba(214,19,92,0.996895)_0.02%,_#F6F0C6_0.03%,_#A6D9C8_80.73%,_#A5D9C8_100%)]">
      <svg
        className="mr-[18px] h-[29px] w-7 shrink-0 text-white opacity-100"
        viewBox="0 0 28 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M14 1V28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M1 14.5H27" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="[font-family:Nunito,sans-serif] text-[40px] leading-[100%] tracking-[0%] font-bold capitalize text-white">
        Lottery Simulator
      </span>
    </header>
  );
}
