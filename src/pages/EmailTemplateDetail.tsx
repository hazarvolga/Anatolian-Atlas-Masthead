import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Eye, Send, Mail, Code, Settings, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// React Email Template imports
import WelcomeEmail from "@/emails/templates/WelcomeEmail";
import BookingConfirmationEmail from "@/emails/templates/BookingConfirmationEmail";
import { render } from '@react-email/render';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  features: string[];
  component: React.ComponentType<any>;
  previewProps: any;
  updatedAt: Date;
}

export default function EmailTemplateDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings: siteSettings, isLoading: settingsLoading } = useSiteSettings();
  const templateId = searchParams.get('templateId');
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState<Partial<EmailTemplate>>({});

  // Dynamic site settings with fallback
  const dynamicSiteSettings = siteSettings ? {
    companyName: siteSettings.company_name || siteSettings.site_title || 'TourCo Adventures',
    companyLogo: siteSettings.site_logo_url || '/logo.png',
    website: siteSettings.website_url || 'https://tourco.com',
    contactEmail: siteSettings.support_email || siteSettings.contact_email || 'info@tourco.com',
    contactPhone: siteSettings.contact_phone || '+1 (555) 123-4567',
    address: siteSettings.address || '123 Adventure St, Travel City, TC 12345',
    socialMedia: siteSettings.social_media_links || {
      facebook: 'https://facebook.com/tourco',
      instagram: 'https://instagram.com/tourco',
      twitter: 'https://twitter.com/tourco',
    },
    primaryColor: siteSettings.primary_color || '#3b82f6',
    secondaryColor: siteSettings.secondary_color || '#1e40af',
  } : {
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

  // Email template definitions
  const emailTemplates: Record<string, EmailTemplate> = {
    '1': {
      id: '1',
      name: 'Welcome Email',
      description: 'Welcome new users with modern React Email components',
      component: WelcomeEmail,
      type: 'welcome',
      status: 'active',
      features: ['Personal greeting', 'Getting started guide', 'Contact information', 'Social media links'],
      previewProps: {
        customerName: 'John Doe',
        companyName: dynamicSiteSettings.companyName,
        supportEmail: dynamicSiteSettings.contactEmail,
        siteSettings: dynamicSiteSettings,
        unsubscribeUrl: 'https://yoursite.com/unsubscribe?token=sample-token-123',
      },
      updatedAt: new Date(),
    },
    '2': {
      id: '2',
      name: 'Booking Confirmation',
      description: 'Confirm booking details with comprehensive tour information',
      component: BookingConfirmationEmail,
      type: 'booking_confirmation',
      status: 'active',
      features: ['Booking reference', 'Tour details', 'Meeting point', 'Cancellation policy'],
      previewProps: {
        customerName: 'Jane Smith',
        tourName: 'Amazing City Tour',
        bookingReference: 'TC-12345',
        tourDate: '2024-01-15',
        tourTime: '10:00 AM',
        participants: 2,
        meetingPoint: 'Central Plaza',
        price: 99.99,
        siteSettings: dynamicSiteSettings,
        unsubscribeUrl: 'https://yoursite.com/unsubscribe?token=sample-token-456',
      },
      updatedAt: new Date(),
    },
  };

  useEffect(() => {
    if (templateId && emailTemplates[templateId]) {
      const foundTemplate = emailTemplates[templateId];
      setTemplate(foundTemplate);
      
      // Render the React Email component to HTML
      const renderEmail = async () => {
        try {
          const Component = foundTemplate.component;
          const html = await render(<Component {...foundTemplate.previewProps} />);
          setRenderedHtml(html);
        } catch (error) {
          console.error('Failed to render email component:', error);
          setRenderedHtml('<p>Error rendering email template</p>');
        }
      };
      renderEmail();
    }
    setLoading(false);
  }, [templateId]);

  const renderPreview = async () => {
    if (!template) return;
    
    try {
      const Component = template.component;
      const html = await render(<Component {...template.previewProps} />);
      setRenderedHtml(html);
    } catch (error) {
      console.error('Failed to render email component:', error);
      setRenderedHtml('<p>Error rendering email template</p>');
    }
  };

  const handleSaveTemplate = () => {
    if (!template) return;
    
    // Update template with edited values
    const updatedTemplate = {
      ...template,
      ...editedTemplate,
      updatedAt: new Date(),
    };
    
    setTemplate(updatedTemplate);
    setIsEditing(false);
    setEditedTemplate({});
    
    toast({
      title: "Template Updated",
      description: "Email template has been successfully updated.",
    });
  };

  const handleStatusToggle = (checked: boolean) => {
    const newStatus = checked ? 'active' : 'draft';
    setEditedTemplate(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-8">Loading template...</div>;
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <h2 className="text-2xl font-bold">Template Not Found</h2>
        <p className="text-muted-foreground">The requested email template could not be found.</p>
        <Button onClick={() => navigate('/admin?tab=emails')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin?tab=emails')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6" />
              {template.name}
            </h1>
            <p className="text-muted-foreground">{template.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">React Email Component</Badge>
              <Badge variant="outline" className="text-xs">Responsive Design</Badge>
            </div>
          </div>
          <Badge variant={template.status === 'active' ? "default" : "secondary"}>
            {template.status}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel Edit" : "Edit Template"}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveTemplate}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
          <Button onClick={renderPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Refresh Preview
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Component Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Preview - Daha geniş alan */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <CardDescription>
                  Live preview of your React Email template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-2 bg-white shadow-inner min-h-[600px] max-h-[800px] overflow-y-auto">
                  <div 
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                    className="email-preview w-full"
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      lineHeight: '1.6' 
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  📧 Email preview - Scroll to see full content
                </div>
              </CardContent>
            </Card>

            {/* Template Info - Daha dar alan */}
            <Card className="xl:col-span-1">
              <CardHeader>
                <CardTitle>Template Information</CardTitle>
                <CardDescription>
                  Details about this email template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Template Type</Label>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    {template.type.replace('_', ' ')}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Features</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Edit Form */}
            <Card>
              <CardHeader>
                <CardTitle>Template Settings</CardTitle>
                <CardDescription>
                  Edit template information and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={editedTemplate.name || template.name}
                    onChange={(e) => setEditedTemplate(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Input
                    id="template-description"
                    value={editedTemplate.description || template.description}
                    onChange={(e) => setEditedTemplate(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="Enter template description"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="template-status">Template Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Active templates can be used for sending emails
                    </p>
                  </div>
                  <Switch
                    id="template-status"
                    checked={(editedTemplate.status || template.status) === 'active'}
                    onCheckedChange={handleStatusToggle}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Template Type</Label>
                  <Input
                    value={template.type}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Template type cannot be changed
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Site Settings Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Site Settings (Dynamic)</CardTitle>
                <CardDescription>
                  These values are pulled from your site settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Company Name</Label>
                  <p className="text-sm text-muted-foreground bg-green-50 p-2 rounded border-l-4 border-green-400">
                    {dynamicSiteSettings.companyName}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Contact Email</Label>
                  <p className="text-sm text-muted-foreground bg-green-50 p-2 rounded border-l-4 border-green-400">
                    {dynamicSiteSettings.contactEmail}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  <p className="text-sm text-muted-foreground bg-green-50 p-2 rounded border-l-4 border-green-400">
                    {dynamicSiteSettings.website}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Social Media</Label>
                  <div className="space-y-1">
                    {Object.entries(dynamicSiteSettings.socialMedia || {}).map(([platform, url]) => (
                      <p key={platform} className="text-sm text-muted-foreground bg-green-50 p-2 rounded border-l-4 border-green-400">
                        {platform}: {String(url)}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Dynamic Content:</strong> Header and footer content is automatically 
                    pulled from your site settings and updated across all email templates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>React Email Component</CardTitle>
              <CardDescription>
                This template is built with React Email components for better compatibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono">
                  <div className="mb-2 text-gray-400">// React Email Component Path</div>
                  <div>/src/emails/templates/{template.component.name}.tsx</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Component Features</Label>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>✓ Cross-client compatibility</li>
                      <li>✓ Mobile responsive design</li>
                      <li>✓ Dynamic content support</li>
                      <li>✓ Modern email styling</li>
                    </ul>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Used Components</Label>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• EmailLayout</li>
                      <li>• EmailButton</li>
                      <li>• EmailCard</li>
                      <li>• ContactInfo</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
