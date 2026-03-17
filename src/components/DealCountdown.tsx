import { useState, useEffect } from "react";

export const DealCountdown = () => {
  const [time, setTime] = useState({ days: 8, hours: 23, minutes: 29, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) return prev;
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const blocks = [
    { label: "Days", value: time.days },
    { label: "Hrs", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {blocks.map((b, i) => (
        <div key={b.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center bg-foreground rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 min-w-[40px] sm:min-w-[48px]">
            <span className="font-mono tabular-nums text-base sm:text-lg font-bold text-background leading-none">
              {String(b.value).padStart(2, "0")}
            </span>
            <p className="text-[8px] sm:text-[9px] uppercase tracking-wider font-mono text-background/50 mt-0.5">{b.label}</p>
          </div>
          {i < blocks.length - 1 && <span className="text-muted-foreground/30 font-mono text-lg">:</span>}
        </div>
      ))}
    </div>
  );
};
