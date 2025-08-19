import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import CaseStudyCard from "./CaseStudyCard";
import CaseStudyCardSkeleton from "./CaseStudyCardSkeleton";
import { useContent } from "@/contexts/ContentContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CaseStudyPage from "./CaseStudyPage";
import { extractDominantColor } from "@/utils/colorExtractor";

const CaseStudiesSection = () => {
  const { caseStudies, isLoadingCaseStudies } = useContent();
  
  // Debug logging
  console.log('CaseStudiesSection render:', {
    caseStudiesCount: caseStudies.length,
    isLoadingCaseStudies,
    caseStudies: caseStudies.map(cs => ({ id: cs.id, title: cs.title }))
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [logoColors, setLogoColors] = useState<{ [key: string]: string }>({});

  const allIndustries = Array.from(new Set(caseStudies.map(cs => cs.industry).filter(Boolean)));

  const filteredCaseStudies = caseStudies.filter(cs => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = cs.title.toLowerCase().includes(searchLower) ||
                         cs.summary.toLowerCase().includes(searchLower) ||
                         cs.company.toLowerCase().includes(searchLower) ||
                         cs.tags.some(tag => tag.toLowerCase().includes(searchLower));
    const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(cs.industry);
    return matchesSearch && matchesIndustry;
  });

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  useEffect(() => {
    const extractColors = async () => {
      const colors: { [key: string]: string } = {};
      
      for (const caseStudy of caseStudies) {
        if (caseStudy.logo) {
          try {
            const color = await extractDominantColor(caseStudy.logo);
            colors[caseStudy.id] = color;
          } catch (error) {
            console.error(`Error extracting color for ${caseStudy.id}:`, error);
            colors[caseStudy.id] = 'hsl(var(--muted))';
          }
        }
      }
      
      setLogoColors(colors);
    };

    if (caseStudies.length > 0) {
      extractColors();
    }
  }, [caseStudies]);

  return (
    <section className="py-20 bg-accent/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-title font-bold mb-6">Real Results, Real Impact</h2>
          <p className="text-xl font-body text-muted-foreground max-w-3xl mx-auto">
            See how we've helped organizations transform from within, creating lasting change 
            that drives measurable business outcomes.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search case studies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
          
          <div className="hidden md:flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Filter by industry:</span>
            {allIndustries.map(industry => (
              <Badge
                key={industry}
                variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toggleIndustry(industry)}
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoadingCaseStudies ? (
            // Show skeleton loaders while loading
            Array.from({ length: 6 }, (_, i) => (
              <CaseStudyCardSkeleton key={i} />
            ))
          ) : (
            filteredCaseStudies.map(caseStudy => (
              <Dialog key={caseStudy.id}>
                <DialogTrigger asChild>
                  <div>
                    <CaseStudyCard
                      caseStudy={caseStudy}
                      backgroundColor={logoColors[caseStudy.id]}
                      onClick={() => {}}
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto" aria-describedby="case-study-content">
                  <CaseStudyPage caseStudyId={caseStudy.id} />
                </DialogContent>
              </Dialog>
            ))
          )}
        </div>

        {!isLoadingCaseStudies && filteredCaseStudies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No case studies match your current filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudiesSection;