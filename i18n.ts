export type Language = "en" | "it";

type TranslationValues = Record<string, string | number>;

type TranslationMap = {
  toggleThemeTitle: string;
  toggleLanguageTitle: string;
  online: string;
  offline: string;
  socketControls: string;
  authOk: string;
  authFail: string;
  fault: string;
  statusIdle: string;
  statusScanning: string;
  statusAuthorizing: string;
  statusAuthorized: string;
  statusDenied: string;
  statusCharging: string;
  statusSummary: string;
  statusError: string;
  buttonStart: string;
  buttonWait: string;
  buttonPlug: string;
  buttonRetry: string;
  buttonStop: string;
  buttonDone: string;
  buttonReset: string;
  validatingTitle: string;
  rfidCheckLine1: string;
  rfidCheckLine2: string;
  accessGrantedLine1: string;
  accessGrantedLine2: string;
  connectCableLine1: string;
  connectCableLine2: string;
  deniedTitle: string;
  invalidCard: string;
  unauthorizedTag: string;
  summaryTitle: string;
  sessionIdLabel: string;
  totalEnergy: string;
  sessionTime: string;
  scanForInfo: string;
  errorTitle: string;
  errorLine1: string;
  errorLine2: string;
  systemIdLabel: string;
  contactSupportLabel: string;
  liveFlow: string;
  energyTransferred: string;
  elapsedSession: string;
  maximumAvailablePower: string;
  pricingEnergy: string;
  pricingInitial: string;
  pricingIdleFee: string;
  pricingPostSession: string;
  pricingFlat: string;
  pricingPerMin: string;
  imageGenError: string;
  aiThemeEngine: string;
  visualAtmosphere: string;
  promptPlaceholder: string;
  renderResolution: string;
  imageGenDescription: string;
  premiumCustomization: string;
  generatingArt: string;
  applyNewTheme: string;
  backToStation: string;
  integratedEngine: string;
};

const en: TranslationMap = {
  toggleThemeTitle: "Toggle theme",
  toggleLanguageTitle: "Switch language",
  online: "ONLINE",
  offline: "OFFLINE",
  socketControls: "Socket {id} Controls",
  authOk: "AUTH OK",
  authFail: "AUTH FAIL",
  fault: "FAULT",
  statusIdle: "IDLE",
  statusScanning: "SCANNING RFID",
  statusAuthorizing: "AUTHORIZING",
  statusAuthorized: "AUTHORIZED",
  statusDenied: "DENIED",
  statusCharging: "CHARGING",
  statusSummary: "SUMMARY",
  statusError: "ERROR",
  buttonStart: "START",
  buttonWait: "WAIT",
  buttonPlug: "PLUG",
  buttonRetry: "RETRY",
  buttonStop: "STOP",
  buttonDone: "DONE",
  buttonReset: "RESET",
  validatingTitle: "Validating...",
  rfidCheckLine1: "Checking",
  rfidCheckLine2: "RFID Credentials",
  accessGrantedLine1: "Access",
  accessGrantedLine2: "Granted",
  connectCableLine1: "Please connect cable",
  connectCableLine2: "to your vehicle",
  deniedTitle: "Denied",
  invalidCard: "Invalid Card.",
  unauthorizedTag: "Unauthorized Tag",
  summaryTitle: "Summary",
  sessionIdLabel: "SESS {id}",
  totalEnergy: "Total Energy",
  sessionTime: "Session Time",
  scanForInfo: "Scan for info",
  errorTitle: "Fault",
  errorLine1: "Ground fault detected.",
  errorLine2: "Safety shutdown engaged.",
  systemIdLabel: "System ID: {id}",
  contactSupportLabel: "Contact Support: {phone}",
  liveFlow: "LIVE FLOW",
  energyTransferred: "Energy Transferred",
  elapsedSession: "Elapsed Session",
  maximumAvailablePower: "Maximum Available Power",
  pricingEnergy: "Energy",
  pricingInitial: "Initial",
  pricingIdleFee: "Idle Fee",
  pricingPostSession: "POST-SESSION",
  pricingFlat: "FLAT",
  pricingPerMin: "/ MIN",
  imageGenError:
    "Failed to generate background. Ensure an API key is selected.",
  aiThemeEngine: "AI Theme Engine",
  visualAtmosphere: "Visual Atmosphere",
  promptPlaceholder:
    "e.g. Minimalist circuit blue, futuristic neon abstract, deep sea industrial...",
  renderResolution: "Render Resolution",
  imageGenDescription:
    "Describe a theme and our Gemini engine will generate a custom industrial backdrop for this station.",
  premiumCustomization: "Premium Customization",
  generatingArt: "Generating Art...",
  applyNewTheme: "Apply New Theme",
  backToStation: "Back to Station",
  integratedEngine: "Integrated Gemini Vision Engine v3.0 Pro",
};

const it: TranslationMap = {
  toggleThemeTitle: "Cambia tema",
  toggleLanguageTitle: "Cambia lingua",
  online: "ONLINE",
  offline: "OFFLINE",
  socketControls: "Controlli presa {id}",
  authOk: "AUT OK",
  authFail: "AUT KO",
  fault: "GUASTO",
  statusIdle: "DISPONIBILE",
  statusScanning: "LETTURA RFID",
  statusAuthorizing: "AUTORIZZAZIONE",
  statusAuthorized: "AUTORIZZATO",
  statusDenied: "NEGATO",
  statusCharging: "IN CARICA",
  statusSummary: "RIEPILOGO",
  statusError: "ERRORE",
  buttonStart: "AVVIA",
  buttonWait: "ATTENDI",
  buttonPlug: "COLLEGA",
  buttonRetry: "RIPROVA",
  buttonStop: "FERMA",
  buttonDone: "FINE",
  buttonReset: "RIPRISTINA",
  validatingTitle: "Verifica...",
  rfidCheckLine1: "Controllo",
  rfidCheckLine2: "Credenziali RFID",
  accessGrantedLine1: "Accesso",
  accessGrantedLine2: "Consentito",
  connectCableLine1: "Collega il cavo",
  connectCableLine2: "al tuo veicolo",
  deniedTitle: "Negato",
  invalidCard: "Carta non valida.",
  unauthorizedTag: "Tag non autorizzato",
  summaryTitle: "Riepilogo",
  sessionIdLabel: "SESS {id}",
  totalEnergy: "Energia totale",
  sessionTime: "Tempo sessione",
  scanForInfo: "Scansiona per info",
  errorTitle: "Guasto",
  errorLine1: "Guasto a terra rilevato.",
  errorLine2: "Arresto di sicurezza attivato.",
  systemIdLabel: "ID sistema: {id}",
  contactSupportLabel: "Contatta supporto: {phone}",
  liveFlow: "FLUSSO LIVE",
  energyTransferred: "Energia trasferita",
  elapsedSession: "Tempo trascorso",
  maximumAvailablePower: "Potenza massima disponibile",
  pricingEnergy: "Energia",
  pricingInitial: "Iniziale",
  pricingIdleFee: "Tariffa sosta",
  pricingPostSession: "POST-SESSIONE",
  pricingFlat: "FISSO",
  pricingPerMin: "/ MIN",
  imageGenError:
    "Impossibile generare lo sfondo. Assicurati che sia selezionata una chiave API.",
  aiThemeEngine: "Motore temi AI",
  visualAtmosphere: "Atmosfera visiva",
  promptPlaceholder:
    "es. Circuito blu minimalista, neon futuristico, astratto, industriale marino...",
  renderResolution: "Risoluzione render",
  imageGenDescription:
    "Descrivi un tema e il nostro motore Gemini generera uno sfondo industriale personalizzato per questa stazione.",
  premiumCustomization: "Personalizzazione premium",
  generatingArt: "Generazione in corso...",
  applyNewTheme: "Applica nuovo tema",
  backToStation: "Torna alla stazione",
  integratedEngine: "Motore Gemini Vision integrato v3.0 Pro",
};

export const translations = { en, it } as const;

export type TranslationKey = keyof TranslationMap;

export type TranslateFn = (
  key: TranslationKey,
  values?: TranslationValues,
) => string;

export const createTranslator = (language: Language): TranslateFn => {
  return (key, values) => {
    const template = translations[language][key] ?? translations.en[key] ?? key;
    if (!values) return template;
    return template.replace(/\{(\w+)\}/g, (_match, token) => {
      if (values[token] === undefined || values[token] === null)
        return `{${token}}`;
      return String(values[token]);
    });
  };
};
