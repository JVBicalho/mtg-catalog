<script setup lang="ts">
import { ref, computed, watch, onMounted, toRef } from 'vue';
import CardItem from './CardItem.vue';
import { useSearch } from '../composables/useSearch';
import type { CardData } from '../types';

const props = defineProps<{
  collection: CardData[];
}>();

const { searchTerm, filteredCards } = useSearch(toRef(props, 'collection'));

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
watch([searchTerm, () => props.collection], () => {
  displayLimit.value = ITEMS_PER_PAGE;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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
    <!-- Search Bar -->
    <div class="sticky top-8 z-50 mb-12">
      <div class="relative group">
        <div class="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div class="relative flex items-center bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-white/10">
          <input 
            v-model="searchTerm"
            type="text" 
            placeholder="Busque por nome ou edição..."
            class="w-full bg-transparent px-6 py-5 text-lg font-medium focus:outline-hidden text-white"
          />
          <div class="pr-6 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="mt-4 flex justify-center items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
        <span>Exibindo {{ visibleCards.length }} modelos</span>
        <div class="h-1 w-1 rounded-full bg-white/10"></div>
        <span class="text-indigo-400">{{ totalQuantity }} cartas no total</span>
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
        <div class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
        <div class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></div>
        <div class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  </div>
</template>
