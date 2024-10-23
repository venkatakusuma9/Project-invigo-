import React, { useContext, useEffect } from 'react';
import axios from '../../api/axios';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import { StateContext } from './StateContext';
import './nextpage.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

const NextPage = () => {
    const { state, setState } = useContext(StateContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const response = await axios.get('/get-dates');
                setState(prevState => ({ ...prevState, dates: response.data.dates }));
            } catch (error) {
                console.error('Error fetching dates', error);
            }
        };

        fetchDates();
    }, [setState]);

    const handleDateChange = async (event) => {
        const date = event.target.value;
        setState(prevState => ({ ...prevState, selectedDate: date }));

        try {
            const response = await axios.get(`/get-users?date=${date}`);
            setState(prevState => ({ ...prevState, users: response.data.users }));
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                const numPages = pdf.numPages;

                let roomData = new Map();

                for (let i = 1; i <= numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();

                    for (let index = 0; index < textContent.items.length; index++) {
                        const text = textContent.items[index].str.trim();

                        if (text.match(/^[A-Z]-\d{3,4}(-[A-Z])?$/)) {
                            const room = text;
                            const strengthIndex = index + 1;
                            const strength = textContent.items[strengthIndex]?.str.trim();

                            if (!isNaN(strength)) {
                                if (roomData.has(room)) {
                                    roomData.set(room, roomData.get(room) + parseInt(strength, 10));
                                } else {
                                    roomData.set(room, parseInt(strength, 10));
                                }
                            }
                        }
                    }
                }

                const roomArray = Array.from(roomData, ([room, strength]) => ({ room, strength, selectedStrength: null }));
                setState(prevState => ({ ...prevState, rooms: roomArray, filteredRooms: roomArray }));
            } catch (error) {
                console.error('Error processing PDF file', error);
            }
        }
    };

    useEffect(() => {
        const query = state.searchQuery.trim().toLowerCase();
        const filtered = state.rooms.filter(room =>
            room.room.toLowerCase().includes(query)
        );
        setState(prevState => ({ ...prevState, filteredRooms: filtered }));
    }, [state.searchQuery, state.rooms, setState]);

    const handleAddFaculty = () => {
        setState(prevState => ({ ...prevState, isModalOpen: true }));
    };

    const handleFacultySearch = async (query) => {
        setState(prevState => ({ ...prevState, facultySearchQuery: query }));
        if (query.length > 0) {
            try {
                const response = await axios.get(`/search-faculty?query=${query}`);
                setState(prevState => ({ ...prevState, facultySuggestions: response.data.faculty }));
            } catch (error) {
                console.error('Error fetching faculty suggestions', error);
            }
        } else {
            setState(prevState => ({ ...prevState, facultySuggestions: [] }));
        }
    };

    const handleSelectFaculty = (faculty) => {
        setState(prevState => ({
            ...prevState,
            users: [...prevState.users, { username: faculty.fullname, branch: faculty.branch }],
            isModalOpen: false,
            facultySearchQuery: '',
            facultySuggestions: []
        }));
    };

    const handleRemoveUser = (index) => {
        setState(prevState => ({
            ...prevState,
            users: prevState.users.filter((_, i) => i !== index)
        }));
    };

    const handleAddRoom = () => {
        setState(prevState => ({ ...prevState, isRoomModalOpen: true, roomError: '' }));
    };

    const handleSaveRoom = () => {
        const existingRoom = state.rooms.find(room => room.room.toLowerCase() === state.newRoom.trim().toLowerCase());
        if (existingRoom) {
            setState(prevState => ({ ...prevState, roomError: 'Room already exists' }));
        } else {
            const newRoomData = { room: state.newRoom, strength: 0, selectedStrength: null };
            setState(prevState => ({
                ...prevState,
                rooms: [...prevState.rooms, newRoomData],
                filteredRooms: [...prevState.rooms, newRoomData],
                isRoomModalOpen: false,
                newRoom: ''
            }));
        }
    };

    const handleRemoveRoom = (roomName) => {
        const updatedRooms = state.rooms.filter(room => room.room !== roomName);
        setState(prevState => ({
            ...prevState,
            rooms: updatedRooms,
            filteredRooms: updatedRooms
        }));
    };

    const handleSelectStrength = (roomName, strength) => {
        setState(prevState => {
            const updatedRooms = prevState.rooms.map(room => {
                if (room.room === roomName) {
                    // Toggle selectedStrength if the room is already selected
                    if (room.selectedStrength === strength) {
                        return { ...room, selectedStrength: null };
                    } else {
                        return { ...room, selectedStrength: strength };
                    }
                }
                return room;
            });
    
            const totalUsersNeeded = updatedRooms.reduce((sum, room) => sum + (room.selectedStrength ? room.selectedStrength / 24 : 0), 0);
    
            if (totalUsersNeeded >= prevState.users.length) {
                alert('Not enough users available to allocate to more rooms.');
                return { ...prevState, rooms: updatedRooms, filteredRooms: updatedRooms };
            }
    
            return { ...prevState, rooms: updatedRooms, filteredRooms: updatedRooms };
        });
    };
    
    const handleAllocate = () => {
        const shuffledUsers = [...state.users].sort(() => 0.5 - Math.random());
        const allocatedRooms = [];
        const usedUsers = new Set();

        for (let room of state.rooms) {
            if (room.selectedStrength === 24) {
                const user = shuffledUsers.find(user => !usedUsers.has(user.username));
                if (user) {
                    allocatedRooms.push({ room: room.room, users: [user] });
                    usedUsers.add(user.username);
                }
            } else if (room.selectedStrength === 48) {
                const user1 = shuffledUsers.find(user => !usedUsers.has(user.username));
                const user2 = shuffledUsers.find(user => !usedUsers.has(user.username) && user !== user1);
                if (user1 && user2) {
                    allocatedRooms.push({ room: room.room, users: [user1, user2] });
                    usedUsers.add(user1.username);
                    usedUsers.add(user2.username);
                }
            }
        }

        setState(prevState => ({ ...prevState, allocatedRooms }));
        navigate('/allocation');
    };

    return (
        <div className="main-container">
            <div className="left-container">
                <FontAwesomeIcon icon={faArrowLeft} className="back-arrow" onClick={() => navigate("/download")} />
                <h2>Select Date</h2>
                <select value={state.selectedDate} onChange={handleDateChange}>
                    <option value="" disabled>Select a date</option>
                    {state.dates.map((date, index) => (
                        <option key={index} value={date}>{date}</option>
                    ))}
                </select>
                <h2>Users</h2>
                <ul>
                    {state.users.map((user, index) => (
                        <li key={index}>
                            {user.username}
                            {user.branch && ` (${user.branch})`}
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="remove-button"
                                onClick={() => handleRemoveUser(index)}
                            />
                        </li>
                    ))}
                </ul>
                <button onClick={handleAddFaculty} className="action-button">Add Faculty</button>
            </div>
            <div className="right-container">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="action-button left"
                />
                <input
                    type="text"
                    placeholder="Search room number"
                    value={state.searchQuery}
                    onChange={(e) => setState(prevState => ({ ...prevState, searchQuery: e.target.value }))}
                    className="search-input"
                />
                <button onClick={handleAddRoom} className="action-button">Add Room</button>
                <div className="rooms-container">
                    {state.filteredRooms.length > 0 ? (
                        state.filteredRooms.map((room, index) => (
                            <div key={index} className="room-card">
                                <div>{room.room}</div>
                                <div>
                                    <button
                                        className={`small-button ${room.selectedStrength === 24 ? 'selected' : ''}`}
                                        onClick={() => handleSelectStrength(room.room, 24)}
                                    >
                                        24
                                    </button>
                                    <button
                                        className={`small-button ${room.selectedStrength === 48 ? 'selected' : ''}`}
                                        onClick={() => handleSelectStrength(room.room, 48)}
                                    >
                                        48
                                    </button>
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="small-button remove"
                                        onClick={() => handleRemoveRoom(room.room)}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No rooms available</p>
                    )}
                </div>
                <button onClick={handleAllocate} className="action-button">Allocate</button>
            </div>
            {state.isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Faculty</h2>
                        <input
                            type="text"
                            value={state.facultySearchQuery}
                            onChange={(e) => handleFacultySearch(e.target.value)}
                            placeholder="Search faculty..."
                            className="search-input"
                            style={{ backgroundColor: 'grey', color: 'white' }}
                        />
                        <ul className="suggestions-list">
                            {state.facultySuggestions.map((faculty, index) => (
                                <li key={index} onClick={() => handleSelectFaculty(faculty)}>
                                    {faculty.fullname} ({faculty.branch})
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setState(prevState => ({ ...prevState, isModalOpen: false }))} className="action-button close-button">Close</button>
                    </div>
                </div>
            )}

            {state.isRoomModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Room</h2>
                        <input
                            type="text"
                            value={state.newRoom}
                            onChange={(e) => setState(prevState => ({ ...prevState, newRoom: e.target.value }))}
                            placeholder="Enter room number"
                            className="search-input"
                        />
                        {state.roomError && <p className="error-message">{state.roomError}</p>}
                        <button onClick={handleSaveRoom} className="action-button">Save</button>
                        <button onClick={() => setState(prevState => ({ ...prevState, isRoomModalOpen: false, newRoom: '', roomError: '' }))} className="action-button close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NextPage;
