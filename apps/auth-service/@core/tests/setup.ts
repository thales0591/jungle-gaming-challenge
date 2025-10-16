// Mock uuid to avoid ESM issues and generate valid UUIDs
jest.mock('uuid', () => ({
  v4: () => {
    // Generate a valid UUID v4 format
    const hex = '0123456789abcdef';
    let uuid = '';
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid += '-';
      } else if (i === 14) {
        uuid += '4'; // UUID version 4
      } else if (i === 19) {
        uuid += hex[Math.floor(Math.random() * 4) + 8]; // UUID variant
      } else {
        uuid += hex[Math.floor(Math.random() * 16)];
      }
    }
    return uuid;
  },
}));
