import "./Loading.css"; // Tí tạo file này

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <p>Đang tải dữ liệu...</p>
    </div>
  );
};

export default Loading;
