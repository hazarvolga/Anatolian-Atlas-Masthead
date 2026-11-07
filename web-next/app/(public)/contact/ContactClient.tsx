"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
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
    <main className="pt-20 pb-24 bg-background min-h-screen">
      {/* Header */}
      <section className="py-14 md:py-20 bg-card border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="editorial-kicker block">
                05 — GALATA PLANNING DESK & BESPOKE DISPATCH
              </span>
              <h1 className="font-serif text-foreground">
                {t?.contact?.title || "İstanbul Planning Desk"}
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                {t?.contact?.subtitle ||
                  "Speak with our route planners in Galata regarding scheduled departures or private itineraries across Türkiye."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Split Swiss Grid: Galata Desk Ledger (5 cols) + Commission Form (7 cols) */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-border bg-card">
            {/* Left 5 Cols: Dark Ink Galata Dossier */}
            <div className="lg:col-span-5 bg-foreground text-background p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-10">
              <div className="space-y-8">
                <div className="border-b border-background/15 pb-4">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-primary-subtle font-semibold block">
                    DISPATCH HEADQUARTERS
                  </span>
                  <h2 className="font-serif text-3xl text-background mt-1">
                    {t?.contact?.getInTouch || "Galata Bureau, İstanbul"}
                  </h2>
                </div>

                <dl className="divide-y divide-background/15 text-xs tabular-nums">
                  <div className="py-4 space-y-1">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-primary-subtle font-semibold">
                      01 / CHANCERY & PLANNING ADDRESS
                    </dt>
                    <dd className="text-sm text-background leading-relaxed">
                      {siteConfig.contact.addressLines.length > 0 ? (
                        siteConfig.contact.addressLines.map((line, idx) => (
                          <span key={idx} className="block">
                            {line}
                          </span>
                        ))
                      ) : (
                        <span className="text-background/80">
                          Galata, Beyoğlu · İstanbul, Türkiye
                        </span>
                      )}
                    </dd>
                  </div>

                  {(siteConfig.contact.phone || siteConfig.contact.whatsapp) && (
                    <div className="py-4 space-y-1">
                      <dt className="text-[10px] uppercase tracking-[0.16em] text-primary-subtle font-semibold">
                        02 / TELEPHONE & FIELD WHATSAPP
                      </dt>
                      {siteConfig.contact.phone && (
                        <dd className="text-sm text-background">
                          {siteConfig.contact.phone} (İstanbul Desk)
                        </dd>
                      )}
                      {siteConfig.contact.whatsapp && (
                        <dd className="text-xs text-background/70">
                          {siteConfig.contact.whatsapp} (Active Field Dispatch)
                        </dd>
                      )}
                    </div>
                  )}

                  {(siteConfig.contact.email ||
                    siteConfig.contact.reservationsEmail) && (
                    <div className="py-4 space-y-1">
                      <dt className="text-[10px] uppercase tracking-[0.16em] text-primary-subtle font-semibold">
                        03 / ELECTRONIC CORRESPONDENCE
                      </dt>
                      {siteConfig.contact.email && (
                        <dd className="text-sm text-background">
                          {siteConfig.contact.email}
                        </dd>
                      )}
                      {siteConfig.contact.reservationsEmail && (
                        <dd className="text-xs text-background/70">
                          {siteConfig.contact.reservationsEmail}
                        </dd>
                      )}
                    </div>
                  )}

                  <div className="py-4 space-y-1">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-primary-subtle font-semibold">
                      04 / CONSULTATION HOURS
                    </dt>
                    <dd className="text-xs text-background/80 leading-relaxed">
                      {siteConfig.contact.hours}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="aspect-video overflow-hidden border border-background/20 bg-foreground">
                <iframe
                  src={siteConfig.contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`${siteConfig.brand.name} Galata Office Map, İstanbul`}
                />
              </div>
            </div>

            {/* Right 7 Cols: Editorial Route Commission Form */}
            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-14 bg-card flex flex-col justify-between">
              <div className="space-y-8">
                <div className="border-b border-border pb-4 flex items-baseline justify-between">
                  <span className="editorial-kicker">
                    ROUTE INQUIRY & PRIVATE CHARTER BRIEF
                  </span>
                  <span className="editorial-meta">RESPONSE WITHIN 24H</span>
                </div>

                <h2 className="font-serif text-3xl text-foreground">
                  {t?.contact?.sendMessage || "Commission an Itinerary or Ask a Question"}
                </h2>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="form-label">
                          01 / {t?.contact?.fullName || "Full Name"}
                        </label>
                        <input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Leyla Arslan"
                          className="form-input"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="form-label">
                          02 / {t?.contact?.email || "Electronic Mail"}
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="leyla@example.com"
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="form-label">
                          03 / {t?.contact?.phoneNumber || "Telephone"}
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+90 532 000 00 00"
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="form-label">
                          04 / {t?.contact?.subject || "Primary Region or Route"}
                        </label>
                        <input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Cappadocia & Göreme Valleys (Autumn)"
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="form-label">
                        05 / {t?.contact?.message || "Travel Window, Party Size & Notes"}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={
                          t?.contact?.howCanWeHelp ||
                          "Share your preferred travel dates, regions of interest, walking pace, and number of guests..."
                        }
                        className="form-input min-h-[160px]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full py-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      <span>{t?.contact?.send || "Transmit Route Brief"}</span>
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </button>
                  </form>
                ) : (
                  <div className="border border-border bg-background p-10 text-center space-y-4">
                    <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center mx-auto">
                      <Check className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-2xl text-foreground">
                      {t?.contact?.messageSent || "Route Brief Logged"}
                    </h3>
                    <p className="text-text-secondary max-w-md mx-auto text-sm">
                      {t?.contact?.thankYou ||
                        "Thank you. A senior route planner in Galata will respond within one business day."}
                    </p>
                    <button
                      type="button"
                      className="btn-outline mt-2"
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
                      Submit Another Inquiry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Field Briefing (FAQ Table) */}
      <section className="pt-16 md:pt-24">
        <div className="container">
          <div className="pb-10 border-b border-border mb-10">
            <span className="editorial-kicker block">
              06 — PRACTICAL FIELD BRIEFING
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground mt-2">
              {t?.contact?.faq || "Planning & Practical Questions"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-border bg-card">
            {defaultFaqData.map((faq, index) => {
              const translated = questionsMap[faq.questionKey];
              const question = translated?.question || faq.question;
              const answer = translated?.answer || faq.answer;

              return (
                <div
                  key={index}
                  className="p-8 border-r border-b border-border space-y-3"
                >
                  <span className="text-[11px] uppercase tracking-[0.16em] text-primary font-semibold tabular-nums">
                    NOTE 0{index + 1}
                  </span>
                  <h3 className="font-serif text-xl text-foreground">
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
    </main>
  );
}
