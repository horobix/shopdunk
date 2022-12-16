import { useRouteError } from "react-router-dom";
import "../styles/error-page.css";

let ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="my-5">
      <h3>Trang này không khả dụng</h3>
      <p>Liên kết bạn truy cập có thể bị hỏng hoặc trang có thể đã bị xoá.</p>

      <p className="fs-6">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
