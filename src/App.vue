<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import CardGallery from './components/CardGallery.vue';
import { parseLigaMagicCSV } from './utils/parser';
import type { CardData } from './types';
const csvFiles = import.meta.glob('./assets/data/*.csv', { eager: true, query: '?url' });

const collections = Object.entries(csvFiles).map(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.csv', '') || 'Coleção';
  const formattedName = fileName
    .split(/[_-]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return {
    id: fileName,
    name: formattedName,
    path: (module as any).default
  };
});

const selectedCollectionId = ref(collections[0]?.id || '');
const collection = ref<CardData[]>([]);
const isLoading = ref(false);
const showScrollTop = ref(false);

const checkScroll = () => {
  showScrollTop.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const loadCollection = async (id: string) => {
  isLoading.value = true;
  try {
    const selected = collections.find(c => c.id === id);
    if (!selected) return;
    
    const response = await fetch(selected.path);
    const csvText = await response.text();
    collection.value = parseLigaMagicCSV(csvText);
  } catch (error) {
    console.error('Erro ao carregar a coleção:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadCollection(selectedCollectionId.value);
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<template>
  <div class="min-h-screen bg-black text-white selection:bg-indigo-500/30">
    <!-- Header -->
    <header class="relative py-16 px-4 overflow-hidden border-b border-white/5">
      <div class="absolute inset-0 bg-linear-to-b from-indigo-500/10 to-transparent"></div>
      <div class="relative mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div class="text-center md:text-left">
            <h1 class="text-5xl font-black tracking-tighter sm:text-7xl">
              MTG <span class="bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">CATALOG</span>
            </h1>
            <p class="mt-4 text-gray-400 text-lg font-medium max-w-xl">
              Navegue pela minha coleção pessoal com precisão cirúrgica.
            </p>
          </div>

          <!-- Collection Selector -->
          <div class="w-full md:w-72">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">Selecionar Coleção</label>
            <select 
              v-model="selectedCollectionId" 
              @change="loadCollection(selectedCollectionId)"
              class="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all shadow-xl appearance-none cursor-pointer"
            >
              <option v-for="c in collections" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 pb-20">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-500 font-medium animate-pulse">Sintonizando os planos...</p>
      </div>
      
      <CardGallery v-else :collection="collection" />
    </main>

    <!-- Footer -->
    <footer class="py-10 border-t border-white/5 text-center text-gray-600 text-sm">
      <p>&copy; 2024 MTG Collection Catalog. Desenvolvido com Vue 3 & Scryfall API.</p>
    </footer>

    <!-- Scroll to Top Button -->
    <button 
      @click="scrollToTop"
      :class="[
        'fixed bottom-8 right-8 p-3 rounded-full bg-indigo-600/80 hover:bg-indigo-500 text-white shadow-lg backdrop-blur-sm transition-all duration-300 z-50',
        showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      ]"
      aria-label="Voltar ao topo"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
