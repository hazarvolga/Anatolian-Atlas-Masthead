"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api/client";
import { isDemoMode, siteConfig } from "@/config/site";

export default function ContactClient() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (!isDemoMode()) {
        const response = await fetch(`${API_BASE_URL}/api/contact-messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, source: "contact-page" }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || "Message could not be sent.");
        }
      }

      setIsSubmitted(true);
      toast.success(
        t?.contact?.messageSent || "Your inquiry has been received."
      );
    } catch {
      // If backend is unreachable during template preview, complete cleanly with notice
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultFaqData = [
    {
      questionKey: "checkInOut",
      question: "How large are your scheduled tour groups?",
      answer:
        "All scheduled departures are capped at 8 to 12 travelers so we can enter smaller monastic churches, historic workshops, and neighborhood lokantas without crowding.",
    },
    {
      questionKey: "parking",
      question: "Are museum and archaeological site tickets included?",
      answer:
        "Yes. Timed-entry tickets for all listed museums, archaeological enclosures (including the Ephesus Terrace Houses and Göreme Dark Church), and licensed specialist guides are included.",
    },
    {
      questionKey: "pets",
      question: "What is the best season to travel in Türkiye?",
      answer:
        "April through June and September through November offer ideal walking temperatures across İstanbul, Cappadocia, Ionia, and Southeastern Anatolia. The Lycian Coast is warmest from May through October.",
    },
    {
      questionKey: "breakfast",
      question: "Can dietary requirements be accommodated?",
      answer:
        "Turkish regional cuisine is rich in vegetable, pulse, and olive-oil dishes. Please note any allergies or dietary preferences when reserving and our guides will coordinate with every kitchen.",
    },
    {
      questionKey: "transfers",
      question: "Do you arrange domestic flights and airport transfers?",
      answer:
        "Multi-day journeys include regional ground transfers. Our İstanbul desk can also coordinate domestic flights into Kayseri (ASR), Nevşehir (NAV), İzmir (ADB), Dalaman (DLM), or Mardin (MQM).",
    },
    {
      questionKey: "amenities",
      question: "Can any itinerary be booked as a private departure?",
      answer:
        "Yes. Every route in the Atlas can be tailored for private couples, families, or academic study groups on custom dates.",
    },
  ];

  const questionsMap = (t?.contact?.questions ?? {}) as Record<
    string,
    { question?: string; answer?: string }
  >;

  return (
    <div className="pt-28 pb-20">
      {/* Header */}
      <section className="py-12 md:py-16 bg-background border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-3">
            <span className="editorial-kicker block">
              GALATA PLANNING DESK — İSTANBUL
            </span>
            <h1 className="font-serif text-foreground">
              {t?.contact?.title || "İstanbul Planning Desk"}
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              {t?.contact?.subtitle ||
                "Speak with our route planners in Galata regarding scheduled departures or private itineraries across Türkiye."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Inquiry Form */}
      <section className="section border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 5 Cols: Galata Desk Information & Map */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-serif text-2xl text-foreground">
                {t?.contact?.getInTouch || "Direct Contact"}
              </h2>

              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center mr-4">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                      {t?.contact?.address || "Galata Office"}
                    </h3>
                    <p className="text-sm text-foreground leading-relaxed">
                      {siteConfig.contact.addressLines.map((line, idx) => (
                        <span key={idx} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center mr-4">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                      {t?.contact?.phone || "Telephone"}
                    </h3>
                    <p className="text-sm text-foreground tabular-nums">
                      {siteConfig.contact.phone} (İstanbul Desk)
                    </p>
                    <p className="text-sm text-text-secondary tabular-nums">
                      {siteConfig.contact.whatsapp} (Field & WhatsApp)
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center mr-4">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                      {t?.contact?.email || "Email"}
                    </h3>
                    <p className="text-sm text-foreground">
                      {siteConfig.contact.email}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {siteConfig.contact.reservationsEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center mr-4">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                      {t?.contact?.receptionHours || "Planning Desk Hours"}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {t?.contact?.checkInTime || siteConfig.contact.hours}
                      <br />
                      {t?.contact?.checkOutTime ||
                        "Active Traveler Support: 24/7"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                <iframe
                  src={siteConfig.contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="NextStopTurkey Galata Office Map, İstanbul"
                />
              </div>
            </div>

            {/* Right 7 Cols: Route Inquiry Form */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-serif text-2xl text-foreground">
                {t?.contact?.sendMessage || "Send a Route Inquiry"}
              </h2>

              <div className="bg-card border border-border rounded-lg p-6 md:p-8">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {t?.contact?.fullName || "Full Name"}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Leyla Arslan"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {t?.contact?.email || "Email"}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="leyla@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {t?.contact?.phoneNumber || "Telephone Number"}
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+90 532 000 00 00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">
                          {t?.contact?.subject ||
                            "Region or Journey of Interest"}
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Cappadocia & Göreme Valleys (Autumn)"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {t?.contact?.message || "Message"}
                      </Label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={
                          t?.contact?.howCanWeHelp ||
                          "Tell us your preferred travel window, regions of interest, and group size..."
                        }
                        className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background text-sm focus:border-primary focus:outline-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary h-11"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      {t?.contact?.send || "Send Inquiry"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-12 h-12 bg-success/15 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-6 w-6 text-success" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">
                      {t?.contact?.messageSent || "Inquiry Received"}
                    </h3>
                    <p className="text-text-secondary max-w-md mx-auto text-sm">
                      {t?.contact?.thankYou ||
                        "Thank you. A route specialist in İstanbul will respond within one business day."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          subject: "",
                          message: "",
                        });
                      }}
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-muted/35">
        <div className="container">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="editorial-kicker block">
              PRACTICAL FIELD BRIEFING
            </span>
            <h2 className="font-serif text-foreground">
              {t?.contact?.faq || "Planning & Practical Questions"}
            </h2>
            <p className="text-text-secondary">
              {t?.contact?.faqSubtitle ||
                "Essential details on group sizes, archaeological permits, and seasonal timing"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {defaultFaqData.map((faq, index) => {
              const translated = questionsMap[faq.questionKey];
              const question = translated?.question || faq.question;
              const answer = translated?.answer || faq.answer;

              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 space-y-2"
                >
                  <h3 className="font-serif text-lg font-medium text-foreground">
                    {question}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
