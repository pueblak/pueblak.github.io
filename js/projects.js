function toggleDropDown(projectID) {
    var element = document.getElementById(projectID)
    var open = element.getElementsByClassName("open-drop-down")[0]
    var close = element.getElementsByClassName("close-text")[0]
    open.style.display = (open.style.display == "none") ? "flex" : "none"
    close.style.rotate = (close.style.rotate == "180deg") ? "0deg" : "180deg"
}

function addProject(project) {
    var projects = document.getElementById("projects")

    var container = document.createElement("div")
    container.className = "project-container"
    container.id = project.id
    projects.appendChild(container)

    var card = document.createElement("div")
    card.className = "project-card"
    card.classList.add("blue-theme")
    card.classList.add("animate-fade-in")
    container.appendChild(card)

    var details = document.createElement("div")
    details.className = "project-card-details"
    card.appendChild(details)

    var image = document.createElement("img")
    image.src = "resources/" + project.image
    image.className = project.image_class
    details.appendChild(image)

    var cardText = document.createElement("div")
    cardText.className = "project-card-text"
    details.appendChild(cardText)

    var title = document.createElement("text")
    title.className = "project-card-title"
    title.innerHTML = project.title
    cardText.appendChild(title)

    var description = document.createElement("text")
    description.className = "project-card-description"
    description.innerHTML = project.description
    cardText.appendChild(description)

    var buttonContainer = document.createElement("div")
    buttonContainer.className = "project-button-container"
    card.appendChild(buttonContainer)

    if (project.left_action_url != "") {
        var left_button = document.createElement("div")
        left_button.className = "project-card-button"
        left_button.classList.add("left-button")
        left_button.onclick = function() { window.open(project.left_action_url, "_blank") }
        left_button.innerHTML = '<img src="resources/icons/play-button.svg" class="md-icon dark-blue">Demo'
        buttonContainer.appendChild(left_button)
    }

    if (project.right_action_url != "") {
        var right_button = document.createElement("div")
        right_button.className = "project-card-button"
        right_button.classList.add("right-button")
        right_button.onclick = function() { window.open(project.right_action_url, "_blank") }
        right_button.innerHTML = '<img src="resources/icons/code.svg" class="sm-icon dark-blue">Code'
        buttonContainer.appendChild(right_button)
    }

    var dropDown = document.createElement("div")
    dropDown.className = "project-drop-down"
    card.appendChild(dropDown)

    var open = document.createElement("div")
    open.className = "open-drop-down"
    open.style.display = "none"
    dropDown.appendChild(open)

    var close = document.createElement("div")
    close.className = "close-drop-down"
    close.onclick = function() { toggleDropDown(project.id) }
    dropDown.appendChild(close)

    var closeText = document.createElement("div")
    closeText.className = "close-text"
    closeText.innerHTML = "^"
    closeText.style.rotate = "180deg"
    close.appendChild(closeText)

    if (project.preview != "") {
        var previewVideo = document.createElement("video")
        previewVideo.src = "resources/demos/" + project.preview
        previewVideo.innerHTML = "Your browser does not support the video tag."
        previewVideo.controls = true
        previewVideo.autoplay = true
        previewVideo.loop = true
        previewVideo.muted = true
        open.appendChild(previewVideo)
    }

    var features = document.createElement("p")
    features.innerHTML = "Notable Features"
    open.appendChild(features)

    var featureList = document.createElement("ul")
    for (var i = 0; i < project.features.length; i++) {
        var feature = document.createElement("li")
        feature.innerHTML = project.features[i]
        featureList.appendChild(feature)
    }
    open.appendChild(featureList)

    var technologies = document.createElement("p")
    technologies.innerHTML = "Technologies Used"
    open.appendChild(technologies)

    var technologyList = document.createElement("div")
    technologyList.className = "tech"
    for (var i = 0; i < project.technologies.length; i++) {
        var technology = document.createElement("img")
        technology.title = project.technologies[i]
        technology.src = "resources/icons/" + data.tech_icons[project.technologies[i]].filename
        technology.className = "tech-icon"
        if (!data.tech_icons[project.technologies[i]].hasColor) {
            technology.classList.add("white")
        }
        technologyList.appendChild(technology)
    }
    open.appendChild(technologyList)
}

function loadProjects() {
    data.projects.sort((a, b) => (a.date < b.date) ? 1 : -1)
    for (var i = 0; i < data.projects.length; i++) {
        addProject(data.projects[i])
    }
}

const data = {
    "projects": [
        {
            "id": "wordleSolver",
            "title": "Wordle Solver",
            "description": "A tool to help you solve Wordle puzzles.",
            "image": "wordle.svg",
            "image_class": "project-image",
            "left_action_url": "https://replit.com/@pueblak/wordle-autosolver-lite",
            "right_action_url": "https://github.com/pueblak/wordle-autosolver",
            "preview": "Wordle Demo.mp4",
            "features": [
                "Solve any Classic Wordle puzzle in less than six guesses, guaranteed!",
                "Can also solve Wordle on Hard mode, or on Wordzy's Master mode",
                "Also supports variations of Wordle such as Quordle, Octordle, and Fibble",
                "Can solve up to 500 simultaneous puzzles at once",
                "Option to have the program do all of the typing and page navigation for you",
                "Command line interface version of the game for those who do not wish to use Selenium",
                "Light Mode (Dark Mode is default)"
            ],
            "technologies": [
                "Python",
                "Google Chrome",
                "Selenium"
            ],
            "tags": [
                "wordle",
                "wordle solver",
                "AI",
                "python",
                "selenium",
                "google chrome",
                "automation"
            ],
            "date": "2022-07-28"
        },
        {
            "id": "chessEngine",
            "title": "Chess Engine",
            "description": "A chess engine which can play and calculate legal moves from any position.",
            "image": "chess/N_B.png",
            "image_class": "project-image-chess",
            "left_action_url": "",
            "right_action_url": "https://github.com/pueblak/chess-engine",
            "preview": "",
            "features": [
                "Play against the engine in a web browser",
                "Calculate legal moves from any position",
                "Calculate the best move from any position",
                "Export games as PGN files"
            ],
            "technologies": [
                "C"
            ],
            "tags": [
                "chess",
                "chess engine",
                "c"
            ],
            "date": "2022-02-21"
        },
        {
            "id": "invasionTD",
            "title": "Invasion TD",
            "description": "A tower defense game where you must place turrets to defeat waves of enemies.",
            "image": "icons/tower-defense.svg",
            "image_class": "project-image-td",
            "left_action_url": "",
            "right_action_url": "https://github.com/pueblak/invasion-td",
            "preview": "Invasion TD Demo.mp4",
            "features": [
                "Place turrets to defeat waves of enemies",
                "Upgrade turrets to increase their power",
                "Earn money by killing enemies",
                "Multiple unique turrets and enemies"
            ],
            "technologies": [
                "Unreal Engine 4"
            ],
            "tags": [
                "tower defense",
                "unreal engine 4",
                "ue4",
                "unreal"
            ],
            "date": "2022-05-07"
        }
    ],
    "tech_icons": {
        "JavaScript": { filename: "javascript.svg", hasColor: true },
        "HTML": { filename: "html-5.svg", hasColor: true },
        "CSS": { filename: "css-3.svg", hasColor: true },
        "Python": { filename: "python.svg", hasColor: true },
        "C++": { filename: "cpp.svg", hasColor: true },
        "C": { filename: "c.svg", hasColor: false },
        "Java": { filename: "java.svg", hasColor: true },
        "C#": { filename: "c-sharp.svg", hasColor: true },
        "PHP": { filename: "php.svg", hasColor: true },
        "Ruby": { filename: "ruby.svg", hasColor: true },
        "Swift": { filename: "swift.svg", hasColor: true },
        "Rust": { filename: "rust.svg", hasColor: true },
        "Scala": { filename: "scala.svg", hasColor: true },
        "Haskell": { filename: "haskell.svg", hasColor: true },
        "R": { filename: "r.svg", hasColor: true },
        "MySQL": { filename: "mysql.svg", hasColor: true },
        "TypeScript": { filename: "typescript.svg", hasColor: true },
        "Sass": { filename: "sass.svg", hasColor: true },
        "Google Chrome": { filename: "chrome.svg", hasColor: true },
        "Selenium": { filename: "selenium.svg", hasColor: true },
        "WebGL": { filename: "webgl.svg", hasColor: true },
        "Unity": { filename: "unity.svg", hasColor: true },
        "Unreal Engine 4": { filename: "unreal.svg", hasColor: false }
    }
}