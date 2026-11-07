import { cookies } from "next/headers";
export type Lang = "en" | "es";
export const getLang = (): Lang => (cookies().get("lang")?.value === "es" ? "es" : "en");
const en = { home: "Home", about: "About", services: "Immigration Services", resources: "Resources", contact: "Contact", portal: "Client Portal", book: "Book a Consultation",
  heroH: "Your Journey to the United States Deserves a Clear Legal Path.", heroP: "Immigration guidance for individuals, families, and businesses navigating important decisions about their future in the United States.", explore: "Explore Immigration Services",
  svcH: "Seven ways we help you move forward", svcP: "Each practice area has its own page with the process, documents, and answers to common questions.", learn: "Learn more",
  procH: "How your case moves", procNote: "These are explanatory stages, not guaranteed outcomes.",
  globH: "Built for people crossing borders", globP: "Many of our clients start their journey outside the United States. The portal, the consultation room, and every notification work in English and Spanish, from any time zone.",
  teamH: "The legal team", portalH: "A clearer way to work with your lawyers", portalP: "Upload documents, see where your case stands, message the team, sign, and pay in one secure place.",
  faqH: "Common questions", ctaH: "Let's Discuss Your Immigration Goals.", contactFirm: "Contact the Firm", disc: "General information only, not legal advice. Reading this site does not create an attorney-client relationship.", rights: "All rights reserved" };
const es: typeof en = { home: "Inicio", about: "Nosotros", services: "Servicios de inmigración", resources: "Recursos", contact: "Contacto", portal: "Portal del cliente", book: "Reservar una consulta",
  heroH: "Su camino hacia Estados Unidos merece una vía legal clara.", heroP: "Orientación migratoria para personas, familias y empresas que toman decisiones importantes sobre su futuro en Estados Unidos.", explore: "Ver servicios de inmigración",
  svcH: "Siete formas de ayudarle a avanzar", svcP: "Cada área tiene su propia página con el proceso, los documentos y respuestas a preguntas frecuentes.", learn: "Más información",
  procH: "Cómo avanza su caso", procNote: "Son etapas explicativas, no resultados garantizados.",
  globH: "Pensado para quienes cruzan fronteras", globP: "Muchos de nuestros clientes inician su camino fuera de Estados Unidos. El portal, la sala de consulta y cada notificación funcionan en inglés y español, desde cualquier zona horaria.",
  teamH: "El equipo legal", portalH: "Una forma más clara de trabajar con sus abogados", portalP: "Suba documentos, vea el estado de su caso, escriba al equipo, firme y pague en un solo lugar seguro.",
  faqH: "Preguntas frecuentes", ctaH: "Hablemos de sus metas migratorias.", contactFirm: "Contactar al despacho", disc: "Información general, no asesoría legal. Leer este sitio no crea una relación abogado-cliente.", rights: "Todos los derechos reservados" };
export const t = (l: Lang) => (l === "es" ? es : en);
