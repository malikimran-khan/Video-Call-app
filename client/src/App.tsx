import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeMain from "./pages/home/HomeMain";
import Signup from "./pages/form/Signup";
import Login from "./pages/form/Login";

import Profile from "./pages/user/Profile";
import ChatApp from "./pages/user/ChatApp";
import Logout from "./pages/form/Logout";

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<HomeMain/>}></Route>
     <Route path='/signup' element={<Signup/>}></Route>
     <Route path="/login" element={<Login/>}></Route>
     <Route path="/profile" element={<Profile/>}></Route>
     <Route path="/chat-app" element={<ChatApp/>}></Route>
     <Route path="/logout" element={<Logout/>}></Route>

    </Routes>
    </BrowserRouter>
    
    </>
  );
}
