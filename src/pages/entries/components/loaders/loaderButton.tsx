import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import {View} from "react-native"

export default function LoaderButton() {
    const props: any = {}
    return (
        <View style={{flex:1,paddingLeft:40, maxHeight:150, alignItems:'center',justifyContent:'center'}}>
            <ContentLoader
            speed={1}
            width={"100%"}
            height={83}
            viewBox="0 0 400 90"
            backgroundColor="#d1d1d1"
            foregroundColor="#ecebeb"
            opacity="0.3"
            {...props}
            >


           
            <Rect x="5" y="10" rx="20" ry="20" width="350" height="83" />


            </ContentLoader>
        </View>
    )
}
