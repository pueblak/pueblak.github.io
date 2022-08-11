import * as THREE from '../node_modules/three/build/three.module.js';

function load_home() {
    console.log("starting")
    var fontSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 8.0)
    document.getElementById("body").style.fontSize = fontSize.toString() + "px"
    
    const loader = new THREE.TextureLoader()
    const binary0 = loader.load('../resources/binary0.png')
    const binary1 = loader.load('../resources/binary1.png')
    
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('#canvas')
    })

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.position.setX(75)
    camera.position.setZ(30)
    scene.background = new THREE.Color(0x000022)

    const ambientLight = new THREE.AmbientLight(0xd4ffd4, 1);
    scene.add(ambientLight);

    renderer.render(scene, camera)

    const groupA = new THREE.Group()
    const groupB = new THREE.Group()
    const groupFastA = new THREE.Group()
    const groupFastB = new THREE.Group()
    scene.add(groupA, groupB, groupFastA, groupFastB)

    const torusPointsA = []
    const torusPointsB = []
    for (let r = 1; r < 8; r++) {
        var n_vertices = r < 6 ? 50 * (r + 1) : 80 * Math.abs(r - 8)
        const geometryA = new THREE.TorusGeometry(40, r, 16, n_vertices)
        const verticesA = geometryA.attributes.position.array
        for (let i = 0; i < verticesA.length; i++)
            torusPointsA.push(verticesA[i])
        const geometryB = new THREE.TorusGeometry(160, r, 16, n_vertices * 8)
        const verticesB = geometryB.attributes.position.array
        for (let i = 0; i < verticesB.length; i++)
            torusPointsB.push(verticesB[i])
    }

    function randomVertexSample(vertices, k) {
        const indices = []
        const sample = new Float32Array(k * 3)
        while (indices.length < k) {
            const index = Math.floor(Math.random() * vertices.length / 3) * 3
            if (!indices.includes(index)) {
                sample[indices.length * 3] = vertices[index]
                sample[indices.length * 3 + 1] = vertices[index + 1]
                sample[indices.length * 3 + 2] = vertices[index + 2]
                indices.push(index)
            }
        }
        return sample
    }

    for (let h = 0; h < 2; h++) {
        const group = h == 0 ? groupA : groupB
        const groupFast = h == 0 ? groupFastA : groupFastB
        const torusPoints = h == 0 ? torusPointsA : torusPointsB
        const binaryCount = h == 0 ? 512 : 1600
        const sphereCount = h == 0 ? 32 : 100
        const binarySample = randomVertexSample(torusPoints, binaryCount * 4 + sphereCount)
        for (let i = 0; i < 5; i++) {
            const binaryGeometry = new THREE.BufferGeometry

            const binaryPosArray = new Float32Array(binaryCount * 3)

            for (let j = 0; j < (i < 4 ? binaryCount : sphereCount); j++) {
                const x = (binaryCount * i + j) * 3;
                const y = x + 1
                const z = x + 2
                binaryPosArray[j * 3] = binarySample[x]
                binaryPosArray[j * 3 + 1] = binarySample[y]
                binaryPosArray[j * 3 + 2] = binarySample[z]
            }

            if (i < 4) {
                binaryGeometry.setAttribute('position', new THREE.BufferAttribute(binaryPosArray, 3))
                const binaryMaterial = new THREE.PointsMaterial({
                    color: 0x70ff70,
                    size: 0.4,
                    map: i < 2 ? binary0 : binary1,
                    transparent: true,
                    opacity: i % 2 == 0 ? 0.8 : 0.4
                })
                const binaryMesh = new THREE.Points(binaryGeometry, binaryMaterial)
                group.add(binaryMesh)
            } else {
                for (let j = 0; j < sphereCount; j++) {
                    const geometry = new THREE.SphereGeometry(0.15, 10, 10)
                    geometry.translate(
                        binaryPosArray[j * 3],
                        binaryPosArray[j * 3 + 1],
                        binaryPosArray[j * 3 + 2]
                    )
                    const material = new THREE.MeshPhongMaterial({
                        color: 0x70d4ff,
                        specular: 0x040404,
                        shininess: 100
                    });
                    const mesh = new THREE.Mesh(geometry, material)
                    groupFast.add(mesh)
                }
            }
        }
    }

    for (let group of [groupA, groupB, groupFastA, groupFastB]) {
        group.rotation.x += 360
        group.position.x += 100
        group.position.y += 3
    }
    for (let group of [groupB, groupFastB]) {
        group.position.x = 50
        group.position.y = -30
        group.position.z = 120
        group.rotation.y -= 0.08
    }

    const clock = new THREE.Clock()
    function animate() {
        const elapsed = clock.getDelta()
        groupA.rotation.z += 0.25 * elapsed
        groupB.rotation.z += 0.05 * elapsed
        groupFastA.rotation.z += 1.6 * elapsed
        groupFastB.rotation.z += 0.4 * elapsed
        renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    function onWindowResize() {
        var fontSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 8.0)
        document.getElementById("body").style.fontSize = fontSize.toString() + "px"
        document.getElementById("title").style.width = '100vw'
        document.getElementById("title").style.textAlign = 'center'
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false)
    window.onmousemove = function(e) {
        var moveDist = Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY)
        groupA.rotation.z += 0.0001 * moveDist
        groupB.rotation.z += 0.000025 * moveDist
    }

    animate()
    console.log("done")
}

export { load_home }
