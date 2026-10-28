// Reglas compartidas por el content script y el popup.
self.BIA = {
  DONATE_URL: "https://buymeacoffee.com/TU_USUARIO",

  DEFAULT_SETTINGS: {
    enabled: true,
    mode: "blur", // "blur" | "hide"
    detectLabels: true,
    detectHashtags: true,
    platforms: {
      youtube: true,
      tiktok: true,
      facebook: true,
      instagram: true,
      reelshort: true,
      x: true
    },
    keywords: [],
    accounts: []
  },

  // Etiquetas oficiales que las plataformas muestran en contenido de IA.
  LABEL_PATTERNS: [
    "altered or synthetic content",
    "contenido alterado o sintético",
    "contenido alterado o sintetico",
    "ai-generated",
    "ai generated",
    "generated with ai",
    "made with ai",
    "creator labeled as ai-generated",
    "ai info",
    "generado por ia",
    "generado con ia",
    "generada por ia",
    "creado con ia",
    "hecho con ia",
    "info de ia",
    "información de ia",
    "etiquetado como generado por ia",
    "el creador lo etiquetó como generado por ia"
  ],

  DEFAULT_HASHTAGS: [
    "ai", "aiart", "aiartwork", "aiartcommunity", "aigenerated", "aivideo",
    "aiimage", "aianimation", "aimusic", "aigirl", "aimodel", "aiinfluencer",
    "generativeai", "genai", "sora", "sora2", "soraai", "midjourney",
    "stablediffusion", "dalle", "dalle3", "veo", "veo3", "googleveo",
    "klingai", "kling", "runwayml", "runway", "pikalabs", "pika", "hailuo",
    "hailuoai", "minimax", "leonardoai", "flux", "fluxai", "suno", "sunoai",
    "udio", "heygen", "synthesia", "ia", "iagenerativa", "hechoconia",
    "generadoconia", "arteia", "videoia"
  ],

  PLATFORMS: {
    youtube: {
      name: "YouTube",
      hosts: ["youtube.com"],
      items: [
        { sel: "ytd-rich-item-renderer" },
        { sel: "ytd-video-renderer" },
        { sel: "ytd-compact-video-renderer" },
        { sel: "yt-lockup-view-model" },
        { sel: "ytd-reel-item-renderer" },
        { sel: "ytm-shorts-lockup-view-model" },
        { sel: "ytd-reel-video-renderer", overlayOnly: true },
        { sel: "#player-container-outer, #player", textFrom: "ytd-watch-metadata, #description", overlayOnly: true }
      ]
    },
    tiktok: {
      name: "TikTok",
      hosts: ["tiktok.com"],
      items: [
        { sel: "[data-e2e='recommend-list-item-container']", overlayOnly: true },
        { sel: "article", overlayOnly: true },
        { sel: "[data-e2e='user-post-item']" },
        { sel: "[data-e2e='search_top-item']" },
        { sel: "[data-e2e='browse-video'], [class*='DivVideoContainer']", textFrom: "[data-e2e='browse-video-desc'], [data-e2e='video-desc']", overlayOnly: true }
      ]
    },
    facebook: {
      name: "Facebook",
      hosts: ["facebook.com"],
      items: [
        { sel: "div[role='article']" },
        { sel: "div[data-pagelet^='FeedUnit']" },
        { sel: "div[data-video-id]", overlayOnly: true }
      ]
    },
    instagram: {
      name: "Instagram",
      hosts: ["instagram.com"],
      items: [
        { sel: "article" },
        { sel: "div[role='dialog'] article", overlayOnly: true }
      ]
    },
    reelshort: {
      name: "ReelShort",
      hosts: ["reelshort.com"],
      items: [
        { sel: "a[href*='/movie/'], a[href*='/episodes/']" },
        { sel: "[class*='book-item'], [class*='BookItem'], [class*='video-item']" }
      ]
    },
    x: {
      name: "X",
      hosts: ["x.com"],
      items: [{ sel: "article[data-testid='tweet']" }]
    }
  }
};
