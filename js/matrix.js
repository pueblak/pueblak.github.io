const loader = new THREE.TextureLoader()
const binary0 = loader.load('../resources/binary0.png')
const binary1 = loader.load('../resources/binary1.png')

let intersection = null


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
            let distortion = (intersect.distanceToRay - 2) * rain.digitSize / 4
            rain.distort(binary.x, binary.y, distortion)
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
    const camera = new THREE.OrthographicCamera(viewSize / -2 * aspect, viewSize / 2 * aspect, viewSize / 2, viewSize / -2, -0.1, viewSize)
    const raycaster = new THREE.Raycaster()
    raycaster.params.Points.threshold = 128

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight, false)
    scene.background = new THREE.Color(0x000022)

    let digitSize = Math.min(window.innerWidth, window.innerHeight) / 40
    let rain = new DigitalRain(128, 64, 10, digitSize)
    for (let i = 0; i < rain.height; i++)
        digitalRainAnimationStep(rain)
    scene.add(rain.mesh)

    let particles = new DigitalParticles(0.5, digitSize)
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
        camera.left = viewSize * aspect / -2
        camera.right = viewSize * aspect / 2
        camera.top = viewSize / 2
        camera.bottom = viewSize / -2
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight, false)
        renderer.setPixelRatio(window.devicePixelRatio)
        rain.resize(aspect)
    }
    window.addEventListener('resize', onWindowResize, false)

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        if (Math.random() < 0.4)
            particles.addRandomParticleAtMouse()
    }
    window.addEventListener('mousemove', onMouseMove, false)

    onWindowResize()
    animate()
}