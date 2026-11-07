
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Eye, Globe } from "lucide-react";
import { useAdminPage, useUpdatePage } from "@/hooks/usePages";
import { toast } from "sonner";
import PageEditorSidebar from "@/components/admin/page-editor/PageEditorSidebar";
import PagePreview from "@/components/admin/page-editor/PagePreview";
import PageSettings from "@/components/admin/page-editor/PageSettings";

export default function AdminPageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const { data: page, isLoading } = useAdminPage(id || "");
  const updatePage = useUpdatePage();
  
  const [pageData, setPageData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "settings">("editor");
  const [isDraft, setIsDraft] = useState(true);

  useEffect(() => {
    if (page) {
      setPageData(page);
      setIsDraft(page.status === 'draft');
    }
  }, [page]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/admin")} className="w-full">
              Go Back to Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Page Not Found</CardTitle>
            <CardDescription>The page you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/admin?tab=pages")} className="w-full">
              Back to Pages
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = async (status: 'draft' | 'published' = 'draft') => {
    try {
      await updatePage.mutateAsync({
        id: pageData.id,
        updates: {
          ...pageData,
          status,
          updated_at: new Date().toISOString()
        }
      });
      setIsDraft(status === 'draft');
      toast.success(status === 'published' ? "Page published successfully!" : "Page saved as draft!");
    } catch (error) {
      toast.error("Failed to save page");
      console.error("Save error:", error);
    }
  };

  const handlePreview = () => {
    if (pageData.slug) {
      window.open(`/${pageData.slug}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/admin?tab=pages")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pages
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{pageData.title}</h1>
              <p className="text-sm text-muted-foreground">
                {isDraft ? "Draft" : "Published"} • Last updated {new Date(pageData.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleSave('draft')}
              disabled={updatePage.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleSave('published')}
              disabled={updatePage.isPending}
            >
              <Globe className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-t px-6">
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "editor" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("editor")}
          >
            Visual Editor
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "settings" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Page Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {activeTab === "editor" ? (
          <>
            <PageEditorSidebar 
              pageData={pageData} 
              onPageDataChange={setPageData}
            />
            <PagePreview 
              pageData={pageData} 
              onPageDataChange={setPageData}
            />
          </>
        ) : (
          <PageSettings 
            pageData={pageData} 
            onPageDataChange={setPageData}
          />
        )}
      </div>
    </div>
  );
}
