import * as THREE from './three.module.js';
import {GLTFLoader} from './GLTFLoader.js';

const _VS = `
    varying vec3 v_Normal;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        v_Normal = normalize(normalMatrix * normal);
    }
`
const _FS = `
    varying vec3 v_Normal;
    void main() {
        gl_FragColor = vec4(v_Normal, 1.0);
    }
`

export function loadCanvas() {
    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 100000)
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = THREE.sRGBEncoding
    document.body.appendChild(renderer.domElement)

    const gridTexture = new THREE.TextureLoader().load('textures/glitch-grid.png')
    gridTexture.wrapS = THREE.RepeatWrapping
    gridTexture.wrapT = THREE.RepeatWrapping
    gridTexture.repeat.set(1, 1)
    gridTexture.premultiplyAlpha = true

    let buildingMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: {value: 1.0},
            resolution: {value: new THREE.Vector2()}
        },
        vertexShader: _VS,
        fragmentShader: _FS
    })
    let shinyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x080808,
        metalness: 0.8,
        roughness: 0.2,
        reflectivity: 0.6,
        side: THREE.DoubleSide,
        depthWrite: true,
        depthTest: true
    })
    let waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x081020,
        metalness: 0.5,
        roughness: 0.1,
        reflectivity: 1.0,
        side: THREE.DoubleSide,
        depthWrite: true,
        depthTest: true
    })

    function loadCityModel() {
        scene.add(city)
        console.log(city.children)
        for (let child of city.children) {
            if (child.type == 'Group' && child.name.includes('building')) {
                for (let building of child.children) {
                    building.material = buildingMaterial
                }
            } else if (child.type == 'Mesh') {
                if (child.name.includes('water')) {
                    child.material = waterMaterial
                } else {
                    child.material = shinyMaterial
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate)
        city.rotation.y += 0.0025
        renderer.render(scene, camera)
    }

    function initializeScene() {
        scene.background = new THREE.Color(0x000022)
        var light = new THREE.HemisphereLight(0x8080a0, 0x000022, 0.6)
        scene.add(light)
        var fog = new THREE.Fog(0x000022, 0, 2048)
        scene.fog = fog
        camera.position.set(0, 128, 256)
    }

    var loader = new GLTFLoader()
    var city;
    loader.load(
        '../models/burjkhalifa.glb',
        function(gltf) {
            city = gltf.scene
            initializeScene()
            loadCityModel()
            animate()
        },
        function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded')
        },
        function(error) {
            console.log('Error loading model: ' + error)
        }
    )
}