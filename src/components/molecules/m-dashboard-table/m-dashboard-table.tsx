import React from 'react';
import type { DashboardRecord, DashboardSortState } from '../../../types/dashboard';

export interface MDashboardTableProps {
  readonly items: DashboardRecord[];
  readonly isLoading: boolean;
  readonly sortState: DashboardSortState;
  readonly onToggleAmountSort: () => void;
}

const getStatusBadgeDescriptor = (status: string, amount: number) => {
  const isActive = status === 'active';
  const isHighValue = amount > 200;

  if (isActive && isHighValue) return { color: '#4ade80', text: status };
  if (isActive) return { color: '#86efac', text: status };
  if (status === 'pending') return { color: '#facc15', text: status };
  return { color: '#f87171', text: status };
};

export const MDashboardTable: React.FC<MDashboardTableProps> = ({
  items,
  isLoading,
  sortState,
  onToggleAmountSort
}) => {
  const hasItems = items.length > 0;
  const isSortedByAmount = sortState.column === 'amount' && sortState.direction !== 'none';
  const directionIndicator = sortState.direction === 'asc' ? '▲' : sortState.direction === 'desc' ? '▼' : '';

  return (
    <div style={{ background: '#131e3a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155' }}>
            <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>ID</th>
            <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>Name</th>
            <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>Category</th>
            <th
              data-testid="sort-header-amount"
              onClick={onToggleAmountSort}
              style={{ padding: '12px 16px', color: '#62c9ff', fontSize: '13px', cursor: 'pointer', userSelect: 'none' }}
            >
              Amount {isSortedByAmount && directionIndicator}
              <span data-testid="sort-indicator-amount" style={{ marginLeft: '4px', fontSize: '11px' }}>
                ({sortState.direction.toUpperCase()})
              </span>
            </th>
            <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>Status</th>
            <th style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '13px' }}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                Loading records...
              </td>
            </tr>
          ) : !hasItems ? (
            <tr>
              <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                No matching records found.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const badge = getStatusBadgeDescriptor(item.status, item.amount);
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{item.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{item.category}</td>
                  <td data-testid="record-row-amount" style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace' }}>
                    {item.amount}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: badge.color }}>
                    {badge.text}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#94a3b8' }}>{item.createdAt}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MDashboardTable;
