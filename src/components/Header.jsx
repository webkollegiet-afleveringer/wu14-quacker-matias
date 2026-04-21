import { Link } from "react-router";
import Logo from "../assets/quacker-logo.svg";
import userFallback from "../assets/icons/user-fallback.svg";
import Feature from "../assets/icons/feature.svg";
import "./Header.scss";
export default function Header() {
  return (
    <div className="header__back">
      <header className="container-heads header">
        <div className="header_user">
          <img src={userFallback} alt="profile" />
        </div>
        <Link>
          <img src={Logo} alt="home" />
        </Link>
        <div className="header_">
          <img src={Feature} alt="features" />
        </div>
      </header>
    </div>
  );
}
