// Textos de la interfaz en español e inglés.
self.BIA.STRINGS = {
  es: {
    language: "Idioma",
    langAuto: "Automático",
    toggle: "Activar o desactivar",
    mode: "Modo",
    modeBlur: "Difuminar",
    modeHide: "Ocultar",
    detection: "Detección",
    detectLabels: "Etiquetas oficiales de IA",
    detectHashtags: "Hashtags de IA (#ai, #sora, #midjourney…)",
    platforms: "Plataformas",
    keywords: "Palabras clave extra",
    accounts: "Cuentas bloqueadas",
    onePerLine: "(una por línea)",
    keywordsPlaceholder: "deepfake\nvoz clonada",
    accountsPlaceholder: "@canal_ia\nusuario_ia",
    donate: "☕ Invítame un café",
    unsupported: "Esta página no es una plataforma compatible.",
    statusCount: "{platform}: {count} elemento(s) bloqueado(s) en esta página.",
    statusOff: "{platform}: bloqueo desactivado.",
    overlayTitle: "Contenido de IA bloqueado",
    overlayShow: "Mostrar",
    reasonMatch: "Coincidencia: “{match}”",
    reasonAccount: "Cuenta en tu lista negra"
  },
  en: {
    language: "Language",
    langAuto: "Automatic",
    toggle: "Turn on or off",
    mode: "Mode",
    modeBlur: "Blur",
    modeHide: "Hide",
    detection: "Detection",
    detectLabels: "Official AI labels",
    detectHashtags: "AI hashtags (#ai, #sora, #midjourney…)",
    platforms: "Platforms",
    keywords: "Extra keywords",
    accounts: "Blocked accounts",
    onePerLine: "(one per line)",
    keywordsPlaceholder: "deepfake\ncloned voice",
    accountsPlaceholder: "@ai_channel\nai_user",
    donate: "☕ Buy me a coffee",
    unsupported: "This page is not a supported platform.",
    statusCount: "{platform}: {count} item(s) blocked on this page.",
    statusOff: "{platform}: blocking is off.",
    overlayTitle: "AI content blocked",
    overlayShow: "Show",
    reasonMatch: "Match: “{match}”",
    reasonAccount: "Account on your blocklist"
  }
};

self.BIA.resolveLang = (lang) => {
  if (lang === "es" || lang === "en") return lang;
  return (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";
};

self.BIA.t = (lang, key, vars = {}) => {
  const dict = self.BIA.STRINGS[self.BIA.resolveLang(lang)];
  return dict[key].replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
};
