export type RecordCategory = 'all' | 'billing' | 'security' | 'operations';

export type RecordStatus = 'active' | 'pending' | 'archived';

export type SortDirection = 'asc' | 'desc' | 'none';

export interface DashboardRecord {
  readonly id: string;
  readonly name: string;
  readonly category: RecordCategory;
  readonly amount: number;
  readonly status: RecordStatus;
  readonly createdAt: string;
}

export interface DashboardFilterState {
  readonly category: RecordCategory;
  readonly searchQuery: string;
}

export interface DashboardSortState {
  readonly column: 'amount' | 'name' | 'createdAt';
  readonly direction: SortDirection;
}

export interface ExportModalState {
  readonly isOpen: boolean;
  readonly confirmationInput: string;
  readonly isSubmitting: boolean;
}

export interface ApiResponseEnvelope<T> {
  readonly success: boolean;
  readonly data: T;
  readonly meta?: {
    readonly timestamp: number;
    readonly total: number;
  };
}
