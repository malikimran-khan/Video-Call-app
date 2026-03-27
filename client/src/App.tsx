import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeMain from "./pages/home/HomeMain";
import Features from "./pages/home/Features";
import Safety from "./pages/home/Safety";
import About from "./pages/home/About";
import Support from "./pages/home/Support";
import Signup from "./pages/form/Signup";
import Login from "./pages/form/Login";
import Profile from "./pages/user/Profile";
import ChatApp from "./pages/user/ChatApp";
import Logout from "./pages/form/Logout";
import EnterOTP from "./pages/form/EnterOTP";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SmoothScroll from "./components/Visuals/SmoothScroll";
import CallManager from "./components/CallManager";

export default function App() {
  return (
    <SmoothScroll>
      <BrowserRouter>
        <ToastContainer position="top-center" autoClose={3000} />
        <CallManager />
        <Routes>
          <Route path="/" element={<HomeMain/>}></Route>
          <Route path="/features" element={<Features/>}></Route>
          <Route path="/safety" element={<Safety/>}></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path="/support" element={<Support/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path="/verify-otp" element={<EnterOTP />}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="/chat-app" element={<ChatApp/>}></Route>
          <Route path="/logout" element={<Logout/>}></Route>
        </Routes>
      </BrowserRouter>
    </SmoothScroll>
  );
}
