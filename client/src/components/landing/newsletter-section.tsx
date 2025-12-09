import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultSettings = {
  title: "Stay Updated",
  subtitle: "Subscribe to our newsletter for exclusive offers, new product updates, and healthy recipes.",
  ctaText: "Subscribe",
  placeholderText: "Enter your email",
  isActive: true,
};

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: settings = defaultSettings } = useQuery({
    queryKey: ["/api/homepage/newsletter/public"],
    queryFn: async () => {
      const res = await fetch("/api/homepage/newsletter/public");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter",
    });
    
    setEmail("");
    setIsSubmitting(false);
  };

  if (!settings?.isActive) return null;

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-600 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
            <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
            {settings.title || defaultSettings.title}
          </h2>
          <p className="text-green-100 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
            {settings.subtitle || defaultSettings.subtitle}
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={settings.placeholderText || defaultSettings.placeholderText}
              className="flex-1 px-5 py-3 rounded-full text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-full font-semibold text-sm sm:text-base"
            >
              {isSubmitting ? "..." : settings.ctaText || defaultSettings.ctaText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
