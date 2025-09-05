import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Hackathons from "./pages/Hackathons";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddHackathon from "./pages/AddHackathon";
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import Landing from "./pages/Landing";
import { useSelector } from "react-redux";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import ProfileWrapper from './components/Profile/ProfileWrapper';
import EditHostProfile from './pages/EditHostProfile';
import HackathonDetails from './pages/HackathonDetails';
import HackathonRegistration from './pages/HackathonRegistration';
import EditUserProfile from './pages/EditUserProfile';

function App() {
  const user = useSelector(state => state.user);

  return (
    <Router>
      <div className="h-screen w-full flex flex-col">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hackathons" element={<Hackathons />} />
            <Route path="/hackathons/:id" element={<HackathonDetails />} />
            
            {/* Protected routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <ProfileWrapper />
              </PrivateRoute>
            } />
            <Route 
              path="/user/profile/edit" 
              element={
                <PrivateRoute>
                  <EditUserProfile />
                </PrivateRoute>
              } 
            />
            
            {/* Host-only routes */}
            <Route 
              path="/host/profile/edit" 
              element={
                <PrivateRoute>
                  <EditHostProfile />
                </PrivateRoute>
              }
            />
            <Route 
              path="/add-hackathon" 
              element={
                <PrivateRoute>
                  <AddHackathon />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hackathons/:id/register" 
              element={
                <PrivateRoute>
                  <HackathonRegistration />
                </PrivateRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

