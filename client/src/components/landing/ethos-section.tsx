import { useQuery } from "@tanstack/react-query";
import { Leaf, Heart, Users, Award, Recycle, Package, MapPin, Calendar, Star, Shield, Truck } from "lucide-react";

const iconMap: Record<string, any> = {
  Leaf, Heart, Users, Award, Recycle, Package, MapPin, Calendar, Star, Shield, Truck
};

const defaultValues = [
  { icon: "Leaf", title: "Farm Fresh", description: "Direct from local farms to your doorstep, ensuring maximum freshness every day." },
  { icon: "Heart", title: "Pure & Natural", description: "No preservatives, no additives. Just pure, natural dairy goodness." },
  { icon: "Users", title: "Supporting Farmers", description: "We work directly with local farmers, ensuring fair prices and sustainable practices." },
  { icon: "Award", title: "Quality Assured", description: "Every product undergoes strict quality checks before reaching you." },
];

export default function EthosSection() {
  const { data: cards = defaultValues } = useQuery({
    queryKey: ["/api/homepage/ethos/public"],
    queryFn: async () => {
      const res = await fetch("/api/homepage/ethos/public");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.length > 0 ? data : defaultValues;
    },
  });

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-green-600 text-sm font-semibold tracking-wider uppercase">Our Values</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Why Choose Divine Naturals?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            We believe in delivering not just products, but a promise of purity, freshness, and care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {cards.map((card: any, index: number) => {
            const IconComponent = iconMap[card.icon] || Leaf;
            return (
              <div
                key={card.id || index}
                className="group p-6 sm:p-8 bg-gray-50 rounded-2xl hover:bg-green-50 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-5 bg-green-100 rounded-2xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
