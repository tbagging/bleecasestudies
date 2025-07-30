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
import { parseFile } from "@/utils/fileParser";

const Admin = () => {
  const { toast } = useToast();
  const { 
    heroContent, 
    aboutContent, 
    ctaContent, 
    clientLogos, 
    availableTags,
    caseStudies,
    updateHeroContent,
    updateAboutContent,
    updateCTAContent,
    updateClientLogos,
    updateAvailableTags,
    updateCaseStudies
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
  const [editingCaseStudy, setEditingCaseStudy] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ 
    title: "", 
    company: "", 
    industry: "", 
    summary: "", 
    tags: [] as string[], 
    image: "", 
    imageFile: null as File | null, 
    fileName: "", 
    newFile: null as File | null,
    content: {
      clientSnapshot: "",
      background: "",
      challenge: [] as string[],
      process: [] as { phase: string; description: string }[],
      results: [] as { metric: string; value: string; description: string }[],
      companySize: "",
      timeline: ""
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf")) {
      const fileName = file.name.replace(/\.(docx|pdf)$/, '');
      const newId = String(Date.now()); // Use timestamp as string ID
      
      try {
        // Parse the file content
        const parsedContent = await parseFile(file);
        
        const newCaseStudy = {
          id: newId,
          title: fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          summary: "Add case study summary here...",
          company: "New Company",
          industry: "Unknown", 
          tags: [],
          fileName: file.name,
          content: {
            clientSnapshot: parsedContent.clientSnapshot || "",
            background: parsedContent.background || "",
            challenge: parsedContent.challenge || [],
            process: parsedContent.process || [],
            results: parsedContent.results || [],
            companySize: parsedContent.companySize || "",
            timeline: parsedContent.timeline || ""
          }
        };
        
        updateCaseStudies([...caseStudies, newCaseStudy]);
        
        toast({
          title: "Case study uploaded and parsed",
          description: `"${file.name}" has been uploaded and content has been extracted automatically.`,
        });
      } catch (error) {
        console.error('Error parsing file:', error);
        
        // Fallback: create case study without parsed content
        const newCaseStudy = {
          id: newId,
          title: fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          summary: "Add case study summary here...",
          company: "New Company",
          industry: "Unknown", 
          tags: [],
          fileName: file.name
        };
        
        updateCaseStudies([...caseStudies, newCaseStudy]);
        
        toast({
          title: "Case study uploaded",
          description: `"${file.name}" has been uploaded. Please edit the content manually as automatic parsing failed.`,
          variant: "destructive"
        });
      }
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

  const startEditing = (caseStudy: any) => {
    setEditingCaseStudy(caseStudy.id);
    setEditForm({
      title: caseStudy.title,
      company: caseStudy.company,
      industry: caseStudy.industry,
      summary: caseStudy.summary || "",
      tags: caseStudy.tags || [],
      image: caseStudy.image || "",
      imageFile: null,
      fileName: caseStudy.fileName || "",
      newFile: null,
      content: caseStudy.content || {
        clientSnapshot: "",
        background: "",
        challenge: [],
        process: [],
        results: [],
        companySize: "",
        timeline: ""
      }
    });
  };

  const cancelEditing = () => {
    setEditingCaseStudy(null);
    setEditForm({ 
      title: "", 
      company: "", 
      industry: "", 
      summary: "", 
      tags: [], 
      image: "", 
      imageFile: null, 
      fileName: "", 
      newFile: null,
      content: {
        clientSnapshot: "",
        background: "",
        challenge: [],
        process: [],
        results: [],
        companySize: "",
        timeline: ""
      }
    });
  };

  const saveEdit = () => {
    if (editingCaseStudy) {
      const finalImage = editForm.imageFile ? URL.createObjectURL(editForm.imageFile) : editForm.image;
      const finalFileName = editForm.newFile ? editForm.newFile.name : editForm.fileName;
      
      updateCaseStudies(caseStudies.map(cs => 
        cs.id === editingCaseStudy 
          ? { ...cs, title: editForm.title, company: editForm.company, industry: editForm.industry, summary: editForm.summary, tags: editForm.tags, image: finalImage, fileName: finalFileName, content: editForm.content }
          : cs
      ));
      
      toast({
        title: "Case study updated",
        description: "Your changes have been saved successfully.",
      });
      
      cancelEditing();
    }
  };

  const handleCaseStudyImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setEditForm({...editForm, imageFile: file, image: URL.createObjectURL(file)});
      toast({
        title: "Photo uploaded",
        description: "Case study photo has been uploaded successfully.",
      });
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = editForm.tags.includes(tag)
      ? editForm.tags.filter(t => t !== tag)
      : [...editForm.tags, tag];
    setEditForm({...editForm, tags: newTags});
  };

  const handleCaseStudyFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/pdf")) {
      try {
        // Parse the new file content
        const parsedContent = await parseFile(file);
        
        setEditForm({
          ...editForm, 
          newFile: file,
          content: {
            clientSnapshot: parsedContent.clientSnapshot || editForm.content.clientSnapshot,
            background: parsedContent.background || "",
            challenge: parsedContent.challenge || [],
            process: parsedContent.process || [],
            results: parsedContent.results || [],
            companySize: parsedContent.companySize || "",
            timeline: parsedContent.timeline || ""
          }
        });
        
        toast({
          title: "File uploaded and parsed",
          description: "New case study file has been uploaded and content extracted successfully.",
        });
      } catch (error) {
        console.error('Error parsing file:', error);
        
        // Fallback: just set the file without parsing
        setEditForm({...editForm, newFile: file});
        
        toast({
          title: "File uploaded",
          description: "New case study file has been uploaded. Please edit the content manually as automatic parsing failed.",
          variant: "destructive"
        });
      }
    }
  };

  const removeCaseStudyFile = () => {
    setEditForm({...editForm, fileName: "", newFile: null});
    toast({
      title: "File removed",
      description: "Case study file has been removed.",
    });
  };

  // Function to clean up duplicate case studies
  const cleanupDuplicates = () => {
    console.log('Current case studies:', caseStudies);
    
    // Find all Ichilov case studies
    const ichilovCases = caseStudies.filter(cs => 
      cs.company === "Ichilov Hospital" || cs.title.toLowerCase().includes("ichilov")
    );
    
    console.log('Found Ichilov cases:', ichilovCases);
    
    if (ichilovCases.length > 1) {
      // Keep the one with complete content structure (the hardcoded one)
      const validIchilov = ichilovCases.find(cs => cs.content && cs.content.background);
      const filteredCaseStudies = caseStudies.filter(cs => {
        if (cs.company === "Ichilov Hospital" || cs.title.toLowerCase().includes("ichilov")) {
          return cs.id === validIchilov?.id;
        }
        return true;
      });
      
      console.log('Cleaning up duplicates, keeping:', validIchilov);
      updateCaseStudies(filteredCaseStudies);
      toast({
        title: "Duplicates removed",
        description: "Duplicate Ichilov case studies have been cleaned up.",
      });
    } else {
      toast({
        title: "No duplicates found",
        description: "No duplicate case studies were found.",
      });
    }
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
                  <p className="text-lg font-medium mb-2">Upload Case Study</p>
                  <p className="text-muted-foreground mb-4">
                    Select a Word document (.docx) or PDF containing your case study
                  </p>
                  <input
                    type="file"
                    accept=".docx,.pdf"
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
                <div className="flex justify-between items-center">
                  <CardTitle>Existing Case Studies</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={cleanupDuplicates}
                    className="text-sm"
                  >
                    Clean Duplicates
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseStudies.map((caseStudy) => (
                    <div key={caseStudy.id} className="p-4 border rounded-lg space-y-4">
                      {editingCaseStudy === caseStudy.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`edit-title-${caseStudy.id}`}>Title</Label>
                            <Input
                              id={`edit-title-${caseStudy.id}`}
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`edit-company-${caseStudy.id}`}>Company</Label>
                              <Input
                                id={`edit-company-${caseStudy.id}`}
                                value={editForm.company}
                                onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`edit-industry-${caseStudy.id}`}>Industry</Label>
                              <Input
                                id={`edit-industry-${caseStudy.id}`}
                                value={editForm.industry}
                                onChange={(e) => setEditForm({...editForm, industry: e.target.value})}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`edit-summary-${caseStudy.id}`}>Summary</Label>
                            <Textarea
                              id={`edit-summary-${caseStudy.id}`}
                              value={editForm.summary}
                              onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Case Study File</Label>
                            <div className="space-y-2">
                              {(editForm.fileName || editForm.newFile) ? (
                                <div className="p-3 border rounded-lg bg-muted/30">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                        <Upload className="w-4 h-4 text-primary" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">
                                          {editForm.newFile ? editForm.newFile.name : editForm.fileName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {editForm.newFile ? "New file (unsaved)" : "Current file"}
                                        </p>
                                      </div>
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={removeCaseStudyFile}
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center text-muted-foreground py-4">
                                  No file attached
                                </div>
                              )}
                              <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm font-medium mb-1">Upload new case study file</p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  .docx or .pdf files only
                                </p>
                                <input
                                  type="file"
                                  accept=".docx,.pdf"
                                  onChange={handleCaseStudyFileUpload}
                                  className="hidden"
                                  id={`case-study-file-upload-${caseStudy.id}`}
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <label htmlFor={`case-study-file-upload-${caseStudy.id}`} className="cursor-pointer">
                                    Choose File
                                  </label>
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label>Case Study Photo</Label>
                            <div className="space-y-2">
                              <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm font-medium mb-1">Upload case study image</p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  PNG, JPG or SVG up to 2MB
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleCaseStudyImageUpload}
                                  className="hidden"
                                  id={`case-study-image-upload-${caseStudy.id}`}
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <label htmlFor={`case-study-image-upload-${caseStudy.id}`} className="cursor-pointer">
                                    Choose Image
                                  </label>
                                </Button>
                              </div>
                              {editForm.image && (
                                <div className="mt-2 p-2 border rounded">
                                  <img src={editForm.image} alt="Case study preview" className="w-full h-32 object-cover rounded" />
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2 w-full"
                                    onClick={() => setEditForm({...editForm, image: "", imageFile: null})}
                                  >
                                    Remove Image
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label>Hashtags</Label>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Select tags for this case study:</p>
                              <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant={editForm.tags.includes(tag) ? "default" : "outline"}
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                    onClick={() => toggleTag(tag)}
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                              {editForm.tags.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-muted-foreground mb-1">Selected tags:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {editForm.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        #{tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Content Editing Section */}
                          <div className="space-y-6 border-t pt-6">
                            <h4 className="font-medium text-lg">Case Study Content</h4>
                            
                            {/* Company Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`company-size-${caseStudy.id}`}>Company Size</Label>
                                <Input
                                  id={`company-size-${caseStudy.id}`}
                                  value={editForm.content.companySize}
                                  onChange={(e) => setEditForm({...editForm, content: {...editForm.content, companySize: e.target.value}})}
                                  placeholder="e.g., 500-1000 employees"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`timeline-${caseStudy.id}`}>Project Timeline</Label>
                                <Input
                                  id={`timeline-${caseStudy.id}`}
                                  value={editForm.content.timeline}
                                  onChange={(e) => setEditForm({...editForm, content: {...editForm.content, timeline: e.target.value}})}
                                  placeholder="e.g., 6 months"
                                />
                              </div>
                            </div>
                            
                            {/* Client Snapshot */}
                            <div>
                              <Label htmlFor={`client-snapshot-${caseStudy.id}`}>Client Snapshot</Label>
                              <Textarea
                                id={`client-snapshot-${caseStudy.id}`}
                                value={editForm.content.clientSnapshot}
                                onChange={(e) => setEditForm({...editForm, content: {...editForm.content, clientSnapshot: e.target.value}})}
                                rows={3}
                                placeholder="Client details, company size, industry specifics..."
                              />
                            </div>
                            
                            {/* Overview/Background */}
                            <div>
                              <Label htmlFor={`background-${caseStudy.id}`}>Overview</Label>
                              <Textarea
                                id={`background-${caseStudy.id}`}
                                value={editForm.content.background}
                                onChange={(e) => setEditForm({...editForm, content: {...editForm.content, background: e.target.value}})}
                                rows={4}
                                placeholder="Describe the company background and context..."
                              />
                            </div>
                            
                            {/* Challenge */}
                            <div>
                              <Label>Challenges</Label>
                              <div className="space-y-2">
                                {editForm.content.challenge.map((item, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={item}
                                      onChange={(e) => {
                                        const newChallenge = [...editForm.content.challenge];
                                        newChallenge[index] = e.target.value;
                                        setEditForm({...editForm, content: {...editForm.content, challenge: newChallenge}});
                                      }}
                                      placeholder={`Challenge ${index + 1}`}
                                    />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newChallenge = editForm.content.challenge.filter((_, i) => i !== index);
                                        setEditForm({...editForm, content: {...editForm.content, challenge: newChallenge}});
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditForm({...editForm, content: {...editForm.content, challenge: [...editForm.content.challenge, ""]}});
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Challenge
                                </Button>
                              </div>
                            </div>
                            
                            {/* Process */}
                            <div>
                              <Label>Process Steps</Label>
                              <div className="space-y-3">
                                {editForm.content.process.map((phase, index) => (
                                  <div key={index} className="border rounded-lg p-3 space-y-2">
                                    <div className="flex gap-2 items-start">
                                      <div className="flex-1 space-y-2">
                                        <Input
                                          value={phase.phase}
                                          onChange={(e) => {
                                            const newProcess = [...editForm.content.process];
                                            newProcess[index].phase = e.target.value;
                                            setEditForm({...editForm, content: {...editForm.content, process: newProcess}});
                                          }}
                                          placeholder="Phase name"
                                        />
                                        <Textarea
                                          value={phase.description}
                                          onChange={(e) => {
                                            const newProcess = [...editForm.content.process];
                                            newProcess[index].description = e.target.value;
                                            setEditForm({...editForm, content: {...editForm.content, process: newProcess}});
                                          }}
                                          placeholder="Phase description"
                                          rows={2}
                                        />
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newProcess = editForm.content.process.filter((_, i) => i !== index);
                                          setEditForm({...editForm, content: {...editForm.content, process: newProcess}});
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditForm({...editForm, content: {...editForm.content, process: [...editForm.content.process, {phase: "", description: ""}]}});
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Process Step
                                </Button>
                              </div>
                            </div>
                            
                            {/* Results */}
                            <div>
                              <Label>Key Results</Label>
                              <div className="space-y-3">
                                {editForm.content.results.map((result, index) => (
                                  <div key={index} className="border rounded-lg p-3 space-y-2">
                                    <div className="flex gap-2 items-start">
                                      <div className="flex-1 space-y-2">
                                        <Input
                                          value={result.metric}
                                          onChange={(e) => {
                                            const newResults = [...editForm.content.results];
                                            newResults[index].metric = e.target.value;
                                            setEditForm({...editForm, content: {...editForm.content, results: newResults}});
                                          }}
                                          placeholder="Metric (e.g., 40%)"
                                        />
                                        <Input
                                          value={result.value}
                                          onChange={(e) => {
                                            const newResults = [...editForm.content.results];
                                            newResults[index].value = e.target.value;
                                            setEditForm({...editForm, content: {...editForm.content, results: newResults}});
                                          }}
                                          placeholder="Value (e.g., Increase in efficiency)"
                                        />
                                        <Input
                                          value={result.description}
                                          onChange={(e) => {
                                            const newResults = [...editForm.content.results];
                                            newResults[index].description = e.target.value;
                                            setEditForm({...editForm, content: {...editForm.content, results: newResults}});
                                          }}
                                          placeholder="Description"
                                        />
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newResults = editForm.content.results.filter((_, i) => i !== index);
                                          setEditForm({...editForm, content: {...editForm.content, results: newResults}});
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditForm({...editForm, content: {...editForm.content, results: [...editForm.content.results, {metric: "", value: "", description: ""}]}});
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Result
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={cancelEditing}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={saveEdit}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{caseStudy.title}</h4>
                            <p className="text-sm text-muted-foreground">{caseStudy.company} • {caseStudy.industry}</p>
                            <p className="text-xs text-muted-foreground">{caseStudy.fileName}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEditing(caseStudy)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => updateCaseStudies(caseStudies.filter(cs => cs.id !== caseStudy.id))}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
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
