<script setup lang="ts">
import { ref, computed, watch, onMounted, toRef } from 'vue';
import CardItem from './CardItem.vue';
import { useSearch } from '../composables/useSearch';
import type { CardData } from '../types';

const props = defineProps<{
  collection: CardData[];
}>();

const { searchTerm, colorFilter, filteredCards } = useSearch(toRef(props, 'collection'));

const colors = [
  { id: 'W', type: 'sprite', pos: '44.44% 33.33%', bg: 'hover:bg-white/10' },
  { id: 'U', type: 'sprite', pos: '55.55% 33.33%', bg: 'hover:bg-blue-500/10' },
  { id: 'B', type: 'sprite', pos: '66.66% 33.33%', bg: 'hover:bg-gray-700/10' },
  { id: 'R', type: 'sprite', pos: '77.77% 33.33%', bg: 'hover:bg-red-500/10' },
  { id: 'G', type: 'sprite', pos: '88.88% 33.33%', bg: 'hover:bg-green-500/10' },
  { id: 'C', type: 'image', bg: 'hover:bg-gray-400/10' },
  { id: 'M', type: 'rainbow', bg: '' },
];

const toggleColor = (id: string) => {
  const index = colorFilter.value.indexOf(id);
  if (index === -1) {
    colorFilter.value.push(id);
  } else {
    colorFilter.value.splice(index, 1);
  }
};

// Infinite Scroll Logic
const ITEMS_PER_PAGE = 20;
const displayLimit = ref(ITEMS_PER_PAGE);
const sentinel = ref<HTMLElement | null>(null);

const visibleCards = computed(() => {
  return filteredCards.value.slice(0, displayLimit.value);
});

const totalQuantity = computed(() => {
  return filteredCards.value.reduce((acc, card) => acc + card.quantidade, 0);
});

// Reset limit when search changes
watch([searchTerm, colorFilter, () => props.collection], () => {
  displayLimit.value = ITEMS_PER_PAGE;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, { deep: true });

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && displayLimit.value < filteredCards.value.length) {
      displayLimit.value += ITEMS_PER_PAGE;
    }
  }, { rootMargin: '400px' }); // Carrega um pouco antes de chegar no fim

  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-12">
    <!-- Search & Filters Container -->
    <div class="sticky top-4 md:top-8 z-50 mb-8 md:mb-12">
      <div class="relative group">
        <div class="absolute -inset-1 bg-linear-to-r from-red-600 to-orange-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div class="relative flex flex-col md:flex-row items-stretch md:items-center bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-white/10 overflow-hidden">
          
          <!-- Search Input -->
          <div class="relative flex items-center flex-1 border-b md:border-b-0 md:border-r border-white/5">
            <div class="pl-4 md:pl-6 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="Busque por nome ou edição..."
              class="w-full bg-transparent px-4 py-4 md:py-5 text-base md:text-lg font-medium focus:outline-hidden text-white placeholder:text-gray-500"
            />
          </div>
          
          <!-- Color Filters -->
          <div class="flex items-center justify-between md:justify-start gap-2 md:gap-1.5 px-4 py-3 md:py-0 md:px-6 bg-white/5 md:bg-transparent overflow-x-auto no-scrollbar">
            <button
              v-for="color in colors"
              :key="color.id"
              @click="toggleColor(color.id)"
              :title="`Filtrar por ${color.id}`"
              :class="[
                'w-9 h-9 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer shrink-0 border border-white/5',
                color.bg,
                colorFilter.includes(color.id) ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900 scale-110 opacity-100' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'
              ]"
            >
              <div 
                v-if="color.type === 'sprite'"
                class="mana-symbol"
                :style="{ backgroundPosition: color.pos }"
              ></div>
              <img 
                v-else-if="color.type === 'image'"
                src="../assets/c.svg" 
                class="w-full h-full object-contain"
                alt="Colorless"
              />
              <div 
                v-else-if="color.type === 'rainbow'"
                class="w-full h-full"
                style="background: linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff);"
              ></div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-500 text-center">
        <span class="flex items-center gap-2">
          Exibindo <span class="text-white">{{ visibleCards.length }}</span> modelos
        </span>
        <div class="hidden sm:block h-1 w-1 rounded-full bg-white/10"></div>
        <span class="text-red-500">
          {{ totalQuantity }} cartas no total
        </span>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div v-if="visibleCards.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      <CardItem 
        v-for="card in visibleCards" 
        :key="`${card.nomeEN}-${card.edicao}-${card.isFoil}`" 
        :card="card" 
      />
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-32 text-center">
      <div class="rounded-full bg-gray-800 p-6 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-bold text-white">Nenhuma carta encontrada</h3>
      <p class="mt-2 text-gray-400">Tente buscar por outro termo ou edição.</p>
    </div>

    <!-- Infinite Scroll Sentinel -->
    <div ref="sentinel" class="h-20 w-full flex items-center justify-center mt-12">
      <div v-if="displayLimit < filteredCards.length" class="flex gap-2">
        <div class="w-2 h-2 rounded-full bg-red-600 animate-bounce"></div>
        <div class="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.2s]"></div>
        <div class="w-2 h-2 rounded-full bg-red-600 animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mana-symbol {
  width: 100%;
  height: 100%;
  background-image: url('../assets/mana.svg');
  background-size: 1045% 730%;
  background-repeat: no-repeat;
  image-rendering: auto;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
