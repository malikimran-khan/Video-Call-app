import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeMain from "./pages/home/HomeMain";
import Signup from "./pages/form/Signup";
import Login from "./pages/form/Login";

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<HomeMain/>}></Route>
     <Route path='/signup' element={<Signup/>}></Route>
     <Route path="/login" element={<Login/>}></Route>
    </Routes>
    </BrowserRouter>
    
    </>
  );
}
