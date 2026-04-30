import Papa from 'papaparse';
import type { CardData } from '../types';
import { mapSetCode, sanitizeCardName } from './mapper';

export function parseLigaMagicCSV(csvContent: string): CardData[] {
  const parsed = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });

  return (parsed.data as any[]).map((row) => {
    const ptName = sanitizeCardName(row['Card (PT)'] || '');
    const enName = sanitizeCardName(row['Card (EN)'] || '');
    
    return {
      nomePT: ptName,
      nomeEN: enName || ptName, // Fallback para o nome PT se o EN estiver vazio
      edicao: (row['Edicao (EN)'] || row['Edicao (PTBR)'] || '').toString().trim(),
      setCode: mapSetCode((row['Edicao (Sigla)'] || '').toString().trim()),
      collectorNumber: (row['Card #'] || '').toString().trim(),
      quantidade: parseInt(row['Quantidade']) || 0,
      isFoil: row['Extras']?.toString().toLowerCase().includes('foil') || false
    };
  });
}
