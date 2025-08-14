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
  isLoadingCaseStudies: boolean;
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

  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoadingCaseStudies, setIsLoadingCaseStudies] = useState(false);
  const [hasLoadedCaseStudies, setHasLoadedCaseStudies] = useState(false);

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

  // Load case studies from Supabase on app start with caching and loading states
  useEffect(() => {
    if (hasLoadedCaseStudies || isLoadingCaseStudies) {
      return; // Prevent duplicate requests
    }

    const load = async () => {
      setIsLoadingCaseStudies(true);
      
      try {
        // First try to load from localStorage for instant display
        const cachedData = localStorage.getItem('caseStudies');
        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData);
            if (parsed.length > 0) {
              setCaseStudies(parsed);
              console.log(`Loaded ${parsed.length} case studies from cache`);
            }
          } catch (cacheError) {
            console.warn('Failed to parse cached case studies:', cacheError);
          }
        }

        // Then fetch fresh data from Supabase
        const { data, error } = await supabase
          .from('case_studies')
          .select('id, title, summary, image, logo, tags, company, industry, file_name, content, display_order')
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error('Error loading case studies from Supabase:', error);
          setHasLoadedCaseStudies(true);
          setIsLoadingCaseStudies(false);
          return;
        }
        
        if (data && data.length > 0) {
          console.log(`Loaded ${data.length} case studies from Supabase`);
          
          // Process data efficiently
          const mapped = data.map((row: any) => ({
            id: row.id,
            title: row.title,
            summary: row.summary || '',
            image: row.image || undefined,
            logo: row.logo || undefined,
            tags: row.tags || [],
            company: row.company || '',
            industry: row.industry || '',
            fileName: row.file_name || undefined,
            content: row.content || undefined,
          }));
          
          setCaseStudies(mapped);
          
          // Save to localStorage in background
          requestIdleCallback(() => {
            try {
              localStorage.setItem('caseStudies', JSON.stringify(mapped));
            } catch (storageError) {
              console.warn('Failed to save to localStorage:', storageError);
            }
          });
        }
        
        setHasLoadedCaseStudies(true);
      } catch (err) {
        console.error('Failed to load case studies:', err);
        setHasLoadedCaseStudies(true);
      } finally {
        setIsLoadingCaseStudies(false);
      }
    };
    
    load();
  }, [hasLoadedCaseStudies, isLoadingCaseStudies]);

  const value = {
    heroContent,
    aboutContent,
    ctaContent,
    clientLogos,
    availableTags,
    caseStudies,
    isLoadingCaseStudies,
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