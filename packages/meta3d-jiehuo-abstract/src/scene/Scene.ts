import { Scene } from "three"
import type { Object3D } from "three"
import { getSceneState, setSceneState } from "../state/State"
import { scene, state } from "../type/StateType"
import { nullable } from "../utils/nullable"
import { forEach, getExn, getWithDefault, map, return_ } from "../utils/NullableUtils"
// import * as ParkScene from "./scene_park/ParkScene"
// import * as Warehouse1Scene from "./scene_warehouse/WarehouseScene"
import { createState as createCameraState, init as initCamera, update as updateCamera } from "./Camera"

export let createState = (): scene => {
    return {
        scene: createScene(),
        currentScene: null,
        camera: createCameraState(),
    }
}

let _getName = () => "Scene"

export let createScene = () => {
    let scene = new Scene()

    scene.name = _getName()
    scene.matrixWorldAutoUpdate = true

    return scene
}

export let isScene = (object: Object3D) => {
    return object.name === _getName()
}

export let getScene = (state: state) => {
    return getSceneState(state).scene
}

let _getCurrentScene = (state: state) => {
    return getSceneState(state).currentScene
}

export let getCurrentScene = (state: state) => {
    return getExn(_getCurrentScene(state))
}

export let setCurrentScene = (state: state, allScenes, currentScene: Object3D) => {
    allScenes.forEach(scene => {
        scene.visible = false
    })

    currentScene.visible = true

    return setSceneState(state, {
        ...getSceneState(state),
        currentScene: return_(currentScene)
    })
}

export let findObjectByName = <T extends Object3D>(scene: Object3D, name): nullable<T> => {
    return scene.getObjectByName(name) as nullable<T>
}

export let findObjects = (scene: Object3D, isMatchFunc) => {
    let result = []

    scene.traverse(object => {
        if (isMatchFunc(object)) {
            result.push(object)
        }
    })

    return result
}

// let _initAllScenes = (state: state) => {
//     return ParkScene.init(state).then(state => {
//         return Warehouse1Scene.init(state)
//     })
// }

// let _disposeCurrentScene = (state: state, currentScene: scene) => {
//     switch (currentScene) {
//         case scene.Park:
//             return ParkScene.dispose(state)
//         case scene.Warehouse:
//             return Warehouse1Scene.dispose(state)
//         default:
//             throw new Error("error")
//     }
// }

// export let init = (state: state, [getAbstractStateFunc, setAbstractStateFunc], currentCamera) => {
//     return initCamera(state, [getAbstractStateFunc, setAbstractStateFunc], currentCamera)
// }
export let init = (state: state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc]) => {
    return initCamera(state, [getAbstractStateFunc, setAbstractStateFunc, readSpecificStateFunc, writeSpecificStateFunc])
}

// let _updateCurrentScene = (state: state) => {
//     switch (getCurrentScene(state).name) {
//         case ParkScene.getName():
//             return ParkScene.update(state)
//         case Warehouse1Scene.getName():
//             return Warehouse1Scene.update(state)
//         default:
//             throw new Error("error")
//     }
// }

export let update = <specificState>(specificState: specificState, [updateCurrentSceneFunc, getAbstractStateFunc, setAbstractStateFunc]) => {
    return updateCamera(getAbstractStateFunc(specificState)).then(state => {
        return updateCurrentSceneFunc(setAbstractStateFunc(specificState, state), getCurrentScene(state).name)
    })
    // .then(specificState => {
    //     getCurrentScene(getAbstractStateFunc(specificState)).updateMatrixWorld(false)

    //     return specificState
    // })
}

// export let switchScene = (state: state, currentScene: scene, targetScene: scene, sceneNumber: number) => {
//     return _disposeCurrentScene(state, currentScene).then(state => {
//         switch (targetScene) {
//             case scene.Park:
//                 return ParkScene.enterScene(state, sceneNumber)
//             case scene.Warehouse:
//                 return Warehouse1Scene.enterScene(state, sceneNumber)
//             default:
//                 throw new Error("error")
//         }
//     })
// }