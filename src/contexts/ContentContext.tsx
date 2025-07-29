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

interface CaseStudyContent {
  background: string;
  challenge: string[];
  process: { phase: string; description: string }[];
  results: { metric: string; value: string; description: string }[];
  companySize?: string;
  timeline?: string;
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
  content?: CaseStudyContent;
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
        fileName: "techcorp-case-study.docx",
        content: {
          background: "TechCorp faced stagnating revenue growth despite having a strong product and talented team. Internal processes were fragmented, teams were working in silos, and strategic priorities were unclear across departments.",
          challenge: [
            "Disconnected teams working without shared strategic vision",
            "Inefficient processes causing delays and resource waste",
            "Lack of clear accountability and ownership across departments",
            "Revenue plateau despite market opportunities"
          ],
          process: [
            { phase: "Month 1-2: Strategic Clarity Workshop", description: "Facilitated intensive alignment sessions to establish clear strategic priorities and shared vision." },
            { phase: "Month 3-4: Process Optimization", description: "Redesigned key workflows and implemented new accountability frameworks." },
            { phase: "Month 5-6: Implementation & Scale", description: "Rolled out new processes company-wide with embedded support and monitoring." }
          ],
          results: [
            { metric: "40%", value: "Revenue Growth", description: "Increase in 6 months" },
            { metric: "60%", value: "Process Efficiency", description: "Reduction in delivery time" },
            { metric: "85%", value: "Team Alignment", description: "Measured satisfaction score" }
          ],
          companySize: "150+ employees",
          timeline: "6 months"
        }
      },
      {
        id: "2",
        title: "Market Expansion Strategy Implementation", 
        summary: "Enabled rapid market entry into 3 new regions through organizational restructuring and strategic focus.",
        company: "GrowthCo",
        industry: "SaaS",
        tags: ["market-expansion", "strategy", "restructuring"],
        fileName: "growthco-case-study.docx",
        content: {
          background: "GrowthCo had achieved strong success in their home market but struggled to expand internationally. Their existing organizational structure and processes were optimized for a single market, creating barriers to effective multi-regional operations and customer acquisition.",
          challenge: [
            "Organizational structure not designed for multi-regional operations",
            "Lack of localized market knowledge and customer insights",
            "Resource allocation challenges across multiple time zones"
          ],
          process: [
            { phase: "Month 1-2: Market Analysis & Strategy Design", description: "Deep dive into target markets and designed region-specific go-to-market strategies." },
            { phase: "Month 3-4: Organizational Restructuring", description: "Redesigned team structure and processes to support multi-regional operations." },
            { phase: "Month 5-8: Implementation & Scale", description: "Launched in new markets with embedded support and continuous optimization." }
          ],
          results: [
            { metric: "3", value: "New Markets Entered", description: "Successful regional expansion" },
            { metric: "120%", value: "Revenue Growth", description: "Total company growth" },
            { metric: "8", value: "Months to Market", description: "Time to full operation" }
          ],
          companySize: "200+ employees",
          timeline: "8 months"
        }
      },
      {
        id: "3",
        title: "Operational Excellence in Manufacturing",
        summary: "Reduced operational costs by 25% while improving quality metrics through systematic process improvements.",
        company: "ManufactureX",
        industry: "Manufacturing", 
        tags: ["operational-excellence", "cost-reduction", "quality"],
        fileName: "manufacturex-case-study.docx",
        content: {
          background: "ManufactureX was facing increasing pressure from competitors with lower costs while maintaining high quality standards. Their existing processes had grown organically over time, creating inefficiencies and quality inconsistencies.",
          challenge: [
            "Rising operational costs impacting competitiveness",
            "Quality inconsistencies affecting customer satisfaction",
            "Outdated processes preventing scalability"
          ],
          process: [
            { phase: "Month 1-2: Process Analysis", description: "Comprehensive audit of all operational processes and quality control systems." },
            { phase: "Month 3-4: System Redesign", description: "Implemented lean manufacturing principles and new quality frameworks." },
            { phase: "Month 5-6: Training & Rollout", description: "Trained teams and rolled out new processes with continuous monitoring." }
          ],
          results: [
            { metric: "25%", value: "Cost Reduction", description: "Operational efficiency gains" },
            { metric: "40%", value: "Quality Improvement", description: "Defect rate reduction" },
            { metric: "95%", value: "Process Adoption", description: "Team implementation rate" }
          ],
          companySize: "500+ employees",
          timeline: "6 months"
        }
      },
      {
        id: "4",
        title: "Ichilov Internal Hackathon",
        summary: "The hackathon aimed to surface commercial-grade ideas, build in-house entrepreneurial momentum, and forge at least one concrete industry collaboration.",
        company: "Ichilov Hospital",
        industry: "Healthcare",
        tags: ["innovation", "collaboration", "entrepreneurship", "healthcare"],
        fileName: "ichilov-hackathon-case-study.docx",
        content: {
          background: "Ichilov Hospital sought to foster innovation culture and entrepreneurial thinking among their staff while identifying opportunities for industry partnerships and commercial development.",
          challenge: [
            "Limited culture of innovation and entrepreneurship",
            "Lack of structured approach to idea development",
            "Need for industry partnerships and commercial viability"
          ],
          process: [
            { phase: "Week 1-2: Preparation & Setup", description: "Designed hackathon framework and recruited cross-functional teams." },
            { phase: "Week 3: Intensive Hackathon", description: "48-hour intensive innovation session with mentorship and industry experts." },
            { phase: "Week 4-8: Development & Partnership", description: "Supported winning ideas and facilitated industry connections." }
          ],
          results: [
            { metric: "50+", value: "Participants", description: "Cross-departmental engagement" },
            { metric: "12", value: "Commercial Ideas", description: "Viable concepts developed" },
            { metric: "3", value: "Industry Partnerships", description: "Active collaborations formed" }
          ],
          companySize: "2000+ employees",
          timeline: "2 months"
        }
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