import React from "react";
import { useGetBorrowsByReader } from "../hooks/useBorrow";

const ReaderHistoryModal = ({ reader, onClose }) => {
  // Gọi Hook lấy dữ liệu của riêng ông reader này
  const { data: historyData, isLoading } = useGetBorrowsByReader(reader._id);
  const history = historyData || [];

  // Helper format ngày
  const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: "800px", maxWidth: "95%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2>📜 Lịch sử mượn: {reader.name}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            ⏳ Đang tải lịch sử...
          </div>
        ) : (
          <div
            className="history-table-wrapper"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="category-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Sách</th>
                  <th>Ngày Mượn</th>
                  <th>Hạn Trả</th>
                  <th>Ngày Trả</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          {record.book?.image && (
                            <img
                              src={record.book.image}
                              style={{
                                width: 30,
                                height: 45,
                                objectFit: "cover",
                              }}
                              alt=""
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: "bold" }}>
                              {record.book?.title || "Sách đã xóa"}
                            </div>
                            <small>{record.book?.bookCode}</small>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(record.borrowDate)}</td>
                      <td>{formatDate(record.dueDate)}</td>
                      <td>
                        {record.returnDate
                          ? formatDate(record.returnDate)
                          : "-"}
                      </td>
                      <td>
                        {record.returnDate ? (
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            ✅ Đã trả
                          </span>
                        ) : (
                          <span
                            style={{ color: "#e67e22", fontWeight: "bold" }}
                          >
                            ⏳ Đang mượn
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "#888",
                      }}
                    >
                      Bạn đọc này chưa mượn cuốn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ textAlign: "right", marginTop: 20 }}>
          <button className="btn-cancel" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default ReaderHistoryModal;
