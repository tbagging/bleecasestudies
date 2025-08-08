import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const cleanTitle = (title: string) => {
  return title.replace(/\bcase study\b/gi, '').trim();
};

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
        {caseStudy.logo && (
          <div className="flex justify-center mb-4">
            <img 
              src={caseStudy.logo} 
              alt={`${caseStudy.company} logo`}
              className="w-32 h-32 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {cleanTitle(caseStudy.title)}
        </CardTitle>
        <span className="text-xs text-muted-foreground">{caseStudy.industry}</span>
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