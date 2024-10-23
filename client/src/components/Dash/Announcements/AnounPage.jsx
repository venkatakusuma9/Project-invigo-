import React, { useEffect } from "react";
import styled from "styled-components";
import AddEvent from "./AddEvent.jsx";

import scrollreveal from "scrollreveal";
function AnounPage() {
  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "80px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(
      `
        nav,
        .row__one,
        .row__two
    `,
      {
        opacity: 0,
        interval: 100,
      }
    );
  }, []);
  return (<div className="dash" id="dash">
    <Section>
      <AddEvent/>
      <div className="grid">
        <div className="row__one">
          
        </div>
        
      </div>
    </Section>
    </div>
  );
}
export default AnounPage;

const Section = styled.section`
  
  margin-left: 22vw;
  padding: 2rem;
  width: calc(100% - 18vw); /* Adjusted to ensure the width fits properly */
  top: 0;
  background-color: grey;
  color: #333;
  overflow: hidden; /* Prevents any accidental scrolling */

  .grid {
    display: flex;
    flex-direction: column;
    gap: 2rem; /* Increased gap for better spacing */
    margin-top: 1rem;

    .row__one, .row__two {
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* Three columns to distribute cards */
      gap: 2rem; /* Gap between cards */
      align-items: stretch; /* Ensures cards stretch to fit without overflow */
    }
  }

  .card {
    background-color: #212121;
    color: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    flex-grow: 1; /* Ensures card grows within its grid space */
    min-width: 0; /* Prevents card overflow */
    min-height: 250px; /* Ensures cards have a minimum height, adjust as needed */
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .card.highlight {
    background-color: #ffc107;
    color: black;
  }

  .card .icon {
    font-size: 3rem;
  }

  @media screen and (min-width: 280px) and (max-width: 1080px) {
    margin-left: 0;
    padding: 1rem;

    .grid {
      .row__one,
      .row__two {
        grid-template-columns: 1fr;
      }
    }
  }
`;
