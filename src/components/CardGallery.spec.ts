import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardGallery from './CardGallery.vue';
import type { CardData } from '../types';

describe('CardGallery', () => {
  const mockCollection: CardData[] = [
    { nomePT: 'Llanowar Elves', nomeEN: 'Llanowar Elves', edicao: 'M10', setCode: 'm10', collectorNumber: '1', quantidade: 4, isFoil: false },
    { nomePT: 'Raios', nomeEN: 'Lightning Bolt', edicao: 'Magic 2010', setCode: 'm10', collectorNumber: '2', quantidade: 2, isFoil: true },
  ];

  it('should render all cards initially', () => {
    const wrapper = mount(CardGallery, {
      props: { collection: mockCollection }
    });

    wrapper.findAllComponents({ name: 'CardItem' });
    // Note: If CardItem name is not explicitly defined, we might need another selector.
    // Let's assume we can find them by a class or just check the number of images.
    expect(wrapper.findAll('img')).toHaveLength(2);
  });

  it('should filter cards when searching', async () => {
    const wrapper = mount(CardGallery, {
      props: { collection: mockCollection }
    });

    const input = wrapper.find('input');
    await input.setValue('Raios');

    expect(wrapper.findAll('img')).toHaveLength(1);
  });
});
