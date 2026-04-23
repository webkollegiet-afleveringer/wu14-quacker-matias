import { Navigate, Outlet, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import AddPost from "./pages/AddPost";
import { useAuth } from "./context/authContext";
import Loading from "./components/Loading";

function ProtectedLayout() {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!userLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default function App() {
  const { userLoggedIn, loading } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-post" element={<AddPost />} />
      </Route>

      <Route
        path="*"
        element={
          loading ? <Loading /> : userLoggedIn ? <NotFound /> : <Navigate to="/auth" replace />
        }
      />
    </Routes>
  );
}
