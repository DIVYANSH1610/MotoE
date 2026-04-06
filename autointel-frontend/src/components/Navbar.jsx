import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, LayoutDashboard, Bot, Scale, CarFront } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSession, logoutUser, getCsrf } from "../services/authApi";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const loadSession = async () => {
    try {
      const res = await getSession();
      if (res.data.authenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    loadSession();
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await getCsrf();
      await logoutUser();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const firstLetter = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  const handleSectionNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 120);
      return;
    }

    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`premium-navbar ${scrolled ? "premium-navbar--scrolled" : ""}`}
      >
        <div className="premium-navbar__inner">
          <Link to="/" className="premium-navbar__logo">
            <span className="logo-glow"></span>
            <span className="logo-text">MotoE Garage</span>
          </Link>

          <nav className="premium-navbar__links desktop-nav">
            <button
              type="button"
              className="nav-link nav-link-button"
              onClick={() => handleSectionNavigation("#featured")}
            >
              Featured
            </button>

            <button
              type="button"
              className="nav-link nav-link-button"
              onClick={() => handleSectionNavigation("#explore")}
            >
              Explore
            </button>

            <button
              type="button"
              className="nav-link nav-link-button"
              onClick={() => handleSectionNavigation("#performance")}
            >
              Performance
            </button>

            <button
              type="button"
              className="nav-link nav-link-button"
              onClick={() => handleSectionNavigation("#gallery")}
            >
              Gallery
            </button>

            {user && (
              <>
                <Link
                  to="/favourites"
                  className={`nav-link ${isActive("/favourites") ? "nav-link--active" : ""}`}
                >
                  Favourites
                </Link>

                <Link
  to="/ai-garage"
  className={`nav-link ${isActive("/ai-garage") ? "nav-link--active" : ""}`}
>
  AI Garage
</Link>
<Link
  to="/used-car-advisor"
  className={`nav-link ${isActive("/used-car-advisor") ? "nav-link--active" : ""}`}
>
  Used Advisor
</Link>
                <Link
  to="/analytics"
  className={`nav-link ${isActive("/analytics") ? "nav-link--active" : ""}`}
>
  Analytics
</Link>
              </>
            )}
          </nav>

          <div className="premium-navbar__actions desktop-actions">
            {user ? (
              <div className="user-box">
                <button
                  className="user-profile-btn"
                  onClick={() => navigate("/dashboard")}
                  title="Open Dashboard"
                  type="button"
                >
                  <div className="user-avatar">{firstLetter}</div>
                </button>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <Link to="/login" className="nav-btn nav-btn--ghost">
                  Login
                </Link>
                <Link to="/register" className="nav-btn nav-btn--primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mobile-nav-content">
              <button
                type="button"
                className="mobile-nav-link"
                onClick={() => handleSectionNavigation("#featured")}
              >
                <CarFront size={18} />
                Featured
              </button>

              <button
                type="button"
                className="mobile-nav-link"
                onClick={() => handleSectionNavigation("#explore")}
              >
                <CarFront size={18} />
                Explore
              </button>

              <button
                type="button"
                className="mobile-nav-link"
                onClick={() => handleSectionNavigation("#performance")}
              >
                <CarFront size={18} />
                Performance
              </button>

              <button
                type="button"
                className="mobile-nav-link"
                onClick={() => handleSectionNavigation("#gallery")}
              >
                <CarFront size={18} />
                Gallery
              </button>

              {user && (
                <>
                  <Link to="/favourites" className="mobile-nav-link">
                    <Heart size={18} />
                    Favourites
                  </Link>
                  <Link to="/ai-garage" className="mobile-nav-link">
  <Bot size={18} />
  AI Garage
</Link>
<Link to="/used-car-advisor" className="mobile-nav-link">
  <CarFront size={18} />
  Used Advisor
</Link>

                  <Link to="/dashboard" className="mobile-nav-link">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>


                  <button
                    type="button"
                    className="mobile-nav-link"
                    onClick={handleLogout}
                  >
                    <Bot size={18} />
                    Logout
                  </button>
                </>
              )}

              {!user && (
                <div className="mobile-auth-actions">
                  <Link to="/login" className="nav-btn nav-btn--ghost mobile-auth-btn">
                    Login
                  </Link>
                  <Link to="/register" className="nav-btn nav-btn--primary mobile-auth-btn">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
