import React, { createContext, useState, useContext } from 'react'

const authContext = createContext({});

export default function AuthContextProvider({children}:any){

    const [user, setUser] = useState([])
    const [isLogged, setIsLogged] = useState(false)

    return(
        <authContext.Provider
            value={{
                user, setUser,
                isLogged, setIsLogged
            }}
        >
            {children}
        </authContext.Provider>
    )
}

export function useUserDB(){
    const context = useContext(authContext);
    const{
        user, setUser,
        isLogged, setIsLogged
    }:any = context
    return {
        user, setUser,
        isLogged, setIsLogged
    }
}