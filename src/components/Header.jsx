import { Link } from "react-router";
import { useAuth } from "../context/authContext";
import Logo from "../assets/quacker-logo.svg";
import userFallback from "../assets/icons/user-fallback.svg";
import Feature from "../assets/icons/feature.svg";
import "./Header.scss";
export default function Header({ headerText }) {
  const { currentUser } = useAuth();
  const headerAvatar = currentUser?.avatarPath || currentUser?.photoURL || userFallback;

  return (
    <div className="header__back">
      <header className="container-heads header">
        <Link to={"/profile"} className="header__user">
          <img src={headerAvatar} alt="profile" />
        </Link>
        {headerText ? (
          <div className="header_middle">
            <span>{headerText}</span>
          </div>
        ) : (
          <Link to={"/"}>
            <img src={Logo} alt="home" />
          </Link>
        )}
        <div className="header_">
          <img src={Feature} alt="features" />
        </div>
      </header>
    </div>
  );
}
