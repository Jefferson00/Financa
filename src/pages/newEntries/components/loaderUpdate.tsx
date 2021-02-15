import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import {View} from "react-native"

export default function LoaderUpdate() {
    const props: any = {}
    return (
        <View style={{alignItems:"center", flex:1, justifyContent:'center',paddingLeft:40}}>
            <ContentLoader
            speed={1}
            width={"100%"}
            height={"100%"}
            viewBox="0 0 400 550"
            backgroundColor="#d1d1d1"
            foregroundColor="#ecebeb"
            {...props}
            >


            <Rect x="0" y="0" rx="3" ry="3" width="62" height="15" /> 
            <Rect x="0" y="30" rx="3" ry="3" width="360" height="30" /> 

            <Rect x="0" y="105" rx="3" ry="3" width="360" height="30" /> 
            <Rect x="0" y="75" rx="3" ry="3" width="62" height="15" /> 
             
            <Rect x="0" y="150" rx="3" ry="3" width="62" height="15" /> 
            <Rect x="0" y="185" rx="3" ry="3" width="360" height="150" /> 

            <Rect x="0" y="350" rx="3" ry="3" width="360" height="80" /> 
            
      


            </ContentLoader>
        </View>
    )
}
