import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <>
      {/* Footer */}
      <div className="footer-warpper">
        {/* Request */}
        <div className="footer-top">
          <div className="container">
            <div className="footer-bottom-content clearfix">
              <div className="row">
                {/* Logo and News Related */}
                <div className="col-lg-4 col-md-4">
                  <div className="logo-footer">
                    <a href="/">
                      {" "}
                      <img
                        src="https://www.evangadi.com/themes/humans//assets/images/misc/evangadi-logo-footer.png"
                        alt="Evangadi Logo"
                      />
                    </a>
                  </div>
                  {/* Social Media Links */}
                  <ul className="footer-social-list list-social list-inline">
                    <li>
                      <a
                        href="https://www.facebook.com/evangaditech"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="social_facebook">
                          <FaFacebook />
                        </i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/evangaditech/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="social_instagram">
                          <FaInstagram />
                        </i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.youtube.com/@EvangadiTech"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="social_youtube">
                          <FaYoutube />
                        </i>
                      </a>
                    </li>
                  </ul>
                </div>
                {/* Useful Links */}
                <div className="col-lg-4 col-md-4">
                  <h5>Useful Links</h5>
                  <ul className="list-menu">
                    <li>
                      <a href="#">How it works</a>
                    </li>
                    <li>
                      <a href="#">Terms of Service</a>
                    </li>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                  </ul>
                </div>
                {/* Contact Info */}
                <div className="col-lg-4 col-md-4 right">
                  <h5>Contact Info</h5>
                  <ul className="list-menu contact-list">
                    <li>Evangadi Networks</li>
                    <li>support@evangadi.com</li>
                    <li>+1-202-386-2702</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
