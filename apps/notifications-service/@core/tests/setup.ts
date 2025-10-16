// Mock uuid para contornar o problema do ESM
let counter = 0;
jest.mock('uuid', () => ({
  v4: () => {
    counter++;
    return `550e8400-e29b-41d4-a716-44665544${String(counter).padStart(4, '0')}`;
  },
}));
