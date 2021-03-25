import React from "react"
import ContentLoader, { Rect} from "react-content-loader/native"
import {View} from "react-native"

export default function BalanceLoader() {
    const props: any = {}
    return (
            <View style={{alignItems:'center', marginHorizontal:50}}>
            <ContentLoader
            speed={1}
            width={'100%'}
            height={300}
            viewBox="0 0 400 300"
            backgroundColor="#ffffff"
            foregroundColor="rgba(156, 156, 156, 0.5)"
            opacity="0.5"
            {...props}
            >
           
            <Rect x="0" y="0" rx="0" ry="0" width="100%" height="50" />
            <Rect x="0" y="150" rx="0" ry="0" width="100%" height="50" />
            <Rect x="0" y="250" rx="0" ry="0" width="100%" height="50" />


            </ContentLoader>
            </View>
      
    )
}