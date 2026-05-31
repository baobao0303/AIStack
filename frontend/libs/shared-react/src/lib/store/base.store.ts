// Base State and Actions for Zustand Stores (SPEC_CORE_FE)

export interface BaseState {
  loading: boolean;
  error?: string;
}

export interface BaseActions {
  reset(): void;
  clearError(): void;
}

// Initial state utility helper
export const initialBaseState: BaseState = {
  loading: false,
  error: undefined,
};
