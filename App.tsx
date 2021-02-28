
import React from 'react';

import {useFonts} from 'expo-font'
import{Poppins_400Regular,Poppins_500Medium, Poppins_600SemiBold,Poppins_700Bold} from'@expo-google-fonts/poppins'

import Routes from './src/routes'
import { MainProvider } from './src/contexts/mainContext';
import { DataBDProvider } from './src/contexts/dataBDContext';

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
    <MainProvider>
        <DataBDProvider>
            <Routes/>
        </DataBDProvider>
    </MainProvider>
  );
}


