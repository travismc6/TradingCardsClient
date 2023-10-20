import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL; //"https://localhost:44395/api/";

export const ENDPOINTS = {
  GET_CHECKLIST: `cardchecklist`,
  SAVE_CHECKLIST: `cardchecklist`,
  EXPORT_CHECKLIST: `cardchecklist/export`,
  REGISTER: `auth/register`,
  LOGIN: `auth/login`,
  SAVE_CARD: `cardcollection`,
  COLLECTION_DETAILS: `cardcollection/details`,
  DELETE_CARD: (id: string) => `cardcollection/delete/${id}`,
  DUPLICATE_CARD: (id: string) => `cardcollection/duplicate/${id}`,
  IMAGE_UPLOAD: (id: string) => `cardcollection/image/${id}`,
  CARD_DETAILS: (id: string) => `cardcollection/${id}`,
};

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.interceptors.response.use(async (response: any) => {
  // if (process.env.NODE_ENV === "development") {
  //   alert("in dev");
  //   const API_BASE_URL = "https://localhost:44395/api";

  // }

  // TODO: undo if in prod
  if (import.meta.env.DEV) await sleep();

  return response;
});

// import axios, { AxiosError, AxiosResponse } from "axios";
// import useAuth from "../Components/Hooks/useAuth";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

// const responseBody = (response: AxiosResponse) => response.data;

// axios.interceptors.request.use((config) => {
//   const { user, loading } = useAuth();

//   if (user?.authToken)
//     config.headers.Authorization = `Bearer ${user?.authToken}`;
//   return config;
// });

// axios.interceptors.response.use(
//   async (response) => {
//     if (process.env.NODE_ENV === "development") await sleep();
//     // const pagination = response.headers["pagination"];
//     // if (pagination) {
//     //   response.data = new PaginatedResponse(
//     //     response.data,
//     //     JSON.parse(pagination)
//     //   );
//     //   return response;
//     // }
//     return response;
//   },
//   (error: AxiosError) => {
//     const { data, status } = error.response as AxiosResponse;
//     const navigate = useNavigate();

//     switch (status) {
//       case 400:
//         if (data.errors) {
//           const modelStateErrors: string[] = [];
//           for (const key in data.errors) {
//             if (data.errors[key]) {
//               modelStateErrors.push(data.errors[key]);
//             }
//           }
//           throw modelStateErrors.flat();
//         }
//         toast.error(data.title);
//         break;
//       case 401:
//         toast.error(data.title);
//         break;
//       case 403:
//         toast.error("You are not allowed to do that!");
//         break;
//       case 500:
//         navigate("/server-error");
//         break;
//       default:
//         break;
//     }

//     return Promise.reject(error.response);
//   }
// );

// export const ENDPOINTS = {
//   GET_CHECKLIST: `${API_BASE_URL}/cardchecklist`,
//   SAVE_CHECKLIST: `${API_BASE_URL}/cardchecklist`,
//   EXPORT_CHECKLIST: `${API_BASE_URL}/cardchecklist/export`,
//   REGISTER: `${API_BASE_URL}/auth/register`,
//   LOGIN: `${API_BASE_URL}/auth/login`,
//   SAVE_CARD: `${API_BASE_URL}/cardcollection`,
//   DELETE_CARD: (id: string) => `${API_BASE_URL}/cardcollection/delete/${id}`,
//   DUPLICATE_CARD: (id: string) =>
//     `${API_BASE_URL}/cardcollection/duplicate/${id}`,
//   IMAGE_UPLOAD: (id: string) => `${API_BASE_URL}/cardcollection/image/${id}`,
//   CARD_DETAILS: (id: string) => `${API_BASE_URL}/cardcollection/${id}`,
// };

// const requests = {
//   get: (url: string, params?: URLSearchParams) =>
//     axios.get(url, { params }).then(responseBody),
//   post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
//   put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
//   delete: (url: string) => axios.delete(url).then(responseBody),
//   postForm: (url: string, data: FormData) =>
//     axios
//       .post(url, data, {
//         headers: { "Content-type": "multipart/form-data" },
//       })
//       .then(responseBody),
//   putForm: (url: string, data: FormData) =>
//     axios
//       .put(url, data, {
//         headers: { "Content-type": "multipart/form-data" },
//       })
//       .then(responseBody),
// };

// const Checklist = {
//   get: () => requests.get("cardchecklist"),
//   // addItem: (productId: number, quantity = 1) =>
//   //   requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
//   // removeItem: (productId: number, quantity = 1) =>
//   //   requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
// };

// const agent = {
//   Checklist,
// };

// export default agent;
