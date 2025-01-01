import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useAuthContext } from "../context/AuthContext";

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/logout");
      localStorage.removeItem("chat-user");
      setAuthUser(null);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return { logout, loading };
};

export default useLogout;
