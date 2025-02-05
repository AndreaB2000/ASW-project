import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCounterStore } from '@/stores/counter';

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia()); // Resetta lo store prima di ogni test
  });

  it('has an initial count of 0', () => {
    const counter = useCounterStore();
    expect(counter.count).toBe(0);
  });

  it('increments the count', () => {
    const counter = useCounterStore();
    counter.increment();
    expect(counter.count).toBe(1);
  });

  it('doubleCount returns double the count', () => {
    const counter = useCounterStore();
    counter.count = 5; // Settiamo manualmente il valore
    expect(counter.doubleCount).toBe(10);
  });
});
