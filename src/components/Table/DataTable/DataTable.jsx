// src/components/DataTableServer/DataTableServer.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from '../Table/Table';
import Pagination from '../Pagination/Pagination';
import './DataTable.css';

const DataTable = ({ 
  columns, 
  fetchData, 
  onRowClick,
  initialPage = 1,
  itemsPerPage = 10,
  initialSortField = null,
  initialSortDirection = 'asc'
}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalItems, setTotalItems] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    field: initialSortField,
    direction: initialSortDirection
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when page, sort or filters change
  useEffect(() => {
    const abortController = new AbortController();
    const fetchDataFromServer = async () => {
      setIsLoading(true);
      setError(null);
      
      try {

        //console.info(fetchData)

        const params = {
          page: currentPage,
          pageSize: itemsPerPage,
          sortField: sortConfig.field,
          sortDirection: sortConfig.direction
        };

        const response = await fetchData(params, { signal: abortController.signal });
        console.log(response);
        setData(response.data);
        setTotalItems(response.total || response.data.length);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromServer();

    return () => abortController.abort(); // Cancela la petición al desmontar
  }, [currentPage, sortConfig, fetchData, itemsPerPage]);

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="data-table-server">
      {error && <div className="error-message">{error}</div>}
      
      <Table
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        sortConfig={{
          key: sortConfig.field,
          direction: sortConfig.direction
        }}
        onSort={handleSort}
        isLoading={isLoading}
      />
      
      {totalItems > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={isLoading}
        />
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.string,
      sortable: PropTypes.bool,
      render: PropTypes.func
    })
  ).isRequired,
  fetchData: PropTypes.func.isRequired,
  onRowClick: PropTypes.func,
  initialPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  initialSortField: PropTypes.string,
  initialSortDirection: PropTypes.oneOf(['asc', 'desc'])
};

DataTable.defaultProps = {
  initialPage: 1,
  itemsPerPage: 10,
  initialSortDirection: 'asc'
};

export default DataTable;