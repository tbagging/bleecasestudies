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
    logo: "",
    logoFile: null as File | null,
    fileName: "", 
    newFile: null as File | null,
    content: {
      heroImage: "",
      clientSnapshot: "",
      background: "",
      challenge: '',
      process: [] as { phase: string; description: string }[],
      results: [] as { metric: string; value: string; description: string }[],
      companySize: "",
      timeline: ""
    }
  });

  // Helper function to extract company name from title
  const extractCompanyName = (fileName: string): string => {
    let title = fileName.replace(/\.(docx|pdf)$/i, '');
    
    // Remove common case study terms
    title = title.replace(/case[\s-_]?study/gi, '').trim();
    
    // Handle common patterns like "CompanyName - Description" or "Description - CompanyName"
    const parts = title.split(/[-_]/);
    if (parts.length > 1) {
      // Take the first part if it looks like a company name (shorter, capitalized)
      const firstPart = parts[0].trim();
      const lastPart = parts[parts.length - 1].trim();
      
      // Prefer shorter parts that are likely company names
      if (firstPart.length <= 20 && firstPart.length > 0) {
        return firstPart.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      if (lastPart.length <= 20 && lastPart.length > 0) {
        return lastPart.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
    
    // If no clear pattern, take the first 20 characters
    const cleaned = title.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return cleaned.length <= 20 ? cleaned : cleaned.substring(0, 20).trim();
  };

  // Helper function to determine industry from content
  const determineIndustry = (content: any): string => {
    const text = `${content.background || ''} ${content.challenge || ''} ${content.clientSnapshot || ''}`.toLowerCase();
    
    const industryKeywords = {
      'Healthcare': ['hospital', 'medical', 'healthcare', 'patient', 'clinic', 'doctor', 'nurse', 'treatment', 'health'],
      'Technology': ['software', 'tech', 'digital', 'app', 'platform', 'ai', 'algorithm', 'code', 'programming', 'saas'],
      'Finance': ['bank', 'financial', 'investment', 'money', 'trading', 'loan', 'credit', 'payment', 'fintech'],
      'Manufacturing': ['manufacturing', 'factory', 'production', 'assembly', 'quality control', 'supply chain', 'logistics'],
      'Retail': ['retail', 'store', 'customer', 'sales', 'shopping', 'ecommerce', 'inventory', 'merchandise'],
      'Education': ['education', 'school', 'university', 'student', 'learning', 'teaching', 'academic', 'curriculum'],
      'Real Estate': ['real estate', 'property', 'housing', 'building', 'construction', 'architecture', 'development'],
      'Energy': ['energy', 'oil', 'gas', 'renewable', 'solar', 'wind', 'power', 'utility', 'electricity'],
      'Consulting': ['consulting', 'advisory', 'strategy', 'transformation', 'optimization', 'efficiency'],
      'Transportation': ['transportation', 'logistics', 'shipping', 'delivery', 'fleet', 'automotive', 'aviation'],
    };

    let bestMatch = 'Unknown';
    let maxScore = 0;

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const score = keywords.reduce((count, keyword) => {
        return count + (text.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = industry;
      }
    }

    return maxScore > 0 ? bestMatch : 'Unknown';
  };

  // Helper function to generate summary from content
  const generateSummary = (content: any, company: string): string => {
    const background = content.background || '';
    const challenge = content.challenge || '';
    const clientSnapshot = content.clientSnapshot || '';
    
    if (!background && !challenge && !clientSnapshot) {
      return '';
    }
    
    // Extract key information for a concise single sentence
    let summary = '';
    if (background) {
      const firstPart = background.split('.')[0];
      if (firstPart) {
        summary = `${company} ${firstPart.toLowerCase()}.`;
      }
    } else if (clientSnapshot) {
      const firstPart = clientSnapshot.split('.')[0];
      if (firstPart) {
        summary = `${company} ${firstPart.toLowerCase()}.`;
      }
    } else if (challenge) {
      const challengePart = challenge.split('.')[0];
      if (challengePart) {
        summary = `${company} faced ${challengePart.toLowerCase()}.`;
      }
    }
    
    // Keep it to maximum 150 characters for brevity
    if (summary.length > 150) {
      summary = summary.substring(0, 147) + '...';
    }
    
    return summary;
  };

  // Helper function to generate hashtags from content
  const generateHashtags = (content: any, industry: string): string[] => {
    const text = `${content.background || ''} ${content.challenge || ''} ${content.clientSnapshot || ''}`.toLowerCase();
    
    const hashtagKeywords = {
      // Industry-based hashtags
      'Healthcare': ['#healthcare', '#medical', '#hospital'],
      'Technology': ['#technology', '#software', '#digital'],
      'Finance': ['#finance', '#fintech', '#banking'],
      'Manufacturing': ['#manufacturing', '#production', '#industry'],
      'Retail': ['#retail', '#ecommerce', '#sales'],
      'Education': ['#education', '#learning', '#academic'],
      'Real Estate': ['#realestate', '#property', '#construction'],
      'Energy': ['#energy', '#power', '#utilities'],
      'Consulting': ['#consulting', '#strategy', '#transformation'],
      'Transportation': ['#transportation', '#logistics', '#automotive'],
    };
    
    // Common business hashtags based on content keywords
    const contentHashtags = [];
    if (text.includes('efficiency') || text.includes('optimization')) contentHashtags.push('#efficiency');
    if (text.includes('automation') || text.includes('automated')) contentHashtags.push('#automation');
    if (text.includes('customer') || text.includes('client')) contentHashtags.push('#customerexperience');
    if (text.includes('data') || text.includes('analytics')) contentHashtags.push('#dataanalytics');
    if (text.includes('process') || text.includes('workflow')) contentHashtags.push('#processimprovement');
    if (text.includes('cost') || text.includes('saving')) contentHashtags.push('#costsaving');
    if (text.includes('revenue') || text.includes('growth')) contentHashtags.push('#growth');
    if (text.includes('integration') || text.includes('system')) contentHashtags.push('#systemintegration');
    
    // Start with industry hashtags
    const industryTags = hashtagKeywords[industry] || [];
    
    // Add content-based hashtags
    const allTags = [...industryTags, ...contentHashtags];
    
    // Always add generic business hashtags
    allTags.push('#casestudy', '#success');
    
    // Return unique hashtags, limited to 6
    return [...new Set(allTags)].slice(0, 6);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const validFiles = Array.from(files).filter(file => 
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      file.type === "application/pdf"
    );
    
    if (validFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please select Word documents (.docx) or PDF files only.",
        variant: "destructive"
      });
      return;
    }
    
    const uploadPromises = validFiles.map(async (file) => {
      const fileName = file.name.replace(/\.(docx|pdf)$/, '');
      const newId = String(Date.now() + Math.random()); // Ensure unique IDs
      
      try {
        // Parse the file content
        const parsedContent = await parseFile(file);
        
        // Extract company name and determine industry
        const extractedCompany = extractCompanyName(file.name);
        const determinedIndustry = determineIndustry(parsedContent);
        
        // Generate summary and hashtags
        const generatedSummary = generateSummary(parsedContent, extractedCompany);
        const generatedHashtags = generateHashtags(parsedContent, determinedIndustry);
        
        const newCaseStudy = {
          id: newId,
          title: fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          summary: generatedSummary,
          company: extractedCompany,
          industry: determinedIndustry,
          tags: generatedHashtags,
          fileName: file.name,
          content: {
            heroImage: "",
            clientSnapshot: parsedContent.clientSnapshot || "",
            background: parsedContent.background || "",
            challenge: parsedContent.challenge || "",
            process: parsedContent.process || [],
            results: parsedContent.results || [],
            companySize: parsedContent.companySize || "",
            timeline: parsedContent.timeline || ""
          }
        };
        
        return { success: true, caseStudy: newCaseStudy, fileName: file.name };
      } catch (error) {
        console.error('Error parsing file:', error);
        
        // Fallback: create case study without parsed content
        // Still extract company name from filename even without content
        const extractedCompany = extractCompanyName(file.name);
        
        const newCaseStudy = {
          id: newId,
          title: fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          summary: "", // No content to generate summary from
          company: extractedCompany,
          industry: "Unknown", // Can't determine without content
          tags: ["#casestudy"], // Basic tag when no content available
          fileName: file.name,
          content: {
            heroImage: "",
            clientSnapshot: "",
            background: "",
            challenge: "",
            process: [],
            results: [],
            companySize: "",
            timeline: ""
          }
        };
        
        return { success: false, caseStudy: newCaseStudy, fileName: file.name, error: error };
      }
    });
    
    const results = await Promise.all(uploadPromises);
    const newCaseStudies = results.map(result => result.caseStudy);
    const successCount = results.filter(result => result.success).length;
    const failureCount = results.length - successCount;
    
    // Update case studies with all new ones
    updateCaseStudies([...caseStudies, ...newCaseStudies]);
    
    // Show appropriate toast messages
    if (successCount > 0 && failureCount === 0) {
      toast({
        title: `${successCount} case ${successCount === 1 ? 'study' : 'studies'} uploaded successfully`,
        description: "All files have been uploaded and content has been extracted automatically.",
      });
    } else if (successCount > 0 && failureCount > 0) {
      toast({
        title: `${successCount} case ${successCount === 1 ? 'study' : 'studies'} uploaded successfully, ${failureCount} failed`,
        description: "Some files were uploaded successfully, others need manual content editing.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Upload completed with issues",
        description: "Files were uploaded but automatic parsing failed. Please edit content manually.",
        variant: "destructive"
      });
    }
  };

  const handleLogoFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLogo({...newLogo, file, url: reader.result as string});
      };
      reader.readAsDataURL(file);
    } else if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive"
      });
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
    if (!newTag.trim()) return;
    
    // Split by comma or space and clean up tags
    const tagsToAdd = newTag
      .split(/[,\s]+/)
      .map(tag => {
        // Remove existing # if present, then ensure consistent format
        const cleanTag = tag.trim().replace(/^#+/, '');
        return cleanTag;
      })
      .filter(tag => tag.length > 0)
      .filter(tag => !availableTags.includes(tag));
    
    if (tagsToAdd.length === 0) {
      toast({
        title: "No new tags",
        description: "All tags already exist or no valid tags provided.",
        variant: "destructive"
      });
      return;
    }
    
    updateAvailableTags([...availableTags, ...tagsToAdd]);
    setNewTag("");
    
    const tagCount = tagsToAdd.length;
    toast({
      title: `${tagCount} tag${tagCount > 1 ? 's' : ''} added`,
      description: `"${tagsToAdd.join('", "')}" ${tagCount > 1 ? 'have' : 'has'} been added to available tags.`,
    });
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
      logo: caseStudy.logo || "",
      logoFile: null,
      fileName: caseStudy.fileName || "",
      newFile: null,
      content: caseStudy.content || {
        heroImage: "",
        clientSnapshot: "",
        background: "",
        challenge: '',
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
      logo: "",
      logoFile: null,
      fileName: "", 
      newFile: null,
      content: {
        heroImage: "",
        clientSnapshot: "",
        background: "",
        challenge: '',
        process: [],
        results: [],
        companySize: "",
        timeline: ""
      }
    });
  };

  const saveEdit = () => {
    if (editingCaseStudy) {
      const finalImage = editForm.image;
      const finalLogo = editForm.logo;
      const finalFileName = editForm.newFile ? editForm.newFile.name : editForm.fileName;
      
      updateCaseStudies(caseStudies.map(cs => 
        cs.id === editingCaseStudy 
          ? { ...cs, title: editForm.title, company: editForm.company, industry: editForm.industry, summary: editForm.summary, tags: editForm.tags, image: finalImage, logo: finalLogo, fileName: finalFileName, content: editForm.content }
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
    if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({...editForm, imageFile: file, image: reader.result as string});
      };
      reader.readAsDataURL(file);
      toast({
        title: "Photo uploaded",
        description: "Case study photo has been uploaded successfully.",
      });
    } else if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive"
      });
    }
  };

  const handleCaseStudyLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({...editForm, logoFile: file, logo: reader.result as string});
      };
      reader.readAsDataURL(file);
      toast({
        title: "Logo uploaded",
        description: "Case study logo has been uploaded successfully.",
      });
    } else if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
    }
  };

  const handleHeroImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({...editForm, content: {...editForm.content, heroImage: reader.result as string}});
      };
      reader.readAsDataURL(file);
      toast({
        title: "Hero image uploaded",
        description: "Case study hero image has been uploaded successfully.",
      });
    } else if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive"
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
            heroImage: editForm.content.heroImage,
            clientSnapshot: parsedContent.clientSnapshot || editForm.content.clientSnapshot,
            background: parsedContent.background || "",
            challenge: parsedContent.challenge || '',
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

        <Tabs defaultValue="case-studies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
            <TabsTrigger value="content">Page Content</TabsTrigger>
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
                   <p className="text-lg font-medium mb-2">Upload Case Studies</p>
                   <p className="text-muted-foreground mb-4">
                     Select one or more Word documents (.docx) or PDFs containing your case studies
                   </p>
                   <input
                     type="file"
                     accept=".docx,.pdf"
                     onChange={handleFileUpload}
                     className="hidden"
                     id="case-study-upload"
                     multiple
                   />
                   <Button asChild>
                     <label htmlFor="case-study-upload" className="cursor-pointer">
                       Choose Files
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
                            <div className="flex items-center gap-2 mb-2">
                              <Label htmlFor={`edit-summary-${caseStudy.id}`}>Summary</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newSummary = generateSummary(editForm.content, editForm.company);
                                  setEditForm({...editForm, summary: newSummary});
                                  toast({
                                    title: "Summary regenerated",
                                    description: "A new summary has been generated from the case study content.",
                                  });
                                }}
                              >
                                Regenerate
                              </Button>
                            </div>
                            <Textarea
                              id={`edit-summary-${caseStudy.id}`}
                              value={editForm.summary || ""}
                              onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                              rows={2}
                              placeholder="Brief one-sentence summary of the case study..."
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
                            <Label>Company Logo</Label>
                            <div className="space-y-2">
                              <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm font-medium mb-1">Upload company logo</p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  PNG, JPG or SVG up to 2MB
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleCaseStudyLogoUpload}
                                  className="hidden"
                                  id={`case-study-logo-upload-${caseStudy.id}`}
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <label htmlFor={`case-study-logo-upload-${caseStudy.id}`} className="cursor-pointer">
                                    Choose Logo
                                  </label>
                                </Button>
                              </div>
                              {editForm.logo && (
                                <div className="mt-2 p-2 border rounded">
                                  <img src={editForm.logo} alt="Company logo preview" className="w-16 h-16 object-contain mx-auto rounded" />
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2 w-full"
                                    onClick={() => setEditForm({...editForm, logo: "", logoFile: null})}
                                  >
                                    Remove Logo
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label>Hashtags</Label>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">Select from available tags:</p>
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
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Selected tags:</p>
                                <div className="space-y-2">
                                  <div className="flex flex-wrap gap-2">
                                    {editForm.tags.map((tag, index) => (
                                      <Badge 
                                        key={index} 
                                        variant="secondary" 
                                        className="text-xs pr-1 flex items-center gap-1"
                                      >
                                        #{tag}
                                        <button
                                          onClick={() => {
                                            const newTags = editForm.tags.filter((_, i) => i !== index);
                                            setEditForm({...editForm, tags: newTags});
                                          }}
                                          className="ml-1 text-muted-foreground hover:text-foreground"
                                        >
                                          ×
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Add custom tag (without #)"
                                      className="text-sm"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          const input = e.target as HTMLInputElement;
                                          const newTag = input.value.trim().replace(/^#+/, '');
                                          if (newTag && !editForm.tags.includes(newTag)) {
                                            setEditForm({...editForm, tags: [...editForm.tags, newTag]});
                                            input.value = '';
                                          }
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                        const newTag = input.value.trim().replace(/^#+/, '');
                                        if (newTag && !editForm.tags.includes(newTag)) {
                                          setEditForm({...editForm, tags: [...editForm.tags, newTag]});
                                          input.value = '';
                                        }
                                      }}
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Hero Image Upload */}
                          <div>
                            <Label>Hero Image</Label>
                            <div className="space-y-2">
                              <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm font-medium mb-1">Upload hero image for case study</p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  PNG, JPG or SVG up to 2MB
                                </p>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleHeroImageUpload}
                                  className="hidden"
                                  id={`hero-image-upload-${caseStudy.id}`}
                                />
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  asChild
                                >
                                  <label htmlFor={`hero-image-upload-${caseStudy.id}`} className="cursor-pointer">
                                    Choose Hero Image
                                  </label>
                                </Button>
                              </div>
                              {editForm.content.heroImage && (
                                <div className="mt-2 p-2 border rounded">
                                  <img src={editForm.content.heroImage} alt="Hero image preview" className="w-full h-32 object-cover rounded" />
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2 w-full"
                                    onClick={() => setEditForm({...editForm, content: {...editForm.content, heroImage: ""}})}
                                  >
                                    Remove Hero Image
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Content Editing Section */}
                          <div className="space-y-6 border-t pt-6">
                            <p className="font-medium text-sm text-muted-foreground">Case Study Content</p>
                            
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
                              <Label htmlFor={`challenge-${caseStudy.id}`}>Challenge</Label>
                              <Textarea
                                id={`challenge-${caseStudy.id}`}
                                value={editForm.content.challenge}
                                onChange={(e) => setEditForm({...editForm, content: {...editForm.content, challenge: e.target.value}})}
                                rows={6}
                                placeholder="Describe the main challenges faced by the client..."
                              />
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
                                          className="text-sm"
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
                            {caseStudy.summary && (
                              <p className="text-sm text-muted-foreground mt-1">{caseStudy.summary}</p>
                            )}
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
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tags (separate multiple with commas or spaces, # optional)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                    />
                    <Button onClick={addNewTag}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Tip: You can add multiple tags at once by separating them with commas or spaces (e.g., "tag1, tag2, tag3")
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Available Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                       <Badge key={tag} variant="secondary" className="text-sm">
                         {tag.startsWith('#') ? tag : `#${tag}`}
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
