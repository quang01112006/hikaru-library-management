import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const logoutHandler = () => {
    logout(); //
    navigate("/login");
  };

  return logoutHandler;
}
