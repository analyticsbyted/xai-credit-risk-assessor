import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Extend vitest's expect method with methods from react-testing-library
expect.extend(matchers);

afterEach(() => {
  cleanup();
});