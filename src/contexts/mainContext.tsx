import {createContext, useState, ReactNode} from 'react';

interface MainContextData{

}

interface MainProviderProps{
    children: ReactNode;
}

const MainContext = createContext({} as MainContextData)

export function MainProvider({children}:MainProviderProps){
    return(
        <MainContext.Provider value={{
            
        }}>
            {children}
        </MainContext.Provider>
    )
}