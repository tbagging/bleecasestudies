import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, TrendingUp, Users, Target, Eye } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

interface CaseStudyPageProps {
  caseStudyId: string;
}

const CaseStudyPage = ({ caseStudyId }: CaseStudyPageProps) => {
  const { caseStudies } = useContent();
  const caseStudy = caseStudies.find(cs => cs.id === caseStudyId);

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
        {caseStudy.content?.heroImage && (
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <img 
              src={caseStudy.content.heroImage} 
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
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Building className="h-6 w-6 text-primary" />
            )}
            <span className="text-lg font-medium text-primary">{caseStudy.company}</span>
            <span className="text-sm text-muted-foreground">{caseStudy.industry}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{caseStudy.title}</h1>
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
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Client Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caseStudy.content?.clientSnapshot ? (
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-4">
                {caseStudy.content.clientSnapshot}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Industry</h4>
                  <p className="text-muted-foreground">{caseStudy.industry}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Company Size</h4>
                  <p className="text-muted-foreground">{caseStudy.content?.companySize || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Project Timeline</h4>
                  <p className="text-muted-foreground">{caseStudy.content?.timeline || "Not specified"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overview/Background */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {caseStudy.content?.background || "Overview information from the uploaded case study document will be displayed here."}
            </div>
          </CardContent>
        </Card>

        {/* Challenge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              The Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caseStudy.content?.challenge ? (
              <div className="text-muted-foreground whitespace-pre-wrap">
                {caseStudy.content.challenge}
              </div>
            ) : (
              <p className="text-muted-foreground">Challenge details from the uploaded case study document will be displayed here.</p>
            )}
          </CardContent>
        </Card>

        {/* Process */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-4 w-4" />
              The Process
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {caseStudy.content?.process && caseStudy.content.process.length > 0 ? (
              <div className="space-y-1">
                <div 
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: caseStudy.content.process[0].description
                      .replace(/\n/g, '<br/>')
                      .replace(/(\d+\.\s*[^<\n]+)/g, '<div class="mt-2 mb-1"><strong class="text-primary">$1</strong></div>')
                      .replace(/([A-Z][a-z\s&]+):/g, '<strong class="text-primary">$1:</strong>')
                      .replace(/(Co-developed|Created|Compiled|Conducted|Hosted|Formed|Teams received|Evaluation was based)/g, '<div class="ml-4">• <strong class="text-foreground">$1</strong>')
                      .replace(/(-primary">[^<]+)/g, '$1')
                  }}
                />
              </div>
            ) : (
              <p className="text-muted-foreground">Process details from the uploaded case study document will be displayed here.</p>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caseStudy.content?.results && caseStudy.content.results.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                 {caseStudy.content.results.map((result, index) => (
                   <div key={index} className="text-center">
                     <div className="text-4xl font-bold text-primary mb-2">{result.value}</div>
                     <div className="text-lg font-semibold text-foreground mb-2">{result.metric}</div>
                     <div className="text-sm text-muted-foreground">{result.description}</div>
                   </div>
                 ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Results and metrics from the uploaded case study document will be displayed here.</p>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Ready to transform your organization?</h3>
          <Button 
            size="lg"
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