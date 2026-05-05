import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';

// Mock do fetch para evitar erros de rede durante o teste
global.fetch = vi.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(''),
  } as Response)
);

describe('App', () => {
  it('should render the download button for the current collection', async () => {
    const wrapper = mount(App);
    
    // O botão de download deve existir
    const downloadBtn = wrapper.find('[data-test="download-csv"]');
    expect(downloadBtn.exists()).toBe(true);
    
    // O link deve apontar para o GitHub (usando o ID da coleção selecionada)
    // Nota: Por padrão a primeira coleção é selecionada
    const expectedPrefix = 'https://github.com/JVBicalho/mtg-catalog/blob/main/src/assets/data/';
    expect(downloadBtn.attributes('href')).toContain(expectedPrefix);
  });
});
