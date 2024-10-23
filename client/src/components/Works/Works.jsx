import React, { useContext } from "react";
import "./Works.css";
import Upwork from "../../img/w1-removebg-preview.png";
import Fiverr from "../../img/w2-removebg-preview.png";
import Amazon from "../../img/wc-removebg-preview.png";
import Shopify from "../../img/w3-removebg-preview.png";
import Facebook from "../../img/Facebook.png";
import A from '../../img/int-logo1.png';
import { themeContext } from "../../Context";
import { motion } from "framer-motion";
import {Link} from 'react-scroll'
import Navbar from "../Navbar/Navbar";
const Works = () => {
  // context
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  // transition
  return (
    <>
    <Navbar/>
    <div className="works" id="works">
      {/* left side */}
      <div className="w-left">
        <div className="awesome">
          {/* dark Mode */}
          <span style={{ color: darkMode ? "white" : "" }}>
            My Awesome 
          </span>
          <span>Services</span>
          <span>
            1.Invigilation Allocation
            <br />
            2.History of their previous Invigilations
            <br />
            3.Analysis Reports
            <br />
            4.
          </span>
          
          <div
            className="blur s-blur1"
            style={{ background: "#ABF1FF94" }}
          ></div>
        </div>

        {/* right side */}
      </div>
      <div className="w-right">
        <motion.div
          initial={{ rotate: 45 }}
          whileInView={{ rotate: 0 }}
          viewport={{ margin: "-40px" }}
          transition={{ duration: 3.5, type: "spring" }}
          className="w-mainCircle"
        >
          <div className="w-secCircle">
            <img src={Upwork} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Fiverr} alt="" />
          </div>
          <div className="w-secCircle">
          <img src={Amazon} alt="" />
          </div>{" "}
          <div className="w-secCircle">
            <img src={Shopify} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Facebook} alt="" />
          </div>
        </motion.div>
        {/* background Circles */}
        <div className="w-backCircle blueCircle"></div>
        <div className="w-backCircle yellowCircle"></div>
      </div>
    </div>
    </>
  );
};

export default Works;
