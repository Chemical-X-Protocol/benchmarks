import React from 'react';
import type { DashboardRecord, DashboardSortState, SortDirection } from '../../../types/dashboard';
import './m-dashboard-table.css';

export interface MDashboardTableProps {
  readonly items: DashboardRecord[];
  readonly isLoading: boolean;
  readonly sortState: DashboardSortState;
  readonly onToggleAmountSort: () => void;
}

const DIRECTION_INDICATORS: Record<SortDirection, string> = { asc: '▲', desc: '▼', none: '' };

const getStatusBadge = (status: string, amount: number) => {
  const isActive = status === 'active';
  const isHighValue = amount > 200;
  if (isActive && isHighValue) return { cls: 'm-dashboard-table__status--active-high', text: status };
  if (isActive) return { cls: 'm-dashboard-table__status--active', text: status };
  if (status === 'pending') return { cls: 'm-dashboard-table__status--pending', text: status };
  return { cls: 'm-dashboard-table__status--archived', text: status };
};

export const MDashboardTable: React.FC<MDashboardTableProps> = ({
  items,
  isLoading,
  sortState,
  onToggleAmountSort
}) => {
  const hasItems = items.length > 0;
  const isSortedByAmount = sortState.column === 'amount' && sortState.direction !== 'none';
  const directionIndicator = DIRECTION_INDICATORS[sortState.direction];

  const renderRow = (item: DashboardRecord) => {
    const badge = getStatusBadge(item.status, item.amount);
    return (
      <tr key={item.id} className="m-dashboard-table__row">
        <td className="m-dashboard-table__td">{item.id}</td>
        <td className="m-dashboard-table__td m-dashboard-table__td--bold">{item.name}</td>
        <td className="m-dashboard-table__td">{item.category}</td>
        <td data-testid="record-row-amount" className="m-dashboard-table__td m-dashboard-table__td--amount">
          {item.amount}
        </td>
        <td className={`m-dashboard-table__td ${badge.cls}`}>{badge.text}</td>
        <td className="m-dashboard-table__td m-dashboard-table__td--muted">{item.createdAt}</td>
      </tr>
    );
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} className="m-dashboard-table__td-status-msg">Loading records...</td>
        </tr>
      );
    }
    if (!hasItems) {
      return (
        <tr>
          <td colSpan={6} className="m-dashboard-table__td-status-msg">No matching records found.</td>
        </tr>
      );
    }
    return items.map(renderRow);
  };

  return (
    <div className="m-dashboard-table">
      <table className="m-dashboard-table__table">
        <thead>
          <tr className="m-dashboard-table__header-row">
            <th className="m-dashboard-table__th">ID</th>
            <th className="m-dashboard-table__th">Name</th>
            <th className="m-dashboard-table__th">Category</th>
            <th
              data-testid="sort-header-amount"
              onClick={onToggleAmountSort}
              className="m-dashboard-table__th m-dashboard-table__th--sortable"
            >
              Amount {isSortedByAmount && directionIndicator}
              <span data-testid="sort-indicator-amount" className="m-dashboard-table__sort-indicator">
                ({sortState.direction.toUpperCase()})
              </span>
            </th>
            <th className="m-dashboard-table__th">Status</th>
            <th className="m-dashboard-table__th">Created At</th>
          </tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
};

export default MDashboardTable;
