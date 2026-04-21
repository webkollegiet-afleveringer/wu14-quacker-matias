import { NavLink } from "react-router";
import Home from "../assets/icons/home.svg";
import Search from "../assets/icons/search.svg";
import Bell from "../assets/icons/bell.svg";
import Mail from "../assets/icons/mail.svg";
import "./Navbar.scss";

export default function Navbar() {
  return (
    <footer className="navbar__sec">
      <nav className="container-heads navbar">
        <ul className="navbar__ul">
          <li>
            <NavLink to="/">
              <img src={Home} alt="home-btn" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/search">
              <img src={Search} alt="search-btn" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/notifications">
              <img src={Bell} alt="notifications-btn" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/messages">
              <img src={Mail} alt="messages-btn" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
