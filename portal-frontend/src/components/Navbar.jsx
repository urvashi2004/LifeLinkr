import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/vite.svg" alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-center">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/employees" className="navbar-link">Employee List</Link>
      </div>
      <div className="navbar-right">
        {user && (
          <span className="navbar-user">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1976d2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ verticalAlign: 'middle', marginRight: '6px' }}
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
            {user}
          </span>
        )}
        <button className="navbar-logout" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
