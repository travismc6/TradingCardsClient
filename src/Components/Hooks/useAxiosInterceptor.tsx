import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "./useAuth";

const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));
  const { logout } = useAuth();

  useEffect(() => {
    const axiosInterceptor = axios.interceptors.response.use(
      async (response) => {
        if (import.meta.env.DEV) await sleep();
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
    };
  });

  // You can add more logic here if needed
};

export default useAxiosInterceptor;
