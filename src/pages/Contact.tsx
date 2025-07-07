import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the form data to a server
    console.log("Form submitted:", formData);
    
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  // Default FAQ data with fallback
  const defaultFaqData = [
    {
      questionKey: "checkInOut",
      question: "What are the check-in and check-out times?",
      answer: "Check-in is from 3:00 PM and check-out is until 11:00 AM. Early check-in and late check-out may be available upon request."
    },
    {
      questionKey: "parking",
      question: "Is parking available?",
      answer: "Yes, we offer complimentary parking for all guests during their stay."
    },
    {
      questionKey: "pets",
      question: "Are pets allowed?",
      answer: "We welcome well-behaved pets with prior arrangement. Additional fees may apply."
    },
    {
      questionKey: "breakfast",
      question: "Is breakfast included?",
      answer: "Continental breakfast is included in most room rates. Please check your booking details for confirmation."
    },
    {
      questionKey: "transfers",
      question: "Do you provide airport transfers?",
      answer: "Airport transfer services are available upon request. Please contact us in advance to arrange."
    },
    {
      questionKey: "amenities",
      question: "What amenities are available?",
      answer: "We offer WiFi, air conditioning, room service, concierge services, and access to local tour arrangements."
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-16">
        {/* İletişim içeriği */}
        <section className="relative py-20 bg-gradient-to-r from-sea-light to-white dark:from-sea-dark dark:to-background overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {t?.contact?.title || "Contact Us"}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {t?.contact?.subtitle || "Get in touch with our team"}
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary/50 blur-3xl" />
            <div className="absolute bottom-10 right-40 w-48 h-48 rounded-full bg-sea-light blur-3xl" />
          </div>
        </section>
        
        {/* Contact Information & Form */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="animate-fade-in [animation-delay:100ms]">
                <h2 className="text-2xl font-bold mb-6">{t?.contact?.getInTouch || "Get in Touch"}</h2>
                
                <div className="glass-card p-6 space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t?.contact?.address || "Address"}</h3>
                      <p className="text-muted-foreground">
                        123 Seaside Boulevard<br />
                        Costa Bella, 12345<br />
                        Italy
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t?.contact?.phone || "Phone"}</h3>
                      <p className="text-muted-foreground">+39 123 4567 890</p>
                      <p className="text-muted-foreground">+39 098 7654 321 (Reservations)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t?.contact?.email || "Email"}</h3>
                      <p className="text-muted-foreground">info@maresereno.com</p>
                      <p className="text-muted-foreground">reservations@maresereno.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t?.contact?.receptionHours || "Reception Hours"}</h3>
                      <p className="text-muted-foreground">
                        Monday - Sunday: 24 hours<br />
                        {t?.contact?.checkInTime || "Check-in: 3:00 PM"}<br />
                        {t?.contact?.checkOutTime || "Check-out: 11:00 AM"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387191.03606358136!2d14.165818971864153!3d40.85529294646443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b0a3c328d896b%3A0x309e11f99628150!2sGulf%20of%20Naples!5e0!3m2!1sen!2sus!4v1628613152777!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    title="Location Map"
                  />
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="animate-fade-in [animation-delay:300ms]">
                <h2 className="text-2xl font-bold mb-6">{t?.contact?.sendMessage || "Send a Message"}</h2>
                
                <div className="glass-card p-6">
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t?.contact?.fullName || "Full Name"}</Label>
                          <Input 
                            id="name" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe" 
                            required 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">{t?.contact?.email || "Email"}</Label>
                          <Input 
                            id="email" 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t?.contact?.phoneNumber || "Phone Number"}</Label>
                          <Input 
                            id="phone" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 234 567 8900" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="subject">{t?.contact?.subject || "Subject"}</Label>
                          <Input 
                            id="subject" 
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="Reservation Inquiry" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">{t?.contact?.message || "Message"}</Label>
                        <textarea 
                          id="message" 
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder={t?.contact?.howCanWeHelp || "How can we help you?"} 
                          className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background"
                          required 
                        />
                      </div>
                      
                      <Button type="submit" className="w-full btn-primary">
                        <Send className="mr-2 h-4 w-4" />
                        {t?.contact?.send || "Send Message"}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t?.contact?.messageSent || "Message Sent!"}</h3>
                      <p className="text-muted-foreground mb-6">
                        {t?.contact?.thankYou || "Thank you for your message. We'll get back to you soon."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="section bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-4">{t?.contact?.faq || "Frequently Asked Questions"}</h2>
              <p className="text-muted-foreground">
                {t?.contact?.faqSubtitle || "Find answers to common questions about our services"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in [animation-delay:200ms]">
              {defaultFaqData.map((faq, index) => {
                // Try to get translation, fallback to default
                const question = t?.contact?.questions?.[faq.questionKey]?.question || faq.question;
                const answer = t?.contact?.questions?.[faq.questionKey]?.answer || faq.answer;
                
                return (
                  <div key={index} className="glass-card p-6">
                    <h3 className="font-semibold text-lg mb-2">{question}</h3>
                    <p className="text-muted-foreground">{answer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
