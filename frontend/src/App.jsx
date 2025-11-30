import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import Home from "./pages/home/Home";
import BorrowBooks from "./pages/borrowBooks/BorrowBooks";
import ManageCategories from "./pages/manageCategories/ManageCategories";
import Layout from "./layout/LayoutTemp";
// import Statistics from "./pages/statistics/Statistics";
import ManageReaders from "./pages/manageReaders/ManageReaders";
import ManageBooks from "./pages/manageBooks/ManageBooks";
import AddBook from "./pages/manageBooks/AddBook";
import ManageUsers from "./pages/manageUsers/ManageUsers";
import ReaderLayout from "./layout/ReaderLayout";
import MyHistory from "./pages/reader/MyHistory";
import LibraryHome from "./pages/reader/LibraryHome";
import NotFound from "./pages/notFound/NotFound";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && !allowedRole.includes(user.role)) {
    if (user.role === "reader") return <Navigate to="/library" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === ROUTE PUBLIC === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* === KHU VỰC AD === */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRole={["admin", "librarian"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="/return-borrow" element={<BorrowBooks />} />
          <Route path="/manage/categories" element={<ManageCategories />} />
          <Route path="/manage/books" element={<ManageBooks />} />
          <Route path="/manage/books/add" element={<AddBook />} />
          <Route path="/manage/books/edit/:id" element={<AddBook />} />
          <Route path="/manage/readers" element={<ManageReaders />} />
          {/* <Route path="/stats" element={<Statistics />} /> */}
          <Route path="/manage/users" element={<ManageUsers />} />
        </Route>

        {/* === KHU VỰC BẠN ĐỌC  === */}
        <Route
          path="/library"
          element={
            <ProtectedRoute allowedRole={["reader"]}>
              <ReaderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LibraryHome />} />
          <Route path="my-history" element={<MyHistory />} />
        </Route>

        {/* Route 404 */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
