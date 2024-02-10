import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login';
import ProductList from './components/productlist';
import Navbar from './components/navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogin = (token, refreshToken) => {
    setIsLoggedIn(true);
    setShowModal(false);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('token', '');
    localStorage.setItem('refreshToken', '');
  };

  const handleLoginClick = () => {
        setShowModal(true);
  };

  return (
    <div>
        <Navbar
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLoginClick={handleLoginClick}
        />
        <div className="container mt-3">
            {/* Rendering Product list component */}
            <ProductList isLoggedIn={isLoggedIn}/>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Rendering Login component on modal */}
                <Login onLogin={handleLogin}/>
            </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
