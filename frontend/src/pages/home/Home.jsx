import Loading from "../../components/loading/Loading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGetBook } from "../../hooks/useBook"; // Nhớ check tên hook số nhiều/ít
import { useGetBorrowHistory } from "../../hooks/useBorrow";
import "./Home.css"; // Tí tạo file này

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Gọi dữ liệu từ Kho
  const { data: booksData, isLoading: booksLoading } = useGetBook();
  const { data: borrowsData, isLoading: borrowsLoading } =
    useGetBorrowHistory();

  const books = booksData || [];
  const borrows = Array.isArray(borrowsData)
    ? borrowsData
    : borrowsData?.data || [];

  // 2. Xử lý số liệu (Business Logic tại Client)

  // A. Đơn chờ duyệt (Cần làm ngay)
  const pendingBorrows = borrows.filter((b) => b.status === "pending");

  // B. Đơn quá hạn (Cần đòi sách)
  const overdueBorrows = borrows.filter((b) => {
    if (b.returnDate) return false; // Trả rồi thì thôi
    return new Date(b.dueDate) < new Date(); // Hạn < Hôm nay
  });

  // C. Sách sắp hết hàng (Cần nhập thêm)
  const lowStockBooks = books.filter((b) => b.availableQuantity < 5);

  // D. Hoạt động gần đây (Lấy 5 cái mới nhất)
  const recentActivity = borrows.slice(0, 5);

  // Helper format ngày
  const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");

  if (booksLoading || borrowsLoading) return <Loading></Loading>;

  // return (
  //   <div className="home-page fade-in">
  //     {/* HEADER: Lời chào */}
  //     <div className="dashboard-header">
  //       <div>
  //         <h1>👋 Xin chào, {user?.username || "Sếp"}!</h1>
  //         <p className="subtitle">Hôm nay có gì cần xử lý không nhỉ?</p>
  //       </div>
  //       <div className="date-badge">
  //         📅{" "}
  //         {new Date().toLocaleDateString("vi-VN", {
  //           weekday: "long",
  //           year: "numeric",
  //           month: "long",
  //           day: "numeric",
  //         })}
  //       </div>
  //     </div>

  //     {/* KHU VỰC 1: CÁC THẺ BÁO CÁO (Stat Cards) */}
  //     <div className="stats-grid">
  //       <div
  //         className="stat-card orange"
  //         onClick={() => navigate("/dashboard/return-borrow")}
  //       >
  //         <div className="stat-icon">⏳</div>
  //         <div className="stat-info">
  //           <h3>Chờ Duyệt</h3>
  //           <span className="stat-number">{pendingBorrows.length}</span>
  //           <p>Yêu cầu mượn mới</p>
  //         </div>
  //       </div>

  //       <div
  //         className="stat-card red"
  //         onClick={() => navigate("/dashboard/return-borrow")}
  //       >
  //         <div className="stat-icon">🚨</div>
  //         <div className="stat-info">
  //           <h3>Quá Hạn</h3>
  //           <span className="stat-number">{overdueBorrows.length}</span>
  //           <p>Phiếu chưa trả</p>
  //         </div>
  //       </div>

  //       <div
  //         className="stat-card blue"
  //         onClick={() => navigate("/dashboard/manage/books")}
  //       >
  //         <div className="stat-icon">📚</div>
  //         <div className="stat-info">
  //           <h3>Tổng Sách</h3>
  //           <span className="stat-number">{books.length}</span>
  //           <p>Đầu sách trong kho</p>
  //         </div>
  //       </div>

  //       <div
  //         className="stat-card purple"
  //         onClick={() => navigate("/dashboard/manage/books")}
  //       >
  //         <div className="stat-icon">📉</div>
  //         <div className="stat-info">
  //           <h3>Sắp Hết</h3>
  //           <span className="stat-number">{lowStockBooks.length}</span>
  //           <p>Cần nhập thêm</p>
  //         </div>
  //       </div>
  //     </div>

  //     {/* KHU VỰC 2: NỘI DUNG CHÍNH */}
  //     <div className="dashboard-content">
  //       {/* CỘT TRÁI: VIỆC CẦN LÀM */}
  //       <div className="main-section">
  //         {/* Bảng quá hạn */}
  //         <div className="section-box">
  //           <div className="section-header">
  //             <h3>🔥 Danh sách quá hạn (Ưu tiên xử lý)</h3>
  //             <button onClick={() => navigate("/dashboard/return-borrow")}>
  //               Xem tất cả
  //             </button>
  //           </div>
  //           {overdueBorrows.length > 0 ? (
  //             <table className="mini-table">
  //               <thead>
  //                 <tr>
  //                   <th>Bạn đọc</th>
  //                   <th>Sách</th>
  //                   <th>Hạn trả</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {overdueBorrows.slice(0, 5).map((item) => (
  //                   <tr key={item._id}>
  //                     <td style={{ fontWeight: "bold" }}>
  //                       {item.reader?.name}
  //                     </td>
  //                     <td>{item.book?.title}</td>
  //                     <td style={{ color: "red", fontWeight: "bold" }}>
  //                       {formatDate(item.dueDate)}
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           ) : (
  //             <p className="empty-state">Tuyệt vời! Không có ai nợ sách.</p>
  //           )}
  //         </div>

  //         {/* Bảng sắp hết hàng */}
  //         <div className="section-box" style={{ marginTop: 20 }}>
  //           <div className="section-header">
  //             <h3>📉 Sách sắp hết hàng (Dưới 5 cuốn)</h3>
  //           </div>
  //           {lowStockBooks.length > 0 ? (
  //             <div className="low-stock-grid">
  //               {lowStockBooks.slice(0, 4).map((book) => (
  //                 <div key={book._id} className="mini-book-item">
  //                   <img src={book.image} alt="" />
  //                   <div>
  //                     <strong>{book.title}</strong>
  //                     <span className="qty-badge">
  //                       Còn: {book.availableQuantity}
  //                     </span>
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <p className="empty-state">Kho hàng vẫn dồi dào.</p>
  //           )}
  //         </div>
  //       </div>

  //       {/* CỘT PHẢI: THAO TÁC NHANH & LOG */}
  //       <div className="side-section">
  //         {/* Thao tác nhanh */}
  //         <div className="section-box">
  //           <h3>⚡ Thao tác nhanh</h3>
  //           <div className="quick-actions">
  //             <button
  //               className="action-btn borrow"
  //               onClick={() => navigate("/dashboard/return-borrow")}
  //             >
  //               📝 Tạo phiếu mượn
  //             </button>
  //             <button
  //               className="action-btn add-reader"
  //               onClick={() => navigate("/dashboard/manage/readers")}
  //             >
  //               👤 Thêm bạn đọc
  //             </button>
  //             <button
  //               className="action-btn add-book"
  //               onClick={() => navigate("/dashboard/manage/books/add")}
  //             >
  //               📖 Nhập sách mới
  //             </button>
  //           </div>
  //         </div>

  //         {/* Hoạt động gần đây */}
  //         <div className="section-box" style={{ marginTop: 20, flex: 1 }}>
  //           <h3>🕒 Hoạt động gần đây</h3>
  //           <div className="activity-list">
  //             {recentActivity.map((act) => (
  //               <div key={act._id} className="activity-item">
  //                 <div
  //                   className={`dot ${act.returnDate ? "green" : "orange"}`}
  //                 ></div>
  //                 <div>
  //                   <div className="act-text">
  //                     <strong>{act.reader?.name}</strong> đã{" "}
  //                     {act.returnDate ? "trả" : "mượn"} cuốn{" "}
  //                     <strong>{act.book?.title}</strong>
  //                   </div>
  //                   <div className="act-time">
  //                     {formatDate(act.updatedAt || act.createdAt)}
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  return <Loading></Loading>;
};

export default Home;
