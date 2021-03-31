import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import {View} from "react-native"

export default function Loader() {
    const props: any = {}
    return (
        <View style={{alignItems:"center", flex:1, justifyContent:'center',paddingLeft:40}}>
            <ContentLoader
            speed={1}
            width={"100%"}
            height={"100%"}
            viewBox="0 0 400 300"
            backgroundColor="#d1d1d1"
            foregroundColor="#ecebeb"
            opacity="0.5"
            {...props}
            >


           
            <Rect x="5" y="10" rx="5" ry="5" width="350" height="80" />
           
            <Rect x="5" y="110" rx="5" ry="5" width="350" height="80" />
            
            <Rect x="5" y="210" rx="5" ry="5" width="350" height="80" />


            </ContentLoader>
        </View>
    )
}
