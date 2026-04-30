import { describe, it, expect } from 'vitest';
import { parseLigaMagicCSV } from './parser';

describe('Data Parser', () => {
  it('should convert real LigaMagic CSV to CardData array', () => {
    const csvContent = `Edicao (PTBR)	Edicao (EN)	Edicao (Sigla)	Card (PT)	Card (EN)	Quantidade	Qualidade	Idioma	Raridade	Cor	Extras	Card #	Comentario
	2024 Lunar New Year	pl24	Servo do Soberano Dragao	Dragonlord's Servant	1	SP	PTEN	R	R		1	
	30th Anniversary Promos	pr30	Sinete Arcano	Arcane Signet	1	SP	PTEN	R	C	Foil	1f	`;

    const result = parseLigaMagicCSV(csvContent);

    expect(result).toHaveLength(2);
    expect(result[0].nomePT).toBe('Servo do Soberano Dragao');
    expect(result[0].nomeEN).toBe("Dragonlord's Servant");
    expect(result[0].setCode).toBe('pl24');
    expect(result[0].collectorNumber).toBe('1');
    expect(result[1].nomeEN).toBe('Arcane Signet');
    expect(result[1].setCode).toBe('p30a'); // mapped from pr30
    expect(result[1].isFoil).toBe(true);
    expect(result[1].collectorNumber).toBe('1f');
  });
});
