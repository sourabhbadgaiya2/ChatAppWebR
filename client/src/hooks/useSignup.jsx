import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuthContext();

  const signup = async ({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  }) => {
    const success = handleInputError({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    });

    if (!success) return;
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/signup", {
        fullName,
        username,
        password,
        confirmPassword,
        gender,
      });
      const data = res.data;

      //! localstorage
      localStorage.setItem("chat-user", JSON.stringify(data));
      //! update context
      setAuthUser(data);

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

// Error Handling client side

const handleInputError = ({
  fullName,
  username,
  password,
  confirmPassword,
  gender,
}) => {
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Password do not match");
    return false;
  }
  if (password.length < 6) {
    toast.error("Password must be at least 6 character");
    return false;
  }
  return true;
};

// const signup = async (input) => {
//   // Input Validation

//   if (!handleInputError(input)) return;

//   setLoading(true);

//   try {
//     const res = await axiosInstance.post("/api/auth/signup", input);

//     if (res.status === 201) {
//       toast.success("Signup successful! Please login.");
//       const data = await res.json();
//       console.log(data);
//     }
//   } catch (error) {
//     toast.error(error?.res?.data?.message || "Signup failed!");
//   } finally {
//     setLoading(false);
//   }
// };

// return { signup, loading };
// };
