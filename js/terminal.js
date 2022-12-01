const CURSOR = '█'
const html_input = `
    <input id="command" class="cli" type="text"
           onload="resize_input(this.value)"
           onresize="resize_input(this.value)"
           oninput="resize_input(this.value)"
           spellcheck="false"/>
    <text class="cursor" id="cursor">█</text>`
const COMMANDS_HELP = `
  help -------------- display this list of commands\n
  upgrade ----------- upgrade the terminal display to a more modern webpage\n
  pwd --------------- print working directory\n
  run [FILENAME] ---- run the given file (must be executable)\n
  cat [FILENAME] ---- view the given file (must be text)\n
  ls [DIRNAME] ------ list directory contents (current directory by default)\n
  cd DIRNAME -------- change directory to {DIRNAME}\n
  echo TEXT [...] --- print {TEXT} to the terminal\n
  alias NAME -------- change your username to {NAME}\n
  clear ------------- clear the screen of all content
`
const DIR = {
    bin: {
        __name__: 'bin',
        __type__: 'DIR',
        __value__: "."
    },
    boot: {
        __name__: 'boot',
        __type__: 'DIR',
        __value__: "."
    },
    home: {
        __name__: 'home',
        __type__: "DIR",
        __value__: "index.html",
        about: {
            __name__: 'about',
            __type__: "SYM_LINK",
            __value__: "about.html",
        },
        contact: {
            __name__: 'contact',
            __type__: "SYM_LINK",
            __value__: "contact.html",
            email: {
                __name__: 'email.txt',
                __type__: "TXT",
                __value__: "pueblakody@gmail.com"
            },
            phone: {
                __name__: 'phone.txt',
                __type__: "TXT",
                __value__: "(309)737-5945"
            },
            linkedin: {
                __name__: 'linkedin.txt',
                __type__: "TXT",
                __value__: "www.linkedin.com/in/kody-puebla"
            },
            github: {
                __name__: 'github.txt',
                __type__: "TXT",
                __value__: "www.github.com/pueblak"
            }
        },
        projects: {
            __name__: 'projects',
            __type__: "SYM_LINK",
            __value__: "projects.html",
        },
        troubleshoot: {
            __name__: 'troubleshoot',
            __type__: "EXE",
            __value__: troubleshoot_exe
        }
    },
    media: {
        __name__: 'media',
        __type__: 'DIR',
        __value__: "."
    },
    root: {
        __name__: 'root',
        __type__: "DIR",
        __value__: "."
    },
    tmp: {
        __name__: 'tmp',
        __type__: "DIR",
        __value__: ".",
        '.cookies': {
            __name__: '.cookies',
            __type__: "TXT",
            __value__: ""
        }
    },
    usr: {
        __name__: 'usr',
        __type__: "DIR",
        __value__: ".",
        root: {
            __name__: 'root',
            __type__: "DIR",
            __value__: "."
        }
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))


var username = 'guest'
var directory = '/home'
var history = []
var excess_lines = 0
var interacted = false
var num_clicks = 0

function load_body() {
    if (window.location.href.includes("pueblak.github.io"))
        window.location.href = window.location.href.replace("pueblak.github.io", "kody-puebla.com")
    document.addEventListener("keydown", function(e) {
        if (e.code == "Escape") {
            directory = window.location.href.replace("https://kody-puebla.com", "/home")
            setCookie("directory", directory, 1)
            window.location.href = "https://kody-puebla.com/terminal"
        }
    })
    if (getCookie("directory") != "")
        directory = getCookie("directory")
}

function get_working_directory_text() {
    return username + '@kody-puebla.com:~' + directory + ' $'
}

function parse_directory_path(path_string) {
    var path = []
    var items = path_string.split('/')
    for (var index = 0; index < items.length; index++) {
        var item = items[index].trim()
        if (item != '') {
            if (item == '.')
                continue
            else if (item == '..' && path.length > 0)
                path = path.slice(0, -1)
            else
                path.push(item)
        }
    }
    return path
}

function find_path_node(path_array, require_dir = false) {
    var path = []
    var node = DIR
    for (var index = 0; index < path_array.length; index++) {
        var node_name = path_array[index]
        if (Object.keys(node).includes(node_name)) {
            node = node[node_name]
            if (!Object.keys(node).includes('__type__'))
                throw "ERROR: '" + path.join('/') + '/' + "' does not have a valid type."
            else if (!require_dir && index == path_array.length - 1)
                return node
            else if (!(['DIR', 'SYM_LINK'].includes(node['__type__'])))
                throw "ERROR: '" + path.join('/') + '/' + "' is not a valid directory."
            path.push(node_name)
        } else
            throw "ERROR: '" + path.join('/') + '/' + "' is not in the current directory."
    }
    return node
}

function change_directory(path_string) {
    var path_array = parse_directory_path(directory + '/' + path_string)
    try {
        find_path_node(path_array, true)
        directory = '/' + path_array.join('/')
    } catch (e) {
        terminal_print_special(e.toString(), "error bold")
    }
}

function node_to_ls_style(node) {
    var type = node['__type__'].toLowerCase()
    if (type != 'txt')
        type += ' bold'
    return '<text class="' + type + '">' + node['__name__'] + ' </text>'
}

function print_directory(path_string) {
    var path_array = parse_directory_path(directory + '/' + path_string)
    var elements = []
    var names = []
    try {
        var node = find_path_node(path_array, true)
        var keys = Object.keys(node)
        for (var index = 0; index < keys.length; index++) {
            var key = keys[index]
            if (key.startsWith('__'))
                continue
            var html_element = node_to_ls_style(node[key])
            elements.push(html_element)
            names.push(key)
        }
    } catch (e) {
        terminal_print_special(e.toString(), "error bold")
    }
    if (names.length > 0) {
        var output_html = ''
        var sorted_names = Array.from(names).sort()
        for (var index = 0; index < sorted_names.length; index++)
            output_html += '\n' + elements[names.indexOf(sorted_names[index])]
        document.getElementById("output").innerHTML += output_html + "<br>"
    }
}

async function find_and_run_executable(path_string, args) {
    var path_array = parse_directory_path(directory + '/' + path_string)
    var node = null
    try {
        node = find_path_node(path_array.slice(0, path_array.length - 1))
    } catch (e) {
        return e.toString().split('ERROR: ')[1]
    }
    var exe = path_array[path_array.length - 1]
    if (!Object.keys(node).includes(exe))
        return "ERROR: '" + path_array.join('/') + "' cannot be found."
    node = node[exe]
    if (!Object.keys(node).includes('__type__'))
        return "ERROR: '" + path_array.join('/') + "' does not have a valid type."
    else if (node['__type__'] != 'EXE')
        return "ERROR: '" + path_array.join('/') + "' is not a valid executable."
    await node['__value__'](args)
    return ''
}

function view_text_file(path_string) {
    var path_array = parse_directory_path(directory + '/' + path_string)
    var node = null
    try {
        node = find_path_node(path_array)
    } catch (e) {
        return e.toString().split('ERROR: ')[1]
    }
    if (!Object.keys(node).includes('__type__'))
        return path_array.join('/') + "' does not have a valid type."
    else if (node['__type__'] != 'TXT')
        return path_array.join('/') + "' is not a valid text file."
    terminal_print(node['__value__'])
    return ''
}

function resize_input(text) {
    // calculate the number of characters that can fit on-screen
    var terminal_elem = document.getElementById("terminal")
    var command_elem = document.getElementById("command")
    var fontWidth = parseFloat(
        window.getComputedStyle(terminal_elem).getPropertyValue('font-size')
    ) * 0.6
    var max_chars = Math.floor(window.innerWidth / fontWidth) - 6
    if (!excess_lines)
        max_chars -= get_working_directory_text().length + 1
    if (text.length >= max_chars) {  // text is about to overflow
        var html_terminal = terminal_elem.innerHTML
        var line = text.substring(0, max_chars - 1)
        var line_width = ((max_chars + 1) * 0.6).toString() + 'em'
        var html_excess = ('<text id="excess_' + excess_lines.toString() +'" style="'
                            + line_width + '">' + line + '</text><br id="break_'
                            + excess_lines.toString() + '">')
        var html_mixed = html_terminal.split("<input")[0] + html_excess + html_input
        terminal_elem.innerHTML = html_mixed
        command_elem = document.getElementById("command")
        command_elem.value = text.substring(max_chars - 1)
        command_elem.style.width = ((command_elem.value.length + 1) * 0.6).toString() + 'em'
        command_elem.focus()
        excess_lines += 1
    } else if (text == '' && excess_lines) {  // going back down one line
        excess_lines -= 1
        console.log(excess_lines)
        var excess_elem = document.getElementById("excess_" + excess_lines.toString())
        command_elem.value = excess_elem.innerHTML
        excess_elem.remove()
        document.getElementById("break_" + excess_lines.toString()).remove()
        if (!excess_lines)
            max_chars -= get_working_directory_text().length + 1
        document.getElementById("command").style.width = (max_chars * 0.6).toString() + 'em'
    } else  // text is on the same line
        command_elem.style.width = ((text.length + 1) * 0.6).toString() + 'em'
    interacted = true
}

function submit_command() {
    var command_elem = document.getElementById("command")
    var full_command = ''
    var output = document.getElementById("output")
    output_text = ''
    output_text += '\n<text class="dir">' + get_working_directory_text() + '</text>'
    for (var index = 0; index < excess_lines; index++) {
        var excess_elem = document.getElementById("excess_" + index.toString())
        full_command += excess_elem.innerHTML
        output_text += ('\n<text>' + excess_elem.innerHTML + '</text><br>')
        excess_elem.remove()
        document.getElementById("break_" + index.toString()).remove()
    }
    output_text += ('\n<text>' + command_elem.value + '</text><br>')
    excess_lines = 0
    full_command += command_elem.value
    output.innerHTML += output_text
    command_elem.value = ''
    command_elem.style.width = '0.6em'
    return full_command
}

async function terminal_print(text, wait=0) {
    if (wait)
        await sleep(wait)
    var output_elem = document.getElementById("output")
    text = text.split('\n').join('</text><br>\n<text style="width:96.875vw">')
    output_elem.innerHTML += '\n<text style="width:96.875vw">' + text + '</text><br>'
    window.scrollBy(0, document.getElementById("output").scrollHeight)
}

async function terminal_print_special(text, type, wait=0) {
    if (wait)
        await sleep(wait)
    var output_elem = document.getElementById("output")
    text = text.split('\n').join('</text><br>\n<text class="' + type + '">')
    output_elem.innerHTML += '<br>\n<text class="' + type + '">' + text + '</text><br>'
    window.scrollBy(0, document.getElementById("output").scrollHeight)
}

async function navigate_to_page(href) {
    if (window.location.href.includes('terminal')) {
        document.getElementById("directory").remove()
        document.getElementById("command").remove()
        document.getElementById("cursor").remove()
        if (getCookie("visitedTerminal") != "True") {
            document.getElementById("output").innerHTML = 'Upgrading...'
            document.getElementById("output").classList.add("fade-color-animation")
            document.getElementById("body").classList.add("fade-color-animation")
            setCookie("visitedTerminal", "True", 1)
            setCookie("visited", "False", 1)
            await sleep(3200)
        }
    }
    history.pushState(null, null, window.location.href)
    window.location.href = href
}

async function begin_labyrinth_quest() {
    await terminal_print("\n...Theseus?\n", 4000)
    await terminal_print("Theseus, my boy, is that you?\n", 5000)
    await terminal_print("Please, my son... Do not venture into the labyrinth. "
                         + "I fear what may come of you if you do.", 6000)
    await terminal_print_special('A new directory has been added to "/home"',
                                 "alert bold", 8000)
}

async function process_command(command) {
    var args = command.split(" ")
    if (args.length == 0)
        return
    error_message = ''
    keyword = args[0]
    switch (keyword) {
        case '':
            break
        case "help":
            if (args.length != 1)
                error_message = 'Too many arguments. (expected 0)'
            else
                terminal_print(COMMANDS_HELP)
            break
        case "upgrade":
            if (args.length != 1)
                error_message = 'Too many arguments. (expected 0)'
            else
                navigate_to_page(
                    find_path_node(parse_directory_path(directory))['__value__']
                )
            break
        case "pwd":
            if (args.length != 1)
                error_message = 'Too many arguments. (expected 0)'
            else
                terminal_print(directory)
            break
        case "clear":
            if (args.length != 1)
                error_message = 'Too many arguments. (expected 0)'
            else
                document.getElementById("output").innerHTML = ''
            break
        case "alias":
            if (args.length != 2)
                error_message = 'Incorrect number of arguments. (expected 1)'
            else {
                terminal_print("Username changed from '" + username
                               + "' to '" + args[1] + "'")
                username = args[1]
                if (username == "Theseus")
                    begin_labyrinth_quest()
            }
            break
        case "echo":
            if (args.length < 2)
                error_message = 'Not enough arguments. (expected at least 1)'
            else
                terminal_print(args.slice(1, args.length).join(' '))
            break
        case "run":
            if (args.length < 2)
                error_message = 'Incorrect number of arguments. (expected at least 1)'
            else
                error_message = await find_and_run_executable(args[1], args.slice(2))
            break
        case "cat":
            if (args.length != 2)
                error_message = 'Incorrect number of arguments. (expected 1)'
            else
                error_message = view_text_file(args[1])
            break
        case "ls":
            if (args.length > 2)
                error_message = 'Too many arguments. (expected at most 1)'
            else
                print_directory(args.length == 2 ? args[1] : '')
            break
        case "cd":
            if (args.length != 2)
                error_message = 'Incorrect number of arguments. (expected 1)'
            else
                change_directory(args.length == 2 ? args[1] : '.')
            break
        default:
            if (args[0].startsWith('.') || args[0].includes('/'))
                error_message = await find_and_run_executable(args[0], args.slice(1))
            else
                error_message = "'" + args[0] + "' command not found"
    }
    if (error_message != '') {
        terminal_print_special("ERROR: " + error_message, "error bold")
        terminal_print(COMMANDS_HELP)
    }
    // allow the user to input commands again
    document.getElementById("directory").innerHTML = get_working_directory_text()
    document.getElementById("command").disabled = false
    document.getElementById("cursor").innerHTML = CURSOR
    document.getElementById("command").focus()
}

function set_terminal_font_size() {
    var fontSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 30.0)
    document.getElementById("body").style.fontSize = fontSize.toString() + "px"
}

function load_terminal() {
    set_terminal_font_size()
    var directory_elem = document.getElementById("directory")
    directory_elem.innerHTML = get_working_directory_text()
    var cursor_elem = document.getElementById("cursor")
    cursor_elem.innerHTML = CURSOR
    var command_elem = document.getElementById("command")
    command_elem.focus()
    window.onclick = function() {
        if (num_clicks < 2)
            num_clicks += 1
        else if (!interacted) {
            terminal_print_special('ERROR: Website is not currently clickable.', "error bold")
            troubleshoot_exe()
            interacted = true
            num_clicks += 1
        } else if (num_clicks == 2) {
            terminal_print_special('ERROR: Website is not currently clickable.', "error bold")
            num_clicks += 1
        }
        document.getElementById('command').focus()
    }
    document.onkeydown = function(event) {
        if (event.key == "Enter") {
            var command = submit_command()
            directory_elem.innerHTML = ''
            command_elem.disabled = true
            cursor_elem.innerHTML = ''
            process_command(command)
        }
    }
}

async function troubleshoot_exe(arg_list=[]) {
    if (arg_list.length > 0) {
        terminal_print_special("ERROR: troubleshoot does not take any arguments.", "error bold")
        return
    }
    document.getElementById("directory").innerHTML = ''
    document.getElementById("command").disabled = true
    document.getElementById("cursor").innerHTML = ''
    await terminal_print("\nStarting KnossOS Troubleshooter...", 4000)
    await sleep(4000)
    document.getElementById("output").innerHTML = ''
    await terminal_print("Oh, hello there, visitor!\n", 2500)
    await terminal_print("My name is Kody Puebla.\n", 4000)
    await terminal_print("You must be looking for my website.\n", 4000)
    await terminal_print("This is the right place! But something seems off...\n", 4000)
    await terminal_print("Whoops! Looks like I sent you to the back end by mistake.\n", 4000)
    await terminal_print("I spend most of my time here, so sometimes I forget this isn't the actual website.\n", 6000)
    await terminal_print("Here, let me give you access to a more user-friendly version.\n", 8000)
    await terminal_print_special("A new command has been added: 'upgrade'", "alert bold", 5000)
    document.getElementById("directory").innerHTML = get_working_directory_text()
    document.getElementById("command").disabled = false
    document.getElementById("cursor").innerHTML = CURSOR
    document.getElementById("command").focus()
}