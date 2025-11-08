import "./App.css";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import BorrowBooks from "./pages/borrowBooks/BorrowBooks";
import Layout from "./layout/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/borrow" element={<BorrowBooks />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
