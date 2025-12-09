import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home,
  Building,
  User,
  Star,
  Navigation
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function AddressManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const [addressForm, setAddressForm] = useState({
    type: "",
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "",
    instructions: "",
    isDefault: false
  });

  // Mock addresses data
  const addresses = [
    {
      id: 1,
      type: "home",
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      addressLine1: "123, Koramangala 5th Block",
      addressLine2: "80 Feet Road",
      landmark: "Near Sony World Signal",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560095",
      instructions: "Leave at the gate",
      isDefault: true
    },
    {
      id: 2,
      type: "work",
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      addressLine1: "456, Brigade Gateway",
      addressLine2: "26th Floor, Tower B",
      landmark: "Rajajinagar Metro Station",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560010",
      instructions: "Hand over to security",
      isDefault: false
    }
  ];

  const addAddressMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Date.now(), ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
      setShowAddForm(false);
      setEditingAddress(null);
      resetForm();
      toast({
        title: "Address saved successfully!",
        description: "Your address has been added to your account",
      });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: number) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
      toast({
        title: "Address deleted",
        description: "Address has been removed from your account",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: number) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
      toast({
        title: "Default address updated",
        description: "This address is now your default delivery location",
      });
    },
  });

  const resetForm = () => {
    setAddressForm({
      type: "",
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "",
      instructions: "",
      isDefault: false
    });
  };

  const handleSaveAddress = () => {
    if (!addressForm.type || !addressForm.name || !addressForm.addressLine1 || !addressForm.pincode) {
      toast({
        title: "Please fill required fields",
        description: "Address type, name, address line and pincode are required",
        variant: "destructive"
      });
      return;
    }

    addAddressMutation.mutate(addressForm);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({ ...address });
    setShowAddForm(true);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case "home": return <Home className="w-5 h-5" />;
      case "work": return <Building className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const getAddressColor = (type: string) => {
    switch (type) {
      case "home": return "text-green-600 bg-green-100";
      case "work": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-60"></div>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="text-[var(--eco-primary)] flex-shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 flex-shrink-0">
                <img 
                  src={logoImage} 
                  alt="Divine Naturals Tree Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[hsl(var(--eco-secondary))] mb-1 truncate">
                  Address Management
                </h1>
                <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                  Manage your delivery locations
                </p>
              </div>
            </div>
            <Button 
              onClick={() => {
                resetForm();
                setEditingAddress(null);
                setShowAddForm(true);
              }}
              className="eco-button flex-shrink-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>
        </div>

        {/* Add/Edit Address Form */}
        {showAddForm && (
          <Card className="border-2 border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-black text-[hsl(var(--eco-secondary))] flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editingAddress ? "Edit Address" : "Add New Address"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">Address Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {["home", "work", "other"].map(type => (
                    <Button
                      key={type}
                      type="button"
                      variant={addressForm.type === type ? "default" : "outline"}
                      onClick={() => setAddressForm(prev => ({ ...prev, type }))}
                      className="capitalize"
                    >
                      {getAddressIcon(type)}
                      <span className="ml-2">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <Input
                    placeholder="Enter full name"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number</label>
                  <Input
                    placeholder="Enter phone number"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Address Details */}
              <div>
                <label className="block text-sm font-semibold mb-2">Address Line 1 *</label>
                <Input
                  placeholder="House/Flat/Building number and name"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine1: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Address Line 2</label>
                <Input
                  placeholder="Street name, Area"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, addressLine2: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Landmark</label>
                <Input
                  placeholder="Nearby landmark (optional)"
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, landmark: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">City</label>
                  <Input
                    value={addressForm.city}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">State</label>
                  <Input
                    value={addressForm.state}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Pincode *</label>
                  <Input
                    placeholder="560001"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, pincode: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Delivery Instructions</label>
                <Textarea
                  placeholder="Any specific instructions for delivery (optional)"
                  value={addressForm.instructions}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button 
                  onClick={handleSaveAddress}
                  disabled={addAddressMutation.isPending}
                  className="eco-button flex-1"
                >
                  {addAddressMutation.isPending ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Addresses */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[hsl(var(--eco-secondary))] flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Saved Addresses ({addresses.length})
          </h2>
          
          {addresses.map((address) => (
            <Card key={address.id} className={`eco-card ${address.isDefault ? 'border-2 border-green-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAddressColor(address.type)}`}>
                      {getAddressIcon(address.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-[hsl(var(--eco-secondary))] capitalize">{address.type}</h3>
                        {address.isDefault && (
                          <Badge className="bg-green-500 text-white text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="font-semibold text-[hsl(var(--eco-secondary))]">{address.name}</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))]">{address.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[hsl(var(--eco-text-muted))] mb-1">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  {address.landmark && (
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-1">
                      Near {address.landmark}
                    </p>
                  )}
                  <p className="text-sm text-[hsl(var(--eco-text-muted))]">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  {address.instructions && (
                    <p className="text-sm text-blue-600 mt-1">
                      📝 {address.instructions}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultMutation.mutate(address.id)}
                      className="flex-1"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteAddressMutation.mutate(address.id)}
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    disabled={address.isDefault}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Integration Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
          <CardContent className="p-6 text-center">
            <Navigation className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-blue-800 mb-2">Pin-drop Location</h3>
            <p className="text-blue-600 text-sm mb-4">
              Use Google Maps to pin your exact location for accurate deliveries
            </p>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Open Map Selector
            </Button>
          </CardContent>
        </Card>

        {/* Delivery Tips */}
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-orange-800 mb-3">💡 Delivery Tips</h3>
            <div className="space-y-2 text-sm text-orange-700">
              <p>• Provide clear landmarks to help our delivery partners find you easily</p>
              <p>• Include specific delivery instructions (gate number, floor, etc.)</p>
              <p>• Keep your phone number updated for delivery coordination</p>
              <p>• Set your most frequently used address as default</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}