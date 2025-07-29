import { createContext, useContext, useState, ReactNode } from 'react';

interface HeroContent {
  title: string;
  subtitle: string;
}

interface AboutContent {
  heading: string;
  description: string;
}

interface CTAContent {
  primary: string;
  secondary: string;
}

interface ClientLogo {
  id: number;
  name: string;
  url: string;
}

interface CaseStudy {
  id: string;
  title: string;
  summary: string;
  image?: string;
  tags: string[];
  company: string;
  industry: string;
  fileName?: string;
}

interface ContentContextType {
  heroContent: HeroContent;
  aboutContent: AboutContent;
  ctaContent: CTAContent;
  clientLogos: ClientLogo[];
  availableTags: string[];
  caseStudies: CaseStudy[];
  updateHeroContent: (content: HeroContent) => void;
  updateAboutContent: (content: AboutContent) => void;
  updateCTAContent: (content: CTAContent) => void;
  updateClientLogos: (logos: ClientLogo[]) => void;
  updateAvailableTags: (tags: string[]) => void;
  updateCaseStudies: (caseStudies: CaseStudy[]) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  console.log('useContent hook called');
  const context = useContext(ContentContext);
  console.log('useContent context:', context);
  if (!context) {
    console.error('useContent: No context found! Provider not wrapping component');
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  console.log('ContentProvider rendering');
  
  const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [heroContent, setHeroContent] = useState<HeroContent>(() =>
    getInitialState('heroContent', {
      title: "Strategic transformation from within",
      subtitle: "We generate clarity, direction and ownership — within 24–48 hours"
    })
  );

  const [aboutContent, setAboutContent] = useState<AboutContent>(() =>
    getInitialState('aboutContent', {
      heading: "Change from within the system",
      description: "We are not consultants. We are not facilitators. We embed inside organizations to activate clarity, ownership, and momentum that drives aligned action."
    })
  );

  const [ctaContent, setCTAContent] = useState<CTAContent>(() =>
    getInitialState('ctaContent', {
      primary: "Let's talk",
      secondary: "Request full case studies"
    })
  );

  const [clientLogos, setClientLogos] = useState<ClientLogo[]>(() =>
    getInitialState('clientLogos', [
      { id: 1, name: "TechCorp", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=TechCorp" },
      { id: 2, name: "InnovateCo", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=InnovateCo" },
      { id: 3, name: "GlobalTech", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=GlobalTech" },
      { id: 4, name: "DataFlow", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=DataFlow" },
      { id: 5, name: "CloudSync", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=CloudSync" },
      { id: 6, name: "NextGen", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=NextGen" }
    ])
  );

  const [availableTags, setAvailableTags] = useState<string[]>(() =>
    getInitialState('availableTags', [
      "revenue-growth", "alignment", "process-optimization", "market-expansion", 
      "strategy", "restructuring", "operational-excellence", "cost-reduction", "quality"
    ])
  );

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(() =>
    getInitialState('caseStudies', [
      {
        id: "1",
        title: "Revenue Growth Through Strategic Alignment",
        summary: "Transformed internal processes to achieve 40% revenue increase within 6 months through strategic clarity and team alignment.",
        company: "TechCorp",
        industry: "Technology",
        tags: ["revenue-growth", "alignment", "process-optimization"],
        fileName: "techcorp-case-study.docx"
      },
      {
        id: "2",
        title: "Market Expansion Strategy Implementation", 
        summary: "Enabled rapid market entry into 3 new regions through organizational restructuring and strategic focus.",
        company: "GrowthCo",
        industry: "SaaS",
        tags: ["market-expansion", "strategy", "restructuring"],
        fileName: "growthco-case-study.docx"
      },
      {
        id: "3",
        title: "Operational Excellence in Manufacturing",
        summary: "Reduced operational costs by 25% while improving quality metrics through systematic process improvements.",
        company: "ManufactureX",
        industry: "Manufacturing", 
        tags: ["operational-excellence", "cost-reduction", "quality"],
        fileName: "manufacturex-case-study.docx"
      }
    ])
  );

  const updateHeroContent = (content: HeroContent) => {
    setHeroContent(content);
    localStorage.setItem('heroContent', JSON.stringify(content));
  };

  const updateAboutContent = (content: AboutContent) => {
    setAboutContent(content);
    localStorage.setItem('aboutContent', JSON.stringify(content));
  };

  const updateCTAContent = (content: CTAContent) => {
    setCTAContent(content);
    localStorage.setItem('ctaContent', JSON.stringify(content));
  };

  const updateClientLogos = (logos: ClientLogo[]) => {
    setClientLogos(logos);
    localStorage.setItem('clientLogos', JSON.stringify(logos));
  };

  const updateAvailableTags = (tags: string[]) => {
    setAvailableTags(tags);
    localStorage.setItem('availableTags', JSON.stringify(tags));
  };

  const updateCaseStudies = (studies: CaseStudy[]) => {
    setCaseStudies(studies);
    localStorage.setItem('caseStudies', JSON.stringify(studies));
  };

  const value = {
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
  };

  console.log('ContentProvider value:', value);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};