import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100">
      <Link to="/" className="flex-1">
        <img
          src="/images/event.png"
          alt="logo"
          width={200}
          height={80}
          className="pointer-events-none"
        />
      </Link>
      <div className="flex-none mr-10">
        <ul className="menu menu-horizontal px-1 gap-6">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/CreateEvent">Create</Link>
          </li>
          <li>
            <Link
              to="/signin"
              className="btn btn-sm btn-ghost"
              onClick={() => localStorage.clear()}
            >
              LogOut
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
