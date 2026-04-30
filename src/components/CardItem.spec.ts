import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardItem from './CardItem.vue';
import type { CardData } from '../types';

describe('CardItem', () => {
  const mockCard: CardData = {
    nomePT: 'Raios',
    nomeEN: 'Lightning Bolt',
    edicao: 'Magic 2010',
    setCode: 'm10',
    collectorNumber: '123',
    quantidade: 2,
    isFoil: true
  };

  it('should render the correct Scryfall image URL with set and collector number', () => {
    const wrapper = mount(CardItem, {
      props: { card: mockCard }
    });

    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe('https://api.scryfall.com/cards/m10/123?format=image');
  });

  it('should display quantity and foil badge', () => {
    const wrapper = mount(CardItem, {
      props: { card: mockCard }
    });

    expect(wrapper.text()).toContain('x2');
    expect(wrapper.find('.badge-foil').exists()).toBe(true);
  });

  it('should NOT display foil badge if card is NOT foil', () => {
    const nonFoilCard = { ...mockCard, isFoil: false };
    const wrapper = mount(CardItem, {
      props: { card: nonFoilCard }
    });

    expect(wrapper.find('.badge-foil').exists()).toBe(false);
  });

  it('should fallback to name+set and then to fuzzy name if image fails', async () => {
    const wrapper = mount(CardItem, {
      props: { card: mockCard }
    });

    const img = wrapper.find('img');
    
    // First error: should fallback to named?exact=...&set=m10
    await img.trigger('error');
    expect(img.attributes('src')).toContain('api.scryfall.com/cards/named?exact=Lightning%20Bolt&set=m10');

    // Second error: should fallback to named?fuzzy=...
    await img.trigger('error');
    expect(img.attributes('src')).toContain('api.scryfall.com/cards/named?fuzzy=Lightning%20Bolt');

    // Should display the alert badge
    expect(wrapper.text()).toContain('INDISPONÍVEL');
  });

  describe('PR30 Fallback Logic', () => {
    const pr30Card = {
      ...mockCard,
      setCode: 'p30a',
      collectorNumber: '1',
      nomeEN: 'Arcane Signet'
    };

    it('should try p30a first, fallback to p30m, then named?exact without set', async () => {
      const wrapper = mount(CardItem, {
        props: { card: pr30Card }
      });

      const img = wrapper.find('img');
      
      // Level 1: p30a
      expect(img.attributes('src')).toContain('api.scryfall.com/cards/named?exact=Arcane%20Signet&set=p30a');

      // Error 1 -> Level 2: p30m
      await img.trigger('error');
      expect(img.attributes('src')).toContain('api.scryfall.com/cards/named?exact=Arcane%20Signet&set=p30m');

      // Error 2 -> Level 3: named?exact without set
      await img.trigger('error');
      expect(img.attributes('src')).toContain('api.scryfall.com/cards/named?exact=Arcane%20Signet');
      expect(img.attributes('src')).not.toContain('set=');
    });
  });
});

