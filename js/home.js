import * as THREE from './three.js'

function randomVertexSample(vertices, k) {
    if (k * 3 >= vertices.length)
        return vertices
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

class BinaryStreamTorus {
    groupSlow = new THREE.Group()
    groupFast = new THREE.Group()
    group = new THREE.Group()

    totalElapsed = 0
    cameraLookTarget = cameraLookTargetA.clone()

    constructor(radius, innerLayers=6, outerLayers=2, density=0.6,
                position=new THREE.Vector3(0, 0, 0), rotation=new THREE.Euler(0, 0, 0)) {
        const totalLayers = innerLayers + outerLayers
        const slowBinaryCount = Math.round(radius * innerLayers * 2.0 * density)
        const fastBinaryCount = Math.round(radius * 2.0 * density)

        const torusPoints = []
        var innerCount = 0
        for (let r = 1; r < totalLayers; r++) {
            var n_vertices = r < innerLayers ? 100 * density * (r + 1) : 150 * density * Math.abs(r - totalLayers)
            const geometry = new THREE.TorusGeometry(radius, r, 16, n_vertices)
            const vertices = geometry.attributes.position.array
            for (let i = 0; i < vertices.length; i++)
                torusPoints.push(vertices[i])
            if (r < innerLayers)
                innerCount += vertices.length
        }

        const slowBinarySample = randomVertexSample(torusPoints, slowBinaryCount * 4)
        const fastBinarySample = randomVertexSample(torusPoints.slice(0, innerCount), fastBinaryCount * 2)
        for (let i = 0; i < 6; i++) {
            const binaryGeometry = new THREE.BufferGeometry
            const binaryPosArray = new Float32Array((i < 4 ? slowBinaryCount : fastBinaryCount) * 3)

            for (let j = 0; j < (i < 4 ? slowBinaryCount : fastBinaryCount); j++) {
                const x = ((i < 4 ? slowBinaryCount * i : fastBinaryCount * (i - 4)) + j) * 3
                const y = x + 1
                const z = x + 2
                var sample = i < 4 ? slowBinarySample : fastBinarySample
                binaryPosArray[j * 3] = sample[x]
                binaryPosArray[j * 3 + 1] = sample[y]
                binaryPosArray[j * 3 + 2] = sample[z]
            }

            binaryGeometry.setAttribute('position', new THREE.BufferAttribute(binaryPosArray, 3))
            const binaryMaterial = new THREE.PointsMaterial({
                color: i < 4 ? 0x70ff70 : 0x70d4ff,
                size: 0.5,
                map: i % 2 == 0 ? binary1 : binary0,
                transparent: true,
                opacity: i < 2 ? 0.45 : 0.9,
                depthWrite: false,
                depthTest: false,
                blending: THREE.AdditiveBlending
            })

            const binaryMesh = new THREE.Points(binaryGeometry, binaryMaterial)
            if (i < 4)
                group.add(binaryMesh)
            else
                groupFast.add(binaryMesh)
        }

        this.group.add(groupSlow, groupFast)
        this.group.rotation = rotation.clone()
        this.group.position = position.clone()
    }

    animationStepBinaryStream(elapsed, speed=0.3) {
        groupFast.rotation.z += speed * elapsed
        groupSlow.rotation.z += speed / 5.0 * elapsed
    }

    animationStepCameraMovement(elapsed, cameraTarget, completed=false) {
        if (!completed && this.totalElapsed < 12) {
            camera.position.lerp(cameraTarget, 0.01)
            camera.lookAt(this.ameraLookTarget.lerp(cameraLookTargetB, 0.01))
            this.totalElapsed += elapsed
        } else if (completed) {
            camera.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z)
            camera.lookAt(cameraLookTargetB)
        }
    }
}

export default BinaryStreamTorus



let fields = [
    ('message', function(x){ return x != "" }, "Say something! I would love to hear from you!"),
    ('email', function(x){ return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(x)}, "Are you sure you entered this correctly?"),
    ('name', function(x){ return x != "" }, "How would you like me to address you?")
]

for (let field of fields) {
    id, validate, errorMessage = field
    if (validate(id)) {
        if (document.getElementById(id).classList.contains("input-valid")) {
            document.getElementById(id).classList.remove("input-valid")
            document.getElementById(id).classList.add("input-error")
        }
        document.getElementById(id + '-error').innerHTML = errorMessage
        document.getElementById(id).focus()
        valid = false
    } else {
        if (document.getElementById(id).classList.contains("input-error")) {
            document.getElementById(id).classList.remove("input-error")
            document.getElementById(id).classList.add("input-valid")
        }
        document.getElementById(id + '-error').innerHTML = ""
    }
}