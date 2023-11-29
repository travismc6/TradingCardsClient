import useAxiosInterceptor from "./useAxiosInterceptor";

const AxiosInterceptorProvider = () => {
  useAxiosInterceptor();

  return null; // This component does not render anything
};

export default AxiosInterceptorProvider;
