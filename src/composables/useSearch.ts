import { ref, computed, type Ref } from 'vue';
import Fuse from 'fuse.js';
import type { CardData } from '../types';

const PRIORITY_ORDER = [
  'Ojer Axonil, Deepest Might',
  'Ulamog, the Infinite Gyre',
  'Gloomlake Verge',
  'Arena of Glory',
  'Ashling, Flame Dancer',
  'Braid of Fire',
  'Pyroblast',
  'Ruby Medallion',
  'Seething Song',
  'Storm-Kiln Artist',
  'Reiterate',
  'Razorkin Needlehead',
  'Manabarbs',
  'Great Train Heist',
  'Goblin Bombardment',
  'Warren Instigator',
  'Nibelheim Aflame',
  'Price of Glory',
  'Wheel of Misfortune',
  'Dualcaster Mage',
  'Toralf, God of Fury',
  'Neheb, the Eternal',
  'Pashalik Mons',
  'Inspired Tinkering',
  'Red Elemental Blast',
  'Eidolon of the Great Revel',
  'Sacred Foundry',
  'Banner of Kinship',
  'Valakut Exploration',
  'Lightning Greaves',
  'Goblin Chieftain',
];

export function useSearch(collection: Ref<CardData[]>) {
  const searchTerm = ref('');
  const colorFilter = ref<string[]>([]);
  
  // Instância do Fuse que se reconstrói quando a coleção muda
  const fuse = computed(() => {
    return new Fuse(collection.value, {
      keys: ['nomePT', 'nomeEN', 'edicao'],
      threshold: 0.3,
      distance: 100,
    });
  });

  const filteredCards = computed(() => {
    let result = collection.value;

    if (searchTerm.value.trim()) {
      result = fuse.value.search(searchTerm.value).map(r => r.item);
    }

    if (colorFilter.value.length > 0) {
      result = result.filter(card => {
        const id = card.color_identity || [];
        
        const hasC = colorFilter.value.includes('C');
        const hasM = colorFilter.value.includes('M');
        const basics = colorFilter.value.filter(c => ['W','U','B','R','G'].includes(c));

        // Se marcou incolor e a carta é incolor
        if (hasC && id.length === 0) return true;

        // Se marcou 'Multi' sem especificar cor
        if (hasM && basics.length === 0 && id.length > 1) return true;

        if (basics.length > 0) {
          if (hasM) {
            // Se marcou 'Multi' + Cores: a carta deve ser multi e conter as cores selecionadas
            if (id.length > 1 && basics.every(b => id.includes(b))) return true;
          } else {
            // MATCH EXATO: A carta deve ter estritamente as cores selecionadas (e apenas elas)
            if (id.length === basics.length && basics.every(b => id.includes(b))) return true;
          }
        }

        return false;
      });
    }

    // Custom Priority Sorting
    return [...result].sort((a, b) => {
      const indexA = PRIORITY_ORDER.indexOf(a.nomeEN);
      const indexB = PRIORITY_ORDER.indexOf(b.nomeEN);

      // Se ambas estão na lista, segue a ordem da lista
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      
      // Se apenas A está na lista, A vem primeiro
      if (indexA !== -1) return -1;
      
      // Se apenas B está na lista, B vem primeiro
      if (indexB !== -1) return 1;

      // Se nenhuma está na lista, mantém a ordem original (Fuse score ou CSV order)
      return 0;
    });
  });

  return {
    searchTerm,
    colorFilter,
    filteredCards,
  };
}
