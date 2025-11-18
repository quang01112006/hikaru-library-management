import React, { useEffect, useState } from "react";
import "./Statistics.css";

const Statistics = () => {
  const [kpis, setKpis] = useState({
    totalBooks: 0,
    borrowingBooks: 0,
    totalReaders: 0,
    monthlyBorrow: 0
  });

  const [topBooks, setTopBooks] = useState([]);

  
  const mockKPI = {
    totalBooks: 500,
    borrowingBooks: 120,
    totalReaders: 300,
    monthlyBorrow: 80
  };

  const mockTopBooks = [
    { id: 1, name: "Dế mèn phiêu lưu ký", category: "Văn học", borrowCount: 98 },
    { id: 2, name: "Lập trình Java cơ bản", category: "Công nghệ", borrowCount: 90 },
    { id: 3, name: "Toán 12 nâng cao", category: "Giáo khoa", borrowCount: 87 },
  ];

  useEffect(() => {
    // Gọi API KPI 
    fetch("http://localhost:8080/api/statistics/kpi")
      .then((res) => {
        if (!res.ok) throw new Error("API KPI chưa sẵn sàng");
        return res.json();
      })
      .then((data) => setKpis(data))
      .catch(() => {
        console.log("Dùng mock KPI");
        setKpis(mockKPI);
      });

    // Gọi API Top Books 
    fetch("http://localhost:8080/api/statistics/top-books")
      .then((res) => {
        if (!res.ok) throw new Error("API Top Books chưa sẵn sàng");
        return res.json();
      })
      .then((data) => setTopBooks(data))
      .catch(() => {
        console.log("Dùng mock Top Books");
        setTopBooks(mockTopBooks);
      });
  }, []);

  return (
    <div className="statistics-page">
      <header className="statistics-header">
        <h1>Thống kê thư viện</h1>
      </header>


      <div className="kpi-cards">
        <div className="card">
          <h2>{kpis.totalBooks}</h2>
          <p>Tổng số sách</p>
        </div>

        <div className="card">
          <h2>{kpis.borrowingBooks}</h2>
          <p>Sách đang cho mượn</p>
        </div>

        <div className="card">
          <h2>{kpis.totalReaders}</h2>
          <p>Tổng số độc giả</p>
        </div>

        <div className="card">
          <h2>{kpis.monthlyBorrow}</h2>
          <p>Lượt mượn tháng này</p>
        </div>
      </div>


      <div className="charts">
        <div className="chart chart-bar">
          <p>Biểu đồ cột </p>
        </div>

        <div className="chart chart-pie">
          <p>Biểu đồ tròn </p>
        </div>
      </div>


      <div className="table-section">
        <h2>Top 10 sách mượn nhiều nhất</h2>

        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên sách</th>
              <th>Thể loại</th>
              <th>Số lượt mượn</th>
            </tr>
          </thead>

          <tbody>
            {topBooks.map((book, index) => (
              <tr key={book.id}>
                <td>{index + 1}</td>
                <td>{book.name}</td>
                <td>{book.category}</td>
                <td>{book.borrowCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
