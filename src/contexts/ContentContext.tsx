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

interface ContentContextType {
  heroContent: HeroContent;
  aboutContent: AboutContent;
  ctaContent: CTAContent;
  clientLogos: ClientLogo[];
  availableTags: string[];
  updateHeroContent: (content: HeroContent) => void;
  updateAboutContent: (content: AboutContent) => void;
  updateCTAContent: (content: CTAContent) => void;
  updateClientLogos: (logos: ClientLogo[]) => void;
  updateAvailableTags: (tags: string[]) => void;
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
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Strategic transformation from within",
    subtitle: "We generate clarity, direction and ownership — within 24–48 hours"
  });

  const [aboutContent, setAboutContent] = useState<AboutContent>({
    heading: "Change from within the system",
    description: "We are not consultants. We are not facilitators. We embed inside organizations to activate clarity, ownership, and momentum that drives aligned action."
  });

  const [ctaContent, setCTAContent] = useState<CTAContent>({
    primary: "Let's talk",
    secondary: "Request full case studies"
  });

  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([
    { id: 1, name: "TechCorp", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=TechCorp" },
    { id: 2, name: "InnovateCo", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=InnovateCo" },
    { id: 3, name: "GlobalTech", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=GlobalTech" },
    { id: 4, name: "DataFlow", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=DataFlow" },
    { id: 5, name: "CloudSync", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=CloudSync" },
    { id: 6, name: "NextGen", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=NextGen" }
  ]);

  const [availableTags, setAvailableTags] = useState<string[]>([
    "revenue-growth", "alignment", "process-optimization", "market-expansion", 
    "strategy", "restructuring", "operational-excellence", "cost-reduction", "quality"
  ]);

  const updateHeroContent = (content: HeroContent) => {
    setHeroContent(content);
  };

  const updateAboutContent = (content: AboutContent) => {
    setAboutContent(content);
  };

  const updateCTAContent = (content: CTAContent) => {
    setCTAContent(content);
  };

  const updateClientLogos = (logos: ClientLogo[]) => {
    setClientLogos(logos);
  };

  const updateAvailableTags = (tags: string[]) => {
    setAvailableTags(tags);
  };

  return (
    <ContentContext.Provider value={{
      heroContent,
      aboutContent,
      ctaContent,
      clientLogos,
      availableTags,
      updateHeroContent,
      updateAboutContent,
      updateCTAContent,
      updateClientLogos,
      updateAvailableTags
    }}>
      {children}
    </ContentContext.Provider>
  );
};