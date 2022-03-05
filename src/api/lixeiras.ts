import { Lixeira } from 'src/reducers/lixeirasSlice'

export interface APILixeira {
    geometry: {
        coordinates: Array<number>,
        type: "Point"
    },
    properties: {
        admin: string,
        location: string,
        description: string,
        capacity: number,
        distanceCover: number,
        distanceBottom: number
    },
    type: "Feature",
    id: string
}

export async function getLixeiras() : Promise<Array<Lixeira>> {
    const response = await fetch('http://10.0.2.2:3000/lixeira') // TODO: Change this once the server has an actual domain
    const json = await response.json()
    return json.features.map((lixeira : APILixeira) => {
        const newLixeira : Lixeira = {
            id : lixeira.id,
            location : lixeira.properties.location,
            description : lixeira.properties.description,
            capacity : lixeira.properties.capacity,
            coordinates : lixeira.geometry.coordinates,
            selected : false
        }
        return newLixeira
    })
}

export function toGeoJSON(lixeiras : Array<Lixeira>) : GeoJSON.FeatureCollection {
    const out : GeoJSON.FeatureCollection = {
        type : 'FeatureCollection',
        features : []
    }
    lixeiras.forEach(lixeira => {
        const coiso : GeoJSON.Feature = {
            type : 'Feature',
            geometry : {
                type : 'Point',
                coordinates : lixeira.coordinates
            },
            properties : {
                id : lixeira.id,
                location : lixeira.location,
                description : lixeira.description,
                capacity : lixeira.capacity.toString(),
                selected : lixeira.selected
            }
        }
        out.features.push(coiso)
    })
    return out
}