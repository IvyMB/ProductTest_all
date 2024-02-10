import React from 'react';

const Navbar = ({ isLoggedIn, onLogout, onLoginClick }) => {
    const handleClick = () => {
        if (isLoggedIn) {
          onLogout();
        } else {
          onLoginClick();
        }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">Product Manager</a>
          <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                      <button className="btn btn-primary" onClick={handleClick}>
                          {isLoggedIn ? 'Logout' : 'Login'}
                      </button>
                  </li>
              </ul>
          </div>
      </div>
    </nav>
  );
}

export default Navbar;
