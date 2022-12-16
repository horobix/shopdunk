import { RxDashboard, RxPlusCircled, RxListBullet } from "react-icons/rx";
import { Link, Outlet } from "react-router-dom";

let AdminSideBar = () => {
  return (
    <>
      <div
        style={{
          position: "sticky",
          top: "0",
          left: "0",
          width: "20%",
          height: "100vh",
          backgroundColor: "#363636",
        }}
      >
        <div className="pt-5 px-5 ">
          <img className="w-100" src="/logo.svg" alt="Brand Logo" />
        </div>

        <div className="px-4 py-2">
          <hr style={{ border: "1px solid #eee" }} />
        </div>
        <div className="px-4 py-2">
          <div>
            <Link
              className="d-flex align-items-center w-100 text-decoration-none fw-semibold text-white"
              to={"/admin/add-product"}
            >
              <RxPlusCircled className="me-2" /> Thêm sản phẩm
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <div>
            <Link
              className="d-flex align-items-center w-100 text-decoration-none fw-semibold text-white"
              to={"/admin/product-manager"}
            >
              <RxListBullet className="me-2" /> Quản lý sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSideBar;
