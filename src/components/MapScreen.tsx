import React, { useEffect, useRef, useState } from 'react'
import {
    View,
    Text,
    PermissionsAndroid
} from 'react-native'
import Map from 'src/components/Map'
import { loadLixeiras, Status } from 'src/reducers/lixeirasSlice'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/reducers'
import Splash from './Splash'
import IconGenerator, { IconColection } from './IconGenerator'
import ControllLayer from 'src/components/ControllLayer'
import LixeiraDrawer from 'src/components/LixeiraDrawer'
import { requestLocationPermission } from 'src/reducers/locationPermissionSlice'

const MapScreen : React.FC = () => {

    const dispatch = useDispatch()

    const lixeiraStatus = useSelector((state : RootState) => state.lixeiras.status)
    const permissionStatus = useSelector((state : RootState) => state.locationPermission.status)
    const permission = useSelector((state : RootState) => state.locationPermission.data)
    const error = useSelector((state : RootState) => state.lixeiras.error)
    const lixeiras = useSelector((state : RootState) => state.lixeiras.data)
    const sorted = useSelector((state : RootState) => state.lixeiras.sorted)
    
    const [renderedMap, setRenderedMap] = useState(false)
    const [icons, setIcons] = useState<IconColection>({})
    const [followUserLocation, setFollowUserLocation] = useState(true)

    const camera = useRef<MapboxGL.Camera>(null)

    useEffect(() => {
        if (permissionStatus === Status.Idle) {
            dispatch(requestLocationPermission())
        }
        if (lixeiraStatus === Status.Idle) {
            dispatch(loadLixeiras())
        }
    }, [])

    useEffect(() => {
        if (sorted.length != 0) {
            camera.current?.flyTo(sorted[0].coordinates, 1000)
        }
    }, [sorted])

    function onSort() {
        setFollowUserLocation(false)
    }

    function onIconGeneratorFinish(icons : IconColection) {
        setIcons(icons)
    }

    return (
        <View style={{flex : 1}}>
            {(Object.values(icons).length != (new Set(lixeiras.map(lixeira => lixeira.capacity))).size) &&
                <IconGenerator onFinish={onIconGeneratorFinish}/>
            }
            {(lixeiraStatus === Status.Pending || Object.values(icons).length != (new Set(lixeiras.map(lixeira => lixeira.capacity))).size) &&
                <Splash/>
            }
            {(lixeiraStatus === Status.Fulfilled && (permissionStatus == Status.Fulfilled || renderedMap) && Object.values(icons).length == (new Set(lixeiras.map(lixeira => lixeira.capacity))).size) && 
                <>
                {!renderedMap && setRenderedMap(true)}
                <Map
                    icons={icons}
                    cameraRef={camera}
                    onTouchStart={() => setFollowUserLocation(false)}
                    followUserLocation={followUserLocation}/>
                <ControllLayer onCenterOnUserPress={() => setFollowUserLocation(true)} onSort={onSort}/>
                {sorted.length != 0 &&
                    <View style={{position : 'absolute', width : '100%', height : '100%'}}>
                        <LixeiraDrawer/>
                    </View>
                }
                </>
            }
            {lixeiraStatus === Status.Rejected &&
                <Text style={{flex : 1, textAlign : 'center', textAlignVertical : 'center'}}>{error}</Text>
            }
        </View>
    )
}
export default MapScreen