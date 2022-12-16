import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

import { Accordion, Container, Row, Col } from "react-bootstrap";
import { RxDashboard } from "react-icons/rx";

import ErrorPage from "./error-page";
import AdminSideBar from "./partials/admin-sidebar";
import AdminAddProduct from "./partials/admin-add-product";
import AminProductManager from "./partials/admin-product-manager";

let Admin = () => {
  useEffect(() => {
    document.title = "ShopDunk LMS";
  }, []);

  return (
    <div className="d-flex h-100">
      <AdminSideBar />
      <div style={{ width: "80%" }}>
        <Outlet />
      </div>
    </div>
  );
};

let adminRoute = {
  path: "/admin",
  element: <Admin />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "/admin/add-product",
      element: <AdminAddProduct />,
    },
    {
      path: "/admin/product-manager",
      element: <AminProductManager />,
    },
  ],
};

export default adminRoute;
