import { ref, computed, type Ref } from 'vue';
import Fuse from 'fuse.js';
import type { CardData } from '../types';

export function useSearch(collection: Ref<CardData[]>) {
  const searchTerm = ref('');
  
  // Instância do Fuse que se reconstrói quando a coleção muda
  const fuse = computed(() => {
    return new Fuse(collection.value, {
      keys: ['nomePT', 'nomeEN', 'edicao'],
      threshold: 0.3,
      distance: 100,
    });
  });

  const filteredCards = computed(() => {
    if (!searchTerm.value.trim()) {
      return collection.value;
    }
    return fuse.value.search(searchTerm.value).map(result => result.item);
  });

  return {
    searchTerm,
    filteredCards,
  };
}
