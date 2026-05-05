import { ref, computed, type Ref } from 'vue';
import Fuse from 'fuse.js';
import type { CardData } from '../types';

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

    return result;
  });

  return {
    searchTerm,
    colorFilter,
    filteredCards,
  };
}
