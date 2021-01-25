
import React from 'react';

import {useFonts} from 'expo-font'
import{Poppins_400Regular,Poppins_500Medium, Poppins_600SemiBold,Poppins_700Bold} from'@expo-google-fonts/poppins'
import SelectedMonthAndYearProvider from "./src/contexts/selectMonthAndYear"
import StylesStatesProvider from "./src/contexts/stylesStates"
import ResultsDBStatesProvider from "./src/contexts/resultsDBStates"

import Routes from './src/routes'

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  if(!fontsLoaded){
    return null
  }

  return (
    <ResultsDBStatesProvider>
        <StylesStatesProvider>
          <SelectedMonthAndYearProvider>
            <Routes/>
          </SelectedMonthAndYearProvider>
      </StylesStatesProvider>
    </ResultsDBStatesProvider>
  );
}


