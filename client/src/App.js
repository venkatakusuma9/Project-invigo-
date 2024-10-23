import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Intro from "./components/Intro/Intro";
import Services from "./components/Services/Services";
import Works from "./components/Works/Works";
import Contact from "./components/Contact/Contact";
import UserList from "./components/FacultyDetails/UserList";
import { themeContext } from "./Context";
import './App.css';
import Register from './components/Register/register';
import Login from "./components/Login/Login";
import MainDash from "./components/Dash/maindash";
import DownloadButton from "./components/getExcel/DownloadButton";
import NextPage from "./components/getExcel/NextPage";
import AllocationPage from "./components/getExcel/AllocationPage";
import { StateProvider } from "./components/getExcel/StateContext";
import PastInvigilation from "./components/getExcel/PastInvigilation";
import Announcement from "./components/Dash/Announcements/Announcement";

function App() {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  
  return (
    <div
      className="App"
      style={{
        background: darkMode ? "black" : "",
        color: darkMode ? "white" : "",
      }}
    >
      <StateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/services" element={<Services />} />
          <Route path="/works" element={<Works />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<MainDash />} />
          <Route path="/faculty" element={<UserList />} />
          <Route path="/download" element={<DownloadButton />} />
          <Route path="/next-page" element={<NextPage />} />
          <Route path="/allocation" element={<AllocationPage/>}/>
          <Route path="/pastdata" element={<PastInvigilation/>}/>
          <Route path="/Anouncement" element={<Announcement/>}/>
        </Routes>
      </Router>
      </StateProvider>
    </div>
  );
}

export default App;