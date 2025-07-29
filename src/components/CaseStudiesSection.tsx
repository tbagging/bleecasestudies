import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Lock, Mail, X } from "lucide-react";
import CaseStudyCard from "./CaseStudyCard";
import { useContent } from "@/contexts/ContentContext";

const CaseStudiesSection = () => {
  const { caseStudies } = useContent();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user has already unlocked content
  useEffect(() => {
    const unlockedEmail = localStorage.getItem('blee_unlocked_email');
    if (unlockedEmail) {
      setIsUnlocked(true);
    }
  }, []);

  const allTags = Array.from(new Set(caseStudies.flatMap(cs => cs.tags)));

  // Sample case study data - in real app this would come from your context or API
  const caseStudyData: Record<string, any> = {
    "1": {
      title: "Revenue Growth Through Strategic Alignment",
      company: "TechCorp",
      industry: "Technology",
      summary: "Transformed internal processes to achieve 40% revenue increase within 6 months through strategic clarity and team alignment.",
      tags: ["revenue-growth", "alignment", "process-optimization"],
      clientSnapshot: "Mid-size technology company with 200+ employees experiencing rapid growth but struggling with internal coordination.",
      background: "TechCorp had grown from 50 to 200 employees in 18 months but lacked the organizational structure to support continued scaling.",
      challenge: "Departments were working in silos, leading to duplicated efforts, missed opportunities, and declining team morale despite strong market demand.",
      process: "BLEE embedded with the leadership team for a 48-hour strategic alignment session, mapping current state, identifying bottlenecks, and creating actionable frameworks for cross-department collaboration.",
      keyMetrics: [
        "40% increase in revenue within 6 months",
        "60% reduction in project delivery time",
        "85% improvement in employee satisfaction scores",
        "3x increase in cross-team collaboration initiatives"
      ]
    }
  };

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
    setSelectedCaseStudy(id);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem('blee_unlocked_email', email);
    setIsUnlocked(true);
    setIsSubmitting(false);
  };

  const selectedCaseStudyData = selectedCaseStudy ? caseStudyData[selectedCaseStudy] : null;

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

      {/* Case Study Modal */}
      <Dialog open={!!selectedCaseStudy} onOpenChange={() => setSelectedCaseStudy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCaseStudyData && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  <span className="text-sm font-medium text-primary block mb-2">
                    {selectedCaseStudyData.company} • {selectedCaseStudyData.industry}
                  </span>
                  {selectedCaseStudyData.title}
                </DialogTitle>
              </DialogHeader>

              {!isUnlocked ? (
                <div className="py-8">
                  <Card className="max-w-md mx-auto">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Unlock Full Case Study</CardTitle>
                      <p className="text-muted-foreground text-sm">
                        Enter your email to access the complete case study details
                      </p>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            "Unlocking..."
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Unlock Case Study
                            </>
                          )}
                        </Button>
                      </form>
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        One-time unlock gives you access to all case studies
                      </p>
                    </CardContent>
                  </Card>

                  {/* Preview content */}
                  <div className="mt-8">
                    <p className="text-lg text-muted-foreground mb-6 text-center">{selectedCaseStudyData.summary}</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {selectedCaseStudyData.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
                      <div className="blur-sm">
                        <h3 className="text-lg font-semibold mb-3">Client Snapshot</h3>
                        <p className="text-muted-foreground text-sm">{selectedCaseStudyData.clientSnapshot}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="text-lg text-muted-foreground mb-4">{selectedCaseStudyData.summary}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedCaseStudyData.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <section>
                      <h3 className="text-xl font-bold mb-3">Client Snapshot</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedCaseStudyData.clientSnapshot}</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold mb-3">Background</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedCaseStudyData.background}</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold mb-3">The Challenge</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedCaseStudyData.challenge}</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold mb-3">The Process</h3>
                      <p className="text-muted-foreground leading-relaxed">{selectedCaseStudyData.process}</p>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold mb-3">Key Metrics</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {selectedCaseStudyData.keyMetrics.map((metric: string, index: number) => (
                          <Card key={index} className="border-primary/20">
                            <CardContent className="p-4 text-center">
                              <p className="font-medium">{metric}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </section>

                    <div className="text-center pt-6 border-t">
                      <h4 className="text-lg font-semibold mb-3">Ready to create similar results?</h4>
                      <Button 
                        onClick={() => {
                          const subject = "Case Study Discussion";
                          const body = `I'm interested in discussing how BLEE can help our organization achieve results similar to the ${selectedCaseStudyData.company} case study.`;
                          window.location.href = `mailto:hello@blee.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        }}
                        className="px-6"
                      >
                        Let's talk
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CaseStudiesSection;