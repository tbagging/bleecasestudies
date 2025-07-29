import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import CaseStudyCard from "./CaseStudyCard";
import { useNavigate } from "react-router-dom";

const CaseStudiesSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Sample case studies data
  const caseStudies = [
    {
      id: "1",
      title: "Revenue Growth Through Strategic Alignment",
      summary: "Transformed internal processes to achieve 40% revenue increase within 6 months through strategic clarity and team alignment.",
      company: "TechCorp",
      industry: "Technology",
      tags: ["revenue-growth", "alignment", "process-optimization"]
    },
    {
      id: "2", 
      title: "Market Expansion Strategy Implementation",
      summary: "Enabled rapid market entry into 3 new regions through organizational restructuring and strategic focus.",
      company: "GrowthCo",
      industry: "SaaS",
      tags: ["market-expansion", "strategy", "restructuring"]
    },
    {
      id: "3",
      title: "Operational Excellence in Manufacturing",
      summary: "Reduced operational costs by 25% while improving quality metrics through systematic process improvements.",
      company: "ManufactureX",
      industry: "Manufacturing",
      tags: ["operational-excellence", "cost-reduction", "quality"]
    }
  ];

  const allTags = Array.from(new Set(caseStudies.flatMap(cs => cs.tags)));

  const filteredCaseStudies = caseStudies.filter(cs => {
    const matchesSearch = cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cs.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cs.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => cs.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleCaseStudyClick = (id: string) => {
    navigate(`/case-study/${id}`);
  };

  return (
    <section className="py-20 bg-accent/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Real Results, Real Impact</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map(caseStudy => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              onClick={() => handleCaseStudyClick(caseStudy.id)}
            />
          ))}
        </div>

        {filteredCaseStudies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No case studies match your current filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudiesSection;