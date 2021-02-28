import React, {createContext, useState, ReactNode} from 'react';

interface MainContextData{
    isBalanceActive: boolean;
    isEarningsActive: boolean;
    isExpansesActive: boolean;
    activeBalanceView: () =>void;
    activeEarningsView: () =>void;
    activeExpansesView: () =>void;
}

interface MainProviderProps{
    children: ReactNode;
}

export const MainContext = createContext({} as MainContextData)

export function MainProvider({children}:MainProviderProps){

    const [isBalanceActive, setIsBalanceActive] = useState(true)
    const [isEarningsActive, setIsEarningsActive] = useState(false)
    const [isExpansesActive, setIsExpansesActive] = useState(false)

    function activeBalanceView(){
        setIsBalanceActive(true)
        setIsEarningsActive(false)
        setIsExpansesActive(false)
    }

    function activeEarningsView(){
        setIsBalanceActive(false)
        setIsEarningsActive(true)
        setIsExpansesActive(false)
    }
    function activeExpansesView(){
        setIsBalanceActive(false)
        setIsEarningsActive(false)
        setIsExpansesActive(true)
    }

    return(
        <MainContext.Provider value={{
            isBalanceActive,
            isEarningsActive,
            isExpansesActive,
            activeBalanceView,
            activeEarningsView,
            activeExpansesView,
        }}>
            {children}
        </MainContext.Provider>
    )
}