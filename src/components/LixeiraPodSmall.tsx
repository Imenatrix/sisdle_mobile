import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import { Lixeira } from 'src/reducers/lixeirasSlice'
import Capacitometer from 'src/components/Capacitometer'

interface Props {
    lixeira : Lixeira
}

const LixeiraPodSmall : React.FC<Props> = (props) => {

    const lixeira = props.lixeira

    return (
        <View style={styles.container}>
            <Capacitometer lixeira={lixeira} style={styles.capacitometer} styleTxt={styles.txtCapacitometer}/>
            <View style={styles.content}>
                <View style={{flex : 1}}>
                    <Text style={styles.txtLocation}>{lixeira.location}</Text>
                    <Text style={styles.txtDescription}>{lixeira.description}</Text>
                </View>
            </View>
        </View>
    )
}

export default LixeiraPodSmall

const styles = StyleSheet.create({
    container : {
        flex : 1,
        height : 70,
        backgroundColor : 'white',
        borderRadius : 20,
        overflow : 'hidden'
    },
    capacitometer : {
        flex : 1,
        flexDirection : 'row'
    },
    txtCapacitometer : {
        position : 'absolute',
        bottom : 0,
        width : '100%',
        textAlign : 'center',
        fontSize : 12
    },
    content : {
        position : 'absolute',
        width : '100%',
        height : 55,
        backgroundColor : 'white',
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
        elevation : 20,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        paddingHorizontal : 10
    },
    txtLocation : {
        flex : 2,
        textAlign : 'center',
        textAlignVertical : 'center',
        fontSize : 17
    },
    txtDescription : {
        color : 'gray',
        fontSize : 10,
        position : 'absolute',
        width : '100%',
        bottom : 0,
        height : 20,
        textAlign : 'center',
        textAlignVertical : 'center',
    }
})