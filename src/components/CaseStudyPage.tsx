import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, TrendingUp, Users, Target, Eye } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

const cleanTitle = (title: string) => {
  return title.replace(/\bcase study\b/gi, '').trim();
};

interface CaseStudyPageProps {
  caseStudyId: string;
}

const CaseStudyPage = ({ caseStudyId }: CaseStudyPageProps) => {
  const { caseStudies } = useContent();
  const caseStudy = caseStudies.find(cs => cs.id === caseStudyId);
  
  // Debug logging
  console.log('CaseStudyPage - caseStudy:', caseStudy);
  console.log('CaseStudyPage - content:', caseStudy?.content);
  console.log('CaseStudyPage - keyStats:', caseStudy?.content?.keyStats);
  console.log('CaseStudyPage - results:', caseStudy?.content?.results);

  if (!caseStudy) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
          <p className="text-muted-foreground">This case study could not be found.</p>
        </div>
      </div>
    );
  }

  if (!caseStudy.content) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Case Study Content Not Available</h1>
          <p className="text-muted-foreground">The detailed content for this case study has not been uploaded yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Hero Image */}
        {(caseStudy.content?.heroImage || caseStudy.image) && (
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <img 
              src={caseStudy.content?.heroImage || caseStudy.image} 
              alt={`${caseStudy.title} hero image`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.parentElement?.style.setProperty('display', 'none');
              }}
            />
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            {caseStudy.logo ? (
              <img 
                src={caseStudy.logo} 
                alt={`${caseStudy.company} logo`}
                className="h-24 w-24 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Building className="h-6 w-6 text-primary" />
            )}
          </div>
          <h1 id="case-study-title" className="text-3xl font-title font-bold mb-4">{cleanTitle(caseStudy.title)}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {caseStudy.summary}
          </p>
          <div className="flex justify-center flex-wrap gap-2 mt-6">
            {caseStudy.tags.map((tag) => (
              <Badge key={tag} variant="secondary">#{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Client Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title">
              <Building className="h-5 w-5" />
              Client Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caseStudy.content?.clientSnapshot ? (
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-4 text-lg">
                {caseStudy.content.clientSnapshot}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Industry</h4>
                  <p className="text-muted-foreground text-lg">{caseStudy.industry}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Company Size</h4>
                  <p className="text-muted-foreground text-lg">{caseStudy.content?.companySize || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Project Timeline</h4>
                  <p className="text-muted-foreground text-lg">{caseStudy.content?.timeline || "Not specified"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overview/Background */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title">
              <Eye className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
              {caseStudy.content?.background || "Overview information from the uploaded case study document will be displayed here."}
            </div>
          </CardContent>
        </Card>

        {/* Challenge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title">
              <Target className="h-5 w-5" />
              The Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caseStudy.content?.challenge ? (
              <div className="text-muted-foreground whitespace-pre-wrap text-lg">
                {caseStudy.content.challenge}
              </div>
            ) : (
              <p className="text-muted-foreground text-lg">Challenge details from the uploaded case study document will be displayed here.</p>
            )}
          </CardContent>
        </Card>

        {/* Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title">
              <Users className="h-5 w-5" />
              The Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caseStudy.content?.process && caseStudy.content.process.length > 0 ? (
              <div className="space-y-6">
                {caseStudy.content.process.map((phase, phaseIndex) => (
                  <div key={phaseIndex} className="border-l-4 border-primary pl-4">
                    <h5 className="font-semibold font-title text-lg mb-2">{phase.phase}</h5>
                    <div className="text-muted-foreground whitespace-pre-wrap text-base">
                      {phase.description}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-lg">Process details from the uploaded case study document will be displayed here.</p>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-title">
              <TrendingUp className="h-5 w-5" />
              Key Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caseStudy.content?.results && caseStudy.content.results.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                 {caseStudy.content.results.map((result, index) => (
                   <div key={index} className="flex flex-col items-center justify-center text-center p-6">
                     <div className="text-4xl font-bold text-primary mb-2">{result.metric}</div>
                      <div className="text-base text-muted-foreground font-medium mb-1">{result.value}</div>
                      <div className="text-base text-muted-foreground">{result.description}</div>
                   </div>
                 ))}
              </div>
            ) : caseStudy.content?.keyStats ? (
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(caseStudy.content.keyStats).map(([key, value], index) => (
                  <div key={index} className="flex flex-col items-center justify-center text-center p-6">
                    <div className="text-4xl font-bold text-primary mb-2">{value as string}</div>
                    <div className="text-base text-muted-foreground font-medium">{key}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-lg">Results and metrics from the uploaded case study document will be displayed here.</p>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center py-8">
          <h3 className="text-2xl font-title font-bold mb-4">Ready to transform your organization?</h3>
          <Button 
            size="lg"
            className="text-xl"
            onClick={() => window.location.href = "mailto:hello@blee.com?subject=Let's discuss transformation"}
          >
            Let's talk
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPage;