import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

const defaultStats = [
  { value: 2500, suffix: "+", label: "Happy Customers" },
  { value: 100, suffix: "+", label: "Products" },
  { value: 50, suffix: "+", label: "Delivery Areas" },
  { value: 365, suffix: "", label: "Days Fresh Supply" },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 2000;
          const increment = value / (duration / 16);
          
          const animate = () => {
            start += increment;
            if (start < value) {
              setCount(Math.floor(start));
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function StatsSection() {
  const { data: stats = defaultStats } = useQuery({
    queryKey: ["/api/homepage/stats/public"],
    queryFn: async () => {
      const res = await fetch("/api/homepage/stats/public");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.length > 0 ? data : defaultStats;
    },
  });

  return (
    <section className="py-16 sm:py-20 bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((stat: any, index: number) => (
            <div key={stat.id || index} className="text-center">
              <AnimatedNumber value={stat.value} suffix={stat.suffix || ""} />
              <p className="text-green-100 text-sm sm:text-base mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
