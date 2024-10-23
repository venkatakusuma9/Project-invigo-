import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { FaDownload } from 'react-icons/fa'; // Import the download icon from react-icons
import './PastInvigilation.css'; // Add this to include your CSS
import Sidebar from '../Dash/Sidebar';

const PastInvigilation = () => {
    const [pdfs, setPdfs] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                const response = await axios.get('/get-pdfs');
                setPdfs(response.data);
            } catch (error) {
                console.error('Error fetching PDFs', error);
            }
        };

        fetchPdfs();
    }, []);

    // Function to handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Filter the PDFs based on the search query
    const filteredPdfs = pdfs.filter(pdf => 
        (pdf.title && pdf.title.toLowerCase().includes(searchQuery)) ||
        (pdf.description && pdf.description.toLowerCase().includes(searchQuery)) ||
        (pdf.date && pdf.date.includes(searchQuery)) ||
        (pdf.session && pdf.session.toLowerCase().includes(searchQuery))
    );

    const handleDownload = async (id, description) => {
        try {
            const response = await axios.get(`/download-pdf/${id}`, {
                responseType: 'blob' // Important for downloading files
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${description}.pdf`); // Use description as filename
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading PDF', error);
        }
    };

    return (
       
        <div className="past-invigilation">
             <Sidebar/>
            <h1>Past Invigilations</h1>
            
            {/* Search input field */}
            <div className='search'>
            <input 
                type="text" 
                placeholder="Search by title, description, date, or session..." 
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
            />
            </div>

            <div className="pdf-cards">
                {filteredPdfs.map(pdf => (
                    <div key={pdf._id} className="pdf-card">
                        <h2>{pdf.title}</h2>
                        <p>{pdf.description}</p>
                        <p>Date: {pdf.date}</p>
                        <p>Session: {pdf.session}</p>
                        <button 
                            onClick={() => handleDownload(pdf._id, pdf.description)} 
                            className="download-button"
                        >
                            <FaDownload /> {/* Use the download icon */}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PastInvigilation;
