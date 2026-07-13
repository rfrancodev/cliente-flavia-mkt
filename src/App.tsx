import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { 
  Instagram, 
  Mail, 
  Phone, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  TrendingUp, 
  User, 
  Video, 
  Award, 
  X, 
  Briefcase, 
  ChevronRight, 
  ChevronDown,
  Calculator, 
  Smartphone, 
  Eye, 
  Heart, 
  MessageCircle, 
  Database,
  ArrowUpRight,
  MousePointerClick,
  Target,
  Film,
  Palette,
  Layers,
  Type
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CLIENTS, 
  SERVICES, 
  PRODUCTS, 
  PORTFOLIO_CASES, 
  DESIGNS, 
  PortfolioCase 
} from "./data";
import { SITE_COPY } from "./copy";
import { IMAGES } from "./assets/images";

export default function App() {
  // Navigation & Category states
  const [activeTab, setActiveTab] = useState<"todos" | "moda" | "beleza" | "joias" | "educacao">("todos");
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [selectedCase, setSelectedCase] = useState<PortfolioCase | null>(null);
  
  // Simulated Video Player States
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);
  const [simulationViews, setSimulationViews] = useState(12840);
  
  // ROI Calculator States
  const [budget, setBudget] = useState(400); // R$
  const [ticket, setTicket] = useState(120); // R$ average product price
  const [nicheConversionFactor, setNicheConversionFactor] = useState(1.2); // weight multiplier

  // Contact Form States
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    segment: "moda",
    phone: "",
    email: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [showLeadsPanel, setShowLeadsPanel] = useState(false);

  // Design Portfolio Auto-Highlight states
  const [highlightedDesignId, setHighlightedDesignId] = useState<string>("d1");
  const [isDesignHovered, setIsDesignHovered] = useState<boolean>(false);

  // Auto-highlight effect for Design Portfolio (3 seconds per card)
  useEffect(() => {
    if (isDesignHovered) return;

    const interval = setInterval(() => {
      setHighlightedDesignId((currentId) => {
        const currentIndex = DESIGNS.findIndex(d => d.id === currentId);
        const nextIndex = (currentIndex + 1) % DESIGNS.length;
        return DESIGNS[nextIndex].id;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isDesignHovered]);

  // References
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch local leads on mount
  useEffect(() => {
    const savedLeads = localStorage.getItem("ana_flavia_leads");
    if (savedLeads) {
      try {
        setLeadsList(JSON.parse(savedLeads));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch leads from Cloudflare Pages D1 Database
  const fetchDbLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.leads)) {
          // Sync database leads with local leads, avoiding duplicates by id
          setLeadsList(prev => {
            const merged = [...data.leads, ...prev];
            const uniqueMap = new Map();
            merged.forEach(lead => {
              if (lead && lead.id) {
                uniqueMap.set(lead.id, lead);
              }
            });
            const uniqueLeads = Array.from(uniqueMap.values());
            // Update local storage to keep them in sync
            localStorage.setItem("ana_flavia_leads", JSON.stringify(uniqueLeads));
            return uniqueLeads;
          });
        }
      }
    } catch (e) {
      console.warn("Could not sync with Cloudflare D1 database. Using local backup.", e);
    }
  };

  // Sync leads when panel is opened
  useEffect(() => {
    if (showLeadsPanel) {
      fetchDbLeads();
    }
  }, [showLeadsPanel]);

  // Filter cases based on selected category tab
  // When "todos" is selected, display exactly 1 case from each client.
  // When a specific category is selected, display all 3 cases of that client.
  const filteredCases = activeTab === "todos"
    ? (() => {
        const seen = new Set<string>();
        return PORTFOLIO_CASES.filter(c => {
          if (!seen.has(c.category)) {
            seen.add(c.category);
            return true;
          }
          return false;
        });
      })()
    : PORTFOLIO_CASES.filter(c => c.category === activeTab);

  // Simulate progress when a case is open in the player
  useEffect(() => {
    if (selectedCase && isPlaying) {
      setVideoProgress(0);
      setActiveCaptionIndex(0);
      
      // Split captions for step-by-step display
      const words = selectedCase.videoCaption.split(". ");
      
      const intervalDuration = 100; // updates every 100ms
      const totalSteps = (selectedCase.videoDurationSeconds * 1000) / intervalDuration;
      let stepCount = 0;

      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);

      simulationIntervalRef.current = setInterval(() => {
        stepCount++;
        const percent = Math.min((stepCount / totalSteps) * 100, 100);
        setVideoProgress(percent);

        // Update active caption index based on percentage
        const sectionSize = 100 / words.length;
        const index = Math.min(Math.floor(percent / sectionSize), words.length - 1);
        setActiveCaptionIndex(index);

        // Slow increase of fake live views
        if (Math.random() > 0.7) {
          setSimulationViews(prev => prev + Math.floor(Math.random() * 3) + 1);
        }

        if (percent >= 100) {
          // Loop video progress
          stepCount = 0;
          setVideoProgress(0);
          setActiveCaptionIndex(0);
        }
      }, intervalDuration);
    } else {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    }

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
    };
  }, [selectedCase, isPlaying]);

  // Open simulated video case modal
  const handleOpenCase = (c: PortfolioCase) => {
    setSelectedCase(c);
    setIsPlaying(true);
    setSimulationViews(Math.floor(Math.random() * 5000) + 8000);
  };

  // Form Submission
  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newLead = {
      ...formData,
      id: Date.now().toString(),
      date: new Date().toLocaleString("pt-BR")
    };
    
    const updatedLeads = [newLead, ...leadsList];
    setLeadsList(updatedLeads);
    localStorage.setItem("ana_flavia_leads", JSON.stringify(updatedLeads));
    setFormSubmitted(true);

    // Send to Cloudflare Pages D1 Database (Serverless Backend)
    fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLead)
    }).then(response => {
      if (!response.ok) {
        console.warn("Backend submission failed, saved locally instead.");
      } else {
        console.log("Successfully stored lead in D1 Database via Cloudflare Pages Function!");
      }
    }).catch(err => {
      console.warn("Network error submitting lead to database. Saved locally.", err);
    });

    // Prefill WhatsApp link and trigger redirect after short delay or via direct button
    const whatsappText = encodeURIComponent(
      `Olá Ana Flávia! Meu nome é ${formData.name} da empresa ${formData.company}. Vi seu portfólio profissional de Marketing & UGC e gostaria de agendar uma consulta sobre nossa estratégia de conteúdo no segmento de ${formData.segment}.`
    );
    const whatsappUrl = `https://wa.me/5535998992647?text=${whatsappText}`;
    
    // Automatically open in tab
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 1200);
  };

  // Clear leads helper
  const handleClearLeads = () => {
    localStorage.removeItem("ana_flavia_leads");
    setLeadsList([]);

    // Clear Cloudflare Pages D1 Database
    fetch("/api/leads", {
      method: "DELETE"
    }).then(response => {
      if (response.ok) {
        console.log("All database leads cleared successfully.");
      }
    }).catch(err => {
      console.warn("Could not clear leads from Cloudflare database.", err);
    });
  };

  // ROI calculations
  // UGC generally delivers 3.2% CTR and 2.5x higher conversion than static standard ads.
  // Each UGC video corresponds to R$ 200, starting from R$ 400 (which gives 2 UGC videos)
  const estimatedVideos = Math.max(2, Math.floor(budget / 200));
  const estimatedViews = estimatedVideos * 12500;
  // Adjusted to include a realistic conversion rate from views to purchases (CTR of 2.2% * Landing Page Conversion of 2.0%)
  const estimatedConversions = Math.round((estimatedViews * 0.022 * 0.02) * nicheConversionFactor);
  const estimatedRevenue = estimatedConversions * ticket;
  const roas = (estimatedRevenue / budget).toFixed(1);

  return (
    <div className="min-h-screen bg-brand-olive-50 text-brand-olive-900 overflow-x-hidden font-sans">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-brand-olive-50/80 backdrop-blur-md border-b border-brand-olive-100 px-4 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-brand-olive-900 group-hover:text-brand-gold-500 transition-colors">
              {SITE_COPY.header.brandName} <span className="text-brand-gold-500 italic">{SITE_COPY.header.brandSurname}</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-sm font-semibold text-brand-olive-700 hover:text-brand-olive-900 transition-colors">{SITE_COPY.header.nav.about}</a>
            <a href="#portfolio" className="text-sm font-semibold text-brand-olive-700 hover:text-brand-olive-900 transition-colors">{SITE_COPY.header.nav.portfolioUgc}</a>
            <a href="#servicos" className="text-sm font-semibold text-brand-olive-700 hover:text-brand-olive-900 transition-colors">{SITE_COPY.header.nav.services}</a>
            <a href="#calculadora" className="text-sm font-semibold text-brand-olive-700 hover:text-brand-olive-900 transition-colors">{SITE_COPY.header.nav.calculator}</a>
            <a href="#contato" className="text-sm font-semibold text-brand-olive-700 hover:text-brand-olive-900 transition-colors">{SITE_COPY.header.nav.contact}</a>
          </nav>

          {/* CTA Header Button */}
          <div>
            <a 
              href="#contato" 
              className="inline-flex items-center justify-center px-4 py-2 text-xs md:text-sm font-bold tracking-wide uppercase bg-brand-olive-900 text-brand-olive-50 hover:bg-brand-gold-500 hover:text-brand-olive-900 transition-all rounded-full border border-brand-olive-800 shadow-sm"
              id="header-cta-btn"
            >
              {SITE_COPY.header.ctaButton}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 border-b border-brand-olive-100">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold-300/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-olive-500/10 rounded-full blur-2xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-olive-100 border border-brand-olive-300 rounded-full text-brand-olive-800 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="h-3 w-3 text-brand-gold-500 animate-pulse" />
              {SITE_COPY.hero.badge}
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-olive-900 leading-[1.1]">
              {SITE_COPY.hero.titlePrimary} <span className="italic text-brand-gold-500 font-medium relative inline-block">
                {SITE_COPY.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-brand-olive-700 leading-relaxed max-w-2xl">
              {SITE_COPY.hero.description}
            </p>

            {/* Quick Metrics highlights */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-brand-olive-100">
              {SITE_COPY.hero.metrics.map((metric, i) => (
                <div key={i} className={i > 0 ? "border-l border-brand-olive-100 pl-4" : ""}>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-brand-olive-900">{metric.value}</div>
                  <div className="text-xs text-brand-olive-600 font-medium uppercase tracking-wider">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a 
                href="#portfolio" 
                className="inline-flex items-center justify-center px-6 py-3.5 bg-brand-olive-900 text-brand-olive-50 hover:bg-brand-gold-500 hover:text-brand-olive-900 transition-all font-bold tracking-wide text-sm rounded-lg shadow-md hover:shadow-lg text-center"
              >
                {SITE_COPY.hero.ctaExplore}
                <Smartphone className="ml-2 h-4 w-4" />
              </a>
              <a 
                href="#contato" 
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-brand-olive-900 hover:bg-brand-olive-100 transition-all font-bold tracking-wide text-sm rounded-lg border border-brand-olive-300 text-center"
              >
                {SITE_COPY.hero.ctaProposal}
                <ArrowRight className="ml-2 h-4 w-4 text-brand-gold-500" />
              </a>
            </div>
          </div>

          {/* Right Column Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Background design accents */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-brand-gold-500 to-brand-olive-700 opacity-20 blur-xl" />
            
            <div className="relative bg-brand-olive-800 rounded-2xl p-3 shadow-2xl max-w-sm sm:max-w-md w-full border border-brand-olive-700 overflow-hidden">
              <div className="absolute top-4 left-4 z-10 bg-brand-olive-900/90 text-brand-gold-500 text-[10px] uppercase tracking-widest font-mono font-bold px-3 py-1 rounded-full border border-brand-gold-500/30 backdrop-blur-sm">
                {SITE_COPY.hero.portraitLabel}
              </div>
              
              {/* Ana Flavia Portrait */}
              <img 
                src={IMAGES.heroPortrait} 
                alt="Ana Flávia Franco" 
                className="w-full h-[380px] sm:h-[420px] object-cover rounded-xl grayscale-[15%] hover:grayscale-0 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Overlaid Floating Metrics */}
              <div className="absolute bottom-6 right-6 left-6 bg-brand-olive-950/90 border border-brand-olive-700 p-4 rounded-xl backdrop-blur-md text-brand-olive-100 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold tracking-wide text-brand-gold-300">Ana Flávia Franco</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingUp className="h-2.5 w-2.5" /> ATIVA
                  </span>
                </div>
                <p className="text-xs text-brand-olive-50 font-medium">
                  "{SITE_COPY.hero.floatingQuote}"
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Brand Carousel / Clients List */}
      <section className="bg-brand-olive-900 py-10 text-brand-olive-100 overflow-hidden border-y border-brand-olive-800 relative">
        {/* Subtle decorative gradient fades on the edges */}
        <div className="absolute left-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-r from-brand-olive-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-16 sm:w-24 bg-gradient-to-l from-brand-olive-900 to-transparent z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-brand-gold-400 font-bold max-w-2xl mx-auto leading-relaxed">
            {SITE_COPY.clients.title}
          </p>
        </div>

        {/* Outer scrolling marquee container */}
        <div className="w-full relative select-none">
          <div 
            className={`animate-marquee flex gap-6 ${isCarouselPaused ? "paused" : ""}`}
            onMouseEnter={() => setIsCarouselPaused(true)}
            onMouseLeave={() => setIsCarouselPaused(false)}
          >
            {/* Duplicate array multiple times to ensure seamless infinite looping */}
            {[...CLIENTS, ...CLIENTS, ...CLIENTS].map((client, i) => (
              <div 
                key={i} 
                onClick={() => {
                  setActiveTab(client.category);
                  document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex items-center gap-4 bg-brand-olive-800/40 border border-brand-olive-700/60 hover:border-brand-gold-500/60 hover:bg-brand-olive-800/90 px-5 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer min-w-[260px] sm:min-w-[290px] shrink-0 shadow-md"
              >
                {/* Real representation image for the client's business */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-brand-olive-700/50 shadow-md">
                  <img 
                    src={client.image} 
                    alt={client.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>

                <div className="text-left flex-1 min-w-0">
                  <div className="text-xs font-bold text-brand-olive-100 group-hover:text-brand-gold-300 transition-colors duration-300 truncate">
                    {client.name}
                  </div>
                  <div className="text-[9px] text-brand-gold-400 font-extrabold tracking-wider uppercase mt-1 flex items-center gap-1 transition-colors duration-300 group-hover:text-brand-gold-300">
                    <span>{SITE_COPY.clients.partnerLabel}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-brand-gold-400 shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-24 bg-white border-b border-brand-olive-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image & Location Column */}
            <div className="lg:col-span-5 relative">
              <div className="absolute top-0 right-0 w-72 h-72 bg-brand-gold-300/10 rounded-full blur-3xl -z-10" />
              <div className="relative rounded-2xl overflow-hidden border border-brand-olive-100 shadow-xl">
                <img 
                  src={IMAGES.aboutOffice} 
                  alt="Aesthetic workspace" 
                  className="w-full h-[320px] md:h-[400px] object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Accent */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-brand-olive-50">
                  <div className="flex items-center gap-2 text-brand-gold-400 text-xs font-bold uppercase tracking-widest mb-1">
                    <Award className="h-4 w-4" /> Produção Profissional
                  </div>
                  <p className="text-xs text-stone-300">
                    Produção com equipamentos modernos e aplicativos especializados.
                  </p>
                </div>
              </div>
            </div>

            {/* About Text Column */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <div className="space-y-3">
                <h3 className="text-brand-gold-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                  <User className="h-3 w-3" /> {SITE_COPY.about.badge}
                </h3>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-olive-900 leading-tight">
                  {SITE_COPY.about.greeting} <span className="font-serif italic font-normal text-brand-gold-500">{SITE_COPY.about.greetingHighlight}</span>
                </h2>
              </div>

              <div className="text-brand-olive-800 space-y-4 text-base leading-relaxed">
                <p>
                  {SITE_COPY.about.paragraph1}
                </p>
                <p>
                  {SITE_COPY.about.paragraph2}
                </p>
                <p>
                  {SITE_COPY.about.paragraph3}
                </p>
              </div>

              {/* Focus Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {SITE_COPY.about.pillars.map((pillar, i) => {
                  const Icon = i === 0 ? Target : Film;
                  return (
                    <div 
                      key={i} 
                      className="flex gap-4 p-5 bg-brand-gold-500 text-brand-olive-950 rounded-2xl border border-brand-gold-400/30 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-olive-950 text-brand-gold-300 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold tracking-wide text-brand-olive-950">{pillar.title}</h4>
                        <p className="text-xs text-brand-olive-900/90 font-medium mt-1 leading-relaxed">{pillar.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <a 
                  href="#portfolio" 
                  className="inline-flex items-center gap-2 text-brand-olive-900 font-bold text-sm hover:text-brand-gold-500 transition-colors group"
                >
                  {SITE_COPY.about.ctaPortfolio} 
                  <ArrowRight className="h-4 w-4 text-brand-gold-500 group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Portfólio de Vídeo UGC Section */}
      <section id="portfolio" className="py-16 md:py-24 bg-brand-olive-50 border-b border-brand-olive-100">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 md:mb-16">
            <h3 className="text-brand-gold-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <Video className="h-3.5 w-3.5 animate-pulse" /> {SITE_COPY.portfolio.badge}
            </h3>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-olive-900 leading-tight">
              {SITE_COPY.portfolio.title} <span className="italic font-serif text-brand-gold-500 font-medium">{SITE_COPY.portfolio.titleHighlight}</span> {SITE_COPY.portfolio.titleEnd}
            </h2>
            <p className="text-sm sm:text-base text-brand-olive-700">
              {SITE_COPY.portfolio.description}
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {[
                { id: "todos", label: "Todos os Cases" },
                { id: "moda", label: "Moda & Vestuário" },
                { id: "beleza", label: "Beleza & Estética" },
                { id: "joias", label: "Joias & Acessórios" },
                { id: "educacao", label: "Educação Particular" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? "bg-brand-olive-900 text-brand-olive-50 border-brand-olive-900 shadow-md"
                      : "bg-white text-brand-olive-700 border-brand-olive-200 hover:bg-brand-olive-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cases grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCases.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-brand-olive-900 rounded-2xl overflow-hidden border border-brand-olive-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top category label */}
                  <div className="absolute top-3 left-3 z-10 bg-black/70 border border-brand-olive-700 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-brand-gold-400 uppercase tracking-widest font-bold">
                    {c.categoryLabel}
                  </div>

                  {/* Image cover styled like a stories cover */}
                  <div className="relative aspect-[9/16] w-full overflow-hidden bg-brand-olive-950">
                    <img 
                      src={c.coverImage} 
                      alt={c.clientName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient cover for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-olive-950 via-brand-olive-950/20 to-transparent opacity-80" />

                    {/* Simulation Play Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-brand-gold-500 text-brand-olive-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 border border-brand-gold-300">
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Instagram Reels HUD Overlay */}
                    <div className="absolute bottom-4 inset-x-4 text-brand-olive-50 flex flex-col justify-end space-y-1.5 pointer-events-none">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-olive-100 text-brand-olive-900 font-bold text-[9px] flex items-center justify-center border border-brand-gold-500">
                          {c.clientName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-white shadow-sm">{c.instagramHandle}</span>
                      </div>
                      
                      {/* Short simulated caption */}
                      <p className="text-[11px] leading-snug text-brand-olive-100 line-clamp-2 drop-shadow-md">
                        {c.videoCaption}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-stone-300 pt-1.5 font-mono">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> {c.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-brand-gold-400" /> {c.comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Brief info card bottom */}
                  <div className="p-4 bg-brand-olive-950 text-brand-olive-50 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-base font-bold text-brand-gold-400">{c.clientName}</h4>
                      <p className="text-xs text-brand-olive-300 line-clamp-2 mt-1">{c.description}</p>
                    </div>
                    
                    <button
                      onClick={() => handleOpenCase(c)}
                      className="w-full py-2 bg-brand-olive-800 hover:bg-brand-gold-500 hover:text-brand-olive-900 text-brand-olive-100 text-xs font-bold uppercase tracking-wider rounded-lg border border-brand-olive-700 transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      {SITE_COPY.portfolio.cardCta} <MousePointerClick className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-center mt-10">
            <p className="text-xs text-brand-olive-600 font-semibold italic">
              {SITE_COPY.portfolio.disclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Reels Player & Insights Modal */}
      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-brand-olive-900 rounded-2xl max-w-4xl w-full border border-brand-olive-700 text-brand-olive-100 shadow-2xl overflow-hidden my-8"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-brand-gold-500 hover:text-brand-olive-900 flex items-center justify-center border border-brand-olive-700 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* Smartphone Reel Player Simulator Column */}
                <div className="md:col-span-5 bg-black p-4 sm:p-6 flex justify-center items-center border-b md:border-b-0 md:border-r border-brand-olive-800">
                  
                  {/* Smartphone Frame Container */}
                  <div className="relative w-full max-w-[280px] aspect-[9/19] rounded-[36px] border-4 border-brand-olive-700 bg-brand-olive-950 overflow-hidden shadow-2xl flex flex-col justify-between">
                    
                    {/* Notch */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-black z-30 rounded-b-xl flex items-center justify-center">
                      <div className="w-16 h-2 rounded-full bg-brand-olive-800" />
                    </div>

                    {/* Progress Bar Header */}
                    <div className="absolute top-5 inset-x-3 h-0.5 bg-brand-olive-800 z-20 overflow-hidden rounded-full">
                      <div 
                        className="h-full bg-brand-gold-500 transition-all duration-100"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>

                    {/* Top User Info HUD */}
                    <div className="absolute top-8 inset-x-3 z-20 flex items-center justify-between text-brand-olive-50">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-brand-gold-500 text-brand-olive-900 font-bold text-[10px] flex items-center justify-center border border-white">
                          A
                        </div>
                        <div className="text-[10px] font-bold">
                          <div>{selectedCase.instagramHandle}</div>
                          <div className="text-[8px] text-stone-400">Patrocinado</div>
                        </div>
                      </div>
                      <span className="text-[9px] bg-brand-gold-500 text-brand-olive-900 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">UGC</span>
                    </div>

                    {/* Simulated Media Player Container */}
                    <div className="relative flex-grow flex items-center justify-center bg-brand-olive-950 overflow-hidden">
                      {/* Zooming background representing video */}
                      <img 
                        src={selectedCase.coverImage} 
                        alt="Reels video"
                        className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-transform ${isPlaying ? 'scale-105 duration-[20s]' : 'scale-100'} ease-out`}
                        referrerPolicy="no-referrer"
                      />

                      {/* Playing overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/30 opacity-75" />

                      {/* Simulated typing subtitles overlay based on play position */}
                      <div className="absolute inset-x-4 text-center z-10 px-2 space-y-2">
                        <div className="inline-block bg-black/60 border border-brand-gold-500/30 text-white rounded-lg px-3 py-2 backdrop-blur-md">
                          <p className="text-xs font-serif leading-relaxed italic text-brand-gold-300">
                            "{selectedCase.videoCaption.split(". ")[activeCaptionIndex] || selectedCase.videoCaption}"
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500 animate-ping" />
                          <span className="text-[8px] font-mono tracking-widest text-brand-gold-400 font-bold uppercase">ÁUDIO ORIGINAL</span>
                        </div>
                      </div>

                      {/* Hover controls info */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex gap-4">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="w-12 h-12 rounded-full bg-black/60 hover:bg-brand-gold-500 hover:text-brand-olive-900 flex items-center justify-center transition-all border border-brand-olive-700 cursor-pointer shadow-lg"
                        >
                          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                        </button>
                        <button 
                          onClick={() => setIsMuted(!isMuted)}
                          className="w-12 h-12 rounded-full bg-black/60 hover:bg-brand-gold-500 hover:text-brand-olive-900 flex items-center justify-center transition-all border border-brand-olive-700 cursor-pointer shadow-lg"
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                      </div>

                      {/* Soundwave representation */}
                      {isPlaying && (
                        <div className="absolute bottom-20 inset-x-0 flex items-end justify-center gap-0.5 h-6 z-10 opacity-60">
                          <div className="w-0.5 h-2 bg-brand-gold-500 animate-[bounce_0.6s_infinite_0.1s]" />
                          <div className="w-0.5 h-5 bg-brand-gold-500 animate-[bounce_0.6s_infinite_0.3s]" />
                          <div className="w-0.5 h-3 bg-brand-gold-500 animate-[bounce_0.6s_infinite_0.2s]" />
                          <div className="w-0.5 h-4 bg-brand-gold-500 animate-[bounce_0.6s_infinite_0.5s]" />
                          <div className="w-0.5 h-1 bg-brand-gold-500 animate-[bounce_0.6s_infinite_0.4s]" />
                          <div className="w-0.5 h-3 bg-brand-gold-500 animate-[bounce_0.6s_infinite_0.1s]" />
                          <div className="w-0.5 h-5 bg-brand-gold-500 animate-[bounce_0.6s_infinite_0.3s]" />
                        </div>
                      )}
                    </div>

                    {/* Reels Bottom Interactive Overlay */}
                    <div className="p-3 bg-black z-20 space-y-1.5 border-t border-brand-olive-900">
                      <div className="flex items-center justify-between text-[10px] text-stone-300">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5"><Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> {selectedCase.likes}</span>
                          <span className="flex items-center gap-0.5"><MessageCircle className="h-3 w-3 text-brand-gold-400" /> {selectedCase.comments}</span>
                        </div>
                        <span className="font-mono text-brand-gold-500 font-semibold">{simulationViews.toLocaleString("pt-BR")} visualizações</span>
                      </div>
                      <a 
                        href={selectedCase.instagramUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full py-1.5 bg-brand-olive-900 hover:bg-brand-gold-500 hover:text-brand-olive-900 transition-colors text-center text-[9px] uppercase tracking-wider font-bold text-brand-gold-400 block rounded border border-brand-gold-500/20"
                      >
                        Ver no Instagram Original
                      </a>
                    </div>

                  </div>

                </div>

                {/* Case Insights Column */}
                <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest bg-brand-olive-800 border border-brand-olive-700 px-3 py-1 rounded text-brand-gold-400">
                        {SITE_COPY.modal.badge}
                      </span>
                      <span className="text-xs text-brand-olive-300 italic">
                        {SITE_COPY.modal.nichePrefix} {selectedCase.categoryLabel}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                      Campanha {selectedCase.clientName}
                    </h2>

                    <p className="text-sm text-brand-olive-300 leading-relaxed mt-3">
                      {selectedCase.description}
                    </p>

                    {/* Stats Badges */}
                    <div className="grid grid-cols-2 gap-3 my-5">
                      <div className="p-3 bg-brand-olive-850 rounded-xl border border-brand-olive-800 text-left">
                        <div className="text-[10px] text-brand-olive-400 uppercase tracking-widest font-bold">{SITE_COPY.modal.likesLabel}</div>
                        <div className="font-serif text-xl font-bold text-brand-gold-400 mt-1">{selectedCase.likes}</div>
                      </div>
                      <div className="p-3 bg-brand-olive-850 rounded-xl border border-brand-olive-800 text-left">
                        <div className="text-[10px] text-brand-olive-400 uppercase tracking-widest font-bold">{SITE_COPY.modal.commentsLabel}</div>
                        <div className="font-serif text-xl font-bold text-brand-gold-400 mt-1">{selectedCase.comments}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold-500 flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" /> {SITE_COPY.modal.strategyTitle}
                      </h4>
                      <ul className="space-y-2">
                        {selectedCase.details.map((detail, idx) => (
                          <li key={idx} className="flex gap-2 text-xs sm:text-sm text-brand-olive-200">
                            <Check className="h-4 w-4 text-brand-gold-500 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* B2B Contact Pitch inside Modal */}
                  <div className="pt-6 border-t border-brand-olive-800 space-y-4">
                    <p className="text-xs text-brand-olive-300">
                      {SITE_COPY.modal.pitch}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href={`https://wa.me/5535998992647?text=Olá Ana Flávia! Vi seu Estudo de Caso para ${selectedCase.clientName} e gostaria de solicitar uma proposta similar para minha empresa.`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 py-3 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-olive-900 font-bold text-xs uppercase tracking-wider rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        {SITE_COPY.modal.ctaWhatsapp} <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                      <button 
                        onClick={() => {
                          setSelectedCase(null);
                          // Scroll to contact form
                          document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="px-4 py-3 bg-brand-olive-800 hover:bg-brand-olive-750 text-brand-olive-100 font-bold text-xs uppercase tracking-wider rounded-lg text-center transition-colors border border-brand-olive-700 cursor-pointer"
                      >
                        {SITE_COPY.modal.ctaDirect}
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Services and Products Section (Bento Grid) */}
      <section id="servicos" className="py-16 md:py-24 bg-white border-b border-brand-olive-100">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h3 className="text-brand-gold-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <Briefcase className="h-3.5 w-3.5" /> {SITE_COPY.servicesAndProducts.badge}
            </h3>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-brand-olive-900">
              {SITE_COPY.servicesAndProducts.title} <span className="italic font-serif text-brand-gold-500 font-medium">{SITE_COPY.servicesAndProducts.titleHighlight}</span>
            </h2>
            <p className="text-sm sm:text-base text-brand-olive-700">
              {SITE_COPY.servicesAndProducts.description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* SERVICES COLUMN */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-brand-olive-100">
                <h3 className="font-serif text-2xl font-bold text-brand-olive-900 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-brand-olive-900 rounded-full" />
                  {SITE_COPY.servicesAndProducts.servicesTitle}
                </h3>
                <span className="text-xs font-bold text-brand-gold-500 uppercase tracking-widest">{SITE_COPY.servicesAndProducts.servicesSubtitle}</span>
              </div>

              <div className="space-y-4">
                {SERVICES.map((s) => (
                  <div 
                    key={s.id} 
                    className="p-4 bg-brand-olive-50 hover:bg-brand-olive-100/60 rounded-xl border border-brand-olive-100/80 transition-all duration-300 hover:translate-x-1 group flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-olive-900 text-brand-gold-500 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner group-hover:bg-brand-gold-500 group-hover:text-brand-olive-900 transition-colors">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-olive-900 group-hover:text-brand-gold-500 transition-colors">{s.name}</h4>
                      <p className="text-xs text-brand-olive-700 mt-1 leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRODUCTS COLUMN */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-brand-olive-100">
                <h3 className="font-serif text-2xl font-bold text-brand-olive-900 flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-brand-gold-500 rounded-full" />
                  {SITE_COPY.servicesAndProducts.productsTitle}
                </h3>
                <span className="text-xs font-bold text-brand-olive-600 uppercase tracking-widest">{SITE_COPY.servicesAndProducts.productsSubtitle}</span>
              </div>

              <div className="space-y-4">
                {PRODUCTS.map((p) => (
                  <div 
                    key={p.id} 
                    className="p-4 bg-white hover:bg-brand-olive-50 rounded-xl border border-brand-olive-100 hover:border-brand-gold-500/40 transition-all duration-300 hover:translate-x-1 group flex items-start gap-4 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-gold-400/20 text-brand-gold-500 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner group-hover:bg-brand-gold-500 group-hover:text-brand-olive-900 transition-colors">
                      ★
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-olive-900 group-hover:text-brand-gold-500 transition-colors">{p.name}</h4>
                      <p className="text-xs text-brand-olive-700 mt-1 leading-relaxed">{p.description}</p>
                    </div>
                  </div>
                ))}

                {/* B2B Special Package Promotion Card */}
                <div className="p-6 bg-brand-olive-900 rounded-xl border border-brand-olive-800 text-brand-olive-100 text-center space-y-4 relative overflow-hidden mt-6 shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold-500/10 rounded-full blur-xl" />
                  <div className="inline-flex px-3 py-1 bg-brand-gold-500 text-brand-olive-900 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
                    {SITE_COPY.servicesAndProducts.b2bPromo.badge}
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white">{SITE_COPY.servicesAndProducts.b2bPromo.title}</h4>
                  <p className="text-xs text-brand-olive-300 leading-relaxed max-w-md mx-auto">
                    {SITE_COPY.servicesAndProducts.b2bPromo.description}
                  </p>
                  <a 
                    href="#contato" 
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-olive-900 text-xs font-bold uppercase tracking-wider rounded-full transition-colors"
                  >
                    {SITE_COPY.servicesAndProducts.b2bPromo.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Portfólio de Designs Section */}
      <section className="py-16 bg-brand-olive-50 border-b border-brand-olive-100">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-xl mx-auto space-y-4 mb-12">
            <h3 className="text-brand-gold-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <Award className="h-3.5 w-3.5" /> {SITE_COPY.designs.badge}
            </h3>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-brand-olive-900">
              {SITE_COPY.designs.title}
            </h2>
            <p className="text-xs sm:text-sm text-brand-olive-700">
              {SITE_COPY.designs.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DESIGNS.map((d) => {
              const isLight = d.id === "d1";
              const isActive = highlightedDesignId === d.id;
              return (
                <div 
                  key={d.id} 
                  onMouseEnter={() => {
                    setIsDesignHovered(true);
                    setHighlightedDesignId(d.id);
                  }}
                  onMouseLeave={() => {
                    setIsDesignHovered(false);
                  }}
                  className={`group relative flex flex-col justify-between min-h-[500px] rounded-3xl overflow-hidden border isolate p-5 transition-all duration-500 ${
                    isActive 
                      ? "border-brand-gold-500/90 shadow-2xl -translate-y-2.5 scale-[1.015] ring-2 ring-brand-gold-400/20" 
                      : "border-brand-olive-200/30 shadow-md hover:shadow-xl hover:-translate-y-1"
                  } ${
                    isLight 
                      ? "bg-stone-50 text-stone-900" 
                      : "bg-white text-stone-250"
                  }`}
                >
                  {/* Smartphone screen backlight gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${d.color} opacity-100 transition-transform duration-700 -z-10 ${
                    isActive ? "scale-[1.04]" : "scale-100 group-hover:scale-[1.02]"
                  }`} />
                  
                  {/* Top Phone Interface / Header simulation */}
                  <div className="space-y-3">
                    {/* Phone status bar decoration with client's Instagram */}
                    <div className={`flex items-center justify-between text-[10px] ${
                      isLight 
                        ? (isActive ? "text-stone-950 font-semibold border-stone-800/30" : "text-stone-800/60 border-stone-800/10") 
                        : (isActive ? "text-brand-gold-300 font-semibold border-brand-gold-500/20" : "text-white/40 border-white/10")
                    } font-mono tracking-wider border-b pb-2 transition-colors duration-500`}>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isActive 
                            ? "bg-brand-gold-400 animate-ping" 
                            : (isLight ? "bg-stone-600 animate-pulse" : "bg-emerald-400 animate-pulse")
                        }`} />
                        <span className={`font-semibold ${
                          isActive 
                            ? "text-brand-gold-400" 
                            : (isLight ? "text-stone-800" : "text-white/50")
                        } transition-colors duration-500`}>{d.handle}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isActive && !isDesignHovered && (
                          <span className="text-[8px] uppercase tracking-widest text-brand-gold-400 animate-pulse mr-1">AUTO</span>
                        )}
                        <Instagram className={`h-3.5 w-3.5 transition-colors duration-500 ${
                          isActive ? "text-brand-gold-400 scale-110" : (isLight ? "text-stone-800" : "text-white/50")
                        }`} />
                      </div>
                    </div>

                    {/* Middle Mock Post Design Canvas (Realistic Social Media Layout) */}
                    <div className={`relative h-44 rounded-xl overflow-hidden shadow-inner flex flex-col justify-between p-4 border transition-all duration-500 ${
                      isActive 
                        ? (isLight ? "border-[#bfb1d1]/60 bg-white/40 shadow-md scale-[1.01]" : "border-white/20 bg-black/25 shadow-md scale-[1.01]") 
                        : (isLight ? "border-stone-800/15 bg-white/25" : "border-white/10 bg-black/15")
                    }`}>
                      
                      {/* Brand-specific visual elements */}
                      {d.id === "d1" && (
                        <>
                          {/* Studio 360 lashes visual effect with beautiful soft center */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,192,212,0.35)_0%,transparent_75%)]" />
                          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-[#bfb1d1]/50 rounded-full flex items-center justify-center transition-transform duration-1000 ${isActive ? "rotate-45 scale-110" : ""}`}>
                            <div className="w-24 h-24 border border-dashed border-[#bfb1d1]/30 rounded-full" />
                          </div>
                          {/* Small sparkling icon */}
                          <Sparkles className="absolute top-3 right-3 h-4 w-4 text-[#bfb1d1] animate-pulse" />
                        </>
                      )}

                      {d.id === "d2" && (
                        <>
                          {/* Luluzinha delicate golden border frame */}
                          <div className="absolute inset-2 border border-[#D4AF37]/40 rounded-lg pointer-events-none" />
                          <div className="absolute inset-3 border border-double border-[#D4AF37]/25 rounded-md pointer-events-none" />
                        </>
                      )}

                      {d.id === "d3" && (
                        <>
                          {/* Colégio Del Rey school design accent */}
                          <div className="absolute top-0 right-0 w-24 h-full bg-[#F39C12] -skew-x-[35deg] origin-top opacity-20 pointer-events-none" />
                          <div className="absolute bottom-0 left-0 w-16 h-4 bg-[#F39C12] rounded-r opacity-90" />
                        </>
                      )}

                      {d.id === "d4" && (
                        <>
                          {/* Milu Tecidos fabric wave effect */}
                          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#F7EBE1]/10 rounded-full blur-md" />
                          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#8B1C33] rounded-full mix-blend-color-dodge opacity-25" />
                        </>
                      )}

                      {/* Header with Client Name inside post */}
                      <div className="z-10 flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full ${d.brandColors[2].bgClass} text-stone-900 font-bold text-[8px] flex items-center justify-center shadow-sm`}>
                          {d.client.substring(0, 1)}
                        </div>
                        <span className={`text-[9px] font-bold ${isLight ? "text-stone-800" : "text-stone-200"} tracking-wide uppercase`}>{d.client}</span>
                      </div>

                      {/* Inner Text with real fonts */}
                      <div className="z-10 space-y-1">
                        <h4 className={`${d.fontClass} ${isLight ? "text-stone-900" : "text-white"} font-bold leading-tight drop-shadow-sm text-base tracking-wide`}>
                          {d.title}
                        </h4>
                        <p className={`text-[10px] ${isLight ? "text-stone-700 font-semibold" : "text-stone-200"} italic font-medium font-serif`}>
                          {d.subtitle}
                        </p>
                      </div>

                      {/* Small Bottom Status decoration */}
                      <div className={`z-10 flex justify-between text-[8px] ${isLight ? "text-stone-600" : "text-stone-400"} font-mono tracking-widest uppercase`}>
                        <span>TEMPLATE POST</span>
                        <span>{isActive ? "★ EM DESTAQUE" : "#FEEDORGANIZADO"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Brand Asset details below simulation screen */}
                  <div className={`space-y-4 pt-4 border-t ${
                    isLight 
                      ? (isActive ? "border-stone-800/20" : "border-stone-800/10") 
                      : (isActive ? "border-white/20" : "border-white/10")
                  } z-10`}>
                    
                    {/* Brand Color Palettes Display */}
                    <div className="space-y-1.5">
                      <div className={`flex items-center gap-1 text-[9px] font-bold tracking-wider ${
                        isLight ? "text-stone-600" : "text-stone-400"
                      } uppercase font-mono`}>
                        <Palette className={`h-3 w-3 ${isActive ? "text-brand-gold-400 animate-spin-slow" : "text-brand-gold-500"}`} /> Paleta de Cores
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {d.brandColors.map((color, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-1 ${
                              isLight 
                                ? (isActive ? "bg-white border-stone-300 shadow-sm" : "bg-white border-stone-200/80") 
                                : (isActive ? "bg-black/45 border-white/15" : "bg-black/30 border-white/5")
                            } border py-0.5 px-2 rounded-full text-[9px] ${
                              isLight ? "text-stone-800 font-semibold" : "text-stone-300"
                            } font-mono font-medium transition-all duration-300`}
                          >
                            <span className={`w-2.5 h-2.5 rounded-full ${color.bgClass} shadow-sm border border-black/10 shrink-0`} />
                            <span>{color.name}</span>
                            <span className="text-[8px] text-stone-500 font-semibold">{color.hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Brand Typography Details */}
                    <div className={`grid grid-cols-2 gap-2 ${
                      isLight 
                        ? (isActive ? "bg-stone-200/50 border-stone-300" : "bg-stone-100 border-stone-200") 
                        : (isActive ? "bg-black/30 border-white/10" : "bg-black/20 border-white/5")
                    } p-2.5 rounded-xl border text-left transition-colors duration-500`}>
                      <div className="space-y-0.5">
                        <div className={`flex items-center gap-1 text-[8px] font-bold tracking-wider ${isLight ? "text-stone-600" : "text-stone-400"} uppercase font-mono`}>
                          <Type className="h-2.5 w-2.5 text-brand-gold-500" /> Tipografia
                        </div>
                        <div className={`text-[9px] ${isLight ? "text-stone-900 font-bold" : "text-stone-200 font-semibold"} truncate`}>{d.typography}</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className={`flex items-center gap-1 text-[8px] font-bold tracking-wider ${isLight ? "text-stone-600" : "text-stone-400"} uppercase font-mono`}>
                          <Layers className="h-2.5 w-2.5 text-brand-gold-500" /> Diretriz Visual
                        </div>
                        <div className={`text-[9px] ${isLight ? "text-stone-900 font-bold" : "text-stone-200 font-semibold"} truncate`} title={d.visualStyle}>
                          {d.visualStyle}
                        </div>
                      </div>
                    </div>

                    {/* Bottom details card (Glassmorphism) */}
                    <div className={`${
                      isLight 
                        ? (isActive ? "bg-white/90 border-brand-gold-500/40 shadow-sm" : "bg-stone-100 border-stone-200") 
                        : (isActive ? "bg-white/10 border-white/20 shadow-md" : "bg-white/5 border-white/10")
                    } border backdrop-blur-md p-3 rounded-xl text-left transition-all duration-500`}>
                      <p className={`text-[9px] ${
                        isLight ? "text-brand-gold-600 font-black" : "text-brand-gold-300 font-extrabold"
                      } uppercase tracking-wider`}>Objetivo de Design</p>
                      <p className={`text-[11px] ${
                        isLight ? "text-stone-800 font-semibold" : "text-stone-200"
                      } leading-relaxed font-medium mt-1`}>{d.description}</p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Interactive Campaign ROI Planner Section */}
      <section id="calculadora" className="py-16 md:py-24 bg-brand-olive-900 text-brand-olive-100 border-b border-brand-olive-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Info and stats Column */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-olive-850 border border-brand-olive-700 rounded-full text-brand-gold-400 text-xs font-bold tracking-wide uppercase">
                <Calculator className="h-3 w-3" /> {SITE_COPY.calculator.badge}
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                {SITE_COPY.calculator.title}
              </h2>

              <p className="text-sm sm:text-base text-brand-olive-300 leading-relaxed">
                {SITE_COPY.calculator.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-gold-500 text-brand-olive-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p className="text-xs sm:text-sm text-brand-olive-200">
                    <strong>Audiência Retida:</strong> UGC retém até 5x mais a atenção nos primeiros 3 segundos do que anúncios tradicionais.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-gold-500 text-brand-olive-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <p className="text-xs sm:text-sm text-brand-olive-200">
                    <strong>Alta Conversão:</strong> Empresas que adotam UGC no funil veem em média um incremento de 42% no ROAS de mídia paga.
                  </p>
                </div>
              </div>

              {/* Conversion chart comparison */}
              <div className="p-4 bg-brand-olive-850 rounded-xl border border-brand-olive-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-gold-400">
                  Taxa Média de Conversão (E-commerce / Serviços)
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                      <span>Anúncios Estáticos Tradicionais (Estúdio Frio)</span>
                      <span>~0.8% a 1.2%</span>
                    </div>
                    <div className="h-2 bg-brand-olive-950 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-600 rounded-full" style={{ width: "25%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-brand-gold-400 font-bold mb-1">
                      <span>UGC Narrativo Estratégico (Ana Flávia Franco)</span>
                      <span>~2.2% a 3.6%</span>
                    </div>
                    <div className="h-2 bg-brand-olive-950 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-gold-500 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Applet Column */}
            <div className="lg:col-span-6 bg-brand-olive-850 p-6 sm:p-8 rounded-2xl border border-brand-olive-800 shadow-2xl space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-brand-olive-800 pb-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-brand-gold-400" />
                  {SITE_COPY.calculator.resultsTitle}
                </h3>
                <span className="text-[10px] text-brand-gold-400 font-mono tracking-widest font-bold">REAIS (R$)</span>
              </div>

              {/* Slider 1: Campaign Budget */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span>{SITE_COPY.calculator.labelBudget}</span>
                  <span className="text-brand-gold-400 font-bold text-base">R$ {budget.toLocaleString("pt-BR")}</span>
                </div>
                <input 
                  type="range" 
                  min="400" 
                  max="10000" 
                  step="100" 
                  value={budget} 
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-brand-gold-500 h-1.5 bg-brand-olive-950 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>R$ 400</span>
                  <span>R$ 10.000</span>
                </div>
              </div>

              {/* Slider 2: Average Ticket Price */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span>{SITE_COPY.calculator.labelPrice}</span>
                  <span className="text-brand-gold-400 font-bold text-base">R$ {ticket.toLocaleString("pt-BR")}</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="1000" 
                  step="10" 
                  value={ticket} 
                  onChange={(e) => setTicket(Number(e.target.value))}
                  className="w-full accent-brand-gold-500 h-1.5 bg-brand-olive-950 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>R$ 30</span>
                  <span>R$ 1.000</span>
                </div>
              </div>

              {/* Dropdown 3: Campaign Segment */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold block text-stone-200">{SITE_COPY.calculator.labelNiche}</label>
                <div className="relative">
                  <select 
                    onChange={(e) => setNicheConversionFactor(Number(e.target.value))}
                    className="w-full h-12 pl-4 pr-10 bg-brand-olive-950 border-2 border-brand-olive-700/80 text-white rounded-xl text-xs sm:text-sm font-extrabold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold-400 focus:ring-4 focus:ring-brand-gold-500/20 transition-all duration-300 shadow-md"
                  >
                    <option value="1.2" className="bg-brand-olive-950 text-stone-100 font-semibold py-2">{SITE_COPY.calculator.niches.moda}</option>
                    <option value="1.5" className="bg-brand-olive-950 text-stone-100 font-semibold py-2">{SITE_COPY.calculator.niches.joias}</option>
                    <option value="1.1" className="bg-brand-olive-950 text-stone-100 font-semibold py-2">{SITE_COPY.calculator.niches.beleza}</option>
                    <option value="0.9" className="bg-brand-olive-950 text-stone-100 font-semibold py-2">{SITE_COPY.calculator.niches.educacao}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-brand-gold-400">
                    <ChevronDown className="h-5 w-5 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Output stats display */}
              <div className="p-4 bg-brand-olive-950 rounded-xl border border-brand-olive-900 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{SITE_COPY.calculator.estimatedVideos}</div>
                  <div className="font-serif text-lg font-bold text-white mt-1">
                    {estimatedVideos} {estimatedVideos === 1 ? "Vídeo" : "Vídeos"} UGC
                  </div>
                  <div className="text-[9px] text-stone-500">Estratégia + Gravação + Edição</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{SITE_COPY.calculator.estimatedViews}</div>
                  <div className="font-serif text-lg font-bold text-brand-gold-400 mt-1">
                    ~{estimatedViews.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-[9px] text-stone-500">Estimativa conservadora</div>
                </div>
              </div>

              <div className="p-4 bg-brand-gold-500/10 rounded-xl border border-brand-gold-500/20 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-brand-gold-400 font-bold uppercase tracking-wider">{SITE_COPY.calculator.estimatedSales}</div>
                  <div className="font-serif text-xl font-bold text-white mt-1">
                    {estimatedConversions} conversões
                  </div>
                  <div className="text-[9px] text-brand-gold-400/80">CTR de 2.2% e CVR de 2.0%</div>
                </div>
                <div>
                  <div className="text-[10px] text-brand-gold-400 font-bold uppercase tracking-wider">{SITE_COPY.calculator.revenueLabel}</div>
                  <div className="font-serif text-xl font-bold text-emerald-400 mt-1">
                    R$ {estimatedRevenue.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-[9px] text-brand-gold-400/80">{SITE_COPY.calculator.returnLabel}: {roas}x</div>
                </div>
              </div>

              <button 
                onClick={() => {
                  // Prepopulate message
                  setFormData(prev => ({
                    ...prev,
                    message: `Olá Ana Flávia, utilizei o Simulador de Orçamento no seu site e planejei um orçamento aproximado de R$ ${budget} para o meu segmento. Gostaria de entender mais sobre as condições e fechar uma proposta!`
                  }));
                  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3.5 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-olive-900 font-extrabold text-xs uppercase tracking-wider rounded-lg text-center transition-colors shadow-lg flex items-center justify-center gap-1.5"
              >
                {SITE_COPY.calculator.callToAction} <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Contact & Lead Capture Section */}
      <section id="contato" className="py-16 md:py-24 bg-brand-olive-950 text-brand-olive-100 border-b border-brand-olive-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact Channels Column */}
            <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-brand-gold-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500 animate-ping" /> {SITE_COPY.contact.badge}
                  </h3>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-black leading-tight">
                    {SITE_COPY.contact.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-olive-300">
                    {SITE_COPY.contact.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  {/* WhatsApp */}
                  <a 
                    href="https://wa.me/5535998992647?text=Olá Ana Flávia, vi seu portfólio de UGC e gostaria de solicitar uma proposta."
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 bg-brand-olive-900 hover:bg-brand-olive-850 rounded-xl border border-brand-olive-800 hover:border-brand-gold-500/40 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-brand-olive-900 transition-colors shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">WhatsApp Comercial</h4>
                      <p className="text-sm font-semibold text-white mt-0.5">(35) 99899-2647</p>
                      <span className="text-[10px] text-brand-gold-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">Falar Agora <ArrowUpRight className="h-3 w-3" /></span>
                    </div>
                  </a>

                  {/* Email */}
                  <a 
                    href="mailto:aflaviafocodigital@gmail.com"
                    className="flex items-center gap-4 p-4 bg-brand-olive-900 hover:bg-brand-olive-850 rounded-xl border border-brand-olive-800 hover:border-brand-gold-500/40 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-brand-olive-900 transition-colors shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">E-mail Corporativo</h4>
                      <p className="text-sm font-semibold text-white mt-0.5">aflaviafocodigital@gmail.com</p>
                      <span className="text-[10px] text-brand-gold-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">Enviar E-mail <ArrowUpRight className="h-3 w-3" /></span>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a 
                    href="https://www.instagram.com/anaflavia.focodigital2" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-4 p-4 bg-brand-olive-900 hover:bg-brand-olive-850 rounded-xl border border-brand-olive-800 hover:border-brand-gold-500/40 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-brand-olive-900 transition-colors shrink-0">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Instagram Profissional</h4>
                      <p className="text-sm font-semibold text-white mt-0.5">@anaflavia.focodigital2</p>
                      <span className="text-[10px] text-brand-gold-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-0.5">Ver Perfil <ArrowUpRight className="h-3 w-3" /></span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Small location tag slide 10 */}
              <div className="text-xs text-brand-olive-400 pt-6 border-t border-brand-olive-900">
                <span>Atendimento presencial no Sul de Minas Gerais (Passos e região) e produção remota de UGC para empresas de todo o Brasil.</span>
              </div>
            </div>

            {/* B2B Lead Capture Form Column */}
            <div className="lg:col-span-7 bg-brand-olive-900 p-6 sm:p-8 rounded-2xl border border-brand-olive-800 shadow-2xl flex flex-col justify-between">
              
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-white border-b border-brand-olive-800 pb-3">
                  Solicitar Proposta e Orçamento de Campanhas
                </h3>
                
                {formSubmitted ? (
                  <div className="p-6 bg-brand-olive-850 rounded-xl border border-brand-gold-500/30 text-center space-y-4 my-8">
                    <div className="w-16 h-16 bg-brand-gold-500 text-brand-olive-900 rounded-full flex items-center justify-center font-bold text-3xl mx-auto shadow-lg">
                      ✓
                    </div>
                    <h4 className="font-serif text-lg font-bold text-white">{SITE_COPY.contact.success.title}</h4>
                    <p className="text-xs text-brand-olive-300 max-w-sm mx-auto leading-relaxed">
                      {SITE_COPY.contact.success.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                      <a 
                        href={`https://wa.me/5535998992647?text=${encodeURIComponent(`Olá Ana Flávia, preenchi o formulário no seu site. Meu nome é ${formData.name} e gostaria de agendar uma consultoria estratégica.`)}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="px-6 py-3 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-olive-900 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 justify-center"
                      >
                        {SITE_COPY.contact.success.ctaManual} <Phone className="h-4 w-4" />
                      </a>
                      <button 
                        onClick={() => setFormSubmitted(false)}
                        className="px-4 py-3 bg-brand-olive-800 hover:bg-brand-olive-750 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors border border-brand-olive-700 cursor-pointer"
                      >
                        Enviar Outra Mensagem
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-brand-olive-400 font-bold block">{SITE_COPY.contact.form.name}:</label>
                        <input 
                          type="text" 
                          name="name" 
                          required
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder={SITE_COPY.contact.form.namePlaceholder}
                          className="w-full px-4 py-2.5 bg-brand-olive-950 border border-brand-olive-800 text-brand-olive-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-gold-500"
                        />
                      </div>

                      {/* Company Name input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-brand-olive-400 font-bold block">{SITE_COPY.contact.form.company}:</label>
                        <input 
                          type="text" 
                          name="company" 
                          required
                          value={formData.company}
                          onChange={handleFormChange}
                          placeholder={SITE_COPY.contact.form.companyPlaceholder}
                          className="w-full px-4 py-2.5 bg-brand-olive-950 border border-brand-olive-800 text-brand-olive-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-gold-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-brand-olive-400 font-bold block">{SITE_COPY.contact.form.phone}:</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          required
                          value={formData.phone}
                          onChange={handleFormChange}
                          placeholder={SITE_COPY.contact.form.phonePlaceholder}
                          className="w-full px-4 py-2.5 bg-brand-olive-950 border border-brand-olive-800 text-brand-olive-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-gold-500"
                        />
                      </div>

                      {/* Segment select */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-brand-olive-400 font-bold block">{SITE_COPY.contact.form.segment}:</label>
                        <select 
                          name="segment"
                          value={formData.segment}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2.5 bg-brand-olive-950 border border-brand-olive-800 text-brand-olive-100 rounded-lg text-xs font-bold focus:outline-none focus:border-brand-gold-500"
                        >
                          <option value="moda">Moda & Tecidos</option>
                          <option value="beleza">Estética & Bem-Estar</option>
                          <option value="joias">Joias & Semijoias</option>
                          <option value="educacao">Educação & Cursos</option>
                          <option value="outros">Outros Segmentos</option>
                        </select>
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-brand-olive-400 font-bold block">{SITE_COPY.contact.form.email}:</label>
                      <input 
                        type="email" 
                        name="email" 
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder={SITE_COPY.contact.form.emailPlaceholder}
                        className="w-full px-4 py-2.5 bg-brand-olive-950 border border-brand-olive-800 text-brand-olive-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-gold-500"
                      />
                    </div>

                    {/* Message textarea */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-brand-olive-400 font-bold block">{SITE_COPY.contact.form.message}:</label>
                      <textarea 
                        name="message" 
                        rows={3}
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder={SITE_COPY.contact.form.messagePlaceholder}
                        className="w-full px-4 py-2.5 bg-brand-olive-950 border border-brand-olive-800 text-brand-olive-100 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-gold-500 resize-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-olive-900 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {SITE_COPY.contact.form.button} <ArrowRight className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>

              {/* Developer Real-Time lead notification/panel */}
              <div className="mt-6 pt-4 border-t border-brand-olive-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-brand-olive-400">
                  <Database className="h-3.5 w-3.5" />
                  <span>Leads Salvos Localmente: <strong className="text-white">{leadsList.length}</strong></span>
                </div>
                {leadsList.length > 0 && (
                  <button 
                    onClick={() => setShowLeadsPanel(!showLeadsPanel)}
                    className="text-[10px] text-brand-gold-400 hover:underline font-bold uppercase tracking-wider cursor-pointer"
                  >
                    {showLeadsPanel ? SITE_COPY.leadsPanel.toggleHide : SITE_COPY.leadsPanel.toggleShow}
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Real-time B2B Leads viewer panel */}
      <AnimatePresence>
        {showLeadsPanel && leadsList.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-brand-olive-900 border-b border-brand-olive-800 text-brand-olive-100 py-10"
          >
            <div className="max-w-7xl mx-auto px-4 space-y-6">
              <div className="flex items-center justify-between border-b border-brand-olive-800 pb-3">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-brand-gold-400" />
                  {SITE_COPY.leadsPanel.title}
                </h3>
                <button 
                  onClick={handleClearLeads}
                  className="px-3 py-1 bg-red-950 hover:bg-red-900 text-red-200 border border-red-500/20 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {SITE_COPY.leadsPanel.clearButton}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leadsList.map((lead) => (
                  <div key={lead.id} className="p-4 bg-brand-olive-950 rounded-xl border border-brand-olive-800 text-left space-y-3 relative shadow-inner">
                    <span className="absolute top-3 right-3 text-[9px] text-brand-olive-500 font-semibold">{lead.date}</span>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white">{lead.name}</h4>
                      <p className="text-xs text-brand-gold-400 font-mono font-medium">{lead.company}</p>
                    </div>
                    <div className="space-y-1 text-xs text-brand-olive-300">
                      <div><strong className="text-stone-400">WhatsApp:</strong> {lead.phone}</div>
                      <div><strong className="text-stone-400">E-mail:</strong> {lead.email}</div>
                      <div><strong className="text-stone-400">Segmento:</strong> <span className="uppercase font-bold text-[10px] text-brand-gold-300">{lead.segment}</span></div>
                    </div>
                    <p className="text-xs text-brand-olive-200 border-t border-brand-olive-800 pt-2 italic">
                      "{lead.message || "Sem mensagem complementar."}"
                    </p>
                    <a 
                      href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 hover:underline pt-1"
                    >
                      Iniciar Conversa no WhatsApp <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-brand-olive-950 py-12 text-brand-olive-400 text-center border-t border-brand-olive-900 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="font-serif text-xl font-bold tracking-tight text-black">
            {SITE_COPY.header.brandName} <span className="text-brand-gold-500 italic">{SITE_COPY.header.brandSurname}</span>
          </div>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            {SITE_COPY.meta.description}
          </p>
          <div className="flex items-center justify-center gap-6 pt-2">
            <a href="https://www.instagram.com/anaflavia.focodigital2" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="mailto:aflaviafocodigital@gmail.com" className="hover:text-white transition-colors" aria-label="E-mail">
              <Mail className="h-5 w-5" />
            </a>
            <a href="https://wa.me/5535998992647" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp">
              <Phone className="h-5 w-5" />
            </a>
          </div>
          <div className="text-[10px] text-stone-600 pt-4 border-t border-brand-olive-900 space-y-1">
            <p>© {new Date().getFullYear()} {SITE_COPY.header.brandName} {SITE_COPY.header.brandSurname}. {SITE_COPY.footer.rights}</p>
            <p>{SITE_COPY.footer.disclaimer}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
