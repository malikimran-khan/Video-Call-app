import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeMain from "./pages/home/HomeMain";

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<HomeMain/>}></Route>
    </Routes>
    </BrowserRouter>
    here is video app
    </>
  );
}
