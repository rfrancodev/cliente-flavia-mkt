import { IMAGES } from "./assets/images";

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
}

export interface ClientLogo {
  name: string;
  shortName: string;
  color: string;
  text: string;
  image: string;
  category: "moda" | "beleza" | "joias" | "educacao" | "todos";
}

export interface PortfolioCase {
  id: string;
  category: "moda" | "beleza" | "joias" | "educacao";
  categoryLabel: string;
  clientName: string;
  instagramHandle: string;
  instagramUrl: string;
  description: string;
  videoCaption: string;
  coverImage: string;
  accentColor: string;
  videoDurationSeconds: number;
  likes: string;
  comments: string;
  details: string[];
}

export interface BrandColor {
  name: string;
  hex: string;
  bgClass: string;
}

export interface DesignPortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  handle: string;
  color: string;
  description: string;
  typography: string;
  fontClass: string;
  brandColors: BrandColor[];
  visualStyle: string;
}

export const CLIENTS: ClientLogo[] = [
  { 
    name: "Milu Tecidos", 
    shortName: "MILU", 
    color: "bg-rose-900 text-rose-100 border-rose-500", 
    text: "MT", 
    image: IMAGES.clientMilu,
    category: "moda"
  },
  { 
    name: "Colégio Del Rey", 
    shortName: "Del Rey", 
    color: "bg-blue-900 text-blue-100 border-blue-500", 
    text: "DR", 
    image: IMAGES.clientDelRey,
    category: "educacao"
  },
  { 
    name: "Luluzinha Joias", 
    shortName: "Luluzinha", 
    color: "bg-amber-950 text-amber-100 border-amber-600", 
    text: "LJ", 
    image: IMAGES.clientLuluzinha,
    category: "joias"
  },
  { 
    name: "Elly Picanso Studio 360", 
    shortName: "Studio 360", 
    color: "bg-purple-900 text-purple-100 border-purple-500", 
    text: "EP", 
    image: IMAGES.clientStudio360,
    category: "beleza"
  },
];

export const SERVICES: ServiceItem[] = [
  { id: "s1", name: "Posicionamento de Marca", description: "Construção de uma identidade forte e memorável para destacar seu negócio na mente do consumidor." },
  { id: "s2", name: "Definição de Estratégia", description: "Planejamento tático de canais, funis de conteúdo e calendários de postagem focados em conversão." },
  { id: "s3", name: "Gestão de Redes Sociais", description: "Gerenciamento completo do Instagram, TikTok e outras mídias sociais para crescimento orgânico." },
  { id: "s4", name: "Captação de Fotos e Vídeos", description: "Direção criativa e captação de materiais audiovisuais profissionais para sua empresa." },
  { id: "s5", name: "Edição de Vídeos (Reels & TikTok)", description: "Cortes dinâmicos, efeitos modernos, legendas atraentes e áudios que geram alto engajamento." },
  { id: "s6", name: "Criação de Conteúdo", description: "Desenvolvimento de roteiros estratégicos, posts de carrossel, histórias e interações diárias." },
  { id: "s7", name: "Design para Redes Sociais", description: "Identidade visual premium aplicada a cada publicação para transmitir sofisticação." },
  { id: "s8", name: "UGC (User Generated Content)", description: "Criação de vídeos autênticos de formato 'criador-usuário', conectando-se diretamente com a dor do cliente." },
  { id: "s9", name: "Collab de Produtos e Serviços", description: "Estratégia de parcerias e promoções cruzadas para ampliar o alcance e reputação da marca." },
  { id: "s10", name: "Análise de Métricas e Resultados", description: "Relatórios mensais de performance com otimização contínua de ROI e alcance." },
];

export const PRODUCTS: ProductItem[] = [
  { id: "p1", name: "Biolink Personalizado", description: "Página de links estratégica, otimizada para direcionar tráfego para WhatsApp e catálogo." },
  { id: "p2", name: "Landing Pages Profissionais", description: "Páginas de vendas de altíssima conversão para lançamentos ou serviços empresariais." },
  { id: "p3", name: "Catálogo Digital Interativo", description: "Apresentação moderna de produtos para facilitar a decisão de compra imediata do cliente." },
  { id: "p4", name: "Configuração de WhatsApp Business", description: "Estruturação de funis, mensagens automáticas e catálogo integrado para vendas ágeis." },
  { id: "p5", name: "Cobertura de Eventos Corporativos", description: "Captação de conteúdo dinâmico em tempo real para stories e reels durante eventos da sua empresa." },
  { id: "p6", name: "Desenvolvimento de Site Institucional", description: "Presença web sólida, rápida e profissional para credibilidade imediata da sua marca." },
  { id: "p7", name: "Gestão de Tráfego Pago", description: "Anúncios patrocinados no Meta Ads e Google Ads focados em captação de leads e vendas diretas." },
];

export const PORTFOLIO_CASES: PortfolioCase[] = [
  // --- MODA (Milu Tecidos) ---
  {
    id: "case-moda-1",
    category: "moda",
    categoryLabel: "Moda & Tecidos",
    clientName: "Milu Tecidos",
    instagramHandle: "@milutecidos",
    instagramUrl: "https://www.instagram.com/milutecidos",
    description: "Criação de conteúdo focado em demonstrar a qualidade dos tecidos 100% algodão e engajamento divertido com a audiência.",
    videoCaption: "Hoje eu vim falar com vocês sobre os tecidos 100% algodão. Quando o marketing quer gravar vídeos... Oi genteee! Bom dia pessoal!",
    coverImage: IMAGES.caseModa1,
    accentColor: "from-rose-800 to-amber-700",
    videoDurationSeconds: 15,
    likes: "1.4k",
    comments: "142",
    details: ["Aumento de 42% nas mensagens diretas sobre o tecido de algodão", "Roteiro focado em quebrar a objeção de encolhimento do tecido", "Uso de humor corporativo focado no público-alvo de costureiras e estilistas"]
  },
  {
    id: "case-moda-2",
    category: "moda",
    categoryLabel: "Moda & Tecidos",
    clientName: "Milu Tecidos",
    instagramHandle: "@milutecidos",
    instagramUrl: "https://www.instagram.com/milutecidos",
    description: "Unboxing dinâmico mostrando texturas e paletas exclusivas de novas coleções de Outono/Inverno.",
    videoCaption: "🚨 ALERTA DE NOVIDADE! Chegaram os novos linhos e tricolines da semana. Olha o caimento desse tecido e a vivacidade das cores! Perfeitos para alfaiataria.",
    coverImage: IMAGES.caseModa2,
    accentColor: "from-rose-900 to-red-800",
    videoDurationSeconds: 20,
    likes: "1.9k",
    comments: "205",
    details: ["Exibição em macro das fibras do linho destacando toque suave", "Vídeo interativo nos stories convertendo em 30+ pedidos no atacado", "Segmentação direcionada a ateliês de costura personalizados"]
  },
  {
    id: "case-moda-3",
    category: "moda",
    categoryLabel: "Moda & Tecidos",
    clientName: "Milu Tecidos",
    instagramHandle: "@milutecidos",
    instagramUrl: "https://www.instagram.com/milutecidos",
    description: "Tutorial em estilo UGC ensinando a testar a pureza do algodão e caimento em peças reais.",
    videoCaption: "Costurando meu próprio vestido com tecidos da Milu! 🧵✨ O processo é super simples quando o algodão é de alta qualidade. Gostaram do resultado final?",
    coverImage: IMAGES.caseModa3,
    accentColor: "from-amber-800 to-amber-600",
    videoDurationSeconds: 18,
    likes: "2.3k",
    comments: "192",
    details: ["Prova social real com o passo a passo da confecção do vestido", "Fortalecimento do branding orgânico através de engajamento 'faça você mesmo'", "Mais de 150 compartilhamentos no Instagram Reels"]
  },

  // --- BELEZA (Elly Picanço | Studio 360) ---
  {
    id: "case-beleza-1",
    category: "beleza",
    categoryLabel: "Espaço de Beleza",
    clientName: "Elly Picanço | Studio 360",
    instagramHandle: "@ellypicanco_studio360",
    instagramUrl: "https://www.instagram.com/ellypicanco_studio360",
    description: "Posicionamento premium focado em contar a história de mais de 40 anos de sofisticação e a evolução do design de sobrancelhas.",
    videoCaption: "Eu tive que me adaptar a todas as mudanças no Design de Sobrancelhas nas últimas décadas... Um trabalho de naturalidade, sofisticação e autoestima.",
    coverImage: IMAGES.caseBeleza1,
    accentColor: "from-purple-800 to-pink-700",
    videoDurationSeconds: 20,
    likes: "2.1k",
    comments: "258",
    details: ["Branding humanizado focado na vasta experiência da fundadora", "Geração de autoridade e diferenciação contra concorrentes 'low-cost'", "Formatos dinâmicos gerando mais de 15 agendamentos diretos via direct por vídeo"]
  },
  {
    id: "case-beleza-2",
    category: "beleza",
    categoryLabel: "Espaço de Beleza",
    clientName: "Elly Picanço | Studio 360",
    instagramHandle: "@ellypicanco_studio360",
    instagramUrl: "https://www.instagram.com/ellypicanco_studio360",
    description: "Vídeo de transformação e reação imediata da cliente ao espelho, destacando o método exclusivo de realce natural.",
    videoCaption: "O poder de um olhar renovado! ✨ Veja a reação da nossa cliente ao ver o resultado do Design de Sobrancelhas personalizado. Naturalidade é a nossa marca registrada.",
    coverImage: IMAGES.caseBeleza2,
    accentColor: "from-fuchsia-900 to-purple-800",
    videoDurationSeconds: 15,
    likes: "3.4k",
    comments: "310",
    details: ["Gatilho mental da transformação visual real e imediata", "Foco no close-up de alta definição dos fios da sobrancelha", "Campanha gerou pico histórico de agendamentos no mês"]
  },
  {
    id: "case-beleza-3",
    category: "beleza",
    categoryLabel: "Espaço de Beleza",
    clientName: "Elly Picanço | Studio 360",
    instagramHandle: "@ellypicanco_studio360",
    instagramUrl: "https://www.instagram.com/ellypicanco_studio360",
    description: "Vídeo de rotina estética mostrando os bastidores do atendimento e rituais de biossegurança do estúdio.",
    videoCaption: "Um dia de spa e autocuidado aqui no Studio 360! 💆‍♀️ Cuidamos de cada detalhe para você se sentir única e maravilhosa. Já agendou o seu momento da semana?",
    coverImage: IMAGES.caseBeleza3,
    accentColor: "from-amber-950 to-stone-900",
    videoDurationSeconds: 22,
    likes: "1.8k",
    comments: "167",
    details: ["Quebra de objeções sobre higiene e biossegurança em procedimentos", "Construção de desejo através da experiência de luxo no atendimento", "Aumento de 25% na fidelização de clientes recorrentes"]
  },

  // --- JOIAS (Luluzinha Joias) ---
  {
    id: "case-joias-1",
    category: "joias",
    categoryLabel: "Joias e Semijoias",
    clientName: "Luluzinha Joias",
    instagramHandle: "@luluzinhajoiasesemijoias",
    instagramUrl: "https://www.instagram.com/luluzinhajoiasesemijoias",
    description: "Vídeos de UGC dinâmicos mostrando a experiência tátil de revelação e uso das joias, focados em recrutar novas revendedoras.",
    videoCaption: "Semijoias Atemporais 100% Consignado. Seja uma REVENDEDORA. Veja esse brilho! Joias que transformam qualquer visual.",
    coverImage: IMAGES.caseJoias1,
    accentColor: "from-amber-900 to-amber-600",
    videoDurationSeconds: 12,
    likes: "980",
    comments: "89",
    details: ["Apresentação visual rica (macro detalhes das peças)", "Vídeo focado no gatilho mental da oportunidade financeira ('Seja uma revendedora')", "Aumento expressivo no engajamento nos stories com enquetes interativas"]
  },
  {
    id: "case-joias-2",
    category: "joias",
    categoryLabel: "Joias e Semijoias",
    clientName: "Luluzinha Joias",
    instagramHandle: "@luluzinhajoiasesemijoias",
    instagramUrl: "https://www.instagram.com/luluzinhajoiasesemijoias",
    description: "Teste de resistência e brilho das semijoias banhadas a ouro 18k em situações do cotidiano.",
    videoCaption: "Suas semijoias escurecem fácil? Aqui não! 💦 Provando a durabilidade e o banho de ouro 18k das nossas peças sob a água. Qualidade que você sente na pele.",
    coverImage: IMAGES.caseJoias2,
    accentColor: "from-amber-950 to-amber-700",
    videoDurationSeconds: 16,
    likes: "1.7k",
    comments: "145",
    details: ["Demonstração prática de durabilidade anti-oxidação do banho de ouro", "Foco na quebra da barreira de compra online de acessórios", "Conversão de leads qualificados para o canal de revendedoras"]
  },
  {
    id: "case-joias-3",
    category: "joias",
    categoryLabel: "Joias e Semijoias",
    clientName: "Luluzinha Joias",
    instagramHandle: "@luluzinhajoiasesemijoias",
    instagramUrl: "https://www.instagram.com/luluzinhajoiasesemijoias",
    description: "Guia prático de moda ensinando a combinar diferentes peças e criar mix de colares de luxo.",
    videoCaption: "Aprenda a montar o mix perfeito de colares e brincos para valorizar seu look de festa! 💎 Detalhes que fazem toda a diferença na sua sofisticação.",
    coverImage: IMAGES.caseJoias3,
    accentColor: "from-emerald-950 to-emerald-800",
    videoDurationSeconds: 14,
    likes: "2.2k",
    comments: "208",
    details: ["Conteúdo educativo agregando valor estético além da venda pura", "Uso de chamadas de ação claras para compra do kit completo nos stories", "Aumento orgânico na taxa de recompra de clientes finais"]
  },

  // --- EDUCACAO (Colégio Del Rey) ---
  {
    id: "case-educacao-1",
    category: "educacao",
    categoryLabel: "Educação Particular",
    clientName: "Colégio Del Rey",
    instagramHandle: "@colegiodelrey",
    instagramUrl: "https://www.instagram.com/colegiodelrey",
    description: "Vídeos alegres e humanizados retratando a vida escolar real, ensaios da banda e a conexão entre pais, alunos e escola.",
    videoCaption: "Escola particular - Preparação de verdade para o ENEM e para a Vida! Olha a minha mãe orgulhosa ali... Viva o desfile da nossa banda!",
    coverImage: IMAGES.caseEducacao1,
    accentColor: "from-blue-900 to-sky-700",
    videoDurationSeconds: 18,
    likes: "3.2k",
    comments: "412",
    details: ["Humanização da marca da escola particular para criar laços emocionais com os pais", "Engajamento altíssimo da comunidade de alunos compartilhando e comentando", "Demonstração de atividades práticas que geram valor além da sala de aula tradicional"]
  },
  {
    id: "case-educacao-2",
    category: "educacao",
    categoryLabel: "Educação Particular",
    clientName: "Colégio Del Rey",
    instagramHandle: "@colegiodelrey",
    instagramUrl: "https://www.instagram.com/colegiodelrey",
    description: "Destaque de atividades pedagógicas inovadoras com os experimentos de laboratório dos alunos.",
    videoCaption: "Ciência na prática! 🧪 Nossos alunos do Ensino Médio dando um show nos experimentos de química hoje. Aqui a teoria encontra a vivência real!",
    coverImage: IMAGES.caseEducacao2,
    accentColor: "from-sky-900 to-blue-800",
    videoDurationSeconds: 20,
    likes: "2.8k",
    comments: "195",
    details: ["Foco na infraestrutura moderna e qualidade pedagógica inovadora", "Aproximação com pais interessados em ensino voltado para ciências e tecnologia", "Mais de 120 salvamentos do post por famílias da região"]
  },
  {
    id: "case-educacao-3",
    category: "educacao",
    categoryLabel: "Educação Particular",
    clientName: "Colégio Del Rey",
    instagramHandle: "@colegiodelrey",
    instagramUrl: "https://www.instagram.com/colegiodelrey",
    description: "Apresentação da metodologia de tecnologia aplicada no ensino e laboratório de informática.",
    videoCaption: "Como a tecnologia potencializa o aprendizado ativo! 💻 Conheça nossas salas interativas e a metodologia inovadora que prepara nossos jovens para o futuro.",
    coverImage: IMAGES.caseEducacao3,
    accentColor: "from-indigo-900 to-sky-800",
    videoDurationSeconds: 15,
    likes: "1.9k",
    comments: "134",
    details: ["Fortalecimento do pilar tecnológico e inovador da instituição", "Geração de leads interessados em agendar visitas presenciais no colégio", "Retenção de matrículas através de transparência educacional com a comunidade"]
  }
];

export const DESIGNS: DesignPortfolioItem[] = [
  {
    id: "d1",
    title: "Profissão Beleza",
    subtitle: "A história contada por Elly Picanço",
    client: "Elly Picanço | Studio 360",
    handle: "@ellypicanco_studio360",
    color: "from-[#bfb1d1] via-[#d7c0d4] to-[#DFB382]",
    description: "Identidade visual leve, minimalista e sofisticada com tons pastéis acolhedores e elegantes.",
    typography: "Playfair Display (Serif Elegante) & Inter (Sans)",
    fontClass: "font-serif",
    brandColors: [
      { name: "Lilás Acinzentado Pastel", hex: "#bfb1d1", bgClass: "bg-[#bfb1d1]" },
      { name: "Bege", hex: "#d7c0d4", bgClass: "bg-[#d7c0d4]" },
      { name: "Ouro Champagne", hex: "#DFB382", bgClass: "bg-[#DFB382]" }
    ],
    visualStyle: "Estética Clean Girl com linhas finas douradas, fundo pastel suave e atmosfera de bem-estar."
  },
  {
    id: "d2",
    title: "Coleção Brisa",
    subtitle: "Campanha de Semijoias Atemporais",
    client: "Luluzinha Joias",
    handle: "@luluzinhajoiasesemijoias",
    color: "from-[#082A1B] via-[#03150C] to-stone-950",
    description: "Design elegante focado em minimalismo com tipografia serifada luxuosa para catálogo digital.",
    typography: "Cinzel (Serif Imperial) & Montserrat (Sans)",
    fontClass: "font-serif",
    brandColors: [
      { name: "Verde Esmeralda", hex: "#082A1B", bgClass: "bg-[#082A1B]" },
      { name: "Verde Lodo Escuro", hex: "#03150C", bgClass: "bg-[#03150C]" },
      { name: "Ouro 18k", hex: "#D4AF37", bgClass: "bg-[#D4AF37]" }
    ],
    visualStyle: "Múltiplas linhas finas douradas, margens limpas amplas e destaque para pedras preciosas."
  },
  {
    id: "d3",
    title: "Enem & Vida",
    subtitle: "Campanha de Matrículas 2026",
    client: "Colégio Del Rey",
    handle: "@colegiodelrey",
    color: "from-[#11245A] via-[#0A1435] to-stone-950",
    description: "Identidade visual forte para captação de novos alunos unindo as cores tradicionais da instituição.",
    typography: "Outfit (Sans Impactante) & Space Grotesk",
    fontClass: "font-sans font-black uppercase tracking-tight",
    brandColors: [
      { name: "Azul Imperial", hex: "#11245A", bgClass: "bg-[#11245A]" },
      { name: "Azul Marinho", hex: "#0A1435", bgClass: "bg-[#0A1435]" },
      { name: "Amarelo Acadêmico", hex: "#F39C12", bgClass: "bg-[#F39C12]" }
    ],
    visualStyle: "Cortes geométricos diagonais, caixas de destaque de alto impacto e grids acadêmicos organizados."
  },
  {
    id: "d4",
    title: "Algodão Premium",
    subtitle: "Lançamento de Malhas e Tecidos",
    client: "Milu Tecidos",
    handle: "@milutecidos",
    color: "from-[#8B1C33] via-[#4D0D19] to-stone-950",
    description: "Layouts harmônicos com texturas realistas e paletas quentes para engajar no Instagram Stories.",
    typography: "Cormorant Garamond (Serif Orgânico) & Inter",
    fontClass: "font-serif",
    brandColors: [
      { name: "Terracota Rosado", hex: "#8B1C33", bgClass: "bg-[#8B1C33]" },
      { name: "Marsala", hex: "#4D0D19", bgClass: "bg-[#4D0D19]" },
      { name: "Algodão Cru", hex: "#F7EBE1", bgClass: "bg-[#F7EBE1]" }
    ],
    visualStyle: "Ondulações orgânicas simulando dobras de tecidos, costuras pontilhadas e texturas quentes."
  }
];
