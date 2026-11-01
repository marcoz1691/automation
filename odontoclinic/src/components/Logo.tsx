import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      <div className="leading-none">
        <div className="flex items-baseline gap-0">
          <span className="text-2xl font-bold tracking-tight text-primary">ODONT</span>
          <span className="text-lg font-light text-secondary">CLINIC</span>
        </div>
        <p className="text-[10px] text-secondary tracking-wide">Clínica Odontológica</p>
      </div>
      <div className="relative ml-1 hidden sm:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border border-secondary/40" />
          <div className="absolute h-12 w-8 rounded-full border border-secondary/30 rotate-45" />
        </div>
        <svg viewBox="0 0 24 24" className="relative h-10 w-10 text-primary" fill="currentColor">
          <path d="M12 2C9 2 7 4 7 7c0 2 1 3 1 5s-1 3-1 5c0 2 2 4 5 4s5-2 5-4c0-2-1-3-1-5s1-3 1-5c0-3-2-5-5-5zm-2 7c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1zm4 0c.5 0 1 .5 1 1s-.5 1-1 1-1-.5-1-1 .5-1 1-1z" />
        </svg>
      </div>
    </Link>
  );
}
