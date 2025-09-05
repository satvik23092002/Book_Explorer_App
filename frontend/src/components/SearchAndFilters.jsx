import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Card, InputGroup } from 'react-bootstrap';

const SearchAndFilters = ({ searchTerm, onSearch, onFilter, onClear, loading }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm || '');
  const [filters, setFilters] = useState({
    rating: '',
    inStock: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });

  useEffect(() => {
    setLocalSearch(searchTerm || '');
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(localSearch);
  };

  const setFilterField = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumericChange = (field, value) => {
    const sanitized = value.replace(/[^0-9]/g, '');
    setFilterField(field, sanitized);
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      rating: '',
      inStock: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'title',
      sortOrder: 'asc'
    };
    setFilters(clearedFilters);
    setLocalSearch('');
    if (onClear) onClear();
  };

  return (
    <div className="search-container slide-up">
      {/* Search Section */}
      <div className="search-section mb-4">
        <h5 className="mb-3" style={{ 
          color: 'var(--text-primary)', 
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>🔍</span>
          Search Books
        </h5>
        
        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by book title..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              style={{
                borderRadius: '0.5rem 0 0 0.5rem',
                border: '2px solid var(--gray-200)',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary-color)';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--gray-200)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <Button 
              type="submit" 
              variant="primary"
              disabled={loading}
              style={{
                borderRadius: '0 0.5rem 0.5rem 0',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                border: 'none',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? '⏳' : '🔍'} Search
            </Button>
          </InputGroup>
          
          <div className="d-flex gap-2 flex-wrap">
            <Button 
              type="button"
              variant="outline-secondary" 
              onClick={clearFilters}
              disabled={loading}
              style={{
                borderRadius: '0.5rem',
                border: '2px solid var(--gray-300)',
                color: 'var(--text-secondary)',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--gray-400)';
                e.target.style.backgroundColor = 'var(--gray-100)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--gray-300)';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              🗑️ Clear All
            </Button>
            
            <Button
              type="button"
              variant="success"
              onClick={applyFilters}
              disabled={loading}
              style={{
                borderRadius: '0.5rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ✅ Apply Filters
            </Button>
          </div>
        </Form>
      </div>

      {/* Filters Section */}
      <Card className="filter-section">
        <Card.Header style={{
          background: 'linear-gradient(135deg, var(--bg-tertiary), var(--gray-100))',
          borderBottom: '1px solid var(--gray-200)',
          borderRadius: '0.75rem 0.75rem 0 0'
        }}>
          <h6 className="mb-0" style={{ 
            color: 'var(--text-primary)', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚙️</span>
            Filters & Sorting
          </h6>
        </Card.Header>
        
        <Card.Body style={{ padding: '1.5rem' }}>
          <Row className="g-3">
            <Col xs={12} sm={6} md={3}>
              <Form.Group>
                <Form.Label style={{ 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  ⭐ Rating
                </Form.Label>
                <Form.Select
                  value={filters.rating}
                  onChange={(e) => setFilterField('rating', e.target.value)}
                  disabled={loading}
                  style={{
                    borderRadius: '0.5rem',
                    border: '2px solid var(--gray-200)',
                    padding: '0.5rem 0.75rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">All Ratings</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                  <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                  <option value="3">⭐⭐⭐ 3 Stars</option>
                  <option value="2">⭐⭐ 2 Stars</option>
                  <option value="1">⭐ 1 Star</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col xs={12} sm={6} md={3}>
              <Form.Group>
                <Form.Label style={{ 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  📦 Availability
                </Form.Label>
                <Form.Select
                  value={filters.inStock}
                  onChange={(e) => setFilterField('inStock', e.target.value)}
                  disabled={loading}
                  style={{
                    borderRadius: '0.5rem',
                    border: '2px solid var(--gray-200)',
                    padding: '0.5rem 0.75rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">All</option>
                  <option value="true">✅ In Stock</option>
                  <option value="false">❌ Out of Stock</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col xs={6} sm={3} md={2}>
              <Form.Group>
                <Form.Label style={{ 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  💰 Min Price
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text style={{
                    background: 'var(--bg-tertiary)',
                    border: '2px solid var(--gray-200)',
                    borderRight: 'none',
                    borderRadius: '0.5rem 0 0 0.5rem'
                  }}>
                    £
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleNumericChange('minPrice', e.target.value)}
                    disabled={loading}
                    style={{
                      borderRadius: '0 0.5rem 0.5rem 0',
                      border: '2px solid var(--gray-200)',
                      borderLeft: 'none',
                      padding: '0.5rem 0.75rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--gray-200)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col xs={6} sm={3} md={2}>
              <Form.Group>
                <Form.Label style={{ 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  💰 Max Price
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text style={{
                    background: 'var(--bg-tertiary)',
                    border: '2px solid var(--gray-200)',
                    borderRight: 'none',
                    borderRadius: '0.5rem 0 0 0.5rem'
                  }}>
                    £
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    placeholder="100"
                    value={filters.maxPrice}
                    onChange={(e) => handleNumericChange('maxPrice', e.target.value)}
                    disabled={loading}
                    style={{
                      borderRadius: '0 0.5rem 0.5rem 0',
                      border: '2px solid var(--gray-200)',
                      borderLeft: 'none',
                      padding: '0.5rem 0.75rem',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--primary-color)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--gray-200)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label style={{ 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  📊 Sort By
                </Form.Label>
                <Form.Select
                  value={filters.sortBy}
                  onChange={(e) => setFilterField('sortBy', e.target.value)}
                  disabled={loading}
                  style={{
                    borderRadius: '0.5rem',
                    border: '2px solid var(--gray-200)',
                    padding: '0.5rem 0.75rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="title">📖 Title</option>
                  <option value="price">💰 Price</option>
                  <option value="rating">⭐ Rating</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col xs={12} sm={6} md={2}>
              <Form.Group>
                <Form.Label style={{ 
                  fontWeight: '500', 
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  🔄 Order
                </Form.Label>
                <Form.Select
                  value={filters.sortOrder}
                  onChange={(e) => setFilterField('sortOrder', e.target.value)}
                  disabled={loading}
                  style={{
                    borderRadius: '0.5rem',
                    border: '2px solid var(--gray-200)',
                    padding: '0.5rem 0.75rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-color)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--gray-200)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="asc">⬆️ Ascending</option>
                  <option value="desc">⬇️ Descending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SearchAndFilters;
