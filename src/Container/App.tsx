import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../Components/Layout/Header';
import Home from '../Components/Home';
import Footer from '../Components/Layout/Footer';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

function App() {
  //const dispatch = useDispatch();
  //const [skip, setSkip] = useState(true);
  //const userData = useSelector((state: RootState) => state.userAuthStore);
  // const { data, isLoading } = useGetShoppingCartQuery(userData.id, {
  //   skip: skip,
  // });

  useEffect(() => {
    // const localToken = localStorage.getItem("token");
    // if (localToken) {
    //   const { fullName, id, email, role }: userModel = jwt_decode(localToken);
    //   dispatch(setLoggedInUser({ fullName, id, email, role }));
    // }
  }, []);

  // useEffect(() => {
  //   if (!isLoading && data) {
  //     console.log(data);
  //     dispatch(setShoppingCart(data.result?.cartItems));
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (userData.id) setSkip(false);
  // }, [userData]);

  return (
    <div>
      <Header />
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          {/* <Route
            path="/menuItemDetails/:menuItemId"
            element={<MenuItemDetails />}
          ></Route> */}
          {/* <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/authentication"
            element={<AuthenticationTest />}
          ></Route>
          <Route
            path="/authorization"
            element={<AuthenticationTestAdmin />}
          ></Route>
          <Route path="/accessDenied" element={<AccessDenied />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="order/orderconfirmed/:id"
            element={<OrderConfirmed />}
          ></Route>
          <Route path="/order/myOrders" element={<MyOrders />} />
          <Route path="/order/orderDetails/:id" element={<OrderDetails />} />
          <Route path="/order/allOrders" element={<AllOrders />} />
          <Route path="/menuItem/menuitemlist" element={<MenuItemList />} />
          <Route
            path="/menuItem/menuItemUpsert/:id"
            element={<MenuItemUpsert />}
          />
          <Route path="/menuItem/menuItemUpsert" element={<MenuItemUpsert />} />
          <Route path="*" element={<NotFound />}></Route> */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
