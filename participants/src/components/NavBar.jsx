import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import navitems from "../constants/navbaritems";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const toggleMenu = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const closeSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false); // Close the sidebar
      }
    };

    document.body.addEventListener("click", closeSidebar);
    return () => {
      document.body.removeEventListener("click", closeSidebar);
    };
  }, []);

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/signIn");
  };

  return (
    <div>
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <img
            src="/event.png"
            alt="logo"
            className="pointer-events-none select-none"
            height={100}
            width={300}
          />
        </div>
        <div className="hidden md:flex flex-none">
          <ul className="menu menu-horizontal px-1">
            {navitems.map((item, index) => (
              <li key={index}>
                <Link to={item.link}>{item.title}</Link>
              </li>
            ))}
            {localStorage.getItem("participant_token") && (
              <>
                <li key="registered_events">
                  <Link to="/yourEvents">My Events</Link>
                </li>
                <li key="logout">
                  <button type="button" onClick={handleLogOut}>
                    Logout&#8594;
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="menu-btn mx-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 8h12M4 12h16M6 16h12"
              />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          ref={sidebarRef}
          className="bg-base-200 w-72 h-screen absolute top-0 left-0 z-50"
        >
          <ul className="menu menu-vertical px-4 py-8 bg-base-200">
            <div className="flex-1">
              <img
                src="/event.png"
                alt="logo"
                className="pointer-events-none select-none mb-3"
                height={100}
                width={300}
              />
            </div>
            {navitems.map((item, index) => (
              <li key={index} className="mb-4 flex items-center">
                <Link
                  to={item.link}
                  onClick={toggleMenu}
                  className="text-lg font-medium text-slate-200 hover:text-gray-900"
                >
                  {item.title}
                </Link>
              </li>
            ))}
            {localStorage.getItem("participant_token") && (
              <>
                <li key="registered_events">
                  <Link
                    to="/yourEvents"
                    className="text-lg font-medium text-slate-200 hover:text-gray-900"
                  >
                    My Events
                  </Link>
                </li>
                <li key="logout" className="mb-4 flex items-center">
                  <button
                    type="button"
                    onClick={handleLogOut}
                    className="text-lg font-medium text-slate-200 hover:text-gray-900"
                  >
                    Logout&#8594;
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavBar;
