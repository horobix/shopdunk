import "../../styles/footer.css";
import Container from "react-bootstrap/Container";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

let Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="footer__container">
          <div className="footer__top">
            <div>
              <h6 className="footer__title">Sản Phẩm</h6>
              <ul className="footer__list ps-0">
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    iPhone
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    iPad
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Mac
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Apple Watch
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Âm Thanh
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Phụ Kiện
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Dịch Vụ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="footer__title">Thông Tin</h6>
              <ul className="footer__list ps-0">
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Giới Thiệu
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Khuyến Mãi
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Bảo Hành Và Sửa Chữa
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Tuyển Dụng
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Tin Tức
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Check IMEI
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Phương Thức Thanh Toán
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Gửi góp ý, khiếu nại
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Thuê điểm bán lẻ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="footer__title">Chính Sách</h6>
              <ul className="footer__list ps-0">
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Trả Góp
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Giao Hàng
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Giao Hàng(ZaloPay)
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Huỷ Giao Dịch
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Đổi Trả
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Bảo Hành
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Giải Quyết Khiểu Nại
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Bảo Mật Thông Tin
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="footer__title">Địa Chỉ</h6>
              <ul className="footer__list ps-0">
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Tìm Store trên Google Map
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="" className="footer__list-link">
                    Hệ Thống Cửa Hàng
                  </a>
                </li>
              </ul>
              <h6 className="footer__title pt-4">Liên Hệ</h6>
              <ul className="footer__list ps-0">
                <li className="footer__list-item">
                  <a href="tel:19006626" className="footer__list-link">
                    Mua hàng: <span className="text-primary">1900.6626</span>
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="tel:0886308688" className="footer__list-link">
                    Khiếu Nại:{" "}
                    <span className="text-primary">0886.308.688</span>
                  </a>
                </li>
                <li className="footer__list-item">
                  <a href="tel:0822688668" className="footer__list-link">
                    Doanh nghiệp & Đối tác:
                    <span className="text-primary">
                      <br />
                      0822.688.668
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="footer__divider" />

          <div className="footer__bottom">
            <span className="copyright">
              &copy; 2022 ShopDunk. All rights reserved.
            </span>
            <ul className="footer__list ps-0">
              <li className="footer__list-item">
                <a href="#" className="footer__list-link">
                  <BsFacebook />
                </a>
              </li>
              <li className="footer__list-item">
                <a href="#" className="footer__list-link">
                  <BsInstagram />
                </a>
              </li>
              <li className="footer__list-item">
                <a href="#" className="footer__list-link">
                  <BsTwitter />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
