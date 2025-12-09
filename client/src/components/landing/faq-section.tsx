import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";

const defaultFaqs = [
  { question: "What is the delivery schedule?", answer: "We deliver fresh milk and dairy products daily between 6 AM to 9 AM. You can also choose your preferred delivery slot while placing an order or setting up a subscription." },
  { question: "How fresh are your products?", answer: "All our products are sourced directly from local farms and delivered within 24 hours of production. We guarantee 100% freshness with every delivery." },
  { question: "What areas do you serve?", answer: "We currently serve major areas in Mumbai including Bandra, Juhu, Andheri, Borivali, and surrounding localities. We're expanding to more areas soon!" },
  { question: "How does the subscription work?", answer: "You can set up a daily, alternate day, or weekly subscription for milk and other dairy products. You can pause, modify, or cancel your subscription anytime from your account." },
  { question: "What payment methods do you accept?", answer: "We accept all major payment methods including UPI, credit/debit cards, net banking, and cash on delivery. Monthly billing is also available for subscription customers." },
  { question: "How can I contact customer support?", answer: "You can reach our customer support at 1800-DIVINE (toll-free) or email us at support@divinenaturals.in. We're available from 7 AM to 10 PM every day." },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { data: faqs = defaultFaqs } = useQuery({
    queryKey: ["/api/homepage/faqs/public"],
    queryFn: async () => {
      const res = await fetch("/api/homepage/faqs/public");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return data.length > 0 ? data : defaultFaqs;
    },
  });

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-green-600 text-sm font-semibold tracking-wider uppercase">FAQ</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Find answers to common questions about our products and services.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq: any, index: number) => (
            <div
              key={faq.id || index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-48" : "max-h-0"
                }`}
              >
                <p className="p-4 sm:p-5 pt-0 text-gray-600 text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
