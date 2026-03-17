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
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="flex items-center gap-3">
      {blocks.map((b, i) => (
        <div key={b.label} className="flex items-center gap-3">
          <div className="text-center">
            <span className="font-mono tabular-nums text-lg font-bold text-foreground">
              {String(b.value).padStart(2, "0")}
            </span>
            <p className="spec-label mt-0.5">{b.label}</p>
          </div>
          {i < blocks.length - 1 && <span className="text-muted-foreground/40 font-mono">:</span>}
        </div>
      ))}
    </div>
  );
};
