import Header from "../components/Header";
import { Register } from "../components/auth/Register";
import Login from "../components/auth/login";

export default function Home() {
  return (
    <>
      <Header />
      <Register />
      <Login />
      <h2>home</h2>
    </>
  );
}
