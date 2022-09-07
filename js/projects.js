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
        left_button.innerHTML = project.left_action
        buttonContainer.appendChild(left_button)
    }

    if (project.right_action_url != "") {
        var right_button = document.createElement("div")
        right_button.className = "project-card-button"
        right_button.classList.add("right-button")
        right_button.onclick = function() { window.open(project.right_action_url, "_blank") }
        right_button.innerHTML = project.right_action
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
        technology.src = "resources/icons/" + data.tech_icons[project.technologies[i]]
        technology.className = "tech-icon"
        technologyList.appendChild(technology)
    }
    open.appendChild(technologyList)
}

function loadProjects() {
    for (var i = 0; i < data.projects.length; i++) {
        addProject(data.projects[i])
    }
}

const data = {
    "projects": [
        {
            "id": "webTerminal",
            "title": "KnossOS Web Terminal",
            "description": "A web terminal which emulates a custom Unix-like operating system.",
            "image": "terminal.svg",
            "image_class": "project-image-terminal",
            "left_action": "TRY IT OUT",
            "right_action": "VIEW CODE",
            "left_action_url": "terminal.html",
            "right_action_url": "https://github.com/pueblak/pueblak.github.io/tree/master/js/terminal.js",
            "features": [
                "Custom Unix-like command line interface",
                "Detailed help command for new users",
                "Traverse this website as if it were a directory tree",
                "Ability to change your username to something epic like Hercules or Zeus",
                "At least 4 colors, maybe even more",
                "Cookies! (not for you)",
                "Secrets?"
            ],
            "technologies": [
                "HTML",
                "CSS",
                "JavaScript"
            ],
            "tags": [
                "terminal",
                "unix",
                "command line",
                "cli",
                "javascript",
                "html",
                "css"
            ],
            "date": "2022-08-31"
        },
        {
            "id": "wordleSolver",
            "title": "Wordle Solver",
            "description": "A tool to help you solve Wordle puzzles.",
            "image": "wordle.svg",
            "image_class": "project-image",
            "left_action": "TRY IT OUT",
            "right_action": "VIEW CODE",
            "left_action_url": "",
            "right_action_url": "https://github.com/pueblak/wordle-autosolver",
            "features": [
                "Solve any Classic Wordle puzzle in less than six guesses, guaranteed!",
                "Can also solve Wordle on Hard mode, or on Wordzy's Master mode",
                "Also supports variations of Wordle such as Quordle, Octordle, and Fibble",
                "Option to have the program do all of the typing and page navigation for you",
                "Command line interface version of the game for those who prefer to type",
                "Dark Mode"
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
            "left_action": "TRY IT OUT",
            "right_action": "VIEW CODE",
            "left_action_url": "",
            "right_action_url": "https://github.com/pueblak/chess-engine",
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
            "date": "2022-07-28"
        }
    ],
    "tech_icons": {
        "JavaScript": "javascript.svg",
        "HTML": "html-5.svg",
        "CSS": "css-3.svg",
        "Python": "python.svg",
        "C++": "cpp.svg",
        "C": "c.svg",
        "Java": "java.svg",
        "C#": "c-sharp.svg",
        "PHP": "php.svg",
        "Ruby": "ruby.svg",
        "Swift": "swift.svg",
        "Rust": "rust.svg",
        "Scala": "scala.svg",
        "Haskell": "haskell.svg",
        "R": "r.svg",
        "MySQL": "mysql.svg",
        "TypeScript": "typescript.svg",
        "Sass": "sass.svg",
        "Google Chrome": "chrome.svg",
        "Selenium": "selenium.svg"
    }
}