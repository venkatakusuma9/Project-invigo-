import React from "react";
import styled from "styled-components";
import Sidebar from "../Sidebar.jsx";
import AnounPage from "./AnounPage.jsx";


const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Announcement = () => {
  return (
    <Container>
      <Sidebar />
      <AnounPage/>
    </Container>
  );
};

export default Announcement;