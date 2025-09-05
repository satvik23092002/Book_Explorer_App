import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Header from './components/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container-fluid py-4">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/book/:id" element={<BookDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;