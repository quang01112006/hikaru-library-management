import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Trang này không tồn tại</h2>

        <div className="buttons">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Quay lại
          </button>
          <button onClick={() => navigate("/")} className="btn-home">
            Về Trang Chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
