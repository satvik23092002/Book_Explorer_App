import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Pagination, Badge, Button } from 'react-bootstrap';
import axios from 'axios';
import BookCard from '../components/BookCard';
import SearchAndFilters from '../components/SearchAndFilters';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({ rating: '', inStock: '', minPrice: '', maxPrice: '', sortBy: 'title', sortOrder: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const buildQueryParams = (page, nextSearchTerm, currentFilters) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '20');

    if (nextSearchTerm && nextSearchTerm.trim()) {
      params.set('search', nextSearchTerm.trim());
    }

    if (currentFilters) {
      if (currentFilters.rating) params.set('rating', String(currentFilters.rating));
      if (currentFilters.inStock === 'true' || currentFilters.inStock === 'false') {
        params.set('inStock', currentFilters.inStock);
      }
      if (currentFilters.minPrice !== '' && currentFilters.minPrice != null) params.set('minPrice', String(currentFilters.minPrice));
      if (currentFilters.maxPrice !== '' && currentFilters.maxPrice != null) params.set('maxPrice', String(currentFilters.maxPrice));
      if (currentFilters.sortBy) params.set('sortBy', currentFilters.sortBy);
      if (currentFilters.sortOrder) params.set('sortOrder', currentFilters.sortOrder);
    }

    return params;
  };

  const fetchBooks = async (page = 1, nextSearchTerm = searchTerm, filterParams = filters) => {
    try {
      setLoading(true);
      setError(null);

      const params = buildQueryParams(page, nextSearchTerm, filterParams);
      const response = await axios.get(`${API_BASE_URL}/books?${params.toString()}`);
      
      setBooks(response.data.books);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchBooks(1, term, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchBooks(1, searchTerm, newFilters);
  };

  const handleClear = () => {
    const cleared = { rating: '', inStock: '', minPrice: '', maxPrice: '', sortBy: 'title', sortOrder: 'asc' };
    setFilters(cleared);
    setSearchTerm('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchBooks(1, '', cleared);
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
    fetchBooks(page, searchTerm, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const items = [];
    const { currentPage, totalPages } = pagination;

    items.push(
      <Pagination.Prev
        key="prev"
        disabled={!pagination.hasPrev}
        onClick={() => handlePageChange(currentPage - 1)}
      />
    );

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={!pagination.hasNext}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    );

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>{items}</Pagination>
      </div>
    );
  };

  if (loading && books.length === 0) {
    return (
      <Container>
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="px-3 px-md-4 px-lg-5">
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClear={handleClear}
        loading={loading}
      />

      {error && (
        <Alert 
          variant="danger" 
          className="error-message fade-in"
          style={{
            borderRadius: '0.75rem',
            border: 'none',
            boxShadow: 'var(--shadow-sm)',
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            color: '#dc2626',
            borderLeft: '4px solid #dc2626'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span>
            <strong>Error:</strong> {error}
          </div>
        </Alert>
      )}

      {/* Results Header */}
      <div className="results-header mb-4 fade-in">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 style={{ 
              color: 'var(--text-primary)', 
              fontWeight: '700',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📚</span>
              Books
              <Badge 
                bg="primary" 
                style={{
                  fontSize: '0.8rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  border: 'none'
                }}
              >
                {pagination.totalBooks}
              </Badge>
            </h2>
            <p style={{ 
              color: 'var(--text-muted)', 
              margin: '0.5rem 0 0 0',
              fontSize: '0.9rem'
            }}>
              Discover amazing books from our collection
            </p>
          </div>
          
          {loading && (
            <div className="d-flex align-items-center gap-2">
              <Spinner 
                size="sm" 
                style={{ 
                  color: 'var(--primary-color)',
                  width: '1.5rem',
                  height: '1.5rem'
                }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Loading books...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <Row className="g-4">
        {books.map((book, index) => (
          <Col 
            key={book._id} 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            xl={2}
            className="book-col"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <BookCard book={book} />
          </Col>
        ))}
      </Row>

      {/* No Results */}
      {books.length === 0 && !loading && (
        <div className="no-results text-center py-5 fade-in">
          <div style={{
            background: 'var(--bg-primary)',
            borderRadius: '1rem',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-sm)',
            border: '2px dashed var(--gray-200)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
            <h3 style={{ 
              color: 'var(--text-primary)', 
              marginBottom: '1rem',
              fontWeight: '600'
            }}>
              No books found
            </h3>
            <p style={{ 
              color: 'var(--text-muted)', 
              marginBottom: '1.5rem',
              fontSize: '1rem'
            }}>
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              variant="outline-primary"
              onClick={handleClear}
              style={{
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontWeight: '500',
                border: '2px solid var(--primary-color)',
                color: 'var(--primary-color)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--primary-color)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'var(--primary-color)';
              }}
            >
              🔄 Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}
    </Container>
  );
};

export default BookList;
