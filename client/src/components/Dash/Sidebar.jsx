import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdSpaceDashboard } from "react-icons/md";
import { RiDashboard2Fill } from "react-icons/ri";
import { FaAddressCard } from "react-icons/fa";
import { GiTwirlCenter } from "react-icons/gi";
import { BsFillChatTextFill } from "react-icons/bs";
import { IoSettings, IoBookSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscChromeClose } from "react-icons/vsc";
import scrollreveal from "scrollreveal";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Add useNavigate

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [currentLink, setCurrentLink] = useState(1);
  const [navbarState, setNavbarState] = useState(false);

  useEffect(() => {
    const sr = scrollreveal({
      origin: "left",
      distance: "80px",
      duration: 1000,
      reset: false,
    });

    sr.reveal(
      `
        .brand,
        .links>ul>li:nth-of-type(1),
        .links>ul>li:nth-of-type(2),
        .links>ul>li:nth-of-type(3),
        .links>ul>li:nth-of-type(4),
        .links>ul>li:nth-of-type(5),
        .links>ul>li:nth-of-type(6),
        .logout
      `,
      {
        opacity: 0,
        interval: 300,
      }
    );

    switch (location.pathname) {
      case "/faculty":
        setCurrentLink(2);
        break;
      case "/download":
        setCurrentLink(3);
        break;
      case "/Anouncement":
        setCurrentLink(5);
        break;
      default:
        setCurrentLink(1);
        break;
    }
  }, [location.pathname]);

  const handleLogout = () => {
    // Remove the token from localStorage or any other storage
    localStorage.removeItem("token");

    // Redirect to home page
    navigate("/");
  };

  return (
    <>
      <Section>
        <div className="top">
          <div className="brand">
            <IoBookSharp />
            <span>INVIGO</span>
          </div>
          <div className="toggle">
            {navbarState ? (
              <VscChromeClose onClick={() => setNavbarState(false)} />
            ) : (
              <GiHamburgerMenu
                onClick={(e) => {
                  e.stopPropagation();
                  setNavbarState(true);
                }}
              />
            )}
          </div>
          <div className="links">
            <ul>
              <li className={currentLink === 1 ? "active" : ""} onClick={() => setCurrentLink(1)}>
                <Link to="/dashboard">
                  <MdSpaceDashboard />
                  <span> Dashboard</span>
                </Link>
              </li>
              <li className={currentLink === 2 ? "active" : ""} onClick={() => setCurrentLink(2)}>
                <Link to="/faculty">
                  <RiDashboard2Fill />
                  <span> Faculty Details</span>
                </Link>
              </li>
              <li className={currentLink === 3 ? "active" : ""} onClick={() => setCurrentLink(3)}>
                <Link to="/download">
                  <FaAddressCard />
                  <span> Allocation</span>
                </Link>
              </li>
              <li className={currentLink === 4 ? "active" : ""} onClick={() => setCurrentLink(4)}>
                <Link to="/pastdata">
                  <GiTwirlCenter />
                  <span> Past Invigilations</span>
                </Link>
              </li>
              <li className={currentLink === 5 ? "active" : ""} onClick={() => setCurrentLink(5)}>
                <Link to="/Anouncement" className="nav-link">
                  <BsFillChatTextFill />
                  <span> Announcements</span>
                </Link>
              </li>
              <li className={currentLink === 6 ? "active" : ""} onClick={() => setCurrentLink(6)}>
                <a href="#">
                  <IoSettings />
                  <span> Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="logout">
          <a href="#" onClick={handleLogout}> {/* Attach logout handler */}
            <FiLogOut />
            <span className="logout">Logout</span>
          </a>
        </div>
      </Section>
      <ResponsiveNav state={navbarState} className={navbarState ? "show" : ""}>
        <div className="responsive__links">
          <ul>
            <li className={currentLink === 1 ? "active" : ""} onClick={() => setCurrentLink(1)}>
              <Link to="/">
                <MdSpaceDashboard />
                <span> Dashboard</span>
              </Link>
            </li>
            <li className={currentLink === 2 ? "active" : ""} onClick={() => setCurrentLink(2)}>
              <Link to="/faculty">
                <RiDashboard2Fill />
                <span> Faculty Details</span>
              </Link>
            </li>
            <li className={currentLink === 3 ? "active" : ""} onClick={() => setCurrentLink(3)}>
              <Link to="/download">
                <FaAddressCard />
                <span> Allocation</span>
              </Link>
            </li>
            <li className={currentLink === 4 ? "active" : ""} onClick={() => setCurrentLink(4)}>
              <a href="#">
                <GiTwirlCenter />
                <span> Past Invigilations</span>
              </a>
            </li>
            <li className={currentLink === 5 ? "active" : ""} onClick={() => setCurrentLink(5)}>
              <Link to="/Anouncement">
                <BsFillChatTextFill />
                <span> Announcements</span>
              </Link>
            </li>
            <li className={currentLink === 6 ? "active" : ""} onClick={() => setCurrentLink(6)}>
              <a href="#">
                <IoSettings />
                <span> Settings</span>
              </a>
            </li>
          </ul>
        </div>
      </ResponsiveNav>
    </>
  );
}

// Styled components remain unchanged


const Section = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  background-color: #212121;
  height: 100vh;
  width: 23vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .top {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    .toggle {
      display: none;
    }

    .brand {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      svg {
        color: #ffc107;
        font-size: 2rem;
      }
      span {
        color: #ffc107;
        font-family: "Permanent Marker", cursive;
        font-size: 2rem;
      }
    }

    .links {
      display: flex;
      justify-content: center;

      ul {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        li {
          padding: 0.6rem 1rem;
          border-radius: 0.6rem;
          display: flex;
          gap: 1rem;
          width:80%;
          cursor: pointer;

          a {
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 1rem;
            color: white;
          }

          &:hover {
            background-color: #ffc107;
            
            a {
              color: black;
            }
          }

          &.active {
            background-color: #ffc107;

            a {
              color: black;
            }
          }
        }
      }
    }
  }

  .logout {
    padding: 0.3rem 1rem;
    border-radius: 0.6rem;

    a {
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    &:hover {
      background-color: #da0037;
    }
  }

  @media screen and (min-width: 280px) and (max-width: 1080px) {
    position: initial;
    width: 100%;
    height: max-content;
    padding: 1rem;
    .top {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;

      .toggle {
        display: block;
        svg {
          color: #ffc107;
          font-size: 1.4rem;
        }
      }

      .brand {
        gap: 1rem;
        justify-content: flex-start;
        svg {
          font-size: 1.5rem;
        }
        span {
          font-size: 1.5rem;
        }
      }
    }

    .links,
    .logout {
      display: none;
    }
  }
`;

const ResponsiveNav = styled.div`
  position: fixed;
  right: -100vw;
  top: 0;
  z-index: 10;
  background-color: black;
  height: 100vh;
  width: 60%;
  display: flex;
  opacity: 0;
  visibility: hidden;
  transition: 0.4s ease-in-out;

  &.show {
    right: 0;
    opacity: 1;
    visibility: visible;
  }

  .responsive__links {
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 3rem;

      li {
        padding: 0.6rem 1rem;
        border-radius: 0.6rem;
        display: flex;
        gap: 1rem;
        cursor: pointer;

        a {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: white;
        }

        &:hover {
          background-color: #ffc107;

          a {
            color: black;
          }
        }

        &.active {
          background-color: #ffc107;

          a {
            color: black;
          }
        }
      }
    }
  }
`;