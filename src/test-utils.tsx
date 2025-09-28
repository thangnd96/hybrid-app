import { Fragment, type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';

// Simple wrapper for testing without router complexity
// eslint-disable-next-line react-refresh/only-export-components
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <Fragment>{children}</Fragment>;
};

const customRender = (ui: ReactElement, options: Omit<RenderOptions, 'wrapper'> = {}) => {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
};

// Re-export everything
export {
  render as rtlRender,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
  within,
  getByTestId,
  getByText,
  queryByText,
  queryByTestId,
  findByText,
  findByTestId,
  // add any other specific exports you need from '@testing-library/react'
} from '@testing-library/react';
export { customRender as render };
