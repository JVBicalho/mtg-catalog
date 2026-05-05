/**
 * Mapeia siglas da LigaMagic para siglas oficiais da Scryfall.
 */
const SET_MAP: Record<string, string> = {
  // --- Foundations (FDN) ---
  'bbfdn': 'fdn',   // Bundle Foundations -> Set oficial: fdn

  // --- Murders at Karlov Manor (MKM) ---
  'prmkm': 'mkm',   // Promo MKM -> Use 'mkm' ou 'pmkm'

  // --- Outlaws of Thunder Junction (OTJ) ---
  'bwfin': 'otj',   // Big Score / Bundle Thunder Junction -> Set oficial: otj ou big
  'RNC': 'ren',    // Renaissance
  'pr30': 'p30a',  // 30th Anniversary Promos

  'slci': 'lci',   // Lost Caverns of Ixalan Showcase (fallback to main set if needed)
  // Adicione outros mapeamentos conforme necessário
  'barvr': 'rvr',
  'blci': 'lci',
  'bcmm': 'cmm',
  'bpcmm': 'cmm',
  'bl2x2': '2x2',
  'blfdn': 'fdn',
  'bldsk': 'dsk',
  'exltr': 'ltr',
  'bltr': 'ltr',
  'rfrvr': 'rvr',
  'grc': 'pw23',


  'lw': 'lrw',

  'pc': 'plc',
  'pcmm': 'cmm',
  'pmom': 'mom',
  'plist': 'plst',
  'cma2': 'cma',
  'sc': 'scg',
  'ts': 'tsp',
  'prpip': 'pip',
  'sh': 'sth',
  'tp': 'tmp',
  'on': 'ons',
  'in': 'inv',
  'cbkhm': 'khm',
  'ju': 'jud',
  'dedsk': 'dsk',
  'mb1': 'plst',
  '9e': '9ed',
  '8e': '8ed',
  '7e': '7ed',
  '4e': '4ed',
  'vi': '6ed',
  'od': 'ody',
  'ul': 'ulg',
  'eaotj': 'otj',

  // --- Outlaws of Thunder Junction / EOE ---
  'preoe': 'otj',    // Prerelease OTJ (A Liga usa EOE por causa de 'Epilogue')
  'bteoe': 'otj',    // Bundle OTJ

  // --- Baldur's Gate (CLB) ---
  'rbclb': 'clb',    // Retro Frame / Promo Baldur's Gate -> Use 'clb' ou 'pclb'

  // --- Brother's War (BRO) ---
  'rfbro': 'bro',    // Retro Frame Brother's War -> Geralmente mapeia para 'bro' ou 'brr'

  // --- Adventures in the Forgotten Realms (AFR) ---
  'cbafr': 'afr',    // AFR (Versões de Commander/Bundle) -> Tente 'afr'

  // --- Edições Clássicas (Siglas de 2 letras que a Liga exporta errado) ---
  'us': 'usg',       // Urza's Saga (A Liga usa 'us', Scryfall usa 'usg')
  'ap': 'apc',       // Apocalypse (A Liga usa 'ap', Scryfall usa 'apc')
  'ps': 'pls',       // Planeshift (A Liga usa 'ps', Scryfall usa 'pls')
  // --- Promos de Aniversário e Eventos ---
  'p30m': 'p30m',   // 30th Anniversary Play Promos (Mantenha se falhar, mas Scryfall usa p30m)
  'pw23': 'pw23',   // Planeswalker Championship Promos 2023

  // --- Murders at Karlov Manor (MKM) ---

  'mfmkm': 'mkm',    // MKM Murders at Karlov Manor (Geralmente é o set base ou mkm)
};

/**
 * Overrides manuais para cartas específicas que têm dificuldade de encontrar a arte correta.
 * Chave: "Nome em Inglês|Sigla da Liga"
 */
const CARD_OVERRIDES: Record<string, { set?: string, number?: string }> = {
  // Exemplo: "Arcane Signet|pr30": { set: "p30a", number: "1" },
  "Aetherborn Marauder|otc": { number: "125" },
  "Slinking Skirge|ud": { number: "71" },
  "Fellwar Stone|4e": { set: "4ed", number: "319" },
  "Red Elemental Blast|4e": { set: "4ed", number: "218" },
  "Mogg Infestation|sh": { set: "sth", number: "93" },
  "Goblin Bombardment|tp": { set: "tmp", number: "179" },
  "Manabarbse|4e": { set: "4ed", number: "212" },
};

/**
 * Converte a sigla da LigaMagic para o padrão Scryfall.
 */
export function mapSetCode(ligaSigla: string): string {
  if (!ligaSigla) return '';
  const sigla = ligaSigla.toLowerCase();
  return SET_MAP[ligaSigla] || SET_MAP[sigla] || sigla;
}

/**
 * Retorna overrides específicos para uma carta.
 */
export function getCardOverride(enName: string, ligaSigla: string) {
  const key = `${enName}|${ligaSigla.toLowerCase()}`;
  return CARD_OVERRIDES[key] || null;
}

/**
 * Trata nomes de cartas removendo informações entre parênteses
 * e garantindo que o nome esteja limpo para a API.
 */
export function sanitizeCardName(name: string): string {
  if (!name) return '';

  // Remove aspas, símbolos de marca registrada e asteriscos
  let cleanName = name.replace(/[®™*"]/g, '');

  // Trata cartas de dupla face (LigaMagic usa " / ", Scryfall usa " // ")
  if (cleanName.includes(' / ') && !cleanName.includes(' // ')) {
    cleanName = cleanName.replace(' / ', ' // ');
  }

  // Remove tudo que estiver entre parênteses
  cleanName = cleanName.replace(/\s*\([^)]*\)/g, '');

  return cleanName.trim();
}
