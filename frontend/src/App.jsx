import React,{useState,useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Postauction from "./pages/Postauction";
import ActiveAuctions from "./pages/ActiveAuctions";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import AuctionDetail from "./pages/AuctionDetail";
import MyAuctions from "./pages/MyAuctions";
import AuctionOwnerDashboard from "./pages/AuctionOwnerDashboard";
import EditProfile from "./pages/profile/EditProfile";
import ProfileMain from "./pages/profile/ProfileMain";
import ParticipatedAuctions from "./pages/profile/ParticipatedAuctions";
import AdminUserDashboard from "./pages/admin/AdminUserDashboard";
import BiddingHistory from "./pages/profile/BiddingHistory";
import WonAuctions from "./pages/profile/WonAuctions";



function App() {
  const [loading, setLoading] = useState(true);
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!token || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

  useEffect(() => {
   
    setTimeout(() => setLoading(false), 100);
  }, []);

  if (loading) return <div>Loading...</div>; 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/post" element={
          <ProtectedRoute>
            <Postauction />
          </ProtectedRoute>
        } />

        <Route path="/auctions" element={
          <ProtectedRoute>
            <ActiveAuctions />
          </ProtectedRoute>
        } />

        <Route path="/auction/:id" element={
          <ProtectedRoute>
            <AuctionDetail />
          </ProtectedRoute>
        } />
    <Route path="/auction/owner/:id" element={<AuctionOwnerDashboard />} />

        <Route
          path="/my-auctions"
          element={
            <ProtectedRoute>
              <MyAuctions />
            </ProtectedRoute>
          }
        />


<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfileMain />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile/edit"
  element={
    <ProtectedRoute>
      <EditProfile />
    </ProtectedRoute>
  }
/>



<Route
  path="/profile/participated-auctions"
  element={
    <ProtectedRoute>
      <ParticipatedAuctions />
    </ProtectedRoute>
  }
/>


<Route
  path="/admin"
  element={
    <ProtectedAdminRoute>
      <AdminUserDashboard />
    </ProtectedAdminRoute>
  }
/>



<Route
path="/profile/bidding-history"
element={
  <ProtectedRoute>
    <BiddingHistory/>
  </ProtectedRoute>
}

/>



<Route
  path="/profile/won-auctions"
  element={
    <ProtectedRoute>
      <WonAuctions />
    </ProtectedRoute>
  }
/>



      </Routes>
    </BrowserRouter>
  );
}

export default App;
