
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from '../../../api/axios';
import Form from "./Form";
import Anoun from "../../../img/Anoun.png.jpg";


export default function AddEvent() {
  const [isWindowOpen, setWindowOpen] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormdata] = useState({
    title: "",
    description: "",
    date: "",
    //file:"",
  });
  const [formDataEdit, setFormdataEdit] = useState({
    title: "",
    description: "",
    date: "",
    _id: "",
    //file:"",
  });
   
  const [dataList, setDataList] = useState([]);

  
const handleOnchange = (e) => {
  const { name, value } = e.target;
  setFormdata((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = await axios.post("/create", formData);
  console.log(data);
  if (data.data.Success) {
    setWindowOpen(false);
    alert(data.data.message);
    getFetchData();
  }
};


  const openWindow = () => {
    setFormdata({
      title: "",
      description: "",
      date: "",
      //file:"",
    });
    setWindowOpen(true);
  };

  const getFetchData = async () => {
    const data = await axios.get("/anoun");
    console.log(data);
    if (data.data.Success) {
      setDataList(data.data.data);
    } 
  }

  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id);
    if (data.data.Success) {
      getFetchData();
      alert(data.data.message);
    }
  }
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/update", formDataEdit);
    if (data.data.Success) {
      getFetchData();
      alert(data.data.message);
      setEditSection(false);
    }
  }

  const handleEditOnchange = async (e) => {
    const { name, value } = e.target;
    setFormdataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleEdit = (event) => {
    setFormdataEdit(event);
    setEditSection(true);
  }
  
  return (
    <>
      <Nav>
        <div className="title">
          <h4>Hi user,</h4>
          <h1>
            Welcome to <span>Anouncement page</span>
          </h1>
        </div>
        <div className="search">
          <button className="btn" onClick={openWindow}>Add Event</button>
        </div>
      </Nav>

      {isWindowOpen && (
        <Form
          handleSubmit={handleSubmit}
          handleOnchange={handleOnchange}
          closeWindow={() => setWindowOpen(false)}
          rest={formData}
        />
      )}

      {editSection && (
        <Form
          handleSubmit={handleUpdate}
          handleOnchange={handleEditOnchange}
          closeWindow={() => setEditSection(false)}
          rest={formDataEdit}
        />
      )}

      <CardContainer>
        {dataList.length > 0 ? (
          dataList.map((event) => (
            <Card key={event.id}>
              <CardImage src={Anoun} alt="Event" />
              <CardDetails>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
                <CardDate>{event.date}</CardDate>
                <CardFile>{event.file}</CardFile>
                <CardActions>
                  <Button className="update" onClick={() => handleEdit(event)}>Edit</Button>
                  <Button className="delete" onClick={() => handleDelete(event._id)}>Delete</Button>
                </CardActions>
              </CardDetails>
            </Card>
          ))
        ) : (
         <Nav>
          <div className="Nostatus">
            <p style={{ textAlign: "center" }}>No Events Currently</p>
          </div>
          </Nav>
          
        )}
      </CardContainer>
    </>
  );
}


const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 1rem;
  max-width: 90%;
  border-radius: 0.6rem;
  background-color: #212121;
  overflow: auto;

  .title {
    width: 40%;
    max-width: 40%;

    h1 {
      font-size: 1.5rem;

      span {
        margin-left: 0.5rem;
        color: #ffc107;
        font-family: "Permanent Marker", cursive;
        letter-spacing: 0.2rem;
      }
    }
    .Nostatus{
    width:100%;
    }
    h4 {
      margin: 0;
    }
  }

  .search {
    background-color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 1rem;

    button {
      background-color: #ffc107;
      color: #212121;
      border: none;
      font-family: "Permanent Marker", cursive;
      letter-spacing: 0.1rem;

      &:focus {
        outline: none;
        background-color: transparent;
        color: #ffc107;
      }
    }
  }

  @media screen and (min-width: 280px) and (max-width: 1080px) {
    flex-direction: column;
    align-items: flex-start;

    .title {
      width: 100%;
      max-width: none;
      margin-bottom: 1rem;

      h1 {
        font-size: 1.2rem;

        span {
          display: block;
          margin: 0.5rem 0;
          letter-spacing: 0;
        }
      }

      h4 {
        font-size: 1rem;
      }
    }

    .search {
      width: 100%;
      padding: 0.5rem;

      input {
        width: 100%;
        font-size: 1rem;
        letter-spacing: 0.05rem;
      }
    }
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 1rem; /* Adjust the gap between rows */
  column-gap: 3rem; /* Adjust the gap between columns */
  align-items: center;
  color: white;
  margin-top: 1rem;
  padding: 1rem;
  max-width: 100%;
  color: #ffc107;
  font-family: "Permanent Marker", cursive;
  border-radius: 0.5rem;
  max-height: 70vh;
  overflow-y: auto; /* Enable vertical scrolling */
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;
  border-radius: 0.6rem;
  background-color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #ffc107;
    color: black;
  }

  &:hover h2,
  &:hover p {
    color: black;
  }
`;

const CardImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: #ffc107;
  transition: color 0.3s ease;
`;

const CardDescription = styled.p`
  margin: 0.5rem 0;
  color: white;
  text-align: center;
  transition: color 0.3s ease;
`;

const CardDate = styled.p`
  margin: 0.5rem 0;
  color: white;
  text-align: center;
  transition: color 0.3s ease;
`;
const CardFile=styled.p`

`;

const CardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 30px 30px;
  transition: background-color 0.3s ease;

  &.update {
    background-color: blue;
    color: #fff;
  }

  &.update:hover {
    background-color: #212121;
  }

  &.delete {
    background-color: #dc3545;
    color: #fff;
  }

  &.delete:hover {
    background-color: #212121;
  }
`;