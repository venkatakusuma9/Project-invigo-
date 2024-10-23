import React from 'react'
import styled from "styled-components";

const Form = ({ handleSubmit, handleOnchange, closeWindow, rest }) => {


  return (
    <div>
      <ModalOverlay>
        <ModalContent>
          <form className="form" autoComplete="off" onSubmit={handleSubmit}>
            <div className="form-group">
              <select
                id="title"
                name="title"
                onChange={handleOnchange}
                value={rest.title}
                required
              >
                <option value="" disabled>Select Event</option>
                <option value="Semester Exams">Semester Exams</option>
                <option value="Mid-1 Exams">Mid-1 Exams</option>
                <option value="Mid-2 Exams">Mid-2 Exams</option>
              </select>

            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Event Description"
                id="description"
                name="description"
                onChange={handleOnchange}
                value={rest.description}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                placeholder="Event date"
                id="date"
                name="date"
                onChange={handleOnchange}
                value={rest.date}
                required
              />
            </div>
            


            <div className="button-row">
              <input type="submit" className="btn btn-primary" value="Submit" />
              <button type="button" className="btn btn-primary" onClick={closeWindow}>
                Cancel
              </button>
            </div>
          </form>
        </ModalContent>
      </ModalOverlay>
    </div>
  )
}
/*<div className="form-group">
              <input
                type="file"
                placeholder="Choose time table"
                id="file"
                name="file" // This should match the name in upload.single('file')
                onChange={handleOnchange}
                value={rest.file}
                accept="application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                required
              />
              </div>*/
export default Form;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #212121;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  width: 80%;
  max-width: 500px;
  z-index: 1001;

  .form-group {
    margin-bottom: 1rem;

    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
       &::file-selector-button {
    padding: 10px 15px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    
    &:hover {
      background-color: #e6e6e6;
    }
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
      select{
      width: 104%;
      padding: 0.6rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      }
  }

  .button-row {
    display: flex;
    justify-content: space-between;

    .btn {
      background-color: #ffc107;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      cursor: pointer;

      &.btn-primary {
        background-color: #007bff;
        color: white;
      }
    }
  }
`;