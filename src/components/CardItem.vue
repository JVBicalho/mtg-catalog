<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CardData } from '../types';

const props = defineProps<{
  card: CardData;
}>();

const errorCount = ref(0);

const scryfallUrl = computed(() => {
  const name = encodeURIComponent(props.card.nomeEN);
  const set = encodeURIComponent(props.card.setCode.toLowerCase());
  const number = encodeURIComponent(props.card.collectorNumber);
  
  // PR30 specific fallback (ignoring collector number due to LigaMagic discrepancies)
  if (set === 'p30a') {
    if (errorCount.value >= 2) {
      return `https://api.scryfall.com/cards/named?exact=${name}&format=image`;
    }
    if (errorCount.value === 1) {
      return `https://api.scryfall.com/cards/named?exact=${name}&set=p30m&format=image`;
    }
    return `https://api.scryfall.com/cards/named?exact=${name}&set=p30a&format=image`;
  }

  // Nível 3: Fallback final por nome aproximado (último recurso)

  if (errorCount.value >= 2) {
    return `https://api.scryfall.com/cards/named?fuzzy=${name}&format=image`;
  }
  
  // Nível 2: Fallback por nome exato + set (ou se o set for problemático como mb1/plst)
  const bypassSets = ['mb1', 'plst', 'list', 'plist'];
  if (errorCount.value === 1 || bypassSets.includes(props.card.setCode.toLowerCase())) {
    return `https://api.scryfall.com/cards/named?exact=${name}&set=${set}&format=image`;
  }
  
  // Nível 1: Busca primária por Set/Número
  return `https://api.scryfall.com/cards/${set}/${number}?format=image`;
});

const handleImageError = () => {
  if (errorCount.value < 2) {
    // Log diagnóstico para ajudar no mapeamento
    console.warn(
      `[IMAGEM NÃO ENCONTRADA] Tentativa ${errorCount.value + 1}: ` +
      `${props.card.nomeEN} (Set: ${props.card.setCode}, Num: ${props.card.collectorNumber}). ` +
      `Tentando próximo nível de fallback...`
    );
    errorCount.value++;
  }
};
</script>

<template>
  <div class="group relative overflow-hidden rounded-xl bg-gray-900 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20">
    <!-- Card Image -->
    <img 
      :src="scryfallUrl" 
      :alt="card.nomePT"
      loading="lazy"
      @error="handleImageError"
      class="h-auto w-full object-cover transition-opacity duration-300"
    />

    <!-- Overlays -->
    <div class="absolute inset-0 flex flex-col justify-between p-3 opacity-0 transition-opacity group-hover:opacity-100 bg-linear-to-t from-black/80 via-transparent to-transparent">
      <div class="flex justify-between items-start">
        <!-- Quantity Badge -->
        <span class="inline-flex items-center rounded-md bg-red-600/90 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-md">
          x{{ card.quantidade }}
        </span>

        <!-- Foil Badge -->
        <span 
          v-if="card.isFoil" 
          class="badge-foil inline-flex items-center rounded-md bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 px-2 py-1 text-xs font-bold text-white shadow-lg animate-pulse"
        >
          FOIL
        </span>
      </div>

      <div class="text-white">
        <h3 class="text-sm font-bold truncate">{{ card.nomePT }}</h3>
        <p class="text-[10px] text-gray-300 truncate">{{ card.edicao }}</p>
      </div>
      
      <!-- Version Alert Badge -->
      <div 
        v-if="errorCount > 0 && !(card.setCode.toLowerCase() === 'p30a' && errorCount === 1)" 
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-2 pointer-events-none"
      >
        <div class="bg-amber-500/90 backdrop-blur-sm text-black text-[9px] font-black py-1 px-2 rounded-lg shadow-xl text-center leading-tight border border-amber-400">
          VERSÃO [{{ card.setCode.toUpperCase() }}] INDISPONÍVEL<br/>
          <span class="opacity-70 font-bold">EXIBINDO ARTE PADRÃO</span>
        </div>
      </div>
    </div>
    
    <!-- Permanent Small Indicators (visible when not hovered) -->
    <div class="absolute bottom-2 right-2 flex gap-1 group-hover:hidden">
       <span class="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
         x{{ card.quantidade }}
       </span>
       <span v-if="card.isFoil" class="rounded bg-linear-to-r from-red-500 to-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
         F
       </span>
    </div>
  </div>
</template>
