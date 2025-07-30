import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, TrendingUp, Users, Target } from "lucide-react";
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
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: caseStudy.content?.images?.[0] 
            ? `url(${caseStudy.content.images[0]})` 
            : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Building className="h-6 w-6" />
              <span className="text-lg font-medium">{caseStudy.company}</span>
              <span className="text-sm opacity-80">{caseStudy.industry}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{caseStudy.title}</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
              {caseStudy.summary}
            </p>
            <div className="flex justify-center flex-wrap gap-2 mt-6">
              {caseStudy.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-white/30">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-8 max-w-6xl mx-auto">

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
            <CardTitle>Overview</CardTitle>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              The Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            {caseStudy.content?.process && caseStudy.content.process.length > 0 ? (
              <div className="space-y-4">
                {caseStudy.content.process.map((phase, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold mb-2">{phase.phase}</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{phase.description}</p>
                  </div>
                ))}
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
                    <div className="text-3xl font-bold text-primary mb-2">{result.value}</div>
                    <div className="font-medium mb-1">{result.metric}</div>
                    <div className="text-sm text-muted-foreground">{result.description}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Results and metrics from the uploaded case study document will be displayed here.</p>
            )}
          </CardContent>
        </Card>

        {/* Images from Document */}
        {caseStudy.content?.images && caseStudy.content.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Case Study Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {caseStudy.content.images.map((image, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border">
                    <img 
                      src={image} 
                      alt={`Case study image ${index + 1}`}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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
    </div>
  );
};

export default CaseStudyPage;