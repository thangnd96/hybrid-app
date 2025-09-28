
// Mock axios
const mockAxiosInstance = {
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
};

jest.mock('axios', () => {
  const createMock = jest.fn(() => mockAxiosInstance);
  return {
    __esModule: true,
    default: { create: createMock },
    create: createMock,
  };
});

describe('api', () => {
  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();
    await (jest as typeof jest & { isolateModulesAsync: (fn: () => Promise<void>) => Promise<void> }).isolateModulesAsync(async () => {
      await import('../api');
    });
  });

  it('should set up request interceptor', () => {
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
  });
});