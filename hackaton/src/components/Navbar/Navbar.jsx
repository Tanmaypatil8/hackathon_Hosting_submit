import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/userSlice";

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 w-full">
      <div className="w-full flex justify-between items-center px-8">
        <Link to="/" className="text-xl font-bold">
          Hackathon Platform
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/hackathons">Hackathons</Link>
          {user && user.role === "HOST" && (
            <Link to="/add-hackathon">Add Hackathon</Link>
          )}
          {token && <Link to="/profile">Profile</Link>}
          {!token && <Link to="/register">Register</Link>}
          {!token && <Link to="/login">Login</Link>}
          {token && (
            <button
              className="bg-red-500 px-3 py-1 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

