/**
 *  Return a random integer between 0 (inclusive) and max (exclusive).
 *
 *  @param max      integer value of upper limit
 *  @return  a randomly selected integer value
 */
function randomInteger(max) {
    return Math.floor(Math.random() * max);
}


/**
 *  Return a random integer between min (inclusive) and max (inclusive if possible).
 *  Optionally, return only integers along an interval defined by step (default 1).
 *      i.e. min=4, max=18, step=2.5 would randomly select from the set {4, 6.5, 9, 11.5, 14, 16.5}.
 *
 *  @param min      integer value of minimum number (inclusive)
 *  @param max      integer value of maximum number (inclusive if possible)
 *  @param step     (optional) value of step interval (default 1)
 *  @return  a randomly selected value along the specified interval
 */
function randomRange(min, max, step = 1) {
    // 1. A{max - min} gives the size of the interval
    // 2. B{A + step} so max can be included in this interval
    // 3. C{B / step} if 0 > step > 1, this will lengthen the interval, otherwise it will shorten it
    // 4. D{Math.floor(Math.random() * C)} choose a random integer value among this interval
    // 5. E{D * step} multiply by the step size
    // 6. F{E + min} add the minimum
    return Math.floor(Math.random() * (max - min + step) / step) * step + min;
}


/**
*  Randomly select a single element from an array.
*
*  @param list     the array to select from
*  @return  a random element in the array
*/
function randomSelect(list) {
    return list[Math.floor(Math.random() * list.length)]
}


/**
 *  Randomly shuffle the given array.
 *  This function will not alter the given array.
 *
 *  @param list    the array to be shuffled
 *  @return  an array with the same elements randomly ordered
 */
function randomShuffle(list) {
    var arr = list.slice(); // this makes a shallow copy of {list}
    for (var count = list.length; count > 1; count--) {
        // select a random element from the front of the array and replace it with the element at list[size]
        //   --repeat this until count is 2 (skip swapping the last element with itself)
        var idx = Math.floor(Math.random() * count);
        if (idx == count - 1)
            continue; // skip if this would swap list[size-1] with itself
        // swap the two elements
        var temp = list[count - 1];
        list[count - 1] = list[idx];
        list[idx] = temp;
    }
    return arr;
}


/**
 *  Generates a subset of {len} elements of the given array without replacement and ordered randomly.
 *  This means there will be no repeated elements unless the given array has repeated elements.
 *  If {len} is not specified, this function creates a shuffled copy of the given array (or if {len > list.length}).
 *  This function will not alter the given array.
 *
 *  @param list     the array to sample
 *  @param len      (optional) integer value representing size of sample
 *  @return  an array of length {len} populated with random elements from {list}
 */
function randomSubset(list, len = list.length) {
    // enforce the maximum value to be the size of the given array
    if (len > list.length)
        len = list.length;
    var sample = list.slice(); // this makes a shallow copy of {list}
    for (var i = 0; i < len; i++) {
        var size = list.length - 1 - i; // index of last unshuffled element
        // select a random element from the front of the array and replace it with the element at list[size]
        //   --repeat this until enough elements have been randomly swapped (skip swapping the last element with itself)
        var idx = Math.floor(Math.random() * size);
        // swap the two elements
        var temp = sample[size - 1];
        sample[size - 1] = sample[idx];
        sample[idx] = temp;
    }
    return sample.slice(-len);
}


/**
 *  Generates a sample array of {len} elements selected randomly with replacement from the given array.
 *  This function will not alter the given array.
 *
 *  @param list     the array to sample
 *  @param len      integer value representing size of sample
 *  @return  an array of length {len} populated with random elements from {list}
 */
function randomSample(list, len) {
    var sample = [];
    for (var i = 0; i < len; i++)
        sample.push(list[Math.floor(Math.random() * list.length)]);
    return sample;
}


/**
 *  Generates a random boolean value.
 *
 *  @return  true or false randomly
 */
function randomBoolean() {
    return Math.random() < 0.5;
}


/**
 *  Uniformily generate a random floating point number between min(inclusive) and max(inclusive).
 *      Note: Maximum may not be included exactly depending on how floating point numbers are rounded.
 *
 *  @param min      minimum value
 *  @param max      maximum value
 *  @return  a random floating point value between the given values
 */
function randomUniform(min, max) {
    return Math.random() * (max - min) + min;
}


/**
 *  Generate a random floating point value along a normal distribution.
 *  This function uses the Box-Muller transformation to achieve this distribution.
 * 
 *  @return  a random floating point value along a normal distribution
 */
function randomNormal() {
    var u = 0;
    var v = 0;
    while (u == 0)
        u = Math.random();
    while (v == 0)
        v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}


/**
 *  Generate a random floating point value along a gaussian distribution given mu and sigma.
 *  This function uses the Box-Muller transformation to achieve this distribution.
 * 
 *  @return  a random floating point value along the specified gaussian distribution
 */
function randomGauss(mu, sigma) {
    var u = 0;
    var v = 0;
    while (u == 0)
        u = Math.random();
    while (v == 0)
        v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * sigma + mu;
}


/**
 *  Randomly generate a color in RBG.
 *
 *  @return  a string representation of the random color
 */
function randomRGB() {
    // constant array of all possible hexadecimal values
    const val = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    var result = "#";
    for (var i = 0; i < 6; i++)
        result += val[Math.floor(Math.random() * 16)]; // append a random hex value 6 times
    return result;
}


/**
 *  Randomly generate a color in RBG with opacity.
 *
 *  @return  a string representation of the random color
 */
    function randomRGBA() {
    // constant array of all possible hexadecimal values
    const val = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    var result = "#";
    for (var i = 0; i < 8; i++)
        result += val[Math.floor(Math.random() * 16)]; // append a random hex value 8 times
    return result;
}


/**
 *  Randomly select one of 140 color names supported by all browsers.
 *
 *  @return  a string with the name of a random color
 */
function randomNamedColor() {
    const list = [
        "AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black",
        "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse",
        "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue",
        "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta",
        "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen",
        "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink",
        "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen",
        "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green",
        "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender",
        "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan",
        "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon",
        "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue",
        "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine",
        "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue",
        "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream",
        "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange",
        "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed",
        "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple",
        "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen",
        "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow",
        "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet",
        "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"
    ];
    return list[Math.floor(Math.random() * list.length)];
}