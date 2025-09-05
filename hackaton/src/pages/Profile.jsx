import { useEffect, useState } from "react";
import { getMe, deleteHackathon, getHackathons as fetchHackathons } from "../api";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import UserProfileView from "../components/Profile/UserProfileView";
import HostProfileView from "../components/Profile/HostProfileView";

function Profile() {
  const user = useSelector((state) => state.user);
  const [hostedHackathons, setHostedHackathons] = useState([]);
  const [error, setError] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Helper functions
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatDateTime = (date) => new Date(date).toLocaleString();

  // ✅ Auto-clear success/error messages
  useEffect(() => {
    if (deleteMsg) {
      const timer = setTimeout(() => setDeleteMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteMsg]);

  // ✅ Fetch user & hackathons
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view your profile.");
      return;
    }

    getMe(token)
      .then((res) => {
        if (
          res.error ||
          res.message === "Not authorized, token failed" ||
          res.message === "Not authorized, no token provided" ||
          res.message === "User not found"
        ) {
          setError("You must be logged in to view your profile.");
        } else {
          // If user is HOST, fetch their hackathons
          if (res.role === "HOST") {
            fetchHackathons().then((data) => {
              setHostedHackathons(
                Array.isArray(data) ? data.filter((h) => h.hostId === res.id) : []
              );
            });
          }
        }
      })
      .catch(() => setError("You must be logged in to view your profile."));
  }, []);

  // ✅ Handle Hackathon Delete
  const handleDelete = async (hackathonId) => {
    try {
      const data = await deleteHackathon(hackathonId);
      console.log('Delete result:', data);
      
      if (data.error) {
        setDeleteMsg(data.error);
        return;
      }
      
      setDeleteMsg("Hackathon deleted successfully");
      setHostedHackathons(hostedHackathons.filter((h) => h.id !== hackathonId));
    } catch (error) {
      console.error('Handle delete error:', error);
      setDeleteMsg(error.message || "Failed to delete hackathon");
    }
  };

  // ✅ Error & loading states
  if (error) {
    return <div className="mt-10 text-center text-red-500">{error}</div>;
  }
  if (!user) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      {user.role === 'HOST' ? (
        <HostProfileView 
          user={user} 
          hostedHackathons={hostedHackathons} 
          formatDateTime={formatDateTime} 
        />
      ) : (
        <UserProfileView 
          user={user} 
          formatDateTime={formatDateTime} 
        />
      )}

      {deleteMsg && (
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-700 p-4 rounded shadow">
          {deleteMsg}
        </div>
      )}
    </div>
  );
}

export default Profile;
//                     Registered on: {formatDateTime(reg.createdAt)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-600">You have not registered for any hackathons.</p>
//           )}
//         </section>
//       )}

//       {/* Show Hosted Hackathons for HOST users */}
//       {user.role === 'HOST' && (
//         <section className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-2xl font-semibold mb-4">Hosted Hackathons</h2>
//           {hostedHackathons && hostedHackathons.length > 0 ? (
//             <div className="grid gap-4">
//               {hostedHackathons.map(hackathon => (
//                 <div key={hackathon.id} className="border p-4 rounded">
//                   <h3 className="font-semibold">{hackathon.title}</h3>
//                   <p className="text-gray-600">Created on: {formatDateTime(hackathon.createdAt)}</p>
//                   <p className="text-gray-600">Participants: {hackathon.registrations?.length || 0}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-600">You haven't hosted any hackathons yet.</p>
//           )}
//         </section>
//       )}
//     </div>
//   );
// }
 

//   // ✅ USER Profile
//   return (
//     <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
//       <h2 className="text-xl mb-4">Profile</h2>
//       <div><strong>Name:</strong> {user.name}</div>
//       <div><strong>Email:</strong> {user.email}</div>
//       <div><strong>Role:</strong> {user.role}</div>
//       <div><strong>Joined:</strong> {formatDate(user.createdAt)}</div>

//       <h3 className="text-lg mt-6 mb-2">Registered Hackathons</h3>
//       <ul>
//         {user.registrations?.length > 0 ? (
//           user.registrations.map((r) => (
//             <li key={r.id} className="mb-4 p-4 border rounded bg-gray-50">
//               <div className="font-bold text-lg">{r.hackathon.title}</div>
//               <div className="mb-1">{r.hackathon.description}</div>
//               <div><span className="font-semibold">Start:</span> {formatDateTime(r.hackathon.startDate)}</div>
//               <div><span className="font-semibold">End:</span> {formatDateTime(r.hackathon.endDate)}</div>
//               {r.hackathon.host && (
//                 <div className="mt-1 text-sm text-gray-600">
//                   <span className="font-semibold">Host:</span> {r.hackathon.host.name} ({r.hackathon.host.email})
//                 </div>
//               )}
//               <div className="mt-1 text-xs text-gray-500">
//                 Registered on: {formatDateTime(r.createdAt)}
//               </div>
//             </li>
//           ))
//         ) : (
//           <li>You have not registered for any hackathons.</li>
//         )}
//       </ul>
//     </div>
//   );
// }

