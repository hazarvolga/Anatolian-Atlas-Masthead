import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const SOCIAL_ICONS: Record<string, React.ComponentType<any>> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const { settings, isLoading } = useSiteSettings();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || isSubscribing) return;

    setIsSubscribing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/email-subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subscription_type: "newsletter", source: "footer" }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Subscription failed");
      }
      toast.success(t.footer.subscribeSuccess);
      setNewsletterEmail("");
    } catch {
      toast.error(t.footer.subscribeError);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Sosyal linkler loaded veya loading iken
  const socialLinksObj = settings?.social_media_links ?? {};
  const activeSocialLinks = Object.entries(socialLinksObj)
    .filter(([platform, url]) => url && SOCIAL_ICONS[platform])
    .map(([platform, url]) => ({
      platform,
      url,
      Icon: SOCIAL_ICONS[platform],
    }));

  return (
    <footer className="bg-card text-card-foreground pt-16 pb-8 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-fade-in [animation-delay:100ms]">
            <h4 className="text-xl font-bold mb-4">{settings?.site_title || "MareSereno"}</h4>
            <p className="text-muted-foreground mb-4">
              {t.footer.description}
            </p>
            <div className="flex space-x-4">
              {activeSocialLinks.length === 0 && (
                <>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook size={20} />
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram size={20} />
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter size={20} />
                    <span className="sr-only">Twitter</span>
                  </a>
                </>
              )}
              {activeSocialLinks.map(({ platform, url, Icon }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                >
                  <Icon size={20} />
                  <span className="sr-only">{platform}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="animate-fade-in [animation-delay:200ms]">
            <h4 className="text-xl font-bold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {[
                { name: t.nav.home, path: "/" },
                { name: "Destinations", path: "/destinations" },
                { name: t.nav.tours, path: "/tours" },
                { name: t.nav.gallery, path: "/gallery" },
                { name: t.nav.contact, path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="animate-fade-in [animation-delay:300ms]">
            <h4 className="text-xl font-bold mb-4">{t.footer.contact}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-primary" />
                <span className="text-muted-foreground">
                  {isLoading ? (
                    <span className="animate-pulse text-slate-400">Yükleniyor...</span>
                  ) : settings?.address ? (
                    <>
                      {settings.address.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </>
                  ) : (
                    <>
                      123 Seaside Boulevard<br />
                      Costa Bella, 12345<br />
                      Italy
                    </>
                  )}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary" />
                <span className="text-muted-foreground">
                  {isLoading ? <span className="animate-pulse text-slate-400">Yükleniyor...</span>
                  : settings?.contact_phone || "+39 123 4567 890"}
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                <span className="text-muted-foreground">
                  {isLoading ? <span className="animate-pulse text-slate-400">Yükleniyor...</span>
                  : settings?.contact_email || "info@maresereno.com"}
                </span>
              </li>
            </ul>
            {/* Sosyal medya ikonlarını iletişim bölümünün altına tekrar göstermek isterseniz: 
            <div className="flex space-x-3 mt-4">
              {activeSocialLinks.map(({ platform, url, Icon }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={platform.charAt(0).toUpperCase() + platform.slice(1)}
                >
                  <Icon size={20} />
                  <span className="sr-only">{platform}</span>
                </a>
              ))}
            </div>
            */}
          </div>
          
          <div className="animate-fade-in [animation-delay:400ms]">
            <h4 className="text-xl font-bold mb-4">{t.footer.newsletter}</h4>
            <p className="text-muted-foreground mb-4">
              {t.footer.newsletterDesc}
            </p>
            <form className="flex flex-col space-y-2" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder={t.footer.yourEmail} 
                className="rounded-md px-4 py-2 bg-muted text-foreground"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                required 
              />
              <button 
                type="submit" 
                className="btn-primary mt-2"
                disabled={isSubscribing}
              >
                {t.footer.subscribe}
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} {settings?.site_title || "MareSereno"}. {t.footer.allRights}</p>
        </div>
      </div>
    </footer>
  );
}
