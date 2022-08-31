const loader = new THREE.TextureLoader()
const binary0 = loader.load('../resources/binary0.png')
const binary1 = loader.load('../resources/binary1.png')

class DigitalRain {
    constructor(width, height, trailLength, depth=0) {
        this.width = Math.floor(width)
        this.height = Math.floor(height)
        this.trailLength = Math.max(trailLength, 1)
        this.mesh = new THREE.Group()
        this.matrix = []
        for (let x = 0; x <= this.width; x++) {
            this.matrix.push([])
            for (let y = 0; y <= this.height; y++) {
                let isOne = Math.random() < 0.5
                this.matrix[x].push({
                    isOne: isOne,
                    brightness: 0,
                    geometry: new THREE.BufferGeometry,
                    material: new THREE.PointsMaterial({
                        color: 0xa0d4a0,
                        size: 1,
                        map: isOne ? binary1 : binary0,
                        transparent: true,
                        opacity: 0,
                        depthWrite: false,
                        depthTest: false,
                        blending: THREE.AdditiveBlending
                    })
                })
                this.matrix[x][y].geometry.setAttribute('position',
                    new THREE.BufferAttribute(new Float32Array(
                        [-(this.width / 2.0) + x, (this.height / 2.0) - y, 0.0]
                    ), 3)
                )
                this.matrix[x][y].mesh = new THREE.Points(this.matrix[x][y].geometry, this.matrix[x][y].material)
                this.mesh.add(this.matrix[x][y].mesh)
            }
        }
        this.mesh.position.set(-5, 2, -depth)
        this.sources = []
    }

    drop_binary(columnIndex=0) {
        if (columnIndex < 0 || columnIndex >= this.width) {
            throw ValueError("Column index out of bounds")
        }
        this.matrix[columnIndex][0].brightness = this.trailLength * 2
        this.sources.push({x: columnIndex, y: 0})
        return this
    }

    step() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const brightness = this.matrix[x][y].brightness
                if (brightness >= 0.25)
                    this.matrix[x][y].material.color = new THREE.Color(0x70ff70)
                if (brightness > 0) {
                    this.matrix[x][y].brightness -= 1
                    this.matrix[x][y].material.opacity = Math.min((brightness - 1) / this.trailLength * 0.25, 0.33)
                }
            }
        }
        let oldSources = this.sources.slice()
        this.sources = []
        for (let source of oldSources) {
            const x = source.x
            const y = source.y
            if (y < this.height) {
                this.matrix[x][y].isOne = !this.matrix[x][y].isOne
                this.matrix[x][y].material.map = this.matrix[x][y].isOne ? binary1 : binary0
                this.matrix[x][y].material.color = new THREE.Color(0xd4ffd4)
                this.matrix[x][y].brightness = this.trailLength * 2
                this.matrix[x][y].material.opacity = 0.33
                this.sources.push({x: x, y: y + 1})
            }
        }
        for (let i = 0; i < this.width / 2; i++) {
            const x = Math.floor(Math.random() * this.width)
            const y = Math.floor(Math.random() * this.height)
            if (!this.sources.includes({x: x, y: y}) && this.matrix[x][y].material.opacity >= 0.25) {
                this.matrix[x][y].isOne = !this.matrix[x][y].isOne
                this.matrix[x][y].material.map = this.matrix[x][y].isOne ? binary1 : binary0
            }
        }
        return this
    }
}

function digitalRainAnimationStep(rain) {
    rain.drop_binary(randomInteger(rain.width))
    rain.drop_binary(randomInteger(rain.width))
    rain.step()
}

function loadCanvas() {
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('#canvas')
    })

    const canvas = renderer.domElement
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    scene.background = new THREE.Color(0x000022)

    let rain = new DigitalRain(104, 48, 16, 32)
    for (let i = 0; i < rain.height; i++)
        digitalRainAnimationStep(rain)
    scene.add(rain.mesh)

    renderer.render(scene, camera)

    const clock = new THREE.Clock()
    const stepLength = 0.025
    let totalElapsed = 0
    function animate() {
        const elapsed = clock.getDelta()
        totalElapsed += elapsed
        if (totalElapsed > stepLength) {
            totalElapsed = 0
            digitalRainAnimationStep(rain)
        }
        renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    function onWindowResize() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    }
    window.addEventListener('resize', onWindowResize, false)

    onWindowResize()
    animate()
}