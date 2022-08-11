////////////////////////////////////
////  CODE FOR BLACKJACK LOGIC  ////
////////////////////////////////////

var deck = [
    "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "TC", "JC", "QC", "KC", "AC",
    "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "TH", "JH", "QH", "KH", "AH",
    "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "TS", "JS", "QS", "KS", "AS",
    "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "TD", "JD", "QD", "KD", "AD"
];

const initBankroll = 1000;

var inPlay = false;
var bankroll = initBankroll;
var wager = 0;
var init = bankroll;
var help = false;
var view = 0; // 0=menu, 1=game, 2=rules, 3=options
var backColor = "red"; // "red", "green", or "blue"
var outputText = "Select an amount to wager (1000 remaining)";

var dealer = [];
var dSum = 0;
var dAce = false;
var dBlackjack = false;

var player = [[], []];
var pSum = [0, 0];
var pAce = [false, false];
var pStand = [false, false];
var pDouble = [false, false];
var pBlackjack = false;
var pSplit = false;
var pInsured = false;

function cardValue(card) {
    var rank = card.substring(0, 1);
    if (rank == "A")
        return 1;
    else if (isNaN(+rank))
        return 10;
    else
        return +rank;
}

function cardFilename(card) {
    if (card == "" || card == undefined)
        return "resources/cards/back_" + backColor + ".png";
    const rankName = { "T":"10", "J":"jack", "Q":"queen", "K":"king", "A":"ace" };
    const suitName = { "C":"clubs", "H":"hearts", "S":"spades", "D":"diamonds" };
    var rank = card.substring(0, 1);
    var suit = card.substring(1, 2);
    if(!isNaN(+rank))
        return "resources/cards/" + rank + "_of_" + suitName[suit] + ".png";
    return "resources/cards/" + rankName[rank] + "_of_" + suitName[suit] + ".png";
}

function wager10() { makeWager(10); }
function wager20() { makeWager(20); }
function wager50() { makeWager(50); }
function wager100() { makeWager(100); }

function makeWager(amount) {
    if (inPlay || amount > bankroll)
        return;
    wager = amount;
    init = bankroll;
    bankroll -= wager;
    inPlay = true;
    dealNewHand();
}

function dealNewHand() {
    reset();
    dealDealer();
    dealPlayer();
    dealDealer();
    dealPlayer();
    removeBetButtons();
    if (pSum[0] < 21 && cardValue(dealer[1]) == 1)
        offerInsurance();
    else
        checkBlackjack();
}

function checkBlackjack() {
    if (dSum == 21)
        dBlackjack = true;
    if (pSum[0] == 21)
        pBlackjack = true;
    if (pBlackjack || dBlackjack) {
        stand();
        revealDealerCard();
    }
    else
        drawActionButtons();
}

function hitA() { hit(); }
function hitB() { hit(true); }

function hit(second = false) {
    var idx = second ? 1 : 0;
    if (!inPlay || pStand[idx] || pSum[idx] >= 21)
        return;
    dealPlayer(second);
    if (pSum[idx] >= 21) {
        stand(second);
        return;
    }
    drawActionButtons(second);
}

function standA() { stand(); }
function standB() { stand(true); }

function stand(second = false) {
    if (!inPlay)
        return;
    pStand[second ? 1 : 0] = true;
    removeActionButtons(second);
    if (pStand[0] && pSplit == pStand[1])
        dealerAutoplay();
    drawSumLabel(true, second);
}

function doubleA() { double(); }
function doubleB() { double(true); }

function double(second = false) {
    var idx = second ? 1 : 0;
    if (!inPlay || player[idx].length > 2 || pStand[idx] || pDouble[idx])
        return;
    pDouble[idx] = true;
    bankroll -= wager;
    drawActionButtons(second);
    dealPlayer(second);
    if (!pStand[idx])
        stand(second);
}

function split() {
    pSplit = true;
    var cardA = player[0][0];
    var cardB = player[0][1];
    player[1].push(player[0].pop());
    pSum = [cardValue(cardA), cardValue(cardB)];
    if (pSum[0] == 1) {
        for (var i = 0; i < 2; i++) {
            pAce[i] = true;
            pSum[i] += 10;
        }
    }
    dealPlayer();
    dealPlayer(true);
    bankroll -= wager;
    if (pSum[0] == 21)
        stand();
    else
        drawActionButtons();
    if (pSum[1] == 21)
        stand(true);
    else
        drawActionButtons(true);
}

function offerInsurance() {
    removeActionButtons();
    drawInsuranceButtons();
}

function acceptInsurance() {
    pInsured = true;
    bankroll -= wager / 2;
    removeInsuranceButtons();
    checkBlackjack();
}

function rejectInsurance() {
    removeInsuranceButtons();
    checkBlackjack();
}

function dealPlayer(second = false) {
    var idx = second ? 1 : 0;
    var card = deck.pop();
    player[idx].push(card);
    var value = cardValue(card);
    if (value == 1 && !pAce[idx] && pSum[idx] < 11) {
        value += 10;
        pAce[idx] = true;
    }
    pSum[idx] += value;
    if (pSum[idx] > 21 && pAce[idx]) {
        pSum[idx] -= 10;
        pAce[idx] = false;
    }
    drawHand(true, second);
}

function dealDealer() {
    var card = deck.pop();
    dealer.push(card);
    var value = cardValue(card);
    if (value == 1 && !dAce && dSum < 11) {
        value += 10;
        dAce = true;
    }
    dSum += value;
    if (dSum > 21 && dAce) {
        dSum -= 10;
        dAce = false;
    }
    drawHand(false);
}

function revealDealerCard() {
    drawHand(false, true);
}

function dealerAutoplay() {
    if ((!pBlackjack && pSum[0] <= 21) || (pSplit && pSum[1] <= 21))
        while (dSum < 17 || (dSum == 17 && dAce))
            dealDealer();
    payout();
    revealDealerCard();
}

function payout() {
    for (var i = 0; i < (pSplit ? 2 : 1); i++) {
        if (pSum[i] > 21)
            continue; // loss
        else if (pBlackjack && !dBlackjack)
            bankroll += wager * 5 / 2; // blackjack
        else if ((pSum[i] == dSum && !dBlackjack) || (pBlackjack && dBlackjack))
            bankroll += pDouble[i] ? wager * 2 : wager; // push
        else if (dSum > 21 || pSum[i] > dSum)
            bankroll += wager * (pDouble[i] ? 4 : 2); // win
    }
    if (dBlackjack && pInsured)
        bankroll += wager * 1.5;
    if (bankroll > init)
        drawOutput("You won " + (bankroll - init) + "! Play again?  (" + bankroll + " remaining)");
    else if (bankroll == init)
        drawOutput("Money returned. Play again?  (" + bankroll + " remaining)");
    else
        drawOutput("You lost " + (init - bankroll) + ". Play again?  (" + bankroll + " remaining)");
    inPlay = false;
    wager = 0;
    if (bankroll < 10) {
        drawOutput("Low funds. Refresh the page to play again.");
        document.getElementById("output").style.top = "" + Math.floor(imgHeight * 2.75) + "px";
    }
    else
        drawBetButtons();
}

function reset() {
    for (var i = 0; i < dealer.length; i++)
        deck.push(dealer[i]);
    dealer = [];
    dSum = 0;
    dAce = false;
    dBlackjack = false;
    for (var i = 0; i < 2; i++)
        for (var j = 0; j < player[i].length; j++)
            deck.push(player[i][j]);
    player = [[], []];
    pSum = [0, 0];
    pAce = [false, false];
    pStand = [false, false];
    pDouble = [false, false];
    pBlackjack = false;
    pSplit = false;
    pInsured = false;
    removeGame();
    drawTableText();
    randomShuffle(deck);
}

/**
 *  Shuffle a given array in place.
 *
 *  @param list    the array to be shuffled
 */
function randomShuffle(list) {
    for (var size = list.length; size > 1; size--) {
        // select a random element from the front of the array and replace it with the element at list[size]
        //   --repeat this until size is 2 (skip swapping the last element with itself)
        var idx = Math.floor(Math.random() * size);
        if (idx == size - 1)
            continue; // skip if this would swap list[size-1] with itself
        var temp = list[size - 1];
        list[size - 1] = list[idx];
        list[idx] = temp;
    }
}


/////////////////////////////////////
//// LOGIC FOR RECOMMENDED MOVE  ////
/////////////////////////////////////

const hard = [
    "H", "H", "H", "H", "H", "H", "H", "H", "H", "H",
    "H", "H", "H", "H", "H", "H", "H", "H", "H", "H",
    "H", "H", "H", "H", "H", "H", "H", "H", "H", "H",
    "H", "H", "H", "H", "H", "H", "H", "H", "H", "H",
    "H", "H", "H", "H", "Dh", "Dh", "H", "H", "H", "H",
    "H", "Dh", "Dh", "Dh", "Dh", "Dh", "H", "H", "H", "H",
    "H", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "H",
    "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh",
    "H", "H", "H", "S", "S", "S", "H", "H", "H", "H",
    "H", "S", "S", "S", "S", "S", "H", "H", "H", "H",
    "H", "S", "S", "S", "S", "S", "H", "H", "H", "H",
    "H", "S", "S", "S", "S", "S", "H", "H", "H", "H",
    "H", "S", "S", "S", "S", "S", "H", "H", "H", "H",
    "S", "S", "S", "S", "S", "S", "S", "S", "S", "S",
    "S", "S", "S", "S", "S", "S", "S", "S", "S", "S",
    "S", "S", "S", "S", "S", "S", "S", "S", "S", "S",
    "S", "S", "S", "S", "S", "S", "S", "S", "S", "S",
    "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"
];

const soft = [
    "H", "H", "H", "H", "Dh", "Dh", "H", "H", "H", "H",
    "H", "H", "H", "Dh", "Dh", "Dh", "H", "H", "H", "H",
    "H", "H", "H", "Dh", "Dh", "Dh", "H", "H", "H", "H",
    "H", "H", "H", "Dh", "Dh", "Dh", "H", "H", "H", "H",
    "H", "H", "H", "Dh", "Dh", "Dh", "H", "H", "H", "H",
    "H", "Dh", "Dh", "Dh", "Dh", "Dh", "H", "H", "H", "H",
    "H", "S", "Ds", "Ds", "Ds", "Ds", "S", "S", "H", "H",
    "S", "S", "S", "S", "S", "Ds", "S", "S", "S", "S",
    "S", "S", "S", "S", "S", "S", "S", "S", "S", "S",
    "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"
];

const pair = [
    "P", "P", "P", "P", "P", "P", "P", "P", "P", "P",
    "H", "P", "P", "P", "P", "P", "P", "H", "H", "H",
    "H", "P", "P", "P", "P", "P", "P", "P", "H", "H",
    "H", "H", "H", "P", "P", "P", "H", "H", "H", "H",
    "H", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "H",
    "H", "P", "P", "P", "P", "P", "P", "H", "H", "H",
    "H", "P", "P", "P", "P", "P", "P", "P", "H", "S",
    "P", "P", "P", "P", "P", "P", "P", "P", "P", "P",
    "P", "P", "P", "P", "P", "P", "S", "P", "P", "S",
    "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"
];

function getRecommendedButton(second = false) {
    if (!inPlay)
        return null;
    var id = "";
    var dIdx = cardValue(dealer[1]) - 1;
    if (document.getElementById("P") != null) {
        var pIdx = cardValue(player[0][0]) - 1;
        id = pair[pIdx * 10 + dIdx];
        if (id == "P")
            return document.getElementById("P");
    }
    var idx = second ? 1 : 0;
    var pValue = pSum[idx];
    if (id == "" && pAce[idx]) {
        var pIdx = pValue - 12;
        id = soft[pIdx * 10 + dIdx];
    }
    if (id == "") {
        var pIdx = pValue - 4;
        id = hard[pIdx * 10 + dIdx];
    }
    if (id == "")
        return null;
    var a_b = second ? "B" : "A";
    if (id.includes("D")) {
        if (document.getElementById("D" + a_b) != null)
            return document.getElementById("D" + a_b);
        id = id.substring(1).toUpperCase();
    }
    return document.getElementById(id + a_b);
}


//////////////////////////////////////////////////////////
////  CODE FOR DRAWING AND POSITIONING PAGE ELEMENTS  ////
//////////////////////////////////////////////////////////

const srcWidth = 500;
const srcHeight = 726;

var tableWidth = 0;
var tableHeight = 0;
var imgWidth = 0;
var imgHeight = 0;
var center_x = 0;
var center_y = 0;
var maxCards = 10;

var parseID = function(filename) { 
    var split = filename.split("/");
    return (split[split[1] == "cards" ? 2 : 1]).split(".")[0]; 
};

function genImageString(filename, x_pos, y_pos, width=0, height=0, onclick="") {
    var image = "<img src=\"" + filename + "\" id=\"" + parseID(filename) + "\"";
    var shadowA = "0px 0px " + Math.floor(imgWidth / 12) + "px 0px #000000";
    var shadowB = "0px 0px " + Math.floor(imgWidth / 24) + "px 0px #000000";
    image += " style=\"position:absolute; box-shadow:" 
    image += shadowA + ", " + shadowB + "; left:";
    image += x_pos + "px; top:" + y_pos + "px";
    if (width)
        image += "; width:" + width + "px";
    if (height)
        image += "; height:" + height + "px";
    image += "\"";
    if (onclick != "")
        image += " onclick=\"" + onclick + "\"";
    return image + ">";
}

function updateCenter() {
    center_x = Math.floor(window.innerWidth / 2);
    center_y = Math.floor(window.innerHeight / 2);
    tableWidth = Math.max(Math.floor(0.95 * window.innerWidth), 560);
    tableHeight = Math.floor(0.95 * window.innerHeight);
    if (center_x / center_y > 1.5)
        tableWidth = Math.floor(tableHeight * 1.5);
    else
        tableHeight = Math.floor(tableWidth / 1.5);
    imgWidth = Math.floor(tableWidth / 14);
    imgHeight = Math.floor(srcHeight * imgWidth / srcWidth);
}

function drawHand(isPlayer = true, second = false) {
    // calculate the variables necessary for placement
    updateCenter();
    var hand = isPlayer ? player[second ? 1 : 0] : dealer;
    if (isPlayer && pSplit)
        maxCards = 5;
    var numCols = hand.length > maxCards ? maxCards : hand.length;
    var handWidth = Math.floor(imgWidth * numCols + (imgWidth * (numCols - 1) / 16));
    var numRows = Math.ceil(hand.length / maxCards);
    if (hand.length == 10)
        numRows += 1
    var handHeight = Math.floor(imgHeight * numRows + (imgHeight * (numRows - 1) / 16));
    var left = Math.floor(center_x - handWidth / 2);
    if (isPlayer && pSplit) {
        if (!second)
            left = center_x - handWidth - imgWidth / 2
        else
            left = center_x + imgWidth / 2;
    }
    var top = Math.floor(isPlayer ? imgHeight * 3.5 : imgHeight * 1.5);
    var totalXGap = Math.floor(handWidth - imgWidth * numCols);
    var totalYGap = Math.floor(handHeight - imgHeight * numRows);
    var xGaps = symmetricSplit(totalXGap, numCols - 1);
    var yGaps = symmetricSplit(totalYGap, numRows - 1);
    // draw each card according to those variables
    var htmlString = "";
    var idx = 0;
    for (var i = 0; i < numRows; i++) {
        var xInit = left;
        if (isPlayer && pSplit && !second && idx > 4 && i > 0) {
            var num = numCols - hand.length % numCols;
            if (idx > 8)
                num--;
            else if (hand.length > 9 && idx > 4)
                num = 1;
            xInit += imgWidth * num + xGaps[num - 1];
        }
        for (var j = 0; j < numCols; j++) {
            if (idx == 9 && i == 1)
                continue;
            var x = xInit + j * imgWidth + (j > 0 ? xGaps[j - 1] : 0);
            var y = top + i * imgHeight + (i > 0 ? yGaps[i - 1] : 0);
            if (isPlayer || idx > 0 || (!isPlayer && second))
                htmlString += genImageString(cardFilename(hand[idx]), x, y, imgWidth);
            else
                htmlString += genImageString(cardFilename(""), x, y, imgWidth);
            idx++;
            if (idx >= hand.length)
                break;
            htmlString += "\n";
        }
    }
    var id = isPlayer ? (second ? "playerB" : "playerA") : "dealer";
    document.getElementById(id).innerHTML = htmlString;
    if (!isPlayer && second) {
        drawSumLabel(false);
        drawSumLabel();
        if (pSplit)
            drawSumLabel(true, true);
    }
    else if (isPlayer)
        drawSumLabel(true, second);
    if (isPlayer && pSplit)
        maxCards = 10;
}

function removeHand(isPlayer = true, second = false) {
    var id = isPlayer ? (second ? "playerB" : "playerA") : "dealer";
    document.getElementById(id).innerHTML = "";
}

function symmetricSplit(area, numElements) {
    if (area == 0 || numElements == 0)
        return [];
    var min = Math.floor(area / numElements);
    var result = [];
    var addend = [];
    for (var i = 1; i <= numElements; i++) {
        result.push(min * i);
        addend.push(false);
    }
    var rem = area % numElements;
    if (rem == 0)
        return result;
    var center = Math.floor(numElements / 2);
    addend[center] = true;
    var count = rem - 1;
    for (var i = 1; i <= Math.floor(rem / 2); i++) {
        if (count == 0)
            break;
        addend[center - i] = true;
        count--;
        if (count == 0)
            break;
        addend[center + i] = true;
        count--;
    }
    var val = 0;
    for (var i = 0; i < numElements; i++) {
        if (addend[i])
            val++;
        result[i] += val;
    }
    return result;
}

function drawBetButtons() {
    updateCenter();
    var style = "type=\"button\" class=\"button button_round\"";
    var size = Math.floor(imgWidth / 1.5);
    var fontSize = Math.floor(size / 2.75);
    var xPos = [Math.floor(center_x - size * 2.75), Math.floor(center_x - size * 1.25), 
        Math.floor(center_x + size * 0.25), Math.floor(center_x + size * 1.75)];
    var yPos = Math.floor(imgHeight * 2.45 + size);
    var pos = [];
    for (var i = 0; i < 4; i++) {
        pos[i] = "style=\"position:absolute; top:" + yPos + "px; left:" + xPos[i] + "px; ";
        pos[i] += "width:" + size + "px; height:" + size + "px; font-size:" + fontSize + "px";
        pos[i] += "; box-shadow:0px 0px " + Math.floor(size / 8) + "px 0px #000000\"";
    }
    var htmlString = "";
    htmlString += "<button " + pos[0] + " " + style + " onclick=\"wager10()\">10</button>";
    htmlString += "<button " + pos[1] + " " + style + " onclick=\"wager20()\">20</button>";
    htmlString += "<button " + pos[2] + " " + style + " onclick=\"wager50()\">50</button>";
    htmlString += "<button " + pos[3] + " " + style + " onclick=\"wager100()\">100</button>";
    document.getElementById("wager").innerHTML = htmlString;
}

function removeBetButtons() {
    document.getElementById("wager").innerHTML = "";
}

function drawActionButtons(second = false) {
    if ((second && !pSplit) || !inPlay)
        return;
    updateCenter();
    var style = "type=\"button\" class=\"button button_long\"";
    var size = Math.floor(imgWidth / 3);
    var fontSize = Math.floor(size / 2);
    var hPadding = fontSize;
    var vPadding = Math.floor(fontSize / 2);
    var textPos = "text-align:center; padding:" + vPadding + "px " + hPadding + "px";
    textPos += "; box-shadow:0px 0px " + Math.floor(size / 8) + "px 0px #000000";
    var yPosHi = Math.floor(imgHeight * 2.65 + size);
    var yPosLo = Math.floor(yPosHi + size * 1.25);
    var xPos = [
        Math.floor(center_x - size * 2.15), // hit
        Math.floor(center_x + size * 0.25), // stand
        Math.floor(center_x - size * (wager < 100 ? 4.5 : 4.75)), // double (amt)
        Math.floor(center_x + size * 0.25)  // split (amt)
    ];
    if (pSplit) {
        for (var i = 0; i < 3; i++) // split button not available if already split
            xPos[i] += Math.floor(second ? 4.75 * size : -4.75 * size);
    }
    var posHit = "style=\"position:absolute; top:" + yPosHi + "px; left:" + xPos[0] 
        + "px; height:" + size + "px; font-size:" + fontSize + "px; " + textPos + "\"";
    var posStd = "style=\"position:absolute; top:" + yPosHi + "px; left:" + xPos[1] 
        + "px; height:" + size + "px; font-size:" + fontSize + "px; " + textPos + "\"";
    var a_b = second ? "B" : "A";
    var htmlString = "";
    htmlString += "<button id=\"H" + a_b + "\" " + posHit + " " + style + " onclick=\"hit" + a_b + "()\">HIT</button>";
    htmlString += "<button id=\"S" + a_b + "\" " + posStd + " " + style + " onclick=\"stand" + a_b + "()\">STAND</button>";
    document.getElementById("actions" + a_b).innerHTML = htmlString;
    var idx = second ? 1 : 0;
    if (!pDouble[idx] && player[idx].length == 2 && bankroll >= wager) {
        var pos = "style=\"position:absolute; top:" + yPosLo + "px; left:" + xPos[2] + "px; height:" 
            + size + "px; font-size:" + fontSize + "px; " + textPos + "\"";
        document.getElementById("double" + a_b).innerHTML = "<button id=\"D" + a_b + "\" " + pos 
            + " " + style + " onclick=\"double" + a_b + "()\">DOUBLE (" + wager + ")</button>";
    }
    else
        document.getElementById("double" + a_b).innerHTML = "";
    if (!pSplit && player[1].length == 0 && player[0].length == 2 
        && cardValue(player[0][0]) == cardValue(player[0][1]) && bankroll >= wager) {
        var pos = "style=\"position:absolute; top:" + yPosLo + "px; left:" + xPos[3] + "px; height:" 
            + size + "px; font-size:" + fontSize + "px; " + textPos + "\"";
        document.getElementById("split").innerHTML = "<button id=\"P\" " + pos + " " + style 
            + " onclick=\"split()\">SPLIT (" + wager + ")</button>";
    }
    else
        document.getElementById("split").innerHTML = "";
    var recommended = getRecommendedButton(second);
    if (help && recommended != null)
        recommended.style.boxShadow = "0px 0px " + Math.floor(size / 2) + "px 0px #ffffff, "
            + "0px 0px " + Math.floor(size / 4) + "px 0px #ffffff, 0px 0px " + size + "px 0px #ffffff";
    drawOutput("Select an action  (" + bankroll + " remaining)");
}

function removeActionButtons(second = false) {
    var a_b = second ? "B" : "A";
    document.getElementById("actions" + a_b).innerHTML = "";
    document.getElementById("double" + a_b).innerHTML = "";
    document.getElementById("split").innerHTML = "";
}

function drawInsuranceButtons() {
    updateCenter();
    var type = "type=\"button\" class=\"button button_long\"";
    var size = Math.floor(imgWidth / 2.5);
    var fontSize = Math.floor(size / 2);
    var hPadding = fontSize;
    var vPadding = Math.floor(fontSize / 2);
    var pos = "text-align:center; padding:" + vPadding + "px " + hPadding + "px";
    pos += "; box-shadow:0px 0px " + Math.floor(size / 8) + "px 0px #000000";
    yPos = imgHeight * 3;
    xPosA = center_x - size * 2.8;
    xPosB = center_x + size * 0.4;
    var styleA = "style=\"position:absolute; top:" + yPos + "px; left:" + xPosA + "px; height:" 
        + size + "px; font-size:" + fontSize + "px; " + pos + "\"";
    var styleB = "style=\"position:absolute; top:" + yPos + "px; left:" + xPosB + "px; height:" 
        + size + "px; font-size:" + fontSize + "px; " + pos + "\"";
    var htmlString = "<button " + type + " " + styleA + " onclick=\"acceptInsurance()\">YES (" + (wager / 2) + ")</button>";
    htmlString += "<button id=\"no\" " + type + " " + styleB + " onclick=\"rejectInsurance()\">NO</button>";
    document.getElementById("insurance").innerHTML = htmlString;
    if (help)
        document.getElementById("no").style.boxShadow = "0px 0px " + Math.floor(size / 2) + "px 0px #ffffff, "
            + "0px 0px " + Math.floor(size / 4) + "px 0px #ffffff, 0px 0px " + size + "px 0px #ffffff";
    drawOutput("Will you make an insurance bet?  (" + bankroll + " remaining)");
}

function removeInsuranceButtons() {
    document.getElementById("insurance").innerHTML = "";
}

function drawTable() {
    updateCenter();
    var style = "type=\"button\" class=\"button_table\"";
    var xPos = Math.floor((window.innerWidth - tableWidth) / 2);
    var yPos = Math.floor((window.innerHeight - tableHeight) / 2);
    var pos = "style=\"position:absolute; top:" + yPos + "px; left:" + xPos + "px; ";
    pos += "width:" + tableWidth + "px; height:" + tableHeight + "px\"";
    document.getElementById("table").innerHTML = "<button " + pos + " " + style + " disabled></button>";
}

function removeTable() {
    document.getElementById("table").innerHTML = "";
}

// Note: this function should only be called in drawHand() and stand()
function drawSumLabel(isPlayer = true, second = false) {
    // idea: white = unfinished; blue = finished/tied; yellow & larger = blackjack; green = won; red = lost/busted
    var id = isPlayer ? (second ? "pLabelB" : "pLabelA") : "dLabel";
    var label = document.getElementById(id);
    var idx = second ? 1 : 0;
    var size = Math.floor(imgWidth / 4);
    var sum = isPlayer ? pSum[idx] : dSum;
    if (sum == 0)
        return;
    label.innerText = sum;
    label.style.fontSize = "" + size + "px";
    label.style.color = "#000000";
    label.style.textShadow = "0px 0px " + Math.floor(size / 4) + "px #ffffff, 0px 0px " 
        + Math.floor(size / 2) + "px #ffffff, 0px 0px " + size + "px #ffffff";
    if (isPlayer && ((pStand[idx] && inPlay) || (!inPlay && pSum[idx] == dSum && !dBlackjack))) {
        if (pSum[idx] <= 21)
            label.style.color = "#333399"
        else
            label.style.color = "#aa2222";
    }
    else if (!inPlay) {
        if ((isPlayer && pBlackjack) || (!isPlayer && dBlackjack)) {
            label.style.color = "#ffff77";
            label.style.textShadow = "0px 0px " + Math.floor(size / 4) + "px #000000, 0px 0px " 
                + Math.floor(size / 2) + "px #000000, 0px 0px " + size + "px #000000";
        }
        else if ((isPlayer && pSum[idx] < 22 && (dSum > 21 || pSum[idx] > dSum)) 
            || (!isPlayer && dSum < 22 && ((dSum >= pSum[0] || pSum[0] > 21) 
            || (((pSplit && dSum >= pSum[1]) || pSum[1] > 21)))))
            label.style.color = "#333399"
        else if ((isPlayer && ((dBlackjack && !pBlackjack) || pSum[idx] > 21 || pSum[idx] < dSum))
            || (!isPlayer && (dSum > 21 || (dSum < pSum[0] && (pSplit == dSum < pSum[1])))))
            label.style.color = "#aa2222";
    }
    label.style.width = "" + imgWidth + "px";
    label.style.height = "" + (size * 2) + "px";
    if (!isPlayer) {
        label.style.left = "" + (center_x - Math.floor(imgWidth / 2)) + "px";
        label.style.top = "" + imgHeight + "px";
    }
    else {
        var scale = 4.5;
        if (pSplit)
            scale += player[idx].length > 9 ? 2 : (player[idx].length > 5 ? 1 : 0);
        label.style.top = "" + Math.floor(imgHeight * scale) + "px";
        if (!pSplit)
            label.style.left = "" + (center_x - Math.floor(imgWidth / 2)) + "px";
        else {
            if (!second)
                label.style.left = "" + (center_x - Math.floor(imgWidth * 1.5)) + "px";
            else
                label.style.left = "" + (center_x + Math.floor(imgWidth / 2)) + "px";
        }
    }
}

function removeSumLabel(isPlayer = true, second = false) {
    var id = isPlayer ? (second ? "pLabelB" : "pLabelA") : "dLabel";
    document.getElementById(id).innerText = "";
}

function drawOutput(message) {
    updateCenter();
    var output = document.getElementById("output");
    var size = Math.floor(imgWidth / 4);
    output.style.color = "#ffffff";
    output.style.fontSize = "" + size + "px";
    output.style.width = "" + (imgWidth * 10) + "px";
    output.style.height = "" + (size * 2) + "px";
    output.style.left = "" + (center_x - imgWidth * 5) + "px";
    output.style.top = "" + Math.floor(size + imgHeight * 2.25) + "px";
    output.innerText = message;
    outputText = message;
}

function removeOutput() {
    document.getElementById("output").innerText = "";
}

function drawTableText() {
    updateCenter();
    var leftText = document.getElementById("leftText");
    leftText.innerText = "DEALER MUST HIT ON SOFT 17 AND UNDER";
    leftText.style.fontSize = "" + Math.floor(imgWidth / 2.5) + "px";
    leftText.style.left = "" + Math.floor(center_x - imgWidth * 6.25) + "px";
    leftText.style.top = "" + Math.floor(center_y - imgHeight * 2) + "px";
    leftText.style.width = "" + Math.floor(imgWidth * 5) + "px";
    leftText.style.transform = "rotate(-30deg)";
    var rightText = document.getElementById("rightText");
    rightText.innerText = "BLACKJACK PAYS 3 TO 2";
    rightText.style.fontSize = "" + Math.floor(imgWidth / 2.5) + "px";
    rightText.style.left = "" + Math.floor(center_x + imgWidth * 2) + "px";
    rightText.style.top = "" + Math.floor(center_y - imgHeight * 2) + "px";
    rightText.style.width = "" + Math.floor(imgWidth * 4) + "px";
    rightText.style.transform = "rotate(30deg)";
    var botText = document.getElementById("botText");
    botText.innerText = "INSURANCE PAYS 2 TO 1";
    botText.style.fontSize = "" + Math.floor(imgWidth / 2.5) + "px";
    botText.style.left = "" + Math.floor(center_x - imgWidth * 2.75) + "px";
    botText.style.top = "" + Math.floor(center_y + imgHeight * 1.75) + "px";
}

function removeTableText() {
    document.getElementById("leftText").innerText = "";
    document.getElementById("rightText").innerText = "";
    document.getElementById("botText").innerText = "";
}

function drawBackButton() {
    var backButton = genImageString("resources/back_arrow.png", 0, Math.floor(imgWidth / 3), imgWidth * 2);
    backButton = backButton.substring(0, backButton.length - 1) + " onclick=\"drawMenu()\">";
    document.getElementById("back").innerHTML = backButton;
}

function removeBackButton() {
    document.getElementById("back").innerHTML = "";
}

function drawMenu() {
    updateCenter();
    undraw();
    removeBackButton();
    view = 0;
    drawTable();
    var type = "type=\"button\" class=\"button button_long\"";
    var size = Math.floor(imgWidth / 1.25);
    var fontSize = Math.floor(size / 2);
    var width = Math.floor(imgWidth * 2.5);
    var left = center_x - width / 2;
    var top = [center_y - size, center_y + size * 0.5, center_y + size * 2];
    var text = ["PLAY", "RULES", "OPTIONS"];
    var onclick = ["drawGame()", "drawRules()", "drawOptions()"];
    var menu = document.getElementById("menu");
    menu.innerHTML = "";
    for (var i = 0; i < 3; i++) {
        var style = "style=\"text-align:center; font-size:" + fontSize + "px; width:";
        style += width + "px; height:" + size + "px; left:" + left + "px; top:" + top[i] + "px";
        style += "; box-shadow:0px 0px " + Math.floor(size / 8) + "px 0px #000000\"";
        menu.innerHTML += "<button " + type + " " + style + " onclick=\"" + onclick[i] + "\">" + text[i] + "</button>";
    }
    menu.innerHTML += genImageString(cardFilename("AC"), center_x - Math.floor(imgWidth * 5), center_y - Math.floor(imgHeight * 0.5), imgWidth * 1.5);
    document.getElementById("ace_of_clubs").style.transform = "rotate(-10deg)";
    menu.innerHTML += genImageString(cardFilename("JH"), center_x - Math.floor(imgWidth * 4), center_y - Math.floor(imgHeight * 0.5), imgWidth * 1.5);
    document.getElementById("jack_of_hearts").style.transform = "rotate(10deg)";
    menu.innerHTML += genImageString(cardFilename("JS"), center_x + Math.floor(imgWidth * 2.5), center_y - Math.floor(imgHeight * 0.5), imgWidth * 1.5);
    document.getElementById("jack_of_spades").style.transform = "rotate(-10deg)";
    menu.innerHTML += genImageString(cardFilename("AD"), center_x + Math.floor(imgWidth * 3.5), center_y - Math.floor(imgHeight * 0.5), imgWidth * 1.5);
    document.getElementById("ace_of_diamonds").style.transform = "rotate(10deg)";
    var title = document.getElementById("title");
    title.innerText = "BLACKJACK";
    title.style.fontSize = Math.floor(size * 1.5);
    title.style.left = "" + (center_x - width * 1.625) + "px";
    title.style.width = "" + (width * 3.25) + "px";
    title.style.top = "" + Math.floor(center_y - imgHeight * 3) + "px";
    title.style.opacity = "0.75";
    title.style.color = "#000000";
    title.style.paddingTop = "" + Math.floor(size * 0.25) + "px";
    title.style.paddingBottom = "" + Math.floor(size * 0.25) + "px";
    title.style.boxShadow = "0px 0px " + Math.ceil(size * 0.25) + "px 0px #000000c0";
    title.style.backgroundColor = "#ffffff40";
    title.style.textDecoration = "";
}

function removeMenu() {
    document.getElementById("menu").innerHTML = "";
    var title = document.getElementById("title");
    title.innerText = "";
    title.style.boxShadow = "";
    title.style.backgroundColor = "";
}

function drawGame() {
    updateCenter();
    undraw();
    view = 1;
    drawTable();
    drawTableText();
    drawBackButton();
    if (!inPlay) {
        drawBetButtons();
        revealDealerCard();
    }
    else {
        if (!pStand[0])
            drawActionButtons();
        drawHand(false);
    }
    drawHand();
    if (pSplit) {
        if (!pStand[1])
            drawActionButtons(true);
        drawHand(true, true);
    }
    drawOutput(outputText);
}

function removeGame() {
    removeTableText();
    removeHand(false);
    removeHand();
    removeHand(true, true);
    removeSumLabel(false);
    removeSumLabel();
    removeSumLabel(true, true);
    removeBetButtons();
    removeActionButtons();
    removeActionButtons(true);
    removeOutput();
}

function drawRules() {
    updateCenter();
    undraw();
    view = 2;
    drawBackButton();
    var size = Math.floor(imgWidth / 1.25);
    var title = document.getElementById("title");
    title.innerText = "Rules";
    title.style.textDecoration = "underline";
    title.style.color = "#ffffff";
    title.style.fontSize = Math.floor(size / 2);
    title.style.left = "" + (center_x - size * 2) + "px";
    title.style.width = "" + (size * 4) + "px";
    title.style.top = "" + Math.floor(center_y - imgHeight * 3) + "px";
    title.style.opacity = "1.0";
    var rules = document.getElementById("rules");
    rules.style.fontSize = "" + Math.floor(size / 4.25) + "px";
    rules.innerText = "1.  Before each hand, you will be asked to make an initial wager of 10, 20, 50, or 100.\n"
        + "2.  To begin each hand, you will be dealt two cards, and the dealer will be dealt two cards.\n     One of the dealer's cards will be dealt"
        + " facedown and will not be revealed until you have\n     completed your hand(s).\n"
        + "3.  Aces may be counted as 1 or 11 points, tens and face cards are worth 10 points, and 2-9\n     are worth 2-9 points respectively.\n"
        + "  a.  A hand is worth the sum of the point values of each card.\n"
        + "  b.  A \"blackjack\" is the best hand and consists of an ace with any ten-point card. This hand\n       outranks all other 21-point hands.\n"
        + "4.  If the dealer has an ace showing, you will be offered insurance. If accepted, you will pay\n     an amount equal to half your original"
        + " wager. If the dealer then has blackjack, you will\n     effectively get your money back.\n"
        + "  a.  Regardless of your choice, if the dealer has blackjack, he will reveal his facedown card\n       and the current hand will end.\n"
        + "  b.  If this happens, you will lose unless you also have blackjack, in which case you will get\n       your money back.\n"
        + "5.  For each hand, you must select one of up to four options: hit, stand, double, or split.\n"
        + "  a.  Hit - This will tell the dealer to give you one more card. You may do this as many times\n       as you wish. However, if this causes"
        + " your hand to be worth over 21, you immediately\n       lose that hand.\n"
        + "  b.  Stand - This will tell the dealer you want no more cards dealt to the hand.\n"
        + "  c.  Double - Double your wager and get dealt one, and only one, more card. This is only\n       available if you can afford it.\n"
        + "  d.  Split - Pay an additional wager and split your cards into two separate hands. Both hands\n       are dealt one card, and play continues"
        + " for each as usual. This is only available as your\n       first move when both cards are worth the same value.\n"
        + "6.  After you have completed your hand(s), the dealer will reveal his facedown card. If his\n     hand is worth 16 or less, he will draw cards"
        + " until his hand is worth 17 or more. If the\n     dealer has an ace and any number of cards totaling six points, this is known as a \"soft\n"
        + "     17,\" and the dealer will draw on this as well.\n"
        + "  a.  If the dealer's hand is worth over 21, all other hands that did not go over 21 will win.\n"
        + "  b.  If the dealer's hand is worth 21 or less, then hands worth more than the dealer's win\n       while hands worth less lose.\n"
        + "  c.  If the dealer's hand is worth the same as the player's then the money wagered for that\n       hand is returned.";
    rules.style.left = "" + (center_x - size * 6) + "px";
    rules.style.top = "" + Math.floor(imgHeight * 1.5) + "px";
    rules.style.width = "" + Math.floor(imgWidth * 10) + "px";
    rules.style.color = "#ffffff";
    rules.style.textAlign = "left";
}

function removeRules() {
    document.getElementById("title").innerText = "";
    document.getElementById("rules").innerText = "";
}

function drawOptions() {
    updateCenter();
    undraw();
    view = 3;
    drawTable();
    drawBackButton();
    var size = Math.floor(imgWidth / 1.25);
    var title = document.getElementById("title");
    title.innerText = "Options";
    title.style.textDecoration = "underline";
    title.style.color = "#ffffff";
    title.style.fontSize = Math.floor(size / 2);
    title.style.left = "" + (center_x - size * 2) + "px";
    title.style.width = "" + (size * 4) + "px";
    title.style.top = "" + Math.floor(center_y - imgHeight * 3) + "px";
    title.style.opacity = "1.0";
    var toggle = "<label class=\"toggle text unselectable\" id=\"help\"><input type=\"checkbox\" onclick=\"help=!help;\"";
    if (help)
        toggle += " checked";
    toggle += "><i></i>Give me hints</label>";
    var options = document.getElementById("options");
    options.innerHTML = "";
    options.innerHTML += toggle;
    var helpElem = document.getElementById("help");
    helpElem.style.left = "" + Math.floor(center_x - imgWidth * 1.75) + "px";
    helpElem.style.top = "" + Math.floor(center_y - imgHeight * 1.5) + "px";
    helpElem.style.fontSize = "" + Math.floor(size * 0.4) + "px";
    helpElem.style.color = "#ffffff";
    options.innerHTML += "<p id=\"color\" class=\"text unselectable\">Select a card design</p>";
    var color = document.getElementById("color");
    color.style.left = "" + Math.floor(center_x - imgWidth * 1.75) + "px";
    color.style.top = "" + Math.floor(center_y - imgHeight / 1.5) + "px";
    color.style.fontSize = "" + Math.floor(size * 0.4) + "px";
    color.style.color = "#ffffff";
    var name = ["red", "green", "blue"];
    var onclick = ["selectRed()", "selectGreen()", "selectBlue()"];
    var xPos = [
        Math.floor(center_x - imgWidth * 10.5 / 4), 
        Math.floor(center_x - imgWidth * 0.75), 
        Math.floor(center_x + imgWidth * 4.5 / 4)
    ];
    var yPos = Math.floor(center_y);
    for (var i = 0; i < 3; i++) {
        options.innerHTML += genImageString("resources/cards/back_" + name[i] + ".png", xPos[i], yPos, 
            imgWidth * 1.5, 0, name[i] != backColor ? onclick[i] : "");
        var element = document.getElementById("back_" + name[i]);
        if (name[i] != backColor)
            element.className = "selectable";
        else
            element.style.boxShadow = "0 0 " + Math.floor(imgWidth / 12) + "px " + Math.floor(imgWidth / 16) + "px #ffa500";
    }
}

function removeOptions() {
    document.getElementById("title").innerText = "";
    document.getElementById("options").innerHTML = "";
}

function selectRed() { backColor = "red"; redraw(); }
function selectGreen() { backColor = "green"; redraw(); }
function selectBlue() { backColor = "blue"; redraw(); }

function redraw() {
    switch (view) {
        case 1:
            drawGame();
            break;
        case 2:
            drawRules();
            break;
        case 3:
            drawOptions();
            break;
        default:
            drawMenu();
    }
}

function undraw() {
    switch (view) {
        case 1:
            removeGame();
            break;
        case 2:
            removeRules();
            break;
        case 3:
            removeOptions();
            break;
        default:
            removeMenu();
    }
}