import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Eye, Trash2, Save, X, Mail, Calendar, CreditCard, Bell, Lock, AlertTriangle, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

// React Email Template imports
import WelcomeEmail from "@/emails/templates/WelcomeEmail";
import BookingConfirmationEmail from "@/emails/templates/BookingConfirmationEmail";
import BookingCancellationEmail from "@/emails/templates/BookingCancellationEmail";
import PaymentFailedEmail from "@/emails/templates/PaymentFailedEmail";
import BookingReminderEmail from "@/emails/templates/BookingReminderEmail";
import PasswordResetEmail from "@/emails/templates/PasswordResetEmail";
import TourUpdateEmail from "@/emails/templates/TourUpdateEmail";
import PromotionalEmail from "@/emails/templates/PromotionalEmail";
import { render } from '@react-email/render';

export default function EmailTemplateManager() {
  const navigate = useNavigate();
  
  // Mock site settings for preview
  const mockSiteSettings = {
    companyName: 'TourCo Adventures',
    companyLogo: '/logo.png',
    website: 'https://tourco.com',
    contactEmail: 'info@tourco.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Adventure St, Travel City, TC 12345',
    socialMedia: {
      facebook: 'https://facebook.com/tourco',
      instagram: 'https://instagram.com/tourco',
      twitter: 'https://twitter.com/tourco',
    },
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
  };

  // Email template definitions with React Email components
  const emailTemplates = [
    {
      id: '1',
      name: 'Welcome Email',
      description: 'Welcome new users with a warm, professional greeting and essential getting started information',
      component: WelcomeEmail,
      icon: Mail,
      type: 'welcome',
      status: 'active',
      features: ['Personal greeting', 'Getting started guide', 'Contact information', 'Social media links'],
      previewProps: {
        customerName: 'John Doe',
        companyName: mockSiteSettings.companyName,
        supportEmail: mockSiteSettings.contactEmail,
        siteSettings: mockSiteSettings,
      },
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Booking Confirmation',
      description: 'Confirm booking details with comprehensive tour information and next steps',
      component: BookingConfirmationEmail,
      icon: Calendar,
      type: 'booking_confirmation',
      status: 'active',
      features: ['Booking reference', 'Tour details', 'Meeting point', 'Cancellation policy'],
      previewProps: {
        customerName: 'Jane Smith',
        tourName: 'Amazing City Tour',
        bookingReference: 'TC-12345',
        tourDate: '2024-01-15',
        meetingPoint: 'Central Plaza',
        price: 99.99,
        siteSettings: mockSiteSettings,
      },
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Booking Cancellation',
      description: 'Handle booking cancellations with empathy and clear refund information',
      component: BookingCancellationEmail,
      icon: X,
      type: 'booking_cancellation',
      status: 'active',
      features: ['Cancellation reason', 'Refund details', 'Alternative suggestions', 'Support contact'],
      previewProps: {
        customerName: 'Mike Johnson',
        tourName: 'Beach Adventure',
        bookingReference: 'TC-67890',
        refundAmount: 149.99,
        reason: 'Weather conditions',
        siteSettings: mockSiteSettings,
      },
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Payment Failed',
      description: 'Alert customers about payment issues with clear recovery steps',
      component: PaymentFailedEmail,
      icon: CreditCard,
      type: 'payment_failed',
      status: 'active',
      features: ['Payment error details', 'Retry instructions', 'Alternative payment methods', 'Support options'],
      previewProps: {
        customerName: 'Sarah Wilson',
        tourName: 'Mountain Hiking Tour',
        amount: 89.99,
        failureReason: 'Insufficient funds',
        retryLink: '#',
        siteSettings: mockSiteSettings,
      },
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: 'Booking Reminder',
      description: 'Remind customers about upcoming tours with essential preparation details',
      component: BookingReminderEmail,
      icon: Bell,
      type: 'booking_reminder',
      status: 'active',
      features: ['Tour countdown', 'What to bring', 'Weather forecast', 'Contact information'],
      previewProps: {
        customerName: 'David Brown',
        tourName: 'Cultural Heritage Walk',
        tourDate: '2024-01-20',
        meetingTime: '09:00 AM',
        meetingPoint: 'Heritage Center',
        weatherInfo: 'Sunny, 22°C',
        siteSettings: mockSiteSettings,
      },
      updatedAt: new Date(),
    },
    {
      id: '6',
      name: 'Password Reset',
      description: 'Secure password reset with clear instructions and security tips',
      component: PasswordResetEmail,
      icon: Lock,
      type: 'password_reset',
      status: 'active',
      features: ['Secure reset link', 'Expiration notice', 'Security tips', 'Account protection'],
      previewProps: {
        customerName: 'Emma Davis',
        resetLink: '#',
        expirationTime: '24 hours',
        siteSettings: mockSiteSettings,
      },
      updatedAt: new Date(),
    },
    {
      id: '7',
      name: 'Tour Update Notification',
      description: 'Communicate important tour changes with clear impact and options',
      component: TourUpdateEmail,
      icon: AlertTriangle,
      type: 'tour_update',
      status: 'active',
      features: ['Change summary', 'Impact assessment', 'Available options', 'Compensation details'],
      previewProps: {
        customerName: 'Alex Martinez',
        tourName: 'Wine Tasting Experience',
        updateType: 'Schedule Change',
        changes: 'Tour time moved from 2:00 PM to 3:00 PM due to venue availability',
        impact: 'Minimal - all other details remain the same',
        siteSettings: mockSiteSettings,
      },
      updatedAt: new Date(),
    },
    {
      id: '8',
      name: 'Promotional Email',
      description: 'Engaging promotional content with compelling offers and clear call-to-action',
      component: PromotionalEmail,
      icon: Gift,
      type: 'promotional',
      status: 'draft',
      features: ['Discount codes', 'Limited time offers', 'Featured tours', 'Exclusive deals'],
      previewProps: {
        customerName: 'Lisa Anderson',
        offerTitle: 'Spring Adventure Sale',
        discountPercentage: 25,
        discountCode: 'SPRING25',
        validUntil: '2024-03-31',
        featuredTours: ['City Explorer', 'Nature Walk', 'Food Tour'],
        siteSettings: mockSiteSettings,
      },
      updatedAt: new Date(),
    },
  ];

  const [templates, setTemplates] = useState(emailTemplates);
  const [loading, setLoading] = useState(false);

  const templateTypeColors = {
    'welcome': 'blue',
    'booking_confirmation': 'green',
    'booking_cancellation': 'red',
    'payment_failed': 'red',
    'booking_reminder': 'yellow',
    'password_reset': 'purple',
    'tour_update': 'orange',
    'promotional': 'pink',
  };

  const getBadgeVariant = (type: string) => {
    const colors = templateTypeColors[type as keyof typeof templateTypeColors];
    return colors || 'outline';
  };

  const handlePreview = (template: any) => {
    navigate(`/admin?tab=email-template-detail&templateId=${template.id}&mode=preview`);
  };

  const handleEdit = (template: any) => {
    navigate(`/admin?tab=email-template-detail&templateId=${template.id}&mode=edit`);
  };

  const handleDelete = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading email templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Email Templates</h3>
          <p className="text-sm text-muted-foreground">
            Manage your React Email templates with modern components and responsive design
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-md transition-all duration-200 border-l-4" 
                  style={{ borderLeftColor: template.status === 'active' ? '#10b981' : '#94a3b8' }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "p-2 rounded-lg",
                      getBadgeVariant(template.type) === 'blue' && 'bg-blue-100 text-blue-700',
                      getBadgeVariant(template.type) === 'green' && 'bg-green-100 text-green-700',
                      getBadgeVariant(template.type) === 'red' && 'bg-red-100 text-red-700',
                      getBadgeVariant(template.type) === 'yellow' && 'bg-yellow-100 text-yellow-700',
                      getBadgeVariant(template.type) === 'purple' && 'bg-purple-100 text-purple-700',
                      getBadgeVariant(template.type) === 'orange' && 'bg-orange-100 text-orange-700',
                      getBadgeVariant(template.type) === 'pink' && 'bg-pink-100 text-pink-700',
                    )}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {template.name}
                        {template.status === 'active' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Live
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                      
                      {/* Features */}
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 3).map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                            >
                              {feature}
                            </span>
                          ))}
                          {template.features.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              +{template.features.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={template.status === 'active' ? "default" : "secondary"}>
                      {template.status === 'active' ? 'Active' : 'Draft'}
                    </Badge>
                    <Badge variant="outline" className={cn(
                      getBadgeVariant(template.type) === 'blue' && 'border-blue-200 text-blue-700 bg-blue-50',
                      getBadgeVariant(template.type) === 'green' && 'border-green-200 text-green-700 bg-green-50',
                      getBadgeVariant(template.type) === 'red' && 'border-red-200 text-red-700 bg-red-50',
                      getBadgeVariant(template.type) === 'yellow' && 'border-yellow-200 text-yellow-700 bg-yellow-50',
                      getBadgeVariant(template.type) === 'purple' && 'border-purple-200 text-purple-700 bg-purple-50',
                      getBadgeVariant(template.type) === 'orange' && 'border-orange-200 text-orange-700 bg-orange-50',
                      getBadgeVariant(template.type) === 'pink' && 'border-pink-200 text-pink-700 bg-pink-50',
                    )}>
                      {template.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>React Email Component</span>
                    <span>•</span>
                    <span>Responsive Design</span>
                    <span>•</span>
                    <span>Updated: {template.updatedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" title="Preview Email" onClick={() => handlePreview(template)}>
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" title="Edit Template" onClick={() => handleEdit(template)}>
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      title="Delete Template" 
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* React Email Info Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Powered by React Email</h4>
              <p className="text-sm text-blue-700 mt-1">
                All templates are built with React Email components for better compatibility, responsive design, and modern email clients support.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-blue-600">
                <span>✓ Cross-client compatibility</span>
                <span>✓ Mobile responsive</span>
                <span>✓ Dynamic content support</span>
                <span>✓ Easy customization</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}