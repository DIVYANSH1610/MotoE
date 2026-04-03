import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSession } from "./services/authApi";
import Favourites from "./pages/Favourites";
import Compare from "./pages/Compare";
import Navbar from "./components/Navbar";
import AIGarage from "./pages/AIGarage";
import UsedCarAdvisor from "./pages/UsedCarAdvisor";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    getSession()
      .then((res) => {
        if (res.data.authenticated) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#05060a", color: "#fff" }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars/:slug" element={<CarDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/used-car-advisor" element={<UsedCarAdvisor />} />
        <Route path="/ai-garage" element={<AIGarage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;