import React from "react"
import ContentLoader, { Rect} from "react-content-loader/native"
import {View} from "react-native"

export default function LatestTransactionsLoader() {
    const props: any = {}
    return (
            <View style={{alignItems:'center', marginHorizontal:26, borderRadius:20, flex:1}}>
            <ContentLoader
            speed={1}
            width={'100%'}
            height={161}
            viewBox="0 0 400 150"
            backgroundColor="rgba(60, 147, 249, 0.5)"
            foregroundColor="rgba(225, 225, 225, 0.5)"
            style={{borderRadius:20}}
            opacity='0.5'
            {...props}
            >
           
            <Rect x="0" y="0" rx="20" ry="20" width="100%" height="161" />


            </ContentLoader>
            </View>
      
    )
}