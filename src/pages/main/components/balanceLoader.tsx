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
            height={50}
            viewBox="0 0 400 50"
            backgroundColor="#d1d1d1"
            foregroundColor="#ecebeb"
         
            {...props}
            >
           
            <Rect x="0" y="0" rx="0" ry="0" width="100%" height="50" />


            </ContentLoader>
            </View>
      
    )
}