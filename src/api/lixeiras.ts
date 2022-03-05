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
    const response = await fetch('http://api.ifprinteligente.com.br/sisdle/rest.php/trash')
    const json = await response.json()
    return json.map((lixeira : APILixeira) => {
        const newLixeira : Lixeira = {
            id : lixeira.id,
            location : lixeira.local,
            description : lixeira.descricao,
            capacity : parseFloat(lixeira.profundidade),
            coordinates : [parseFloat(lixeira.longitude), parseFloat(lixeira.latitude)],
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