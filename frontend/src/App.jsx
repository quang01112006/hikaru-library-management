import "./App.css";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import BorrowBooks from "./pages/borrowBooks/BorrowBooks";
import ManageCategories from "./pages/manageCategories/ManageCategories";
import Layout from "./layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Statistics from "./pages/statistics/Statistics";
import ManageReaders from "./pages/manageReaders/ManageReaders";
import ManageBooks from "./pages/manageBooks/ManageBooks";
import AddBook from "./pages/manageBooks/AddBook";
import ManageUsers from "./pages/manageUsers/ManageUsers";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/return-borrow" element={<BorrowBooks />}></Route>
            <Route
              path="/manage/categories"
              element={<ManageCategories />}
            ></Route>
            <Route path="/manage/books" element={<ManageBooks />}></Route>
            <Route path="/manage/books/add" element={<AddBook />}></Route>
            <Route path="/manage/books/edit/:id" element={<AddBook />}></Route>
            <Route path="/manage/readers" element={<ManageReaders />}></Route>
            <Route path="/stats" element={<Statistics />}></Route>
            <Route path="/manage/users" element={<ManageUsers/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
