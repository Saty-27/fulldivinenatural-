import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  Headphones, 
  MessageCircle, 
  Phone, 
  Mail,
  Search,
  HelpCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import CustomerLayout from "@/components/layout/customer-layout";
import { useToast } from "@/hooks/use-toast";
import logoImage from "@assets/WhatsApp Image 2025-08-07 at 16.06.46_1755865958874.jpg";

export default function CustomerSupport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("help");
  const [searchQuery, setSearchQuery] = useState("");
  const [newTicket, setNewTicket] = useState({
    category: "",
    subject: "",
    description: "",
    orderId: ""
  });

  // Mock data
  const faqs = [
    {
      id: 1,
      category: "delivery",
      question: "What are your delivery timings?",
      answer: "We deliver fresh milk twice daily - morning (6 AM - 8 AM) and evening (6 PM - 8 PM). You can choose your preferred time slot during subscription setup."
    },
    {
      id: 2,
      category: "milk",
      question: "Is your milk organic and chemical-free?",
      answer: "Yes! Our milk comes directly from certified organic farms. We maintain strict quality standards and our cattle are grass-fed without any harmful chemicals or antibiotics."
    },
    {
      id: 3,
      category: "subscription",
      question: "Can I pause my milk subscription temporarily?",
      answer: "Absolutely! You can pause your subscription anytime from the app. Just go to Subscription Management and click 'Pause'. You can resume it whenever you want."
    },
    {
      id: 4,
      category: "payment",
      question: "What payment methods do you accept?",
      answer: "We accept UPI, Credit/Debit cards, Net banking, Wallet payments, and Cash on Delivery. Auto-pay is available for subscriptions."
    },
    {
      id: 5,
      category: "delivery",
      question: "What if I'm not home during delivery?",
      answer: "You can add delivery instructions in your address settings. Our delivery partners can leave milk at your gate, with security, or any safe location you specify."
    },
    {
      id: 6,
      category: "quality",
      question: "What if I receive spoiled or damaged products?",
      answer: "We guarantee fresh products! If you receive any damaged items, contact us immediately via chat or phone. We'll replace it for free and investigate the issue."
    }
  ];

  const tickets = [
    {
      id: "TKT-001",
      subject: "Milk not delivered today",
      category: "Delivery Issue",
      status: "open",
      createdAt: "2025-08-23",
      lastUpdate: "2025-08-23"
    },
    {
      id: "TKT-002", 
      subject: "Wrong product delivered",
      category: "Product Issue",
      status: "resolved",
      createdAt: "2025-08-21",
      lastUpdate: "2025-08-22"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createTicketMutation = useMutation({
    mutationFn: async (data: any) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: `TKT-${Date.now()}`, ...data, status: "open", createdAt: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      setNewTicket({ category: "", subject: "", description: "", orderId: "" });
      toast({
        title: "Ticket created successfully!",
        description: "Our support team will contact you within 24 hours",
      });
    },
  });

  const handleCreateTicket = () => {
    if (!newTicket.category || !newTicket.subject || !newTicket.description) {
      toast({
        title: "Please fill all required fields",
        description: "Category, subject and description are required",
        variant: "destructive"
      });
      return;
    }

    createTicketMutation.mutate(newTicket);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500";
      case "in-progress": return "bg-yellow-500";
      case "resolved": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="w-4 h-4" />;
      case "in-progress": return <AlertCircle className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <CustomerLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-60"></div>
          <div className="relative flex items-center space-x-4">
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
                Support & Help
              </h1>
              <p className="text-base text-[hsl(var(--eco-text-muted))] font-semibold">
                We're here to help you 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-green-800 mb-1">Live Chat</h3>
              <p className="text-sm text-green-600 mb-3">Get instant help</p>
              <Button className="bg-green-600 text-white hover:bg-green-700 w-full">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-blue-800 mb-1">Call Us</h3>
              <p className="text-sm text-blue-600 mb-3">+91 80123 45678</p>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="eco-card cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-purple-800 mb-1">WhatsApp</h3>
              <p className="text-sm text-purple-600 mb-3">Quick support</p>
              <Button className="bg-purple-600 text-white hover:bg-purple-700 w-full">
                Message
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="help" className="rounded-lg font-semibold">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tickets" className="rounded-lg font-semibold">
              <FileText className="w-4 h-4 mr-2" />
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="contact" className="rounded-lg font-semibold">
              <Headphones className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="help" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--eco-text-muted)] w-4 h-4" />
              <Input
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl"
              />
            </div>

            {/* FAQ Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {["all", "delivery", "milk", "payment", "subscription"].map(category => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="capitalize"
                >
                  {category === "all" ? "All Topics" : category}
                </Button>
              ))}
            </div>

            {/* FAQ Accordion */}
            <Card className="eco-card">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[hsl(var(--eco-text-muted))]">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            {/* Create New Ticket */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-black text-[hsl(var(--eco-secondary))] flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Raise a Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category *</label>
                    <select 
                      className="w-full p-3 border border-gray-200 rounded-lg"
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">Select category</option>
                      <option value="delivery">Delivery Issue</option>
                      <option value="product">Product Quality</option>
                      <option value="payment">Payment Problem</option>
                      <option value="subscription">Subscription Help</option>
                      <option value="refund">Refund Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Order ID (Optional)</label>
                    <Input
                      placeholder="Enter order ID if related"
                      value={newTicket.orderId}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, orderId: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Subject *</label>
                  <Input
                    placeholder="Brief description of your issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <Textarea
                    placeholder="Please provide detailed information about your issue"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleCreateTicket}
                  disabled={createTicketMutation.isPending}
                  className="eco-button w-full"
                >
                  {createTicketMutation.isPending ? "Creating Ticket..." : "Submit Ticket"}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Tickets */}
            <Card className="eco-card">
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tickets.length > 0 ? tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[hsl(var(--eco-secondary))]">{ticket.id}</span>
                        <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(ticket.status)}
                            <span className="capitalize">{ticket.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <span className="text-xs text-[hsl(var(--eco-text-muted))]">
                        {ticket.createdAt}
                      </span>
                    </div>
                    <h4 className="font-semibold text-[hsl(var(--eco-secondary))] mb-1">{ticket.subject}</h4>
                    <p className="text-sm text-[hsl(var(--eco-text-muted))] mb-2">{ticket.category}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[hsl(var(--eco-text-muted))]">
                        Last updated: {ticket.lastUpdate}
                      </span>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-[hsl(var(--eco-text-muted))] mx-auto mb-3" />
                    <p className="text-[hsl(var(--eco-text-muted))]">No support tickets yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Contact Info */}
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Phone Support</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))]">+91 80123 45678</p>
                      <p className="text-xs text-[hsl(var(--eco-text-muted))]">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">Email Support</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))]">support@divinenaturals.com</p>
                      <p className="text-xs text-[hsl(var(--eco-text-muted))]">Response within 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold">WhatsApp</p>
                      <p className="text-sm text-[hsl(var(--eco-text-muted))]">+91 80123 45678</p>
                      <p className="text-xs text-[hsl(var(--eco-text-muted))]">Quick responses</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="eco-card">
                <CardHeader>
                  <CardTitle>Support Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Live Chat</span>
                    <span className="font-semibold text-green-600">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone Support</span>
                    <span className="font-semibold">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Support</span>
                    <span className="font-semibold">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WhatsApp</span>
                    <span className="font-semibold">6 AM - 10 PM</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Commitment */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-[hsl(var(--eco-secondary))] mb-3">🌟 Our Service Commitment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[hsl(var(--eco-text-muted))]">
                  <div>
                    <p>• Live chat response: Instant</p>
                    <p>• Phone call answer: Within 30 seconds</p>
                    <p>• Email response: Within 2 hours</p>
                  </div>
                  <div>
                    <p>• Issue resolution: Within 24 hours</p>
                    <p>• Refund processing: 2-3 business days</p>
                    <p>• Quality complaints: Immediate action</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CustomerLayout>
  );
}