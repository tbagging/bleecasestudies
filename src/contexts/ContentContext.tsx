import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
  heroImage?: string;
  clientSnapshot: string;
  background: string;
  challenge: string;
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
  logo?: string;
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
  updateCaseStudies: (caseStudies: CaseStudy[]) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  
  
  // Initialize from localStorage if available, otherwise use defaults
  const initializeContent = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [heroContent, setHeroContent] = useState<HeroContent>(() => 
    initializeContent('heroContent', {
      title: "Strategic transformation from within",
      subtitle: "We generate clarity, direction and ownership — within 24–48 hours"
    })
  );

  const [aboutContent, setAboutContent] = useState<AboutContent>(() =>
    initializeContent('aboutContent', {
      heading: "Change from within the system",
      description: "We are not consultants. We are not facilitators. We embed inside organizations to activate clarity, ownership, and momentum that drives aligned action."
    })
  );

  const [ctaContent, setCTAContent] = useState<CTAContent>(() =>
    initializeContent('ctaContent', {
      primary: "Let's talk",
      secondary: "Request full case studies"
    })
  );

  const [clientLogos, setClientLogos] = useState<ClientLogo[]>(() =>
    initializeContent('clientLogos', [
      { id: 1, name: "Client 1", url: "/lovable-uploads/1c39af01-0e9b-42cd-8833-e7e47da9bbd7.png" },
      { id: 2, name: "Client 2", url: "/lovable-uploads/31c0e9ec-b93a-4065-9536-a710b7df5b8d.png" },
      { id: 3, name: "Client 3", url: "/lovable-uploads/b3ee8b18-3ea9-48fa-a1db-fb95bb3c136a.png" },
      { id: 4, name: "Client 4", url: "/lovable-uploads/44cf9821-f49f-4fb3-852a-063bd79faf1e.png" },
      { id: 5, name: "Client 5", url: "/lovable-uploads/e05b80ef-55e5-45e6-85b7-ec1d92c3c898.png" }
    ])
  );

  const [availableTags, setAvailableTags] = useState<string[]>(() =>
    initializeContent('availableTags', [
      "revenue-growth", "alignment", "process-optimization", "market-expansion", 
      "strategy", "restructuring", "operational-excellence", "cost-reduction", "quality",
      "innovation", "collaboration", "entrepreneurship", "healthcare"
    ])
  );

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([
    {
      id: "1",
      title: "Revenue Growth Through Strategic Alignment",
      summary: "Transformed internal processes to achieve 40% revenue increase within 6 months through strategic clarity and team alignment.",
      image: "/lovable-uploads/1c39af01-0e9b-42cd-8833-e7e47da9bbd7.png",
      logo: "/lovable-uploads/31c0e9ec-b93a-4065-9536-a710b7df5b8d.png",
      company: "TechCorp",
      industry: "Technology",
      tags: ["revenue-growth", "alignment", "process-optimization"],
      fileName: "techcorp-case-study.docx",
      content: {
        heroImage: "/lovable-uploads/1c39af01-0e9b-42cd-8833-e7e47da9bbd7.png",
        clientSnapshot: "TechCorp is a mid-sized technology company with 150+ employees, operating in the competitive B2B software market. Despite having strong products and talented teams, they faced significant internal alignment challenges.",
        background: "TechCorp faced stagnating revenue growth despite having a strong product and talented team. Internal processes were fragmented, teams were working in silos, and strategic priorities were unclear across departments.",
        challenge: "TechCorp faced multiple interconnected challenges: Disconnected teams were working without a shared strategic vision, creating silos that prevented effective collaboration. Inefficient processes were causing delays and resource waste, while a lack of clear accountability and ownership across departments led to confusion and missed opportunities. Despite having strong market opportunities, the company was experiencing a revenue plateau due to these internal barriers.",
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
      image: "/lovable-uploads/b3ee8b18-3ea9-48fa-a1db-fb95bb3c136a.png",
      logo: "/lovable-uploads/44cf9821-f49f-4fb3-852a-063bd79faf1e.png",
      company: "GrowthCo",
      industry: "SaaS",
      tags: ["market-expansion", "strategy", "restructuring"],
      fileName: "growthco-case-study.docx",
      content: {
        heroImage: "/lovable-uploads/b3ee8b18-3ea9-48fa-a1db-fb95bb3c136a.png",
        clientSnapshot: "GrowthCo is a fast-growing SaaS company with 200+ employees, having achieved strong success in their home market and now seeking rapid international expansion across multiple regions.",
        background: "GrowthCo had achieved strong success in their home market but struggled to expand internationally. Their existing organizational structure and processes were optimized for a single market, creating barriers to effective multi-regional operations and customer acquisition.",
        challenge: "GrowthCo faced significant expansion challenges: Their organizational structure was not designed for multi-regional operations, creating bottlenecks in decision-making and execution. The company lacked localized market knowledge and customer insights necessary for effective international expansion. Additionally, resource allocation challenges across multiple time zones were hampering coordination and creating inefficiencies in their expansion efforts.",
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
      image: "/lovable-uploads/e05b80ef-55e5-45e6-85b7-ec1d92c3c898.png",
      logo: "/lovable-uploads/1c39af01-0e9b-42cd-8833-e7e47da9bbd7.png",
      company: "ManufactureX",
      industry: "Manufacturing", 
      tags: ["operational-excellence", "cost-reduction", "quality"],
      fileName: "manufacturex-case-study.docx",
      content: {
        heroImage: "/lovable-uploads/e05b80ef-55e5-45e6-85b7-ec1d92c3c898.png",
        clientSnapshot: "ManufactureX is a large-scale manufacturing company with 500+ employees, operating in a highly competitive market where cost efficiency and quality standards are critical for success.",
        background: "ManufactureX was facing increasing pressure from competitors with lower costs while maintaining high quality standards. Their existing processes had grown organically over time, creating inefficiencies and quality inconsistencies.",
        challenge: "ManufactureX was confronting critical operational challenges: Rising operational costs were significantly impacting their competitiveness in an already tight market. Quality inconsistencies were affecting customer satisfaction and threatening long-term relationships. Additionally, outdated processes that had grown organically over time were preventing scalability and creating barriers to growth and efficiency improvements.",
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
      image: "/lovable-uploads/31c0e9ec-b93a-4065-9536-a710b7df5b8d.png",
      logo: "/lovable-uploads/b3ee8b18-3ea9-48fa-a1db-fb95bb3c136a.png",
      company: "Ichilov Hospital",
      industry: "Healthcare",
      tags: ["innovation", "collaboration", "entrepreneurship", "healthcare"],
      fileName: "ichilov-hackathon-case-study.docx",
      content: {
        heroImage: "/lovable-uploads/31c0e9ec-b93a-4065-9536-a710b7df5b8d.png",
        clientSnapshot: "Ichilov Hospital is Israel's largest medical center with 2000+ employees, serving as a leading healthcare institution seeking to foster innovation culture and develop commercial partnerships within the medical technology ecosystem.",
        background: "Ichilov Hospital sought to foster innovation culture and entrepreneurial thinking among their staff while identifying opportunities for industry partnerships and commercial development.",
        challenge: "Ichilov Hospital faced innovation development challenges: There was a limited culture of innovation and entrepreneurship among staff, with most employees focused on day-to-day healthcare delivery rather than commercial innovation. The hospital lacked a structured approach to idea development and commercialization. Additionally, there was a clear need to establish industry partnerships and ensure commercial viability of internal innovations to create sustainable value.",
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
    ]);

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

  const updateCaseStudies = async (studies: CaseStudy[]) => {
    console.log('updateCaseStudies called with:', studies);
    try {
      // Determine removed IDs compared to current state
      const currentIds = new Set(caseStudies.map(cs => cs.id));
      const newIds = new Set(studies.map(cs => cs.id));
      const removedIds = Array.from(currentIds).filter(id => !newIds.has(id));
      console.log('removedIds:', removedIds);

      // Upsert all studies with display_order
      const rows = studies.map((cs, index) => ({
        id: cs.id,
        title: cs.title,
        summary: cs.summary ?? null,
        image: cs.image ?? null,
        logo: cs.logo ?? null,
        tags: cs.tags ?? [],
        company: cs.company,
        industry: cs.industry,
        file_name: cs.fileName ?? null,
        content: cs.content ? cs.content as any : null,
        display_order: index + 1, // Save the order position
      }));
      console.log('Upserting rows:', rows);

      const { error: upsertError } = await supabase
        .from('case_studies')
        .upsert(rows, { onConflict: 'id' });

      if (upsertError) {
        console.error('Supabase upsert error:', upsertError);
        throw upsertError;
      }

      if (removedIds.length > 0) {
        console.log('Deleting removed IDs...');
        const { error: deleteError } = await supabase
          .from('case_studies')
          .delete()
          .in('id', removedIds);
        if (deleteError) {
          console.error('Supabase delete error:', deleteError);
          throw deleteError;
        }
      }

      console.log('Setting case studies state...');
      setCaseStudies(studies);
      try {
        localStorage.setItem('caseStudies', JSON.stringify(studies));
        console.log('Saved to localStorage');
      } catch (localStorageError) {
        console.error('Failed to save to localStorage:', localStorageError);
      }
      console.log('updateCaseStudies completed successfully');
    } catch (error) {
      console.error('Failed to persist case studies:', error);
      throw error; // Re-throw so the Admin component can handle it
    }
  };

  // Load case studies from Supabase on app start
  useEffect(() => {
    const load = async () => {
      try {
        console.log('Starting to load case studies from Supabase...');
        
        // Try a simpler approach first
        const response = await fetch(`https://ktyqsarxhhhaorcehquj.supabase.co/rest/v1/case_studies?select=*&order=display_order.asc`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0eXFzYXJ4aGhoYW9yY2VocXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjAyODQsImV4cCI6MjA3MDU5NjI4NH0.hNqBa-R85tLgF4YOLrDzrQBAo98PIwGvApjXxCywLuE',
            'accept-profile': 'public'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Direct fetch response:', data);
        
        if (data && data.length > 0) {
          console.log('Loading case studies from Supabase:', data.length);
          const mapped = data.map((row: any) => ({
            id: row.id as string,
            title: row.title as string,
            summary: (row.summary ?? '') as string,
            image: (row.image ?? undefined) as string | undefined,
            logo: (row.logo ?? undefined) as string | undefined,
            tags: (row.tags ?? []) as string[],
            company: (row.company ?? '') as string,
            industry: (row.industry ?? '') as string,
            fileName: (row.file_name ?? undefined) as string | undefined,
            content: (row.content ?? undefined) as any,
          }));
          console.log('Mapped case studies:', mapped);
          setCaseStudies(mapped);
          localStorage.setItem('caseStudies', JSON.stringify(mapped));
        } else {
          console.log('No case studies found in direct fetch');
        }
      } catch (err) {
        console.error('Error with direct fetch, trying Supabase client:', err);
        
        // Fallback to Supabase client
        try {
          const { data, error } = await supabase
            .from('case_studies')
            .select('*')
            .order('display_order', { ascending: true });
          
          console.log('Supabase client response:', { data, error });
          
          if (error) {
            console.error('Supabase client error:', error);
            return;
          }
          
          if (data && data.length > 0) {
            console.log('Loading case studies from Supabase client:', data.length);
            const mapped = data.map((row: any) => ({
              id: row.id as string,
              title: row.title as string,
              summary: (row.summary ?? '') as string,
              image: (row.image ?? undefined) as string | undefined,
              logo: (row.logo ?? undefined) as string | undefined,
              tags: (row.tags ?? []) as string[],
              company: (row.company ?? '') as string,
              industry: (row.industry ?? '') as string,
              fileName: (row.file_name ?? undefined) as string | undefined,
              content: (row.content ?? undefined) as any,
            }));
            setCaseStudies(mapped);
            localStorage.setItem('caseStudies', JSON.stringify(mapped));
          }
        } catch (clientError) {
          console.error('Both direct fetch and Supabase client failed:', clientError);
        }
      }
    };
    load();
  }, []);

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

  

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};