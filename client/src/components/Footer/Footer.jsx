import React from "react";
import "./Footer.css";
import Wave from "../../img/wave.png";
import Insta from "@iconscout/react-unicons/icons/uil-instagram";
import Facebook from "@iconscout/react-unicons/icons/uil-facebook";
import Gitub from "@iconscout/react-unicons/icons/uil-github";

const Footer = () => {
  return (
    <div className="footer">
      <img src={Wave} alt="" style={{ width: "100%",height:"0%" }} />
      <div className="f-content">
        <span>sathwiksampengala@gmail.com</span>
        <div className="f-icons">
         <a href="https://www.instagram.com/sac_vvit/?hl=en" target="blank"> <Insta color="white" size={"3rem"} /></a>
          <a href="https://www.facebook.com/vvitgunturofficial/" target="blank" ><Facebook color="white" size={"3rem"} /></a>
          <a href="https://www.linkedin.com/school/vasireddy-venkatadri-institute-of-technology-nambur-v-pedakakani-m-pin-522508-cc-bq-/?originalSubdomain=in" target="blank"><Gitub color="white" size={"3rem"} /></a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
