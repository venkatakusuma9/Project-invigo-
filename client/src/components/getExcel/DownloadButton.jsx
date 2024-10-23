import React, { useState } from 'react';
import axios from '../../api/axios';
import './DownloadButton.css';
import Sidebar from '../Dash/Sidebar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash } from 'react-icons/fa';

const DownloadButton = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const navigate = useNavigate();

    const handleDownload = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleModalSubmit = async () => {
        if (!title) {
            alert("Title is required to download the file.");
            return;
        }
        setModalOpen(false);

        try {
            const response = await axios.get('/generate-excel', {
                responseType: 'blob'
            });

            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // Clean up the URL object
        } catch (error) {
            console.error('Error downloading the Excel file', error);
            toast.error('Error downloading the file.');
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleUpdate = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/upload-excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('File uploaded successfully!');
            setFile(null);
            setFileName('');

            // Navigate to the next page after a short delay to ensure the toast is visible
            setTimeout(() => {
                navigate('/next-page');
            }, 1000);
        } catch (error) {
            toast.error('Error uploading the file.');
            console.error('Error uploading the file', error);
        }
    };

    const handleDeleteFile = () => {
        setFile(null);
        setFileName('');
    };

    return (
        <div>
            <Sidebar />
            <div className="button-container">
                <button className="download-button" onClick={handleDownload}>
                    Download Faculty Data
                </button>
                {!file ? (
                    <input type="file" onChange={handleFileChange} />
                ) : (
                    <div className="file-info">
                        <span className="file-name">{fileName}</span>
                        <button className="delete-button" onClick={handleDeleteFile}>
                            <FaTrash />
                        </button>
                    </div>
                )}
                <button className="update-button" onClick={handleUpdate}>
                    Upload Details
                </button>
                <ToastContainer
                    style={{
                        position: 'absolute',
                        top: '490px', /* Adjust this value to move the toast lower */
                        left: '50%', /* Adjust as needed to align it with the button */
                        transform: 'translateX(-50%)',
                        zIndex: 9999, /* Ensure it appears above other elements */
                    }}
                    autoClose={3000}
                    hideProgressBar={true}
                    closeOnClick
                    pauseOnHover
                    draggable
                />
                
                {/* Modal for File Name Input */}
                {modalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Enter File Name</h2>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="File name" 
                            />
                            <button onClick={handleModalSubmit}>Download</button>
                            <button onClick={handleModalClose}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 30px; /* Increase padding for more space inside the modal */
                    border-radius: 8px;
                    text-align: center;
                    width: 400px; /* Set a fixed width */
                    max-width: 90%; /* Responsive width */
                }
                .modal-content input {
                    margin-bottom: 10px;
                    padding: 8px;
                    width: 100%;
                }
                .modal-content button {
                    margin: 5px;
                    padding: 10px 20px;
                    border: none;
                    background-color: #007bff;
                    color: white;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .modal-content button:hover {
                    background-color: #0056b3;
                }
                .file-info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: auto; /* Adjust as needed */
                    max-width: 100%; /* Responsive width */
                    margin: 10px 0;
                    padding: 10px;
                    background-color: #1c1c1c;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                }
                .file-name {
                    font-weight: bold;
                    color: white;
                    margin-right: 10px;
                }
                .delete-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: red;
                }
                .delete-button:hover {
                    color: darkred;
                }
            `}</style>
        </div>
    );
};

export default DownloadButton;
