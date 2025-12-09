import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, MapPin, Search, Navigation } from "lucide-react";

export default function AddressSetup() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("Try Sector 75 etc");
  const [flat, setFlat] = useState("");
  const [locality, setLocality] = useState("");
  const [name, setName] = useState("");
  const [pinPosition, setPinPosition] = useState({ x: 50, y: 50 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleSaveAddress = () => {
    if (flat && locality && name) {
      // Save to local storage or state management
      localStorage.setItem("userAddress", JSON.stringify({
        flat,
        locality,
        name,
        location: "Mumbai"
      }));
      
      // Navigate to customer home
      setLocation("/home");
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Map Background */}
      <div className="h-1/2 bg-gray-100 relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#52B574]"></div>
          </div>
        )}
        
        {/* Simulated Google Maps Style */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          {/* Map grid lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Main Roads */}
            <path d="M0 150 L400 150" stroke="#d1d5db" strokeWidth="4"/>
            <path d="M200 0 L200 300" stroke="#d1d5db" strokeWidth="4"/>
            <path d="M100 0 L100 300" stroke="#e5e7eb" strokeWidth="3"/>
            <path d="M300 0 L300 300" stroke="#e5e7eb" strokeWidth="3"/>
            <path d="M0 100 L400 100" stroke="#e5e7eb" strokeWidth="2"/>
            <path d="M0 200 L400 200" stroke="#e5e7eb" strokeWidth="2"/>
            
            {/* Street Labels */}
            <text x="30" y="140" className="text-xs fill-gray-600" fontSize="9">VM Bhargav Rd</text>
            <text x="230" y="140" className="text-xs fill-gray-600" fontSize="9">Rd No. 3</text>
            <text x="105" y="20" className="text-xs fill-gray-600" fontSize="9">Dattatray Rd</text>
            <text x="305" y="20" className="text-xs fill-gray-600" fontSize="9">Station Rd</text>
            
            {/* Buildings and Landmarks */}
            <rect x="80" y="60" width="80" height="30" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1"/>
            <rect x="220" y="170" width="60" height="40" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1"/>
            <rect x="50" y="180" width="40" height="25" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1"/>
            <rect x="280" y="80" width="50" height="35" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1"/>
            
            {/* Parks/Green Areas */}
            <circle cx="150" cy="250" r="20" fill="#dcfce7" stroke="#22c55e" strokeWidth="1"/>
            <circle cx="350" cy="50" r="15" fill="#dcfce7" stroke="#22c55e" strokeWidth="1"/>
            
            {/* Business Markers */}
            <circle cx="120" cy="75" r="4" fill="#ef4444"/>
            <text x="130" y="80" className="text-xs fill-gray-700" fontSize="8">Reliance SMART</text>
            
            <circle cx="250" cy="190" r="4" fill="#3b82f6"/>
            <text x="260" y="195" className="text-xs fill-gray-700" fontSize="8">Dr. Jayde</text>
            
            <circle cx="310" cy="95" r="4" fill="#f59e0b"/>
            <text x="320" y="100" className="text-xs fill-gray-700" fontSize="8">Superstore</text>
          </svg>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/auth/otp")}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white shadow-md p-2 z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </Button>

        {/* Search Bar */}
        <div className="absolute top-4 left-16 right-4 z-10">
          <div className="flex items-center bg-white rounded-lg shadow-md px-4 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 p-0 text-gray-600 focus:ring-0 placeholder:text-gray-400"
              placeholder="Try Sector 75 etc"
            />
          </div>
        </div>

        {/* Delivery notification */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-[#52B574] text-white px-4 py-2 rounded-lg shadow-lg z-10">
          <p className="text-sm font-medium">Your order will be delivered here</p>
          <p className="text-xs opacity-90">Move pin to your exact location</p>
        </div>

        {/* Map pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10">
          <div className="w-8 h-8 bg-[#52B574] rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Location and Map buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-full shadow-md flex items-center">
            <Navigation className="w-4 h-4 mr-2" />
            Current Location
          </Button>
          <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-full shadow-md">
            MAP VIEW
          </Button>
        </div>
      </div>

      {/* Address Form */}
      <div className="h-1/2 px-6 py-6">
        {/* Location */}
        <div className="flex items-start mb-6">
          <MapPin className="w-5 h-5 text-[#52B574] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-gray-800">Mumbai</h2>
            <p className="text-sm text-gray-600">3RPQ+6Q6 Railway Colony Santacruz (West) Mumbai</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <Input
            placeholder="Flat, House No, Apartment"
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
            className="w-full h-12 border border-gray-300 rounded-lg px-4 placeholder:text-gray-500"
          />
          
          <Input
            placeholder="Locality/Area/Landmark"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="w-full h-12 border border-gray-300 rounded-lg px-4 placeholder:text-gray-500"
          />
          
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 border border-gray-300 rounded-lg px-4 placeholder:text-gray-500"
          />
        </div>

        <p className="text-xs text-gray-500 mb-6">
          This will be your address for all morning and instant deliveries
        </p>

        {/* Save Button */}
        <Button
          onClick={handleSaveAddress}
          disabled={!flat || !locality || !name}
          className="w-full h-14 bg-[#52B574] hover:bg-[#459963] text-white text-lg font-semibold rounded-xl disabled:opacity-50"
        >
          SAVE ADDRESS
        </Button>
      </div>
    </div>
  );
}