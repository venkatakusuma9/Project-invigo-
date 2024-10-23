import React, { createContext, useState } from 'react';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
    const [state, setState] = useState({
        dates: [],
        selectedDate: '',
        users: [],
        rooms: [],
        searchQuery: '',
        filteredRooms: [],
        isModalOpen: false,
        facultySearchQuery: '',
        facultySuggestions: [],
        isRoomModalOpen: false,
        newRoom: '',
        roomError: '',
        allocatedRooms: [],
    });

    return (
        <StateContext.Provider value={{ state, setState }}>
            {children}
        </StateContext.Provider>
    );
};