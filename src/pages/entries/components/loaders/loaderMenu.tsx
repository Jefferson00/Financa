import React, { useContext } from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import {View} from "react-native"
import { StylesContext } from "../../../../contexts/stylesContext"

export default function LoaderMenu() {
    const {colorScheme, isDarkTheme} = useContext(StylesContext)
    let backgroundColor = "#ffffff"

    if (colorScheme == 'dark' || isDarkTheme){
        backgroundColor = '#181818'
    }
    const props: any = {}
    return (
        <View style={{
            height:80,
            paddingHorizontal:30,
            alignItems:'center',
            justifyContent:'center',
            borderTopRightRadius: 40,
            borderTopLeftRadius:40,
            elevation:20,
            shadowColor: '#CAD3DD',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 4.65,
            backgroundColor:backgroundColor,
            flexDirection: 'row',
            }}>
            <ContentLoader
            speed={1}
            width={"100%"}
            height={83}
            viewBox="0 0 400 50"
            backgroundColor="#d1d1d1"
            foregroundColor="#ecebeb"
            opacity="0.3"
            {...props}
            >


           
            <Rect x="20" y="0" rx="20" ry="20" width="50" height="50" />
            <Rect x="120" y="0" rx="20" ry="20" width="50" height="50" />
            <Rect x="220" y="0" rx="20" ry="20" width="50" height="50" />
            <Rect x="320" y="0" rx="20" ry="20" width="50" height="50" />


            </ContentLoader>
        </View>
    )
}
