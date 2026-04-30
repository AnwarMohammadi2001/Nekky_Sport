// MainLayout.jsx
import Header from "../components/Header/Header";
import Footer from "../components/footer/Footer";
import Navbar from "../components/Header/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="">
      <Header />
      <main className="">
        <Outlet /> {/* Nested route renders here */}
      </main>
      <Footer />
    </div>
  );
}
