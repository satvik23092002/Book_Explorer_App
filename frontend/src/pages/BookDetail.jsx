import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/books/${id}`);
        setBook(response.data);
      } catch (err) {
        setError('Failed to fetch book details. Please try again.');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const renderStars = (rating) => {
    if (!rating) return 'No rating';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <Container fluid>
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Alert variant="danger" className="error-message">
          {error}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/')}>Back to Books</Button>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container fluid>
        <Alert variant="warning">Book not found.</Alert>
        <Button variant="primary" onClick={() => navigate('/')}>Back to Books</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="px-3 px-md-4 px-lg-5">
      {/* Back Button */}
      <Row className="mb-4">
        <Col>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/')}
            style={{
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontWeight: '500',
              border: '2px solid var(--gray-300)',
              color: 'var(--text-secondary)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--primary-color)';
              e.target.style.color = 'var(--primary-color)';
              e.target.style.backgroundColor = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--gray-300)';
              e.target.style.color = 'var(--text-secondary)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ← Back to Books
          </Button>
        </Col>
      </Row>

      {/* Book Detail Content */}
      <Row className="g-4 align-items-stretch">
        <Col xs={12} xl={6}>
          <div className="book-detail-hero fade-in">
            <img
              src={book.imageUrl || '/placeholder-book.jpg'}
              alt={book.title}
              className="book-detail-image"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          </div>
        </Col>
        
        <Col xs={12} xl={6}>
          <Card className="book-detail-card h-100 fade-in" style={{ animationDelay: '0.2s' }}>
            <Card.Body style={{ padding: '2rem' }}>
              {/* Title and Status */}
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start mb-4 gap-3">
                <h1 
                  className="mb-0" 
                  style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    lineHeight: '1.2'
                  }}
                >
                  {book.title}
                </h1>
                <Badge 
                  bg={book.inStock ? 'success' : 'danger'} 
                  className="availability-badge"
                  style={{
                    fontSize: '0.9rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '1rem',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {book.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                </Badge>
              </div>

              {/* Price and Rating */}
              <Row className="mb-4">
                <Col sm={6} className="mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <h2 
                      className="mb-1" 
                      style={{ 
                        color: 'white',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        margin: 0
                      }}
                    >
                      £{book.price?.toFixed(2) || 'N/A'}
                    </h2>
                    <small style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                      💰 Price
                    </small>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div 
                      className="rating-stars" 
                      style={{ 
                        fontSize: '2rem',
                        color: 'white',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {renderStars(book.rating)}
                    </div>
                    <small style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                      {book.rating ? `${book.rating} out of 5 stars` : 'No rating available'}
                    </small>
                  </div>
                </Col>
              </Row>

              {/* Availability Details */}
              <div className="info-section mb-4">
                <h5 
                  className="mb-3" 
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>📦</span>
                  Availability Details
                </h5>
                <div style={{
                  background: 'var(--bg-tertiary)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  border: '1px solid var(--gray-200)'
                }}>
                  <p 
                    className="mb-2" 
                    style={{ 
                      color: 'var(--text-secondary)',
                      fontSize: '1rem',
                      margin: 0
                    }}
                  >
                    {book.availabilityText || 'Availability information not available'}
                  </p>
                  {typeof book.stockCount === 'number' && (
                    <p 
                      className="mb-0" 
                      style={{ 
                        color: 'var(--text-primary)',
                        fontWeight: '500',
                        margin: 0
                      }}
                    >
                      <strong>Stock Count:</strong> {book.stockCount}
                    </p>
                  )}
                </div>
              </div>

              {/* Book Information */}
              <div className="info-section mb-4">
                <h5 
                  className="mb-3" 
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>📋</span>
                  Book Information
                </h5>
                <Row className="g-3">
                  <Col sm={6}>
                    <div style={{
                      background: 'var(--bg-primary)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      border: '1px solid var(--gray-200)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <p className="mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        💰 Price
                      </p>
                      <p className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>
                        £{book.price?.toFixed(2) || 'N/A'}
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div style={{
                      background: 'var(--bg-primary)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      border: '1px solid var(--gray-200)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <p className="mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        ⭐ Rating
                      </p>
                      <p className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>
                        {book.rating ? `${book.rating}/5 stars` : 'No rating'}
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div style={{
                      background: 'var(--bg-primary)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      border: '1px solid var(--gray-200)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <p className="mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        📦 Status
                      </p>
                      <p className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>
                        {book.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div style={{
                      background: 'var(--bg-primary)',
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      border: '1px solid var(--gray-200)',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <p className="mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                        📅 Added
                      </p>
                      <p className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>
                        {new Date(book.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* External Link */}
              {book.detailUrl && (
                <div className="mt-4">
                  <Button 
                    variant="primary" 
                    href={book.detailUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1.5rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    🌐 View on Original Site
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetail;
