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
  <div class="min-h-screen bg-black text-white selection:bg-red-500/30">
    <!-- Header -->
    <header class="relative py-12 md:py-16 px-4 overflow-hidden border-b border-white/5">
      <div class="absolute inset-0 bg-linear-to-b from-red-600/10 to-transparent"></div>
      <div class="relative mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
          <div class="text-center md:text-left">
            <h1 class="text-4xl font-black tracking-tighter sm:text-7xl">
              MTG <span class="bg-linear-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">CATALOG</span>
            </h1>
            <p class="mt-3 md:mt-4 text-gray-400 text-base md:text-lg font-medium max-w-xl mx-auto md:mx-0">
              Navegue pela minha coleção pessoal com precisão cirúrgica.
            </p>
          </div>

          <!-- Collection Selector & Download -->
          <div class="w-full md:w-auto flex flex-col sm:flex-row items-end gap-3">
            <div class="w-full md:w-72 relative">
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1 text-center md:text-left">Selecionar Coleção</label>
              <select 
                v-model="selectedCollectionId" 
                @change="loadCollection(selectedCollectionId)"
                class="w-full bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-red-400 focus:ring-2 focus:ring-red-600 focus:outline-hidden transition-all shadow-xl appearance-none cursor-pointer text-center md:text-left"
              >
                <option v-for="c in collections" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
              <div class="absolute right-4 bottom-4 pointer-events-none text-red-600/50 hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <a 
              :href="`https://github.com/JVBicalho/mtg-catalog/blob/main/src/assets/data/${selectedCollectionId}.csv`"
              target="_blank"
              rel="noopener noreferrer"
              data-test="download-csv"
              class="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 hover:border-red-600/40 text-red-400 px-5 py-3.5 rounded-xl font-bold text-xs transition-all active:scale-95 group"
              title="Baixar CSV no GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span class="sm:hidden md:inline">Baixar CSV</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 pb-20">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
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
        'fixed bottom-8 right-8 p-3 rounded-full bg-red-700/80 hover:bg-red-600 text-white shadow-lg backdrop-blur-sm transition-all duration-300 z-50',
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
