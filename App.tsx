
import React, { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Permissions from "expo-permissions";
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import {useFonts} from 'expo-font'
import{Poppins_400Regular,Poppins_500Medium, Poppins_600SemiBold,Poppins_700Bold} from'@expo-google-fonts/poppins'

import Routes from './src/routes'
import { MainProvider } from './src/contexts/mainContext';
import { DataBDProvider } from './src/contexts/dataBDContext';
import { NewEntriesProvider } from './src/contexts/newEntriesContext';
import { StylesProvider } from './src/contexts/stylesContext';
import { SecurityProvider } from './src/contexts/securityContext';



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
      <SecurityProvider>
        <DataBDProvider>
          <NewEntriesProvider>
            <StylesProvider>
            <Routes/>
            </StylesProvider>
          </NewEntriesProvider>
        </DataBDProvider>
        </SecurityProvider>
    </MainProvider>
  );
}


