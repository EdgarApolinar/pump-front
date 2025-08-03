// src/components/Table/Table.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

const Table = ({ 
  columns, 
  data, 
  onRowClick,
  sortConfig,
  onSort,
  isLoading
}) => {
  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className="table-container">
      {isLoading && <div className="loading-overlay">Cargando...</div>}
      
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                style={{ width: column.width || 'auto' }}
                onClick={() => column.sortable && handleSort(column.key)}
                className={column.sortable ? 'sortable' : ''}
              >
                <div className="header-content">
                  {column.title}
                  {column.sortable && (
                    <span className="sort-icon">
                      {sortConfig?.key === column.key 
                        ? (sortConfig.direction === 'ascending' ? '↑' : '↓') 
                        : '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? 'clickable-row' : ''}
              >
                {columns.map((column) => (
                  <td key={`${column.key}-${rowIndex}`}>
                    {column.render 
                      ? column.render(row[column.key], row) 
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="no-data">
              <td colSpan={columns.length}>
                {isLoading ? 'Buscando datos...' : 'No se encontraron registros'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.string,
      sortable: PropTypes.bool,
      render: PropTypes.func
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['ascending', 'descending'])
  }),
  onSort: PropTypes.func,
  isLoading: PropTypes.bool
};

export default Table;