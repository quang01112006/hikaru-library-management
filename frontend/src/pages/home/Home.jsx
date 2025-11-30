import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGetStats } from "../../hooks/useStats";
import { useGetBorrowHistory } from "../../hooks/useBorrow";
import Loading from "../../components/loading/Loading";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: statsData, isLoading: statsLoading } = useGetStats();

  const { data: borrowsData, isLoading: borrowsLoading } =
    useGetBorrowHistory();

  const stats = statsData || {
    totalBooks: 0,
    totalReaders: 0,
    activeBorrows: 0,
    overdueBorrows: 0,
  };
  const borrows = Array.isArray(borrowsData)
    ? borrowsData
    : borrowsData?.data || [];

  const overdueList = borrows
    .filter((b) => !b.returnDate && new Date(b.dueDate) < new Date())
    .slice(0, 5);

  if (statsLoading || borrowsLoading) return <Loading />;

  return (
    <div className="home-container">
      <div className="home-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Xin chào, <strong>{user?.username || "Admin"}</strong>. Chúc bạn một
            ngày làm việc hiệu quả!
          </p>
        </div>
        <div className="today-date">
          {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      <div className="stats-row">
        <div
          className="kpi-card blue"
          onClick={() => navigate("/manage/books")}
        >
          <div className="kpi-value">{stats.totalBooks}</div>
          <div className="kpi-label">Tổng số sách</div>
        </div>
        <div
          className="kpi-card green"
          onClick={() => navigate("/manage/readers")}
        >
          <div className="kpi-value">{stats.totalReaders}</div>
          <div className="kpi-label">Bạn đọc</div>
        </div>
        <div
          className="kpi-card orange"
          onClick={() => navigate("/return-borrow")}
        >
          <div className="kpi-value">{stats.activeBorrows}</div>
          <div className="kpi-label">Đang mượn</div>
        </div>
        <div
          className="kpi-card red"
          onClick={() => navigate("/return-borrow")}
        >
          <div className="kpi-value">{stats.overdueBorrows}</div>
          <div className="kpi-label">Quá hạn</div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="main-panel">
          <div className="panel-header">
            <h3> Quá hạn ({overdueList.length})</h3>
            <button
              className="btn-link"
              onClick={() => navigate("/return-borrow")}
            >
              Xem tất cả
            </button>
          </div>

          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Bạn đọc</th>
                  <th>Sách mượn</th>
                  <th>Hạn trả</th>
                  <th>Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                {overdueList.length > 0 ? (
                  overdueList.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div className="fw-bold">
                          {item.reader?.name || "N/A"}
                        </div>
                        <div className="sub-text">
                          {item.reader?.readerCode}
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold">
                          {item.book?.title || "N/A"}
                        </div>
                        <div className="sub-text">{item.book?.bookCode}</div>
                      </td>
                      <td>
                        {new Date(item.dueDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td>
                        <span className="badge-overdue">Quá hạn</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Không có ai nợ sách.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="side-panel">
          <h3>Thao tác nhanh</h3>
          <div className="quick-actions-stack">
            <button
              className="qa-btn"
              onClick={() => navigate("/manage/books/add")}
            >
              Nhập sách mới
            </button>
            <button
              className="qa-btn"
              onClick={() => navigate("/manage/readers")}
            >
              Thêm bạn đọc
            </button>
            <button
              className="qa-btn primary"
              onClick={() => navigate("/return-borrow")}
            >
              Tạo phiếu mượn
            </button>
            {user?.role === "admin" && (
              <button
                className="qa-btn secondary"
                onClick={() => navigate("/manage/users")}
              >
                Quản lý nhân viên
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
