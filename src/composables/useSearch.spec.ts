import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import { useSearch } from './useSearch';
import type { CardData } from '../types';

describe('useSearch', () => {
  const mockCollection: CardData[] = [
    { nomePT: 'Llanowar Elves', nomeEN: 'Llanowar Elves', edicao: 'M10', setCode: 'm10', collectorNumber: '1', quantidade: 4, isFoil: false },
    { nomePT: 'Raios', nomeEN: 'Lightning Bolt', edicao: 'Magic 2010', setCode: 'm10', collectorNumber: '2', quantidade: 2, isFoil: true },
    { nomePT: 'Contrafeitiço', nomeEN: 'Counterspell', edicao: '7th Edition', setCode: '7ed', collectorNumber: '3', quantidade: 1, isFoil: false },
  ];

  it('should filter cards by exact Portuguese name', () => {
    const { filteredCards, searchTerm } = useSearch(ref(mockCollection));
    searchTerm.value = 'Raios';
    expect(filteredCards.value).toHaveLength(1);
    expect(filteredCards.value[0].nomeEN).toBe('Lightning Bolt');
  });

  it('should filter cards by English name (fuzzy)', () => {
    const { filteredCards, searchTerm } = useSearch(ref(mockCollection));
    searchTerm.value = 'Light';
    expect(filteredCards.value).toHaveLength(1);
    expect(filteredCards.value[0].nomePT).toBe('Raios');
  });

  it('should filter cards by edition', () => {
    const { filteredCards, searchTerm } = useSearch(ref(mockCollection));
    searchTerm.value = '7th';
    expect(filteredCards.value).toHaveLength(1);
    expect(filteredCards.value[0].nomePT).toBe('Contrafeitiço');
  });

  it('should sort cards by custom priority order', () => {
    // Vamos usar cartas que ESTÃO na lista para o teste de prioridade.
    const testCollection: CardData[] = [
      { nomePT: 'Ulamog', nomeEN: 'Ulamog, the Infinite Gyre', edicao: 'UMA', setCode: 'uma', collectorNumber: '7', quantidade: 1, isFoil: false },
      { nomePT: 'Ojer Axonil', nomeEN: 'Ojer Axonil, Deepest Might', edicao: 'LCI', setCode: 'lci', collectorNumber: '158', quantidade: 1, isFoil: false },
      { nomePT: 'Ashling', nomeEN: 'Ashling, Flame Dancer', edicao: 'MH3', setCode: 'mh3', collectorNumber: '115', quantidade: 1, isFoil: false },
    ];
    
    const { filteredCards: prioritized } = useSearch(ref(testCollection));
    
    expect(prioritized.value[0].nomeEN).toBe('Ojer Axonil, Deepest Might');
    expect(prioritized.value[1].nomeEN).toBe('Ulamog, the Infinite Gyre');
    expect(prioritized.value[2].nomeEN).toBe('Ashling, Flame Dancer');
  });
});
