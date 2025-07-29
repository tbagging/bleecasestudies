import { useState } from "react";
import * as React from "react";
import { useContent } from "@/contexts/ContentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  const { 
    heroContent, 
    aboutContent, 
    ctaContent, 
    clientLogos, 
    availableTags,
    updateHeroContent,
    updateAboutContent,
    updateCTAContent,
    updateClientLogos,
    updateAvailableTags
  } = useContent();

  const [localHeroContent, setLocalHeroContent] = useState(heroContent);
  const [localAboutContent, setLocalAboutContent] = useState(aboutContent);
  const [localCTAContent, setLocalCTAContent] = useState(ctaContent);

  // Sync local state when context changes
  React.useEffect(() => {
    setLocalHeroContent(heroContent);
  }, [heroContent]);

  React.useEffect(() => {
    setLocalAboutContent(aboutContent);
  }, [aboutContent]);

  React.useEffect(() => {
    setLocalCTAContent(ctaContent);
  }, [ctaContent]);
  const [newTag, setNewTag] = useState("");

  const [newLogo, setNewLogo] = useState({ name: "", url: "", file: null as File | null });
  const [caseStudies, setCaseStudies] = useState([
    { id: 1, title: "Revenue Growth Through Strategic Alignment", company: "TechCorp", industry: "Technology", fileName: "techcorp-case-study.docx" },
    { id: 2, title: "Digital Transformation Success", company: "RetailCorp", industry: "Retail", fileName: "retailcorp-case-study.docx" },
    { id: 3, title: "Market Expansion Strategy", company: "StartupInc", industry: "SaaS", fileName: "startupinc-case-study.docx" }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const fileName = file.name.replace('.docx', '');
      const newId = Math.max(...caseStudies.map(cs => cs.id)) + 1;
      
      const newCaseStudy = {
        id: newId,
        title: fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        company: "New Company",
        industry: "Unknown",
        fileName: file.name
      };
      
      setCaseStudies([...caseStudies, newCaseStudy]);
      
      toast({
        title: "Case study uploaded",
        description: `"${file.name}" has been uploaded and added to the list.`,
      });
    }
  };

  const handleLogoFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setNewLogo({...newLogo, file, url: URL.createObjectURL(file)});
    }
  };

  const saveHeroContent = () => {
    updateHeroContent(localHeroContent);
    toast({
      title: "Hero section updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const saveAboutContent = () => {
    updateAboutContent(localAboutContent);
    toast({
      title: "About section updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const saveCTAContent = () => {
    updateCTAContent(localCTAContent);
    toast({
      title: "CTA buttons updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const addNewTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      updateAvailableTags([...availableTags, newTag.trim()]);
      setNewTag("");
      toast({
        title: "Tag added",
        description: `"${newTag.trim()}" has been added to available tags.`,
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateAvailableTags(availableTags.filter(tag => tag !== tagToRemove));
    toast({
      title: "Tag removed",
      description: `"${tagToRemove}" has been removed from available tags.`,
    });
  };

  const addNewLogo = () => {
    if (newLogo.name.trim() && newLogo.url.trim()) {
      const newId = Math.max(...clientLogos.map(logo => logo.id)) + 1;
      updateClientLogos([...clientLogos, { id: newId, name: newLogo.name, url: newLogo.url }]);
      setNewLogo({ name: "", url: "", file: null });
      toast({
        title: "Client logo added",
        description: `"${newLogo.name}" has been added to client logos.`,
      });
    }
  };

  const removeLogo = (logoId: number) => {
    const logoName = clientLogos.find(logo => logo.id === logoId)?.name;
    updateClientLogos(clientLogos.filter(logo => logo.id !== logoId));
    toast({
      title: "Client logo removed",
      description: `"${logoName}" has been removed from client logos.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">BLEE Admin Panel</h1>
          <p className="text-muted-foreground">Manage your landing page content and case studies</p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Page Content</TabsTrigger>
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            <TabsTrigger value="logos">Client Logos</TabsTrigger>
            <TabsTrigger value="tags">Manage Tags</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Title</Label>
                  <Input
                    id="hero-title"
                    value={localHeroContent.title}
                    onChange={(e) => setLocalHeroContent({...localHeroContent, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle">Subtitle</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={localHeroContent.subtitle}
                    onChange={(e) => setLocalHeroContent({...localHeroContent, subtitle: e.target.value})}
                  />
                </div>
                <Button onClick={saveHeroContent}>Save Changes</Button>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About BLEE Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-heading">Heading</Label>
                  <Input
                    id="about-heading"
                    value={localAboutContent.heading}
                    onChange={(e) => setLocalAboutContent({...localAboutContent, heading: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="about-description">Description</Label>
                  <Textarea
                    id="about-description"
                    rows={4}
                    value={localAboutContent.description}
                    onChange={(e) => setLocalAboutContent({...localAboutContent, description: e.target.value})}
                  />
                </div>
                <Button onClick={saveAboutContent}>Save Changes</Button>
              </CardContent>
            </Card>

            {/* CTA Content */}
            <Card>
              <CardHeader>
                <CardTitle>Call-to-Action Buttons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cta-primary">Primary CTA Text</Label>
                  <Input
                    id="cta-primary"
                    value={localCTAContent.primary}
                    onChange={(e) => setLocalCTAContent({...localCTAContent, primary: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cta-secondary">Secondary CTA Text</Label>
                  <Input
                    id="cta-secondary"
                    value={localCTAContent.secondary}
                    onChange={(e) => setLocalCTAContent({...localCTAContent, secondary: e.target.value})}
                  />
                </div>
                <Button onClick={saveCTAContent}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="case-studies" className="space-y-6">
            {/* Upload Case Studies */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Case Study</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Upload .docx Case Study</p>
                  <p className="text-muted-foreground mb-4">
                    Select a Word document containing your case study
                  </p>
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="case-study-upload"
                  />
                  <Button asChild>
                    <label htmlFor="case-study-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing Case Studies */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Case Studies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseStudies.map((caseStudy) => (
                    <div key={caseStudy.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{caseStudy.title}</h4>
                        <p className="text-sm text-muted-foreground">{caseStudy.company} • {caseStudy.industry}</p>
                        <p className="text-xs text-muted-foreground">{caseStudy.fileName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setCaseStudies(caseStudies.filter(cs => cs.id !== caseStudy.id))}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Client Logos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo-name">Logo Name</Label>
                    <Input
                      id="logo-name"
                      placeholder="Company name"
                      value={newLogo.name}
                      onChange={(e) => setNewLogo({...newLogo, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Logo</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">Upload logo from computer</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        PNG, JPG or SVG up to 2MB
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="hidden"
                        id="logo-file-upload"
                      />
                      <label htmlFor="logo-file-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
                      </label>
                    </div>
                    {newLogo.url && (
                      <div className="mt-2 p-2 border rounded">
                        <img src={newLogo.url} alt="Preview" className="w-20 h-10 object-contain mx-auto" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">or</div>
                  
                  <div>
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <Input
                      id="logo-url"
                      placeholder="https://example.com/logo.png"
                      value={newLogo.url}
                      onChange={(e) => setNewLogo({...newLogo, url: e.target.value, file: null})}
                    />
                  </div>
                </div>
                
                <Button onClick={addNewLogo} disabled={!newLogo.name.trim() || !newLogo.url.trim()}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Logo
                </Button>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Current Client Logos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientLogos.map((logo) => (
                      <div key={logo.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img src={logo.url} alt={logo.name} className="w-16 h-8 object-contain" />
                          <span className="font-medium">{logo.name}</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeLogo(logo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Hashtags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                  />
                  <Button onClick={addNewTag}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Available Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Unlock Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="unlock-email">Admin Email for Notifications</Label>
                  <Input
                    id="unlock-email"
                    type="email"
                    placeholder="admin@blee.com"
                  />
                </div>
                <div>
                  <Label htmlFor="unlock-message">Unlock Message</Label>
                  <Textarea
                    id="unlock-message"
                    placeholder="Enter your email to access the complete case study details"
                  />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
