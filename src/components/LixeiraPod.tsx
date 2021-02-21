import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import { Lixeira } from 'src/reducers/lixeirasSlice'
import { loadRoute, Status } from 'src/reducers/routeSlice'
import Draggable from 'react-native-draggable'
import Capacitometer from 'src/components/Capacitometer'

interface Props {
    lixeira : Lixeira
}

const LixeiraPod : React.FC<Props> = (props) => {

    const dispatch = useDispatch()

    const routeStatus = useSelector((state : RootState) => state.route.status)
    const userLocation = useSelector((state : RootState) => state.userPosition)
    const [status, setStatus] = useState(Status.Idle)
    const lixeira = props.lixeira

    useEffect(() => {
        if (routeStatus != Status.Pending) {
            setStatus(Status.Idle)
        }
    }, [routeStatus])

    function onBtnRoutePress() {
        if (routeStatus != Status.Pending) {
            console.log('press')
            dispatch(loadRoute({
                start : userLocation,
                finish : lixeira.coordinates,
            }))
            setStatus(Status.Pending)
        }
    }

    return (
        <View style={{position : 'absolute', width : '100%', height : '100%'}}>
            <Draggable minX={0} maxX={0} maxY={Dimensions.get('screen').height / 2}>
                <View style={styles.container}>
                    <Capacitometer lixeira={lixeira} style={styles.capacitometer} styleTxt={styles.txtCapacitometer}/>
                    <View style={styles.content}>
                        <View style={styles.contentBody}>
                            <Pressable onPress={onBtnRoutePress} style={styles.btnRoute}>
                                {status === Status.Idle &&
                                    <Icon style={styles.iconRoute} name='directions'/>
                                }
                                {status === Status.Pending &&
                                    <ActivityIndicator color='white'/>
                                }
                            </Pressable>
                            <View style={{flex : 1}}>
                                <Text style={styles.txtLocation}>{lixeira.location}</Text>
                            </View>
                            <Pressable style={styles.btnOpenDrawer}>
                                <Icon style={styles.iconOpenDrawer} name='keyboard-arrow-down'/>
                            </Pressable>
                        </View>
                        <View style={styles.contentFooter}>
                            <Text style={styles.txtDescription}>{lixeira.description}</Text>
                        </View>
                    </View>
                </View>
            </Draggable>
        </View>
    )
}

export default LixeiraPod

const styles = StyleSheet.create({
    container : {
        width : Dimensions.get('screen').width,
        height : 85,
        backgroundColor : 'white',
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
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
        height : 70,
        backgroundColor : 'white',
        borderBottomLeftRadius : 20,
        borderBottomRightRadius : 20,
        elevation : 20
    },
    contentBody : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    txtLocation : {
        flex : 2,
        textAlign : 'center',
        textAlignVertical : 'center',
        fontSize : 17,
        marginTop : 0
    },
    btnRoute : {
        width : 50,
        height : 50,
        backgroundColor : '#2196F3',
        borderRadius : 25,
        justifyContent : 'center',
        alignItems : 'center',
        marginLeft : 10,
        marginTop : 10
    },
    iconRoute : {
        fontSize : 30,
        color : 'white'
    },
    contentFooter : {
        position : 'absolute',
        width : '100%',
        bottom : 0,
        height : 20,
        justifyContent : 'center',
        alignItems : 'center',
    },
    txtDescription : {
        color : 'gray',
        fontSize : 10
    },
    btnOpenDrawer : {
        width : 50,
        height : 50,
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 10,
        marginTop : 10
    },
    iconOpenDrawer : {
        fontSize : 30
    }
})