import { createContext, useState, useContext } from 'react';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
    const [region, setRegion] = useState('IN');

    const toggleRegion = () => {
        setRegion(prev => prev === 'IN' ? 'US' : 'IN'); // Expand logic as needed
    };

    return (
        <RegionContext.Provider value={{ region, setRegion, toggleRegion }}>
            {children}
        </RegionContext.Provider>
    );
};

export const useRegion = () => useContext(RegionContext);
