import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative bg-gradient-to-r from-green-50 via-white to-green-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-4">
              Fresh From Farm
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              The Path of{" "}
              <span className="text-green-600">Pure & Natural</span>{" "}
              Dairy
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Experience the goodness of farm-fresh milk and dairy products delivered straight to your doorstep. Pure, natural, and always fresh.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={() => setLocation("/shop")}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-full"
              >
                Shop Now
              </Button>
              <Button
                onClick={() => setLocation("/subscription")}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-6 text-lg rounded-full"
              >
                Start Subscription
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">2500+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">100%</p>
                <p className="text-sm text-gray-600">Fresh Products</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">Daily</p>
                <p className="text-sm text-gray-600">Delivery</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              <img
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600"
                alt="Fresh Dairy Products"
                className="w-full h-64 md:h-80 object-cover rounded-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                25% OFF
              </div>
            </div>
            <div className="absolute -z-10 top-8 left-8 w-full h-full bg-green-100 rounded-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
