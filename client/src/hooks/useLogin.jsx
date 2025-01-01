import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({ username, password }) => {
    // const success = handleInputError({username, password });
    // if (!success) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", {
        username,
        password,
      });
      const data = res.data;

      //   if (data.error) {
      //     throw new Error(data.error);
      //   }

      localStorage.setItem("chat-user", JSON.stringify(data));
      setAuthUser(data);

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return { login, loading };
};

export default useLogin;

const handleInputError = ({ username, password }) => {
  if (!username || !password) {
    toast.error("please fill in all fields");
    return false;
  }
  return true;
};
