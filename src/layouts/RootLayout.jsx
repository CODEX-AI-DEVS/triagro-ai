import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AgriculturalChatbot from "../components/AgriculturalChatbot";

const RootLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
      <AgriculturalChatbot />
    </div>
  );
};

export default RootLayout;
