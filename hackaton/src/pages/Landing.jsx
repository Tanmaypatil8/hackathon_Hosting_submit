import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Landing() {
  const user = useSelector(state => state.user.user);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Hackathon Platform</h1>
      <p className="text-xl mb-8 text-gray-600 max-w-2xl">
        Join exciting hackathons, showcase your skills, and connect with other developers. 
        Whether you're a participant or an organizer, this is your platform.
      </p>
      <div className="space-x-4">
        <Link
          to="/hackathons"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Browse Hackathons
        </Link>
        {!user && (
          <Link
            to="/register"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Get Started
          </Link>
        )}
      </div>
    </div>
  );
}
