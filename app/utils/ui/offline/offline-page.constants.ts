import type { Locale } from "@goat-it/schemas/shared/locale";

import type { OfflinePageCopy } from "@/utils/ui/offline/offline-page.types";

const OFFLINE_PAGE_COPY: Readonly<Record<Locale, OfflinePageCopy>> = {
  de: {
    title: "Du bist offline",
    description: "Zum Laden neuer Fragen und Inhalte ist eine Netzwerkverbindung erforderlich. Stelle die Verbindung wieder her und versuche es erneut.",
    retry: "Erneut versuchen",
  },
  en: {
    title: "You're offline",
    description: "A network connection is required to load new questions and content. Reconnect, then try again.",
    retry: "Retry",
  },
  es: {
    title: "Sin conexión",
    description: "Se necesita una conexión de red para cargar nuevas preguntas y contenido. Vuelve a conectarte e inténtalo de nuevo.",
    retry: "Reintentar",
  },
  fr: {
    title: "Vous êtes hors ligne",
    description: "Une connexion réseau est nécessaire pour charger de nouvelles questions et du contenu. Reconnectez-vous, puis réessayez.",
    retry: "Réessayer",
  },
  it: {
    title: "Sei offline",
    description: "Per caricare nuove domande e contenuti è necessaria una connessione di rete. Riconnettiti e riprova.",
    retry: "Riprova",
  },
  pt: {
    title: "Está offline",
    description: "É necessária uma ligação de rede para carregar novas perguntas e conteúdos. Volte a ligar-se e tente novamente.",
    retry: "Tentar novamente",
  },
};

export { OFFLINE_PAGE_COPY };