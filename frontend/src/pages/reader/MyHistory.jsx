import Loading from "../../components/loading/Loading";
import { useAuth } from "../../context/AuthContext";
import { useGetBorrowsByReader, useCancelBorrow } from "../../hooks/useBorrow";
import "./MyHistory.css";

const MyHistory = () => {
  const { user } = useAuth();

  const { data: historyData, isLoading } = useGetBorrowsByReader(user?._id);
  const history = historyData || [];
  const { mutate: cancelBorrow, isPending: isCanceling } = useCancelBorrow();
  const handleCancel = (recordId) => {
    if (window.confirm("Hủy yêu cầu mượn sách này?")) {
      cancelBorrow(recordId, {
        onSuccess: () => alert("Hủy yêu cầu thành công!"),
        onError: (err) =>
          alert("Lỗi: " + (err.response?.data?.message || err.message)),
      });
    }
  };

  const getStatusBadge = (borrow) => {
    const isOverdue =
      !borrow.returnDate && new Date(borrow.dueDate) < new Date();

    if (borrow.status === "pending")
      return <span className="history-badge pending">Chờ duyệt</span>;

    if (borrow.status === "returned" || borrow.returnDate)
      return <span className="history-badge returned">Đã trả</span>;

    if (isOverdue)
      return <span className="history-badge overdue">Quá hạn</span>;

    return <span className="history-badge borrowing">Đang mượn</span>;
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");

  if (isLoading) return <Loading />;

  return (
    <div className="history-page">
      <header className="history-header">
        <p>Lịch sử mượn </p>
      </header>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Sách</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="history-book-info">
                      <img
                        src={item.book?.image}
                        alt=""
                        className="history-book-cover"
                      />
                      <div>
                        <div className="history-book-title">
                          {item.book?.title}
                        </div>
                        <div className="history-book-author">
                          {item.book?.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(item.borrowDate)}</td>
                  <td>{formatDate(item.dueDate)}</td>
                  <td>{item.returnDate ? formatDate(item.returnDate) : "-"}</td>
                  <td>{getStatusBadge(item)}</td>
                  <td>
                    {item.status === "pending" && (
                      <button
                      className="btn-secondary cancel-btn"
                        onClick={() => handleCancel(item._id)}
                        disabled={isCanceling}
                      >
                        {isCanceling ? "..." : "Hủy mượn"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="history-no-data">
                  Bạn chưa mượn cuốn sách nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyHistory;
