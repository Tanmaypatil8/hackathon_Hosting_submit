import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hackathons from './pages/Hackathons';
import Profile from './pages/Profile';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hackathons />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
