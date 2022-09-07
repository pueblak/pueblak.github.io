const loader = new THREE.TextureLoader()
const binary0 = loader.load('../resources/binary0.png')
const binary1 = loader.load('../resources/binary1.png')
const mouse = new THREE.Vector2()

let intersection = null


class DigitalRain {
    constructor(width, height, trailLength) {
        this.width = Math.floor(width)
        this.height = Math.floor(height)
        this.trailLength = Math.max(trailLength, 1)
        this.mesh = new THREE.Group()
        this.lookup = {}
        this.matrix = []
        for (let x = 0; x <= this.width; x++) {
            this.matrix.push([])
            for (let y = 0; y <= this.height; y++) {
                let isOne = Math.random() < 0.5
                this.matrix[x].push({
                    x: x,
                    y: y,
                    isOne: isOne,
                    brightness: 0,
                    geometry: new THREE.BufferGeometry,
                    material: new THREE.PointsMaterial({
                        color: 0x70ff70,
                        size: 16,
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
                        [-(width / 1.5) + x, (height / 1.5) - y, 0.0]
                    ), 3)
                )
                this.matrix[x][y].mesh = new THREE.Points(this.matrix[x][y].geometry, this.matrix[x][y].material)
                this.mesh.add(this.matrix[x][y].mesh)
                this.lookup[this.matrix[x][y].mesh.uuid] = this.matrix[x][y]
            }
        }
        this.mesh.scale.set(24, 24, 24)
        this.sources = []
    }

    illuminate(x, y, scale=1.0) {
        this.matrix[x][y].brightness = Math.floor(this.trailLength * 2 * scale)
        this.matrix[x][y].material.opacity = 0.33 * scale
    }

    drop_binary(columnIndex=0) {
        if (columnIndex < 0 || columnIndex >= this.width) {
            throw ValueError("Column index out of bounds")
        }
        this.illuminate(columnIndex, 0)
        this.sources.push({x: columnIndex, y: 0})
        return this
    }

    step() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.matrix[x][y].material.color = new THREE.Color(0x70ff70)
                const brightness = this.matrix[x][y].brightness
                if (brightness > 0) {
                    this.matrix[x][y].brightness -= 1
                    this.matrix[x][y].material.opacity = Math.min((brightness - 1) / this.trailLength * 0.25, 0.33)
                }
                if (16 - this.matrix[x][y].material.size > 0.25)
                    this.matrix[x][y].material.size += 0.25
                else
                    this.matrix[x][y].material.size = 16
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
                this.illuminate(x, y)
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

    distort(x, y, targetSize) {
        this.matrix[x][y].material.size = targetSize
    }
}

class DigitalParticles {
    constructor(frequency) {
        this.frequency = frequency
        this.mesh = new THREE.Group()
        this.particles = []
        this.lookup = {}
    }

    addParticle(x, y, z, scale=1.0, distance=10.0) {
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([x, y, z]), 3))
        const material = new THREE.PointsMaterial({
            color: 0x70ff70,
            size: 16 * scale,
            map: Math.random() < 0.5 ? binary0 : binary1,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending
        })

        const particle = {
            initial: new THREE.Vector2(x, y),
            final: new THREE.Vector2(1, 0).rotateAround(new THREE.Vector2(), (Math.random() * 0.75 + 0.125) * Math.PI).multiplyScalar(distance).add(new THREE.Vector2(x, y)),
            alpha: 0.0,
            scale: scale,
            geometry: geometry,
            material: material,
            mesh: new THREE.Points(geometry, material)
        }
        particle.mesh.scale.set(24, 24, 24)
        particle.mesh.position.set(x, y, z)
        this.mesh.add(particle.mesh)
        this.particles.push(particle)
        this.lookup[particle.mesh.uuid] = particle
    }

    addRandomParticleAtMouse() {
        this.addParticle(
            mouse.x * window.innerWidth / 48,
            mouse.y * window.innerHeight / 48,
            0,
            Math.random() * 1.5 + 0.5,
            Math.random() * 64 + 64
        )
    }

    remove(uuid) {
        const particle = this.lookup[uuid]
        this.mesh.remove(particle.mesh)
        this.particles.splice(this.particles.indexOf(particle), 1)
        delete this.lookup[uuid]
    }

    step(elapsed) {
        if (Math.random() < 0.05) {
            this.addRandomParticleAtMouse()
        }
        let erase = []
        for (let particle of this.particles) {
            particle.alpha += this.frequency * elapsed
            if (particle.alpha > 1.0) {
                particle.alpha = 1.0
                erase.push(particle.mesh.uuid)
            }
            particle.mesh.position.lerpVectors(
                new THREE.Vector3(particle.initial.x, particle.initial.y, 0),
                new THREE.Vector3(particle.final.x, particle.final.y, 0),
                particle.alpha
            )
            particle.mesh.material.opacity = 0.5 * (1.0 - particle.alpha)
            //particle.mesh.material.size = 16 * particle.scale * (1.0 - particle.alpha)
        }
        for (let uuid of erase) {
            this.remove(uuid)
        }
    }
}

function digitalRainAnimationStep(rain) {
    rain.drop_binary(randomInteger(rain.width))
    rain.drop_binary(randomInteger(rain.width))
    rain.step()
}

function mouseAnimationStep(raycaster, mouse, camera, scene, rain) {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)
    for (let intersect of intersects) {
        if (intersect.object.uuid in rain.lookup) {
            let binary = rain.lookup[intersect.object.uuid]
            rain.distort(binary.x, binary.y, (intersect.distanceToRay - 2) * 4)
        }
    }
}

function loadCanvas() {
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('#canvas')
    })

    let aspect = window.innerWidth / window.innerHeight
    const viewSize = 1000
    const camera = new THREE.OrthographicCamera(viewSize / -2 * aspect, viewSize / 2 * aspect, viewSize / 2, viewSize / -2, -0.1, 1000)
    const raycaster = new THREE.Raycaster()
    raycaster.params.Points.threshold = 128

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight, false)
    scene.background = new THREE.Color(0x000022)

    let rain = new DigitalRain(128, 64, 10)
    for (let i = 0; i < rain.height; i++)
        digitalRainAnimationStep(rain)
    scene.add(rain.mesh)

    let particles = new DigitalParticles(0.5)
    scene.add(particles.mesh)

    renderer.render(scene, camera)

    const clock = new THREE.Clock()
    const stepLength = 0.025
    let timer = 0
    function animate() {
        const elapsed = clock.getDelta()
        timer += elapsed
        if (timer > stepLength) {
            digitalRainAnimationStep(rain)
            mouseAnimationStep(raycaster, mouse, camera, scene, rain)
            particles.step(elapsed)
            timer = 0
        }
        renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    function onWindowResize() {
        let aspect = window.innerWidth / window.innerHeight
        camera.aspect = aspect
        camera.left = viewSize * aspect / -2
        camera.right = viewSize * aspect / 2
        camera.top = viewSize / 2
        camera.bottom = viewSize / -2
        camera.updateProjectionMatrix()
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight, false)
    }
    window.addEventListener('resize', onWindowResize, false)

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        particles.addRandomParticleAtMouse()
    }
    window.addEventListener('mousemove', onMouseMove, false)

    onWindowResize()
    animate()
}