import React from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";


const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const MainDash = () => {
  return (
    <Container>
      <Sidebar />
      <Dashboard />
    </Container>
  );
};

export default MainDash;
