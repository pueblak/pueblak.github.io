const LINE = "    ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯";

var drionen = [
    {
        "dri": "aemaypiZH",
        "pro": "\u025b\u02c8ma\u026a\u032fpi\u0292",
        "pos": "n",
        "eng": [
            [
                "repetition",
                1.0
            ],
            [
                "duplication",
                0.8
            ],
            [
                "iteration",
                0.8
            ],
            [
                "echo",
                0.8
            ],
            [
                "recurrence",
                0.8
            ],
            [
                "redundancy",
                0.8
            ]
        ],
        "def": "Recurring or reiterated action or statement"
    },
    {
        "dri": "aemayneyLT",
        "pro": "\u025b\u02c8ma\u026a\u032fne\u026a\u032flt",
        "pos": "n",
        "eng": [
            [
                "advertisement",
                1.0
            ],
            [
                "marketing",
                0.8
            ],
            [
                "ad",
                0.8
            ],
            [
                "commercial",
                0.8
            ],
            [
                "promotion",
                0.8
            ],
            [
                "campaign",
                0.8
            ]
        ],
        "def": "Promotional content for products or services"
    },
    {
        "dri": "aeM",
        "pro": "\u025bm",
        "pos": "v",
        "eng": [
            [
                "crave",
                1.0
            ],
            [
                "miss (long for)",
                1.0
            ],
            [
                "yearn",
                0.8
            ],
            [
                "want",
                0.8
            ],
            [
                "hanker for",
                0.8
            ],
            [
                "desire",
                0.8
            ],
            [
                "long for",
                0.8
            ]
        ],
        "def": "Strongly desire or yearn"
    },
    {
        "dri": "wa",
        "pro": "w\u0251",
        "pos": "n",
        "eng": [
            [
                "horn",
                1.0
            ],
            [
                "trombone",
                0.8
            ],
            [
                "tuba",
                0.8
            ],
            [
                "trumpet",
                0.8
            ],
            [
                "saxophone",
                0.8
            ],
            [
                "french horn",
                0.8
            ]
        ],
        "def": "A musical instrument made of brass or other materials, typically curved and producing a loud sound"
    },
    {'dri': 'adhuD', 'pro': 'ˈɑðud', 'pos': 'adj', 'eng': [('smooth', 1.0), ('sleek', 1.0), ('polished', 0.8), ('refined', 0.8), ('elegant', 0.8), ('streamlined', 0.8), ('lustrous', 0.8)], 'def': 'A term that refers to something with a polished and streamlined appearance or texture'},
    {'dri': 'munoB', 'pro': 'ˈmunob', 'pos': 'v', 'eng': [('bake', 1.0), ('grill', 0.8), ('roast', 0.8), ('broil', 0.8), ('cook', 0.8)], 'def': 'To cook food in an oven or over an open fire until it is cooked through and crispy on the outside'},
    {'dri': 'wiLD', 'pro': 'wild', 'pos': 'n', 'eng': [('diameter', 1.0), ('span', 0.8), ('width', 0.8), ('distance', 0.8), ('measurement', 0.8), ('breadth', 0.8)], 'def': 'A straight line passing through the center of a circle or sphere, connecting two points on the circumference or surface'},
    {'dri': 'saeRtooliveynayN', 'pro': 'ˌsɛɹtoˌoliˈβeɪ̯naɪ̯n', 'pos': 'n', 'eng': [('upper class', 1.0), ('elite', 0.8), ('privileged', 0.8), ('wealthy', 0.8), ('affluent', 0.8), ('aristocracy', 0.8)], 'def': 'Socially privileged and wealthy'},
    {'dri': 'soyRtooliveynayN', 'pro': 'ˌsɔɪ̯ɹtoˌoliˈβeɪ̯naɪ̯n', 'pos': 'n', 'eng': [('thigh', 1.0), ('upper leg', 0.8), ('groin', 0.8), ('femur', 0.8), ('hamstring', 0.8), ('quadriceps', 0.8)], 'def': 'Upper leg area'},
    {'dri': 'dryleyZH aespyLT', 'pro': 'ˈdɹɪleɪ̯ʒ ˈɛspɪlt', 'pos': 'n', 'eng': [('census', 1.0), ('headcount', 0.8), ('enumeration', 0.8), ('demographic study', 0.8), ('survey', 0.8), ('population count', 0.8)], 'def': 'Population count for statistical purposes'}
]


function hideMainMenu() {
    var mainMenu = document.getElementById("dictionary-form");
    mainMenu.style.display = "none";
    var dictionary = document.getElementById("dictionary");
    var win = document.createElement("div");
    win.id = "dictionary-window";
    win.className = "dictionary-window";
    dictionary.appendChild(win);
}

function showMainMenu() {
    var dictionary = document.getElementById("dictionary");
    var win = document.getElementById("dictionary-window");
    if (win) {
        dictionary.removeChild(win);
    }
    var mainMenu = document.getElementById("dictionary-form");
    mainMenu.style.display = "flex";
}

function beginSearch() {
    // hideMainMenu();
    const win = document.getElementById("dictionary-window");

}

async function requestDictionary() {
    fetch("https://drionen.kody-puebla.com", {
        method: "FETCH",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .catch((error) => {
        console.error("Error loading dictionary: " + error);
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      drionen = data;
      console.log("Dictionary loaded");
    });
}

function beginBrowse() {
    hideMainMenu();

    var win = document.getElementById("dictionary-window");
    addHeader("Browse Dictionary");

    // iterate through all entries and add them to the window
    var prevLetter = "";
    for (var index = 0; index < drionen.length; index++) {
        var entry = drionen[index];
        var startLetter = findStartLetter(entry.dri);
        if (startLetter != prevLetter) {
            prevLetter = startLetter;
            var letterBox = document.createElement("div");
            letterBox.className = "dictionary-seperator";
            win.appendChild(letterBox);

            var letter = document.createElement("div");
            letter.className = "dictionary-letter";
            letter.innerText = startLetter;
            letterBox.appendChild(letter);

            var line = document.createElement("div");
            line.className = "dictionary-letter-line";
            letterBox.appendChild(line);

            var lineText = document.createElement("text");
            lineText.className = "dictionary-line-text";
            lineText.innerHTML = LINE;
            line.appendChild(lineText);

            letterBox.style.visibility = "hidden";
        }
        addDictionaryResult(entry, index + 1);
    }
    sleep(1000).then(() => {
        for (var child of win.children) {
            child.style.visibility = "visible";
        }
    });
}

function beginEdit() {
    // hideMainMenu();
}

function addHeader(titleText) {
    var win = document.getElementById("dictionary-window");
    
    var header = document.createElement("div");
    header.className = "browse-header";
    win.appendChild(header);

    var backButton = document.createElement("img");
    backButton.className = "browse-header-back";
    backButton.src = "resources/arrow-left.svg";
    backButton.onclick = showMainMenu;
    header.appendChild(backButton);

    var title = document.createElement("div");
    title.className = "browse-header-title";
    title.innerText = titleText;
    header.appendChild(title);

    var blank = document.createElement("div");
    blank.className = "browse-header-blank";
    header.appendChild(blank);
}

function addDictionaryResult(entry, index) {
    var win = document.getElementById("dictionary-window");

    var container = document.createElement("div");
    container.className = "dictionary-result";
    container.id = entry.dri.replace(" ", "-");
    win.appendChild(container);

    var idxElement = document.createElement("div");
    idxElement.className = "dictionary-result-index";
    idxElement.innerText = index;
    container.appendChild(idxElement);

    var preview = document.createElement("div");
    preview.className = "dictionary-preview";
    container.appendChild(preview);

    var word = document.createElement("div");
    word.className = "dictionary-preview-word";
    word.innerText = entry.dri.replace(" ", "");
    preview.appendChild(word);

    var definition = document.createElement("div");
    definition.className = "dictionary-preview-details";
    definition.innerHTML = entry.pos + ".&nbsp;&nbsp;&nbsp;&nbsp;" + entry.def;
    preview.appendChild(definition);

    container.style.visibility = "hidden";
}

function findStartLetter(dri) {
    const consonants = [
        "f", "v", "s", "z", "t", "d", "n", "l", "r", "m", "p", "b", "w",
        "sh", "zh", "th", "dh", "rh", "st", "sp", "sl", "sn", "pl", "bl",
        "fl", "fr", "frh", "pr", "prh", "br", "brh", "tr", "trh", "dr",
        "drh", "vr", "vrh", "str", "strh", "thr", "thrh", "dhr", "dhrh"
    ];
    const vowels = [
        "a", "e", "i", "o", "u", "y", "ae", "ai", "ao", "au", "ay", "ey",
        "oy", "ei", "oo"
    ];
    var consonant = ""
    for (var i = consonants.length - 1; i >= 0; i--) {
        if (dri.startsWith(consonants[i])) {
            consonant = consonants[i];
            break;
        }
    }
    var vowel = ""
    for (var i = vowels.length - 1; i >= 0; i--) {
        if (dri.startsWith(consonant + vowels[i])) {
            vowel = vowels[i];
            break;
        }
    }
    return consonant + vowel;
}

function formatPronunciation(pronunciation) {
    var formatted = "";
    var words = pronunciation.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (i > 0) {
            formatted += " ";
        }
        var word = words[i];
        var syllables = getSyllables(word);
        for (var j = 0; j < syllables.length; j++) {
            if (j > 0) {
                formatted += "·";
            }
            formatted += syllables[j];
        }
    }
    return "/" + formatted + "/";
}

function getSyllables(pronunciation) {
    const consonants = [
        "b", "ɓ", "β", "ʙ", "c", "ç", "d", "ɖ", "ɗ", "ᶑ", "ʣ", "ʥ", "ʤ", "f",
        "ɸ", "g", "ɠ", "ɢ", "ʛ", "ɰ", "h", "ɦ", "ħ", "ɧ", "ɥ", "ʜ", "j", "ʝ",
        "ɟ", "ʄ", "k", "l", "ɫ", "ɬ", "ɮ", "ɭ", "ꞎ", "ʟ", "m", "ɱ", "n", "ɳ",
        "ɲ", "ŋ", "ɴ", "p", "q", "r", "ɹ", "ɾ", "ɽ", "ɻ", "ɺ", "ʁ", "ʀ", "s",
        "ʂ", "ɕ", "ʃ", "t", "ʈ", "ʦ", "ʨ", "ʧ", "v", "ⱱ", "ʋ", "w", "ʍ", "x",
        "ɣ", "χ", "ʎ", "z", "ʐ", "ʑ", "ʒ", "θ", "ð", "ʔ", "ʡ", "ʕ", "ʢ", "ʘ",
        "ǀ", "ǃ", "ǂ", "ǁ"
    ];
    const vowels = [
        "aɪ̯", "aʊ̯", "eɪ̯", "oʊ̯", "ɔɪ̯", "ɜː", "iː", "ɪ", "ɔː", "uː", "a", "æ",
        "ɑ", "ɒ", "ɐ", "e", "ɛ", "ɜ", "ɞ", "ə", "i", "ɨ", "ɪ", "y", "ʏ", "ø",
        "ɘ", "ɵ", "œ", "ɶ", "ɤ", "o", "ɔ", "u", "ʉ", "ʊ", "ɯ", "ʌ", "ɑ", "æ",
        "ɛ", "ʊ", "ʌ"
    ]
    var syllables = [];
    var syllable = "";
    var hasVowel = false;
    for (var i = 0; i < pronunciation.length; i++) {
        var letter = pronunciation[i];
        if (letter == "ˈ") {
            syllables.push(syllable);
            syllable = "";
            hasVowel = false;
        } else if (consonants.includes(letter)) {
            if (hasVowel) {
                syllables.push(syllable);
                syllable = "";
                hasVowel = false;
            }
        } else if (vowels.includes(letter)) {
            hasVowel = true;
        }
        syllable += letter;
    }
    if (syllable.length > 0) {
        if (hasVowel) {
            syllables.push(syllable);
        } else {
            syllables[syllables.length - 1] += syllable;
        }
    }
    return syllables;
}