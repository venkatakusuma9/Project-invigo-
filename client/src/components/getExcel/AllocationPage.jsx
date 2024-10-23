import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StateContext } from './StateContext';
import Select from 'react-select';
import jsPDF from 'jspdf';
import axios from '../../api/axios';
import 'jspdf-autotable';
import { FaArrowLeft } from 'react-icons/fa';
import './AllocationPage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllocationPage = () => {
    const { state, setState } = useContext(StateContext);
    const navigate = useNavigate();
    const { allocatedRooms, users, rooms } = state;

    const [isEditing, setIsEditing] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);
    const [newRoom, setNewRoom] = useState(null);
    const [newUsers, setNewUsers] = useState([]);
    const [showPrintPopup, setShowPrintPopup] = useState(false);
    const [printTitle, setPrintTitle] = useState('');
    const [printDescription, setPrintDescription] = useState('');
    const [printDate, setPrintDate] = useState('');
    const [printSession, setPrintSession] = useState('');

    const allocatedUsernames = allocatedRooms.flatMap(allocation => allocation.users.map(user => user.username));
    const unallocatedUsers = users.filter(user => !allocatedUsernames.includes(user.username));
    const allocatedRoomNames = allocatedRooms.map(allocation => allocation.room);
    const unallocatedRooms = rooms.filter(room => !allocatedRoomNames.includes(room.room));

    const handleEdit = (allocation) => {
        setCurrentEdit(allocation);
        setNewRoom({ value: allocation.room, label: allocation.room });
        setNewUsers(allocation.users.map(user => ({ value: user.username, label: user.username })));
        setIsEditing(true);
    };

    const handleUpdate = () => {
    // Get the current number of users in the allocation being edited
    const currentUsersCount = currentEdit.users.length;
    const newUsersCount = newUsers.length;

    // Case 1: If the current allocation has 1 user, and the updated number of users is not 1
    if (currentUsersCount === 1 && newUsersCount !== 1) {
        toast.error('Room should contain exactly 1 user');
        return;
    }

    // Case 2: If the current allocation has 2 users, and the updated number of users is not 2
    if (currentUsersCount === 2 && newUsersCount !== 2) {
        toast.error('Room should contain exactly 2 users');
        return;
    }

    // Update the allocations if all checks pass
    const updatedAllocations = allocatedRooms.map(allocation => {
        if (allocation.room === currentEdit.room) {
            return {
                room: newRoom.value,
                users: newUsers.map(user => ({ username: user.value })),
            };
        }
        return allocation;
    });

    setState({
        ...state,
        allocatedRooms: updatedAllocations,
    });

    setIsEditing(false);
    setCurrentEdit(null);
};

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentEdit(null);
    };

    const roomOptions = unallocatedRooms.map(room => ({
        value: room.room,
        label: room.room,
    }));

    const userOptions = unallocatedUsers.map(user => ({
        value: user.username,
        label: user.username,
    }));

    const handlePrintPopup = () => {
        setShowPrintPopup(true);
    };

    const handleGeneratePDF = async () => {
        const doc = new jsPDF();
    
        doc.setFontSize(22);
        doc.text(printTitle, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
        doc.setFontSize(16);
        doc.text(printDescription, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    
        doc.setFontSize(12);
        doc.text(`Date: ${printDate ? new Date(printDate).toLocaleDateString() : 'DD/MM/YYYY'}`, 10, 40);
        doc.text(`Session: ${printSession ? formatTime(printSession) : 'HH:MM AM/PM'}`, doc.internal.pageSize.getWidth() - 10, 40, { align: 'right' });
    
        // Add table
        doc.autoTable({
            startY: 50,
            head: [['Room', 'Assigned Faculty']],
            body: allocatedRooms.map(allocation => [
                allocation.room,
                allocation.users.map(user => user.username).join(', ')
            ]),
        });
    
        const pdfBlob = doc.output('blob');
    
        const formData = new FormData();
        formData.append('file', pdfBlob, `${printDescription}.pdf`);
        formData.append('title', printTitle);
        formData.append('description', printDescription);
        formData.append('date', printDate);
        formData.append('session', printSession);
    
        try {
            // Upload the PDF to the database
            await axios.post('/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            // Create a URL for downloading the PDF
            const downloadUrl = window.URL.createObjectURL(pdfBlob);
    
            // Create a link element and trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${printDescription}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            // Show success toast message
            toast.success('PDF saved to database and downloaded successfully');
    
        } catch (error) {
            console.error('Error uploading PDF:', error);
            toast.error('Error uploading PDF');
        }
    
        setShowPrintPopup(false); // Close the popup after generating the PDF
    };
    
    const handleCancelPrint = () => {
        setShowPrintPopup(false);
        setPrintTitle('');
        setPrintDescription('');
        setPrintDate('');
        setPrintSession('');
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const hourInt = parseInt(hour, 10);
        const period = hourInt >= 12 ? 'PM' : 'AM';
        const formattedHour = hourInt > 12 ? hourInt - 12 : hourInt === 0 ? 12 : hourInt;
        return `${formattedHour}:${minute} ${period}`;
    };

    return (
        <div className="allocation-page">
            <FaArrowLeft className="back-arrow" onClick={() => navigate('/next-page')} />
            <h1>Allocation Results</h1>
            {allocatedRooms.length > 0 ? (
                <table className="allocation-table">
                    <thead>
                        <tr>
                            <th>Room</th>
                            <th>Users</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocatedRooms.map((allocation, index) => (
                            <tr key={index}>
                                <td>{allocation.room}</td>
                                <td>
                                    {allocation.users.map((user, idx) => (
                                        <span key={idx}>{user.username}{idx < allocation.users.length - 1 ? ', ' : ''}</span>
                                    ))}
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(allocation)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No allocations made</p>
            )}

            {isEditing && (
                <div className="edit-popup">
                    <div className="edit-popup-content">
                        <h3>Edit Allocation</h3>
                        <label>
                            Room:
                            <Select
                                value={newRoom}
                                onChange={setNewRoom}
                                options={roomOptions}
                                className="select-input"
                            />
                        </label>
                        <label>
                            Users:
                            <Select
                                isMulti
                                value={newUsers}
                                onChange={setNewUsers}
                                options={userOptions}
                                className="select-input"
                            />
                        </label>
                        <div className="edit-popup-buttons">
                            <button onClick={handleUpdate}>Update</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <button onClick={handlePrintPopup} className="print-button">Generate PDF</button>

            {showPrintPopup && (
                <div className="print-popup">
                    <div className="print-popup-content">
                        <h3>Generate PDF</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label>Title:</label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={printTitle}
                                            onChange={(e) => setPrintTitle(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Description:</label>
                                    </td>
                                    <td>
                                        <textarea
                                            value={printDescription}
                                            onChange={(e) => setPrintDescription(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Date:</label>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={printDate}
                                            onChange={(e) => setPrintDate(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>Session:</label>
                                    </td>
                                    <td>
                                        <input
                                            type="time"
                                            value={printSession}
                                            onChange={(e) => setPrintSession(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="print-popup-buttons">
                            <button onClick={handleGeneratePDF}>Generate PDF</button>
                            <button onClick={handleCancelPrint}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Container */}
            <ToastContainer position="bottom-center" />
        </div>
    );
};

export default AllocationPage;