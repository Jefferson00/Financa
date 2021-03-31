import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import {View} from "react-native"

export default function LoaderBalance() {
    const props: any = {}
    return (
        <View style={{flex:1,paddingLeft:40, maxHeight:80}}>
            <ContentLoader
            speed={1}
            width={"100%"}
            height={80}
            viewBox="0 0 400 80"
            backgroundColor="#d1d1d1"
            foregroundColor="#ecebeb"
            opacity="0.3"
            {...props}
            >


           
            <Rect x="5" y="10" rx="5" ry="5" width="350" height="80" />


            </ContentLoader>
        </View>
    )
}
