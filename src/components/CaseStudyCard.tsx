import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  image?: string;
  logo?: string;
  tags: string[];
  company: string;
  industry: string;
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onClick: () => void;
}

const CaseStudyCard = ({ caseStudy, onClick }: CaseStudyCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {caseStudy.logo && (
              <img 
                src={caseStudy.logo} 
                alt={`${caseStudy.company} logo`}
                className="w-6 h-6 object-contain"
              />
            )}
            <span className="text-sm font-medium text-primary">{caseStudy.company}</span>
          </div>
          <span className="text-xs text-muted-foreground">{caseStudy.industry}</span>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {caseStudy.title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          {caseStudy.summary}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {caseStudy.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;