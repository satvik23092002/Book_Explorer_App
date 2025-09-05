import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const renderStars = (rating) => {
    if (!rating) return <span className="text-muted">No rating</span>;
    return (
      <div className="rating-display">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`star ${i < rating ? 'filled' : 'empty'}`}
            style={{ 
              color: i < rating ? '#f59e0b' : '#e5e7eb',
              fontSize: '0.9rem',
              marginRight: '1px'
            }}
          >
            ★
          </span>
        ))}
        <span className="rating-text" style={{ fontSize: '0.8rem', marginLeft: '0.25rem' }}>
          {rating}/5
        </span>
      </div>
    );
  };

  return (
    <Card className="book-card h-100 fade-in">
      <div className="position-relative">
        <div className="book-image-wrapper">
          <Card.Img
            variant="top"
            src={book.imageUrl || '/placeholder-book.jpg'}
            alt={book.title}
            className="book-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          <div className="image-overlay">
            <Badge
              bg={book.inStock ? 'success' : 'danger'}
              className="availability-badge"
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                fontSize: '0.7rem',
                fontWeight: '600',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.375rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {book.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </Badge>
          </div>
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title 
          className="h6 mb-3" 
          style={{ 
            minHeight: '2.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            lineHeight: '1.4',
            color: 'var(--text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {book.title}
        </Card.Title>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="price-display">
              <span 
                className="price"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: 'var(--success-color)',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                £{book.price?.toFixed(2) || 'N/A'}
              </span>
            </div>
            <div className="rating-container">
              {renderStars(book.rating)}
            </div>
          </div>
          
          <Link
            to={`/book/${book._id}`}
            className="btn btn-primary w-100"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontWeight: '600',
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
            }}
          >
            View Details →
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
