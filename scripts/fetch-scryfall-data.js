import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const DATA_DIR = path.resolve('./src/assets/data');
const CACHE_FILE = path.resolve('./src/data/scryfall-cache.json');
const DELAY_MS = 700; // Limit to < 1.5 req/s

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchScryfallData(nameEN, namePT) {
  const sanitize = (n) => n.replace(/[®™*"]/g, '').replace(/\s*\([^)]*\)/g, '').trim();
  const queries = [];
  
  if (nameEN) {
    const cleanEN = sanitize(nameEN);
    queries.push(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cleanEN)}`);
    queries.push(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cleanEN)}`);
  }
  
  if (namePT) {
    const cleanPT = sanitize(namePT);
    queries.push(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cleanPT)}`);
    queries.push(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cleanPT)}`);
  }

  for (const query of queries) {
    try {
      await sleep(DELAY_MS);
      const res = await fetch(query);
      if (res.ok) {
        const data = await res.json();
        return {
          color_identity: data.color_identity || [],
          type_line: data.type_line || '',
        };
      }
    } catch (e) {
      // Ignora erro e tenta a próxima query de fallback
    }
  }

  console.warn(`\n[Aviso] Dados não encontrados para: ${nameEN || namePT}`);
  return { color_identity: [], type_line: '' };
}

async function main() {
  console.log('Iniciando script de atualização de dados Scryfall...');

  let cache = {};
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
  }

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Diretório não encontrado: ${DATA_DIR}`);
    return;
  }

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.csv'));
  const uniqueCards = new Map();

  for (const file of files) {
    const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
    const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
    
    for (const row of parsed.data) {
      const ptName = (row['Card (PT)'] || '').toString().trim();
      const enName = (row['Card (EN)'] || '').toString().trim();
      
      // Chave primária do cache será o nome em inglês (ou PT se não existir EN)
      const key = sanitizeKey(enName || ptName);
      if (!key) continue;

      if (!uniqueCards.has(key)) {
        uniqueCards.set(key, { nameEN: enName, namePT: ptName });
      }
    }
  }

  const cardsToFetch = Array.from(uniqueCards.entries()).filter(([key]) => !cache[key]);

  console.log(`Encontradas ${uniqueCards.size} cartas únicas.`);
  console.log(`${cardsToFetch.length} cartas precisam ser buscadas no Scryfall.`);

  let count = 0;
  for (const [key, { nameEN, namePT }] of cardsToFetch) {
    count++;
    process.stdout.write(`\rBuscando dados: ${count}/${cardsToFetch.length} (${key})...`);
    
    const scryfallData = await fetchScryfallData(nameEN, namePT);
    cache[key] = scryfallData;

    // Salva o cache a cada 10 cartas para evitar perda de dados se o script falhar
    if (count % 10 === 0) {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    }
  }

  // Escreve o resultado final
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  console.log('\nDados atualizados com sucesso!');
}

function sanitizeKey(name) {
  // A chave de cache deve ser consistente com o frontend
  let cleanName = name.replace(/[®™*"]/g, '');
  if (cleanName.includes(' / ') && !cleanName.includes(' // ')) {
    cleanName = cleanName.replace(' / ', ' // ');
  }
  cleanName = cleanName.replace(/\s*\([^)]*\)/g, '');
  return cleanName.trim();
}

main().catch(console.error);
