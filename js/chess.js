//////////////////////////////////
////  BITBOARD FUNCTIONALITY  ////
//////////////////////////////////


//  This class holds a 64-bit unsigned integer which represent a chess board
//  Creating a BitBoard object is a bit slow, but once created, its built-in
//  operations are designed to execute very quickly on other BitBoard objects.
//  The bit corresponding to each square is as follows:

class BitBoard {
    static empty = new BitBoard()
    static lookup = [
        BitBoard.fromHex("1"), BitBoard.fromHex("2"), BitBoard.fromHex("4"), BitBoard.fromHex("8"),
        BitBoard.fromHex("10"), BitBoard.fromHex("20"), BitBoard.fromHex("40"), BitBoard.fromHex("80"),
        BitBoard.fromHex("100"), BitBoard.fromHex("200"), BitBoard.fromHex("400"), BitBoard.fromHex("800"),
        BitBoard.fromHex("1000"), BitBoard.fromHex("2000"), BitBoard.fromHex("4000"), BitBoard.fromHex("8000"),
        BitBoard.fromHex("10000"), BitBoard.fromHex("20000"), BitBoard.fromHex("40000"), BitBoard.fromHex("80000"),
        BitBoard.fromHex("100000"), BitBoard.fromHex("200000"), BitBoard.fromHex("400000"), BitBoard.fromHex("800000"),
        BitBoard.fromHex("1000000"), BitBoard.fromHex("2000000"), BitBoard.fromHex("4000000"), BitBoard.fromHex("8000000"),
        BitBoard.fromHex("10000000"), BitBoard.fromHex("20000000"), BitBoard.fromHex("40000000"), BitBoard.fromHex("80000000"),
        BitBoard.fromHex("100000000"), BitBoard.fromHex("200000000"), BitBoard.fromHex("400000000"), 
        BitBoard.fromHex("800000000"), BitBoard.fromHex("1000000000"), BitBoard.fromHex("2000000000"),
        BitBoard.fromHex("4000000000"), BitBoard.fromHex("8000000000"), BitBoard.fromHex("10000000000"),
        BitBoard.fromHex("20000000000"), BitBoard.fromHex("40000000000"), BitBoard.fromHex("80000000000"),
        BitBoard.fromHex("100000000000"), BitBoard.fromHex("200000000000"), BitBoard.fromHex("400000000000"),
        BitBoard.fromHex("800000000000"), BitBoard.fromHex("1000000000000"), BitBoard.fromHex("2000000000000"),
        BitBoard.fromHex("4000000000000"), BitBoard.fromHex("8000000000000"), BitBoard.fromHex("10000000000000"), 
        BitBoard.fromHex("20000000000000"), BitBoard.fromHex("40000000000000"), BitBoard.fromHex("80000000000000"),
        BitBoard.fromHex("100000000000000"), BitBoard.fromHex("200000000000000"), BitBoard.fromHex("400000000000000"), 
        BitBoard.fromHex("800000000000000"), BitBoard.fromHex("1000000000000000"), BitBoard.fromHex("2000000000000000"),
        BitBoard.fromHex("4000000000000000"), BitBoard.fromHex("8000000000000000")
    ]

    constructor(lower24=0, middle16=0, upper24=0) {
        this.lo_ = lower24
        this.md_ = middle16
        this.hi_ = upper24
    }

    static fromHex(hex="0") {
        if (hex.startsWith("0x"))
            hex = hex.substring(2)
        if (hex.length < 16)
            hex = "0000000000000000".substring(0, 16 - hex.length) + hex
        var hi = Number("0x" + hex.substring(0, 6))
        var md = Number("0x" + hex.substring(6, 10))
        var lo = Number("0x" + hex.substring(10, 16))
        return new BitBoard(lo, md, hi)
    }

    static fromSquare(square) {
        if (square === -1)
            return new BitBoard()
        var board = this.lookup[square]
        return new BitBoard(board.lo_, board.md_, board.hi_)
    }

    static compliment(board) {
        return new BitBoard(~board.lo_, ~board.md_, ~board.hi_)
    }

    static and(first, second) {
        return new BitBoard(
            first.lo_ & second.lo_,
            first.md_ & second.md_,
            first.hi_ & second.hi_
        )
    }

    static or(first, second) {
        return new BitBoard(
            first.lo_ | second.lo_,
            first.md_ | second.md_,
            first.hi_ | second.hi_
        )
    }

    static xor(first, second) {
        return new BitBoard(
            first.lo_ ^ second.lo_,
            first.md_ ^ second.md_,
            first.hi_ ^ second.hi_
        )
    }

    static delete(first, second) {
        return new BitBoard(
            (first.lo_ | second.lo_) ^ second.lo_,
            (first.md_ | second.md_) ^ second.md_,
            (first.hi_ | second.hi_) ^ second.hi_
        )
    }

    and(other) {
        this.lo_ = this.lo_ & other.lo_
        this.md_ = this.md_ & other.md_
        this.hi_ = this.hi_ & other.hi_
        return this
    }

    or(other) {
        this.lo_ = this.lo_ | other.lo_
        this.md_ = this.md_ | other.md_
        this.hi_ = this.hi_ | other.hi_
        return this
    }

    xor(other) {
        this.lo_ = this.lo_ ^ other.lo_
        this.md_ = this.md_ ^ other.md_
        this.hi_ = this.hi_ ^ other.hi_
        return this
    }

    delete(other) {
        this.lo_ = (this.lo_ | other.lo_) ^ other.lo_
        this.md_ = (this.md_ | other.md_) ^ other.md_
        this.hi_ = (this.hi_ | other.hi_) ^ other.hi_
        return this
    }

    invert() {
        this.lo_ = ~this.lo_
        this.md_ = ~this.md_
        this.hi_ = ~this.hi_
        return this
    }

    isEmpty() {
        return (this.lo_ | this.md_ | this.hi_) === 0
    }

    toArray() {
        var arr = []
        for (var shift = 0; shift < 24; shift += 1) {
            var mask = 1 << shift
            if (shift < 16) {
                if (this.md_ & mask)
                    arr.push(shift + 24)
            }
            if (this.lo_ & mask)
                arr.push(shift)
            if (this.hi_ & mask)
                arr.push(shift + 40)
        }
        arr.sort()
        return arr
    }

    rotate180() {
        var lo = 0, md = 0, hi = 0
        for (var i = 0; i < 24; i++) {
            mask = 1 << i
            if (i < 16)
                md = (md << 1) | ((this.md_ & mask) ? 1 : 0)
            lo = (lo << 1) | ((this.hi_ & mask) ? 1 : 0)
            hi = (hi << 1) | ((this.lo_ & mask) ? 1 : 0)
        }
        this.lo_ = lo
        this.md_ = md
        this.hi_ = hi
        return this
    }

    count() {
        var count = 0
        for (var i = 0; i < 24; i++) {
            var mask = 1 << i
            if (i < 16)
                count += (this.md_ & mask) ? 1 : 0
            count += (this.hi_ & mask) ? 1 : 0
            count += (this.lo_ & mask) ? 1 : 0
        }
        return count
    }

    copy() {
        return new BitBoard(this.lo_, this.md_, this.hi_)
    }
}



////////////////////////////////
////  CODE FOR CHESS LOGIC  ////
////////////////////////////////


const piece_names = ["P", "N", "B", "R", "Q", "K"]
const square_names = [ 
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
]
const idString = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
    "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "-", "+", "#"
]   //  makes it technically possible to set up a board with 64 of the same piece and color
    //  in practice, the game should recognize something like that as an illegal board state


//  This program uses multiple different board representations.
//  For display, it uses FEN notation to place pieces on the board.
const default_start_position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

//  For calculating moves, it uses a bitboard representation, including a
//  preloaded list of legal moves which is stored in a separate file.
//  Since Javascript Numbers cannot accurately represent a 64-bit integer,
//  it instead uses a a custom BitBoard class to hold these values.
const check_valid_castle_WK = BitBoard.fromHex("6000000000000000")
const check_valid_castle_WQ = BitBoard.fromHex("e00000000000000")
const check_valid_castle_WQx = BitBoard.fromHex("c00000000000000")
const check_valid_castle_BK = BitBoard.fromHex("60")
const check_valid_castle_BQ = BitBoard.fromHex("e")
const check_valid_castle_BQx = BitBoard.fromHex("c")

var boardState = null


class BoardState {
    //  Essential for defining the current state of the game
    whiteToMove = true
    white_can_castle_kingside = true
    white_can_castle_queenside = true
    black_can_castle_kingside = true
    black_can_castle_queenside = true
    en_passant_target_square = -1
    pawn_to_promote = -1
    fifty_move_rule_count = 0  // this will actually increment to 100 (counting half-moves)
    turn_counter = 1
    result = null
    
    //  Dictionary-like objects useful for fast lookup of information about each piece
    whitePieces = new Object()
    blackPieces = new Object()
    squareIDs = new Array(64)

    //  Useful dictionary-like objects for calculating and recording moves
    legalMoves = new Object()
    uniquePositionCount = new Object()
    positionHistory = []
    moveHistory = []

    //  Other useful information to help make move calculations quicker
    attacked_by_white = new BitBoard()
    attacked_by_black = new BitBoard()
    occupied_by_white = new BitBoard()
    occupied_by_black = new BitBoard()
    occupied = new BitBoard()

    //  Only used for outputting the game in PGN format
    event = "?"
    site = "pueblak.github.io/Chess"
    date = "?"
    round = "?"
    whiteName = "White"
    blackName = "Black"

    constructor(startPosition="", fromState=null) {
        const numbers = ["1", "2", "3", "4", "5", "6", "7", "8"]
        if (startPosition === "" && fromState !== null) {
            this.whiteToMove = fromState.whiteToMove
            this.white_can_castle_kingside = fromState.white_can_castle_kingside
            this.white_can_castle_queenside = fromState.white_can_castle_queenside
            this.black_can_castle_kingside = fromState.black_can_castle_kingside
            this.black_can_castle_queenside = fromState.black_can_castle_queenside
            this.en_passant_target_square = fromState.en_passant_target_square
            this.pawn_to_promote = fromState.pawn_to_promote
            this.fifty_move_rule_count = fromState.fifty_move_rule_count
            this.turn_counter = fromState.turn_counter
            this.result = fromState.result

            //  BitBoard instances must be deep copied so as not to affect the original
            this.attacked_by_white = fromState.attacked_by_white.copy()
            this.attacked_by_black = fromState.attacked_by_black.copy()
            this.occupied_by_white = fromState.occupied_by_white.copy()
            this.occupied_by_black = fromState.occupied_by_black.copy()
            this.occupied = fromState.occupied.copy()

            //  These objects are simple enough that they can be converted to JSON without data loss
            this.whitePieces = JSON.parse(JSON.stringify(fromState.whitePieces))
            this.blackPieces = JSON.parse(JSON.stringify(fromState.blackPieces))
            this.squareIDs = JSON.parse(JSON.stringify(fromState.squareIDs))
            this.uniquePositionCount = JSON.parse(JSON.stringify(fromState.uniquePositionCount))
            this.positionHistory = JSON.parse(JSON.stringify(fromState.positionHistory))

            //  As an Object containing BitBoards, each element must be deep copied individually into this one
            this.legalMoves = new Object()
            var keys = Object.keys(fromState.legalMoves)
            for (var k = 0; k < keys.length; k++)
                this.legalMoves[keys[k]] = fromState.legalMoves[keys[k]].copy()
        } else {
            if (startPosition === "")
                startPosition = default_start_position
            this.whitePieces = { "K": [], "Q": [], "R": [], "B": [], "N": [], "P": [] }
            this.blackPieces = { "K": [], "Q": [], "R": [], "B": [], "N": [], "P": [] }
            var pieceIDs = []
            var board = startPosition.split(" ")[0]
            var currSquare = 0
            for (var p = 0; p < board.length; p++) {
                var symbol = board.charAt(p)
                if (symbol === "/")
                    continue
                else if (numbers.includes(symbol)) {
                    currSquare += Number(symbol)
                    continue
                }
                var isWhite = piece_names.includes(symbol)
                var pieces = isWhite ? this.whitePieces : this.blackPieces
                if (!isWhite)
                    symbol = symbol.toUpperCase()
                var pieceID = symbol + idString[pieces[symbol].length] + (isWhite ? "W" : "B")
                pieces[symbol].push(currSquare)
                pieces[currSquare] = symbol
                pieceIDs.push(pieceID)
                pieces[pieceID] = currSquare
                this.squareIDs[currSquare] = pieceID
                var occ = isWhite ? this.occupied_by_white : this.occupied_by_black
                occ.or(BitBoard.fromSquare(currSquare))
                this.occupied.or(BitBoard.fromSquare(currSquare))
                currSquare += 1
            }
            this.positionHistory.push(startPosition)
            this.uniquePositionCount[startPosition.split(" ")[0]] = 1
            this.white_can_castle_kingside = false
            this.white_can_castle_queenside = false
            this.black_can_castle_kingside = false
            this.black_can_castle_queenside = false
            this.whiteToMove = startPosition.split(" ")[1] === "w"
            var castling = startPosition.split(" ")[2]
            if (castling !== "-") {
                for (var c = 0; c < castling.length; c++) {
                    var char = castling.charAt(c)
                    if (char === "K")
                        this.white_can_castle_kingside = true
                    else if (char === "Q")
                        this.white_can_castle_queenside = true
                    else if (char === "k")
                        this.black_can_castle_kingside = true
                    else if (char === "q")
                        this.black_can_castle_queenside = true
                }
            }
            var en_passant = startPosition.split(" ")[3]
            if (en_passant === "-")
                this.en_passant_target_square = -1
            else
                this.en_passant_target_square = square_names.indexOf(en_passant)
            this.fifty_move_rule_count = Number(startPosition.split(" ")[4])
            this.turn_counter = Number(startPosition.split(" ")[5])
            this.legalMoves = new Object()
            for (var id = 0; id < pieceIDs.length; id++)
                this.legalMoves[pieceIDs[id]] = new BitBoard()
            this.updateLegalMoves()
            this.updateResult()
        }
    }

    updateLegalMoves() {
        this.updateAttackedSquares()
        this.updatePseudoLegalMoves()
        this.confirmMoveLegality()
    }
    
    updateAttackedSquares() {
        this.attacked_by_white = new BitBoard()
        this.attacked_by_black = new BitBoard()
        var pieceIDs = Object.keys(this.legalMoves)
        for (var id = 0; id < pieceIDs.length; id++) {
            var pieceID = pieceIDs[id]
            var type = pieceID.charAt(0)
            var isWhite = pieceID.charAt(2) === "W"
            if (type !== "P") {
                var attacked = isWhite ? this.attacked_by_white : this.attacked_by_black
                if (type === "K")
                    attacked.or(this.calculateKingMoves(pieceID))
                else if (type === "N")
                    attacked.or(this.calculateKnightMoves(pieceID))
                else if (type === "B")
                    attacked.or(this.calculateBishopMoves(pieceID))
                else if (type === "R")
                    attacked.or(this.calculateRookMoves(pieceID))
                else if (type === "Q")
                    attacked.or(this.calculateQueenMoves(pieceID))
                continue
            }
            // only include squares that the pawn can attack
            var square = (isWhite ? this.whitePieces : this.blackPieces)[pieceID]
            if ((isWhite && square < 8) || (!isWhite && square > 55))
                continue // pawn about to promote cannot attack
            if (square % 8 !== 0) { // attacking left
                if (isWhite)
                    this.attacked_by_white.or(BitBoard.fromSquare(square - 9))
                else
                    this.attacked_by_black.or(BitBoard.fromSquare(square + 7))
            }
            if (square % 8 !== 7) { // attacking right
                if (isWhite)
                    this.attacked_by_white.or(BitBoard.fromSquare(square - 7))
                else
                    this.attacked_by_black.or(BitBoard.fromSquare(square + 9))
            }
        }
    }

    updatePseudoLegalMoves() {
        var ids = Object.keys(this.legalMoves)
        for (var id = 0; id < ids.length; id++) {
            var pieceID = ids[id]
            if ((pieceID.charAt(2) === "W") !== this.whiteToMove) {
                this.legalMoves[pieceID] = new BitBoard()
                continue
            }
            var occupied = pieceID.charAt(2) === "W" ? this.occupied_by_white : this.occupied_by_black
            switch (pieceID.charAt(0)) {
                case "P":
                    this.legalMoves[pieceID] = this.calculatePawnMoves(pieceID)
                    break
                case "B":
                    this.legalMoves[pieceID] = this.calculateBishopMoves(pieceID).delete(occupied)
                    break
                case "N":
                    this.legalMoves[pieceID] = this.calculateKnightMoves(pieceID).delete(occupied)
                    break
                case "R":
                    this.legalMoves[pieceID] = this.calculateRookMoves(pieceID).delete(occupied)
                    break
                case "Q":
                    this.legalMoves[pieceID] = this.calculateQueenMoves(pieceID).delete(occupied)
                    break
                case "K":
                    this.legalMoves[pieceID] = this.calculateKingMoves(pieceID).delete(occupied)
                    break
            }
        }
    }
    
    confirmMoveLegality() {
        var keys = Object.keys(this.legalMoves)
        for (var k = 0; k < keys.length; k++) {
            var pieceID = keys[k]
            var pieceName = pieceID.charAt(0)
            var pieceColor = pieceID.charAt(2)
            var isWhite = pieceColor === "W"
            var oldSquare = (isWhite ? this.whitePieces : this.blackPieces)[pieceID]
            var moves = this.legalMoves[pieceID].toArray()
            for (var m = 0; m < moves.length; m++) {
                var simulated = new BoardState("", this)
                simulated.playMove(pieceName, pieceColor, oldSquare, moves[m], false)
                simulated.updateAttackedSquares()
                var kingSquare = (isWhite ? simulated.whitePieces : simulated.blackPieces)["K"][0]
                var attacked = isWhite ? simulated.attacked_by_black : simulated.attacked_by_white
                if (!attacked.and(BitBoard.fromSquare(kingSquare)).isEmpty())
                    this.legalMoves[pieceID].delete(BitBoard.fromSquare(moves[m]))
            }
        }
    }

    calculatePawnMoves(pieceID) {
        var isWhite = pieceID.charAt(2) === "W"
        var pieces = isWhite ?this. whitePieces : this.blackPieces
        var other = isWhite ? this.blackPieces : this.whitePieces
        var square = pieces[pieceID]
        var rank = Math.floor(square / 8)
        if (rank === (isWhite ? 0 : 7))
            return new BitBoard()
        var forward = BitBoard.fromSquare(square + (isWhite ? -8 : 8))
        if (rank === (isWhite ? 6 : 1) && !BitBoard.delete(forward, this.occupied).isEmpty())
            forward.or(BitBoard.fromSquare(square + (isWhite ? -16 : 16)))
        forward.delete(this.occupied) // cannot move forward into occupied square
        var left = new BitBoard()
        if (square % 8 !== 0) {
            var target = square + (isWhite ? -9 : 7)
            if (target === this.en_passant_target_square || target in other)
                left = BitBoard.fromSquare(target)
        }
        var right = new BitBoard()
        if (square % 8 !== 7) {
            var target = square + (isWhite ? -7 : 9)
            if (target === this.en_passant_target_square || target in other)
                right = BitBoard.fromSquare(target)
        }
        return forward.or(left).or(right)
    }
    
    calculateKnightMoves(pieceID) {
        var isWhite = pieceID.charAt(2) === "W"
        var pieces = isWhite ? this.whitePieces : this.blackPieces
        var square = pieces[pieceID]
        var rank = Math.floor(square / 8)
        var file = square % 8
        var moves = new BitBoard()
        if (rank > 0 && file < 6) // right2-up1
            moves.or(BitBoard.fromSquare(square - 6))
        if (rank > 1 && file < 7) // up2-right1
            moves.or(BitBoard.fromSquare(square - 15))
        if (rank > 1 && file > 0) // up2-left1
            moves.or(BitBoard.fromSquare(square - 17))
        if (rank > 0 && file > 1) // left2-up1
            moves.or(BitBoard.fromSquare(square - 10))
        if (rank < 7 && file > 1) // left2-down1
            moves.or(BitBoard.fromSquare(square + 6))
        if (rank < 6 && file > 0) // down2-left1
            moves.or(BitBoard.fromSquare(square + 15))
        if (rank < 6 && file < 7) // down2-right1
            moves.or(BitBoard.fromSquare(square + 17))
        if (rank < 7 && file < 6) // right2-down1
            moves.or(BitBoard.fromSquare(square + 10))
        return moves
    }
    
    calculateSlidingMoves(pieceID, type) {
        var isWhite = pieceID.charAt(2) === "W"
        var pieces = isWhite ? this.whitePieces : this.blackPieces
        var opp = isWhite ? this.blackPieces : this.whitePieces
        var square = pieces[pieceID]
        var checkMoves = sliding_moves[type][square_names[square]]
        var moves = new BitBoard()
        for (var dir = 0; dir < 4; dir++) {
            for (var m = 0; m < checkMoves[dir].length; m++) {
                var move = checkMoves[dir][m]
                moves.or(BitBoard.fromSquare(move))
                if (move in pieces || move in opp)
                    break
            }
        }
        return moves
    }
    
    calculateBishopMoves(pieceID) {
        return this.calculateSlidingMoves(pieceID, "B")
    }
    
    calculateRookMoves(pieceID) {
        return this.calculateSlidingMoves(pieceID, "R")
    }
    
    calculateQueenMoves(pieceID) {
        return this.calculateSlidingMoves(pieceID, "B").or(
            this.calculateSlidingMoves(pieceID, "R")
        )
    }
    
    calculateKingMoves(pieceID) {
        var isWhite = pieceID.charAt(2) === "W"
        var pieces = isWhite ? this.whitePieces : this.blackPieces
        var square = pieces[pieceID]
        var left = (square % 8) > 0
        var right = (square % 8) < 7
        var up = Math.floor(square / 8) > 0
        var down = Math.floor(square / 8) < 7
        var moves = new BitBoard()
        if (left)
            moves.or(BitBoard.fromSquare(square - 1))
        if (up)
            moves.or(BitBoard.fromSquare(square - 8))
        if (right)
            moves.or(BitBoard.fromSquare(square + 1))
        if (down)
            moves.or(BitBoard.fromSquare(square + 8))
        if (up && left)
            moves.or(BitBoard.fromSquare(square - 9))
        if (up && right)
            moves.or(BitBoard.fromSquare(square - 7))
        if (down && left)
            moves.or(BitBoard.fromSquare(square + 7))
        if (down && right)
            moves.or(BitBoard.fromSquare(square + 9))
        if (isWhite) {
            if (!BitBoard.fromSquare(square).and(this.attacked_by_black).isEmpty()) {
                return moves
            }
            if (this.white_can_castle_kingside &&
                BitBoard.and(check_valid_castle_WK, this.occupied).isEmpty() &&
                BitBoard.and(check_valid_castle_WK, this.attacked_by_black).isEmpty())
                moves.or(BitBoard.fromSquare(62))
            if (this.white_can_castle_queenside &&
                BitBoard.and(check_valid_castle_WQ, this.occupied).isEmpty() &&
                BitBoard.and(check_valid_castle_WQx, this.attacked_by_black).isEmpty())
                moves.or(BitBoard.fromSquare(58))
        } else {
            if (!BitBoard.fromSquare(square).and(this.attacked_by_white).isEmpty()) {
                return moves
            }
            if (this.black_can_castle_kingside &&
                BitBoard.and(check_valid_castle_BK, this.occupied).isEmpty() &&
                BitBoard.and(check_valid_castle_BK, this.attacked_by_white).isEmpty())
                moves.or(BitBoard.fromSquare(6))
            if (this.black_can_castle_queenside &&
                BitBoard.and(check_valid_castle_BQ, this.occupied).isEmpty() &&
                BitBoard.and(check_valid_castle_BQx, this.attacked_by_white).isEmpty())
                moves.or(BitBoard.fromSquare(2))
        }
        return moves
    }

    updateResult() {
        var allLegalMoves = new BitBoard()
        var pieceIDs = Object.keys(this.legalMoves)
        for (var id = 0; id < pieceIDs.length; id++) {
            if ((pieceIDs[id].charAt(2) === "W") === this.whiteToMove)
                allLegalMoves.or(this.legalMoves[pieceIDs[id]])
        }
        if (allLegalMoves.isEmpty()) {
            var kingSquare = (this.whiteToMove ? this.whitePieces : this.blackPieces)["K"][0]
            var attacked = this.whiteToMove ? this.attacked_by_black : this.attacked_by_white
            if (!BitBoard.fromSquare(kingSquare).and(attacked).isEmpty()) // checkmate
                this.result = this.whiteToMove ? -1 : 1
            else // stalemate
                this.result = 0
            return
        }
        if (this.fifty_move_rule_count === 100 || this.checkThreefoldRepetition()) // forced draw
            this.result = 0
    }

    checkThreefoldRepetition() {
        // NOTE TO SELF: also need to check for insufficient material
        var positions = Object.keys(this.uniquePositionCount)
        for (var p = 0; p < positions.length; p++) {
            if (this.uniquePositionCount[positions[p]] === 3)
                return true
        }
        return false
    }
    
    outputFEN() {
        var fen = ""
        var emptyCount = 0
        for (var s = 0; s < 64; s++) {
            if (s in this.blackPieces) {
                if (emptyCount > 0)
                    fen += emptyCount
                fen += this.blackPieces[s].toLowerCase()
                emptyCount = 0
            } else if (s in this.whitePieces) {
                if (emptyCount > 0)
                    fen += emptyCount
                fen += this.whitePieces[s]
                emptyCount = 0
            } else {
                emptyCount++
            }
            if (s % 8 === 7) {
                if (emptyCount > 0)
                    fen += emptyCount
                emptyCount = 0
                if (s < 63)
                    fen += "/"
            }
        }
        fen += this.whiteToMove ? " w " : " b "
        var castle = ""
        if (this.white_can_castle_kingside)
            castle += "K"
        if (this.white_can_castle_queenside)
            castle += "Q"
        if (this.black_can_castle_kingside)
            castle += "k"
        if (this.black_can_castle_queenside)
            castle += "q"
        if (castle === "")
            castle = "-"
        fen += castle + " "
        if (this.en_passant_target_square === -1)
            fen += "- "
        else
            fen += square_names[this.en_passant_target_square] + " "
        fen += this.fifty_move_rule_count + " " + this.turn_counter
        return fen
    }

    outputPGN() {
        var pgnString = "[Event \"" + this.event + "\"]\n"
        pgnString += "[Site \"" + this.site + "\"]\n"
        pgnString += "[Date \"" + this.date + "\"]\n"
        pgnString += "[Round \"" + this.round + "\"]\n"
        pgnString += "[White \"" + this.whiteName + "\"]\n"
        pgnString += "[Black \"" + this.blackName + "\"]\n"
        var resultString = "*"
        if (this.result === 0)
            resultString = "1/2-1/2"
        else if (this.result === -1)
            resultString = "0-1"
        else if (this.result === 1)
            resultString = "1-0"
        pgnString += "[Result \"" + resultString + "\"]\n\n"
        for (var m = 0; m < this.moveHistory.length; m++) {
            if (m % 2 === 0)
                pgnString += (Math.floor(m / 2) + 1) + ". "
            pgnString += this.moveHistory[m] + " "
        }
        pgnString += resultString
        return pgnString
    }

    playMove(pieceName, pieceColor, oldSquare, newSquare, updateMoves=true) {
        var isWhite = pieceColor.toLowerCase().startsWith("w")
        var pieces = isWhite ? this.whitePieces : this.blackPieces
        var other = isWhite ? this.blackPieces : this.whitePieces
        var index = pieces[pieceName].indexOf(oldSquare)
        if (index === -1) // piece does not exist at oldSquare (should never actually happen)
            return false
        var pieceID = this.squareIDs[oldSquare]
        pieces[pieceName][index] = newSquare
        pieces[pieceID] = newSquare
        pieces[newSquare] = pieceName
        delete pieces[oldSquare]
        if (pieceName === "P")
            this.fifty_move_rule_count = 0
        else if (updateMoves)
            this.fifty_move_rule_count += 1
        // special case for castling
        if (pieceName === "K") {
            if (isWhite) {
                if (oldSquare === 60) {
                    if (newSquare === 62) // kingside castle
                        this.playMove("R", "white", 63, 61, false)
                    else if (newSquare === 58) // queenside
                        this.playMove("R", "white", 56, 59, false)
                }
                this.white_can_castle_kingside = false
                this.white_can_castle_queenside = false
            } else {
                if (oldSquare === 4) {
                    if (newSquare === 6) // kingside castle
                        this.playMove("R", "black", 7, 5, false)
                    else if (newSquare === 2) // queenside
                        this.playMove("R", "black", 0, 3, false)
                }
                this.black_can_castle_kingside = false
                this.black_can_castle_queenside = false
            }
        } else if (pieceName === "R") {
            if (isWhite) {
                if (oldSquare === 63)
                    this.white_can_castle_kingside = false
                else if (oldSquare === 56)
                    this.white_can_castle_queenside = false
            } else {
                if (oldSquare === 7)
                    this.black_can_castle_kingside = false
                else if (oldSquare === 0)
                    this.black_can_castle_queenside = false
            }
        }
        // if a piece was captured, remove it and update accordingly
        if (newSquare in other || (pieceName === "P" && newSquare === this.en_passant_target_square)) {
            var capSquare = newSquare
            if (pieceName === "P" && capSquare === this.en_passant_target_square)
                capSquare += isWhite ? 8 : -8
            var captured = this.squareIDs[capSquare]
            var capName = captured.charAt(0)
            // update castling rights if necessary
            if (capName === "R") {
                if (isWhite) {
                    if (capSquare === 7)
                        this.black_can_castle_kingside = false
                    else if (capSquare === 0)
                        this.black_can_castle_queenside = false
                } else {
                    if (capSquare === 63)
                        this.white_can_castle_kingside = false
                    else if (capSquare === 56)
                        this.white_can_castle_queenside = false
                }
            }
            // remove all traces of this piece
            other[capName].splice(other[capName].indexOf(capSquare), 1)
            delete other[capSquare]
            delete other[captured]
            delete this.legalMoves[captured]
            var occ = isWhite ? this.occupied_by_black : this.occupied_by_white
            occ.delete(BitBoard.fromSquare(capSquare))
            this.fifty_move_rule_count = 0 // always gets reset after a piece is captured
        }
        // update tables with new locations of pieces
        this.squareIDs[newSquare] = this.squareIDs[oldSquare]
        this.squareIDs[oldSquare] = null
        this.occupied.delete(BitBoard.fromSquare(oldSquare)).or(BitBoard.fromSquare(newSquare))
        var occ = isWhite ? this.occupied_by_white : this.occupied_by_black
        occ.delete(BitBoard.fromSquare(oldSquare)).or(BitBoard.fromSquare(newSquare))
        // update en passant square if necessary
        if (pieceName === "P" && Math.abs(newSquare - oldSquare) > 9)
            this.en_passant_target_square = oldSquare + (isWhite ? -8 : 8)
        else
            this.en_passant_target_square = -1
        if (pieceName === "P" && (isWhite ? newSquare < 8 : newSquare > 55)) {
            this.pawn_to_promote = newSquare // pawn is promoting
        }
        else if (updateMoves) {
            if (!isWhite)
                this.turn_counter += 1
            this.whiteToMove = !this.whiteToMove
            this.updateLegalMoves()
            var position = this.outputFEN()
            this.positionHistory.push(position)
            var board = position.split(" ")[0]
            if (board in this.uniquePositionCount)
                this.uniquePositionCount[board] += 1
            else
                this.uniquePositionCount[board] = 1
            this.updateResult()
        }
        return true
    }

    promotePawn(pieceID) {
        var pieces = this.whiteToMove ? this.whitePieces : this.blackPieces
        var pawnID = this.squareIDs[this.pawn_to_promote]
        // remove pawn from promotion square
        pieces["P"].splice(pieces["P"].indexOf(this.pawn_to_promote), 1)
        delete pieces[pawnID]
        delete this.legalMoves[pawnID]
        // place target piece at promotion square
        pieces[pieceID.charAt(0)].push(this.pawn_to_promote)
        pieces[pieceID] = this.pawn_to_promote
        pieces[this.pawn_to_promote] = pieceID.charAt(0)
        this.squareIDs[this.pawn_to_promote] = pieceID
        this.legalMoves[pieceID] = new BitBoard()
        this.pawn_to_promote = -1
        // make updates for next turn
        if (!this.whiteToMove)
            this.turn_counter += 1
        this.whiteToMove = !this.whiteToMove
        this.updateLegalMoves()
        var position = this.outputFEN()
        this.positionHistory.push(position)
        var board = position.split(" ")[0]
        if (board in this.uniquePositionCount)
            this.uniquePositionCount[board] += 1
        else
            this.uniquePositionCount[board] = 1
        this.updateResult()
    }
}


///////////////////////////////////////////
////  CODE FOR DRAWING CHESS ELEMENTS  ////
///////////////////////////////////////////


var center_x = 0, center_y = 0
var board_x = 0, board_y = 0
var boardSize = 0
var pieceSize = 0
var color_scheme = "color"
var sidePanelOpen = false

const color_lookup = { "color": 0, "color_a": 1, "color_b": 2, "color_c": 3, "color_d": 4,
"color_x": 5, "color_h": 6, "color_g": 7, "color_f": 8, "color_e": 9 }


function begin(startPosition="") {
    boardState = new BoardState("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1")
    updateCenter()
    drawBoard()
    drawSidebar()
    drawPieces(true)
    drawPieces(false)
    boardState.updateLegalMoves()
    detailedMoveCount(new BoardState("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"), 2)
    document.onkeyup = function(event) {
        if (event.key === "s")
            console.log(boardState)
        else if (event.key === "h")
            console.log(boardState.positionHistory)
    }
}

function redraw() {
    updateCenter()
    drawBoard()
    drawSidebar()
    drawPieces(true)
    drawPieces(false)
    redrawMarks()
}

function updateCenter() {
    center_x = Math.floor(window.innerWidth / 2)
    center_y = Math.floor(window.innerHeight / 2)
    boardSize = Math.floor(Math.min(center_y * 1.5, center_x * 0.8) / 8) * 8
    pieceSize = Math.floor(boardSize / 8)
    board_x = center_x - Math.floor(pieceSize * 6.5)
    board_y = center_y - (boardSize / 2)
}

function genImageString(filename, x_pos, y_pos, width=0, height=0, id="", zIndex=0) {
    var image = "<img src=\"" + filename
    if (id !== "")
        image += "\" id=\"" + id
    image += "\" style=\"position:absolute; left:"
    image += x_pos + "px; top:" + y_pos + "px"
    if (width)
        image += "; width:" + width + "px"
    if (height)
        image += "; height:" + height + "px"
    if (zIndex !== 0)
        image += "; z-index:" + zIndex
    return image + "\">"
}

function drawBoard() {
    document.getElementById("board").innerHTML = genImageString(
        "resources/chess/board.png",
        board_x, board_y, boardSize, boardSize, "chessboard"
    )
    if (color_scheme !== "color")
        document.getElementById("board").innerHTML += genImageString(
            "resources/chess/" + color_scheme + ".png",
            board_x, board_y, boardSize, boardSize, "board_color"
        )
    else if (document.getElementById("board_color") !== null)
        document.getElementById("board_color").outerHTML = ""
}

function drawPieces(isWhite=true) {
    var color = isWhite ? "white" : "black"
    var c = isWhite ? "W" : "B"
    var htmlString = ""
    for (let p = 0; p < 6; p++) {
        var piece = piece_names[p]
        var arr = isWhite ? boardState.whitePieces[piece] : boardState.blackPieces[piece]
        for (let s = 0; s < arr.length; s++) {
            var square = arr[s]
            if ((piece === "K") && (isWhite === boardState.whiteToMove) && (boardState.result === (boardState.whiteToMove ? -1 : 1)))
                piece = "X"
            htmlString += genImageString(
                "resources/chess/" + piece + "_" + c + ".png",
                board_x + ((square % 8) * pieceSize),
                board_y + (Math.floor(square / 8) * pieceSize),
                pieceSize,
                pieceSize,
                boardState.squareIDs[square],
                4
            )
        }
    }
    document.getElementById(color).innerHTML = htmlString
    var pieces = document.getElementById(color).children
    for (var p = 0; p < pieces.length; p++)
        makeDraggable(pieces[p])
}

function drawMoves(pieceID) {
    if (pieceID.charAt(2) !== (boardState.whiteToMove ? "W" : "B"))
        return
    var pieces = pieceID.charAt(2) === "W" ? boardState.whitePieces : boardState.blackPieces
    var opp = pieceID.charAt(2) === "W" ? boardState.blackPieces : boardState.whitePieces
    var htmlString = ""
    var moves = boardState.legalMoves[pieceID].toArray()
    var moveIDs = []
    for (var m = 0; m < moves.length; m++) {
        var move = moves[m]
        var filename = move in opp ? "circle.png" : "dot.png"
        if (pieceID.charAt(0) === "P" && move === boardState.en_passant_target_square)
            filename = "circle.png"
        htmlString += genImageString(
            "resources/chess/" + filename,
            board_x + ((move % 8) * pieceSize),
            board_y + (Math.floor(move / 8) * pieceSize),
            pieceSize,
            pieceSize,
            "move-" + move,
            3
        )
        moveIDs.push("move-"+move)
    }
    document.getElementById("moves").innerHTML = htmlString
    for (var m = 0; m < moveIDs.length; m++)
        makeClickable(moveIDs[m], pieceID)
    undrawMarks("select")
    drawMark("select", pieces[pieceID])
}

function undrawMoves() {
    document.getElementById("moves").innerHTML = ""
    undrawMarks("select")
    document.onmousedown = null
}

function redrawMarks() {
    var marks = document.getElementById("marks").children
    var htmlString = ""
    for (var m = 0; m < marks.length; m++) {
        var mark = marks[m]
        var type = mark.id.split("-")[0]
        var square = Number(mark.id.split("-")[1])
        htmlString += genImageString(
            "resources/chess/" + type + ".png",
            board_x + ((square % 8) * pieceSize),
            board_y + (Math.floor(square / 8) * pieceSize),
            pieceSize,
            pieceSize,
            type + "-" + square,
            2
        )
    }
    document.getElementById("marks").innerHTML = htmlString
}

function drawMark(type, square) {
    if (type !== "mark" && type !== "select" && type !== "alert" && type !== "highlight")
        return
    document.getElementById("marks").innerHTML += genImageString(
        "resources/chess/" + type + ".png",
        board_x + ((square % 8) * pieceSize),
        board_y + (Math.floor(square / 8) * pieceSize),
        pieceSize,
        pieceSize,
        type + "-" + square,
        2
    )
}

function undrawMarks(type="all") {
    if (type === "all") {
        document.getElementById("marks").innerHTML = ""
        return
    }
    var children = document.getElementById("marks").children
    for (var c = 0; c < children.length; c++) {
        var child = children[c]
        if (child.id.startsWith(type))
            child.outerHTML = ""
    }
}

function makeClickable(moveID, pieceID) {
    var pieces = pieceID.charAt(2) === "W" ? boardState.whitePieces : boardState.blackPieces
    var oldSquare = pieces[pieceID]
    var move = document.getElementById(moveID)
    var newSquare = Number(move.id.split("-")[1])
    move.onmouseup = function(event) {
        event.preventDefault()
        if (event.button !== 0) // left click only
            return
        if (!boardState.playMove(pieceID[0], pieceID[2], oldSquare, newSquare))
            return
        drawConfirmedMove(pieceID, oldSquare, newSquare, move.style.left, move.style.top)
        undrawMoves()
    }
}

function drawConfirmedMove(pieceID, oldSquare, newSquare, leftStyle, topStyle) {
    undrawMarks()
    document.getElementById(pieceID).style.left = leftStyle
    document.getElementById(pieceID).style.top = topStyle
    drawPieces(true)
    drawPieces(false)
    if (boardState.pawn_to_promote > -1)
        drawPromotionPrompt(oldSquare, newSquare)
    else
        drawMoveMarks(oldSquare, newSquare)
}

function drawMoveMarks(oldSquare, newSquare) {
    drawMark("mark", oldSquare)
    drawMark("mark", newSquare)
    var kingSquare = (boardState.whiteToMove ? boardState.whitePieces : boardState.blackPieces)["K"][0]
    if (!BitBoard.fromSquare(kingSquare).and(
        boardState.whiteToMove ? boardState.attacked_by_black : boardState.attacked_by_white
    ).isEmpty())
        drawMark("alert", kingSquare)
}

function drawPromotionPrompt(oldSquare, newSquare) {
    var drawSquare = boardState.pawn_to_promote
    if (!boardState.whiteToMove)
        drawSquare -= 24
    var htmlString = genImageString(
        "resources/chess/promote.png",
        board_x + ((drawSquare % 8) * pieceSize),
        board_y + (Math.floor(drawSquare / 8) * pieceSize),
        pieceSize,
        pieceSize * 4,
        "promote",
        6
    )
    var c = boardState.whiteToMove ? "W" : "B"
    var options = boardState.whiteToMove ? ["Q", "R", "B", "N"] : ["N", "B", "R", "Q"]
    var pieces = boardState.whiteToMove ? boardState.whitePieces : boardState.blackPieces
    for (var opt = 0; opt < options.length; opt++) {
        var square = drawSquare + 8 * opt
        var pieceName = options[opt]
        htmlString += genImageString(
            "resources/chess/" + pieceName + "_" + c + ".png",
            board_x + ((square % 8) * pieceSize),
            board_y + (Math.floor(square / 8) * pieceSize),
            pieceSize,
            pieceSize,
            pieceName + idString[pieces[pieceName].length] + c,
            8
        )
    }
    document.getElementById("promotion").innerHTML = htmlString
    var elements = document.getElementById("promotion").children
    for (var e = 0; e < elements.length; e++) {
        var element = elements[e]
        if (element.id.startsWith("promote"))
            continue
        makeSelectable(element, oldSquare, newSquare)
    }
}

function makeSelectable(element, oldSquare, newSquare) {
    element.onmousedown = function() {
        boardState.promotePawn(element.id)
        document.getElementById("promotion").innerHTML = ""
        drawPieces(true)
        drawPieces(false)
        drawMoveMarks(oldSquare, newSquare)
    }
}

function makeDraggable(element) {
    var initX = 0, initY = 0, currX = 0, currY = 0, nextX = 0, nextY = 0
    element.onmousedown = function(event) {
        event.preventDefault()
        if (event.button !== 0) // prevents weird behavior when right clicking while dragging
            return
        if (boardState.pawn_to_promote > -1) // no pieces can be moved while a pawn is promoting
            return
        // handle piece being clicked on as an attack target
        if ((element.id.charAt(2) === "W") !== boardState.whiteToMove) {
            var oldSquare = -1
            var children = document.getElementById("marks").children
            for (var c = 0; c < children.length; c++) {
                var child = children[c]
                if (child.id.startsWith("select")) {
                    oldSquare = Number(child.id.split("-")[1])
                    break
                }
            }
            if (oldSquare !== -1) {
                var color = boardState.whiteToMove ? "white" : "black"
                var pieces = boardState.whiteToMove ? boardState.whitePieces : boardState.blackPieces
                var other = boardState.whiteToMove ? boardState.blackPieces : boardState.whitePieces
                var newSquare = other[element.id]
                var pieceID = boardState.squareIDs[oldSquare]
                if (BitBoard.fromSquare(newSquare).and(boardState.legalMoves[pieceID]).isEmpty())
                    return
                var left = element.style.left
                var top = element.style.top
                if (boardState.playMove(pieces[oldSquare], color, oldSquare, newSquare)) {
                    drawConfirmedMove(pieceID, oldSquare, newSquare, left, top)
                    return
                }
            }
        }
        // otherwise, piece is being dragged
        drawMoves(element.id)
        initX = Number(element.style.left.substring(0, element.style.left.length - 2))
        initY = Number(element.style.top.substring(0, element.style.top.length - 2))
        currX = event.clientX
        currY = event.clientY
        element.style.zIndex = 20
        document.onmousemove = function(event) {
            event.preventDefault()
            if (event.button !== 0)
                return
            // calculate new position and update
            nextX = currX - event.clientX
            nextY = currY - event.clientY
            currX = event.clientX
            currY = event.clientY
            element.style.left = (element.offsetLeft - nextX) + "px"
            element.style.top = (element.offsetTop - nextY) + "px"
        }
        document.onmouseup = function(event) {
            undrawMoves()
            event.preventDefault()
            if (event.button !== 0)
                return
            var pieceName = element.id.charAt(0)
            var pieceColor = element.parentElement.id

            // calculate nearest squares
            currX = Number(element.style.left.substring(0, element.style.left.length - 2))
            currY = Number(element.style.top.substring(0, element.style.top.length - 2))
            var oldXCoord = Math.floor((initX - board_x + (pieceSize / 2)) / pieceSize)
            var oldYCoord = Math.floor((initY - board_y + (pieceSize / 2)) / pieceSize)
            var newXCoord = Math.floor((currX - board_x + (pieceSize / 2)) / pieceSize)
            var newYCoord = Math.floor((currY - board_y + (pieceSize / 2)) / pieceSize)
            var oldSquare = oldYCoord * 8 + oldXCoord
            var newSquare = newYCoord * 8 + newXCoord
            var snapX = newXCoord * pieceSize + board_x
            var snapY = newYCoord * pieceSize + board_y

            // if nearest square is out of bounds or the move is otherwise illegal, return to original spot
            if (snapX < board_x || snapX > (board_x + boardSize - pieceSize) || 
                snapY < board_y || snapY > (board_y + boardSize - pieceSize) ||
                pieceColor !== (boardState.whiteToMove ? "white" : "black") ||
                BitBoard.and(BitBoard.fromSquare(newSquare), boardState.legalMoves[element.id]).isEmpty() ||
                !boardState.playMove(pieceName, pieceColor, oldSquare, newSquare)) {
                    element.style.left = initX + "px"
                    element.style.top = initY + "px"
                    undrawMarks("select")
                    drawMoves(element.id)
            } else // a legal move has been played
                drawConfirmedMove(element.id, oldSquare, newSquare, snapX + "px", snapY + "px")
            
            // stop dragging
            element.style.zIndex = 3
            document.onmouseup = undrawMoves
            document.onmousemove = null
        }
    }
}

function undrawPiece(pieceID) {
    document.getElementById(pieceID).outerHTML = ""
}

function drawAttackedSquares(defended=false) {
    undrawMarks("alert")
    undrawMarks("highlight")
    var attacked = (boardState.whiteToMove ^ defended) ? boardState.attacked_by_black : boardState.attacked_by_white
    for (var s = 0; s < 64; s++) {
        if (!BitBoard.and(attacked, BitBoard.lookup[s]).isEmpty())
            drawMark(defended ? "highlight" : "alert", s)
    }
}

function drawSidebar() {
    var scalar = boardSize / 2048
    var leftSide = board_x + Math.floor(boardSize * 1.125)
    var htmlString = ""
    if (sidePanelOpen) {
        leftSide -= Math.floor(boardSize / 16)
        htmlString += drawOptionsBar(leftSide + Math.round(scalar * 992), scalar)
    }
    htmlString += genImageString(
        "resources/chess/sidebar.png",
        leftSide,
        board_y,
        Math.floor(boardSize / 2),
        boardSize,
        "back_panel",
        1
    )
    // locations/sizes are all based on original layout dimensions of 1024x2048
    //  (refer to "resources/chess/sidebar_layout.png" -- pixels measured in Photoshop CS6)
    if (color_scheme !== "color") {
        var color = color_scheme
        var color_opts = Object.keys(color_lookup)
        while (color === "color_x" || color === "color") {
            color = color_opts[Math.floor(Math.random() * color_opts.length)]
        }
        htmlString += genImageString(
            "resources/chess/" + color + ".png",
            leftSide + Math.round(scalar * 64),
            board_y + Math.round(scalar * 64),
            Math.round(scalar * 896),
            Math.round(scalar * 1920),
            "back_color",
            2
        )
    }
    htmlString += genImageString(
        "resources/chess/new_game.png",
        leftSide + Math.floor(172 * scalar),
        board_y  + Math.floor(140 * scalar),
        Math.floor(424 * scalar),
        Math.floor(168 * scalar),
        "new_game",
        3
    )
    htmlString += genImageString(
        "resources/chess/options.png",
        leftSide + Math.floor(684 * scalar),
        board_y + Math.floor(140 * scalar),
        Math.floor(168 * scalar),
        Math.floor(168 * scalar),
        "options",
        3
    )
    htmlString += genImageString(
        "resources/chess/color_panel.png",
        leftSide + Math.floor(172 * scalar),
        board_y + Math.floor(364 * scalar),
        Math.floor(680 * scalar),
        Math.floor(296 * scalar),
        "color_panel",
        3
    )
    const colors = ["", "A", "B", "C", "D", "X", "H", "G", "F", "E"]
    for (var c = 0; c < colors.length; c++) {
        htmlString += genImageString(
            "resources/chess/color" + colors[c] + ".png",
            leftSide + Math.floor(scalar * (208 + (c % 5) * 128)),
            board_y + Math.floor(scalar * (c < 5 ? 400 : 528)),
            Math.floor(scalar * 96),
            Math.floor(scalar * 96),
            "color" + (c === 0 ? "" : "_") + colors[c].toLowerCase(),
            4
        )
    }
    htmlString += genImageString(
        "resources/chess/P_B.png",
        leftSide + Math.floor(scalar * (224 + 128 * (color_lookup[color_scheme] % 5))),
        board_y + Math.floor(scalar * (color_lookup[color_scheme] < 5 ? 412 : 540)),
        Math.floor(scalar * 64),
        Math.floor(scalar * 64),
        "color_scheme",
        5
    )
    htmlString += genImageString(
        "resources/chess/moves_panel.png",
        leftSide + Math.floor(scalar * 172),
        board_y + Math.floor(scalar * 748),
        Math.floor(scalar * 680),
        Math.floor(scalar * 936),
        "moves_panel",
        2
    )
    htmlString += genImageString(
        "resources/chess/left.png",
        leftSide + Math.floor(scalar * 140),
        board_y + Math.floor(scalar * 1740),
        Math.floor(scalar * 168),
        Math.floor(scalar * 168),
        "left",
        2
    )
    htmlString += genImageString(
        "resources/chess/right.png",
        leftSide + Math.floor(scalar * 716),
        board_y + Math.floor(scalar * 1740),
        Math.floor(scalar * 168),
        Math.floor(scalar * 168),
        "right",
        2
    )
    htmlString += genImageString(
        "resources/chess/save.png",
        leftSide + Math.floor(scalar * 354),
        board_y + Math.floor(scalar * 1756),
        Math.floor(scalar * 134),
        Math.floor(scalar * 134),
        "save",
        2
    )
    htmlString += genImageString(
        "resources/chess/analyze.png",
        leftSide + Math.floor(scalar * 536),
        board_y + Math.floor(scalar * 1756),
        Math.floor(scalar * 134),
        Math.floor(scalar * 134),
        "analyze",
        2
    )
    document.getElementById("sidebar").innerHTML = htmlString
    // apply click effects
    var children = document.getElementById("sidebar").children
    for (var c = 0; c < children.length; c++) {
        var element = children[c]
        if (element.id.includes("panel") || element.id.includes("hover")
            || element.id.includes("back"))
            continue
        else if (element.id.includes("color"))
            makeColorClickable(element.id)
        else if (element.id === "new_game") {
            element.onmousedown = function() {
                sidePanelOpen = true
                newGameOptions = true
                redraw()
                // TODO: add options for a new game
            }
        } else if (element.id === "options") {
            element.onmousedown = function() {
                sidePanelOpen = !sidePanelOpen
                newGameOptions = false
                if (sidePanelOpen) {
                    // TODO: add options
                }
                redraw()
            }
        }
    }
}

function drawOptionsBar(leftSide, scalar) {
    var htmlString = genImageString(
        "resources/chess/options_bar.png",
        leftSide,
        board_y,
        Math.floor(boardSize / 2),
        boardSize,
        "options_panel"
    )
    if (color_scheme !== "color") {
        var color = color_scheme
        var color_opts = Object.keys(color_lookup)
        while (color === "color_x" || color === "color") {
            color = color_opts[Math.floor(Math.random() * color_opts.length)]
        }
        htmlString += genImageString(
            "resources/chess/" + color + ".png",
            leftSide,
            board_y + Math.round(scalar * 192),
            Math.round(scalar * 624),
            Math.round(scalar * 1664),
            "options_color"
        )
    }
    return htmlString
}

function drawColorHover(color) {
    var hover = document.getElementById("color_hover")
    if (hover !== null)
        document.getElementById("color_hover").outerHTML = ""
    if (color === color_scheme)
        return
    var scalar = boardSize / 2048
    document.getElementById("sidebar").innerHTML += genImageString(
        "resources/chess/P_B.png",
        board_x + Math.floor(boardSize * 1.125) + Math.floor(scalar * (224 + 128 * (color_lookup[color] % 5))),
        board_y + Math.floor(scalar * (color_lookup[color] < 5 ? 412 : 540)),
        Math.floor(scalar * 64),
        Math.floor(scalar * 64),
        "color_hover",
        5
    )
    document.getElementById("color_hover").style.opacity = "0.25"
}

function makeColorClickable(elementID) {
    var element = document.getElementById(elementID)
    // element.onmouseenter = function() {
    //     drawColorHover(elementID)
    // }
    // element.onmouseleave = function() {
    //     drawColorHover(color_scheme)
    // }
    element.onmousedown = function() {
        var redrawSideboard = (element.id === "color_x") || (element.id !== color_scheme)
        if (element.id !== "color_scheme")
            color_scheme = element.id
        if (redrawSideboard)
            redraw()
    }
}



/////////////////////////////////////////////////////////
//////  CODE FOR COUNTING LEGAL MOVES (DEBUGGING)  //////
/////////////////////////////////////////////////////////

class MoveCounter {
    constructor() {
        this.total = 0
        this.captures = 0
        this.en_passants = 0
        this.castles = 0
        this.promotions = 0
        this.checks = 0
        this.discovery_checks = 0
        this.double_checks = 0
        this.checkmates = 0
        this.stalemates = 0
    }

    add(other) {
        this.total += other.total
        this.captures += other.captures
        this.en_passants += other.en_passants
        this.castles += other.castles
        this.promotions += other.promotions
        this.checks += other.checks
        this.discovery_checks += other.discovery_checks
        this.double_checks += other.double_checks
        this.checkmates += other.checkmates
        this.stalemates += other.stalemates
    }
}

function detailedMoveCount(startState, depth=1) {
    var pieces = startState.whiteToMove ? startState.whitePieces : startState.blackPieces
    var other = startState.whiteToMove ? startState.blackPieces : startState.whitePieces
    var pieceColor = startState.whiteToMove ? "W" : "B"
    var pieceIDs = Object.keys(startState.legalMoves)
    if (depth > 2) {
        var expected = 0
        for (var id = 0; id < pieceIDs.length; id++) {
            var pieceID = pieceIDs[id]
            if ((pieceID.charAt(2) === "W") !== startState.whiteToMove)
                continue
            expected += startState.legalMoves[pieceID].count()
        }
        console.log("Expecting to check " + expected + " unique moves...")
    }
    var total = new MoveCounter()
    var count = 0
    for (var id = 0; id < pieceIDs.length; id++) {
        var pieceID = pieceIDs[id]
        if ((pieceID.charAt(2) === "W") !== startState.whiteToMove)
            continue
        var pieceName = pieceID.charAt(0)
        var oldSquare = pieces[pieceID]
        var moves = startState.legalMoves[pieceID].toArray()
        for (var m = 0; m < moves.length; m++) {
            var newSquare = moves[m]
            var moveString = pieceName === "P" ? "" : pieceName
            if (pieceName === "P" && (startState.en_passant_target_square === newSquare || newSquare in other))
                moveString = square_names[oldSquare].charAt(0) + "x"
            else if (pieceName === "K" && Math.abs(oldSquare - newSquare) === 2) {
                if (newSquare < oldSquare)
                    moveString = "O-O-O"
                else
                    moveString = "O-O"
            } else if (newSquare in other)
                moveString += "x"
            if (!moveString.includes("O"))
                moveString += square_names[newSquare]
            var nextState = new BoardState("", startState)
            nextState.playMove(pieceName, pieceColor, oldSquare, newSquare)
            if (nextState.pawn_to_promote === -1) {
                var result = countLegalMovesFromBoardState(nextState, depth - 1)
                total.add(result)
                count += 1
                if (count < 10)
                    moveString = count + ".  " + moveString
                else
                    moveString = count + ". " + moveString
                console.log(moveString, result, nextState)
            } else {
                var options = ["Q", "R", "B", "N"]
                if (depth === 1)
                    count.promotions += 4
                for (var opt = 0; opt < 4; opt++) {
                    var promotionState = new BoardState("", nextState)
                    var promotionID = options[opt] + idString[pieces[options[opt]].length] + pieceColor
                    promotionState.promotePawn(promotionID)
                    var result = countLegalMovesFromBoardState(promotionState, depth - 1)
                    total.add(result)
                    count += 1
                    if (count < 10)
                        moveString = count + ".  " + moveString
                    else
                        moveString = count + ". " + moveString
                    console.log(moveString + "=" + options[opt], result, promotionState)
                }
            }
        }
    }
    console.log("Total moves found at depth 1 = " + count)
    console.log("Final result:", total)
}

function countLegalMovesFromBoardState(startState, depth=0) {
    var count = new MoveCounter()
    if (startState.result !== null && depth > 0)
        return count
    else if (depth === 0) {
        count.total = 1
        if (startState.result === 0)
            count.stalemates = 1
        else if (startState.result !== null)
            count.checkmates = 1
        var isWhite = startState.whiteToMove
        var attacked = isWhite ? startState.attacked_by_black : startState.attacked_by_white
        var kingSquare = (isWhite ? startState.whitePieces : startState.blackPieces)["K"][0]
        if (!attacked.and(BitBoard.fromSquare(kingSquare)).isEmpty())
            count.checks = 1
        return count
    }
    var pieces = startState.whiteToMove ? startState.whitePieces : startState.blackPieces
    var other = startState.whiteToMove ? startState.blackPieces : startState.whitePieces
    var pieceColor = startState.whiteToMove ? "W" : "B"
    var pieceIDs = Object.keys(startState.legalMoves)
    for (var id = 0; id < pieceIDs.length; id++) {
        var pieceID = pieceIDs[id]
        if ((pieceID.charAt(2) === "W") !== startState.whiteToMove)
            continue
        var pieceName = pieceID.charAt(0)
        var oldSquare = pieces[pieceID]
        var moves = startState.legalMoves[pieceID].toArray()
        for (var m = 0; m < moves.length; m++) {
            var newSquare = moves[m]
            if (depth === 1) {
                if (pieceName === "P" && startState.en_passant_target_square === newSquare) {
                    count.en_passants += 1
                    count.captures += 1
                } else if (pieceName === "K" && Math.abs(oldSquare - newSquare) === 2)
                    count.castles += 1
                else if (newSquare in other)
                    count.captures += 1
            }
            var nextState = new BoardState("", startState)
            nextState.playMove(pieceName, pieceColor, oldSquare, newSquare)
            if (nextState.pawn_to_promote === -1)
                count.add(countLegalMovesFromBoardState(nextState, depth - 1))
            else {
                var options = ["Q", "R", "B", "N"]
                if (depth === 1)
                    count.promotions += 4
                for (var opt = 0; opt < 4; opt++) {
                    var promotionState = new BoardState("", nextState)
                    var promotionID = options[opt] + idString[pieces[options[opt]].length] + pieceColor
                    promotionState.promotePawn(promotionID)
                    count.add(countLegalMovesFromBoardState(promotionState, depth - 1))
                }
            }
        }
    }
    return count
}



///////////////////////////////////////////
//////  DICTIONARY OF SLIDING MOVES  //////
///////////////////////////////////////////

const sliding_moves = {
    "B": {
        "a8": [[], [], [], [9, 18, 27, 36, 45, 54, 63]],
        "b8": [[], [], [8], [10, 19, 28, 37, 46, 55]],
        "c8": [[], [], [9, 16], [11, 20, 29, 38, 47]],
        "d8": [[], [], [10, 17, 24], [12, 21, 30, 39]],
        "e8": [[], [], [11, 18, 25, 32], [13, 22, 31]],
        "f8": [[], [], [12, 19, 26, 33, 40], [14, 23]],
        "g8": [[], [], [13, 20, 27, 34, 41, 48], [15]],
        "h8": [[], [], [14, 21, 28, 35, 42, 49, 56], []],
        "a7": [[1], [], [], [17, 26, 35, 44, 53, 62]],
        "b7": [[2], [0], [16], [18, 27, 36, 45, 54, 63]],
        "c7": [[3], [1], [17, 24], [19, 28, 37, 46, 55]],
        "d7": [[4], [2], [18, 25, 32], [20, 29, 38, 47]],
        "e7": [[5], [3], [19, 26, 33, 40], [21, 30, 39]],
        "f7": [[6], [4], [20, 27, 34, 41, 48], [22, 31]],
        "g7": [[7], [5], [21, 28, 35, 42, 49, 56], [23]],
        "h7": [[], [6], [22, 29, 36, 43, 50, 57], []],
        "a6": [[9, 2], [], [], [25, 34, 43, 52, 61]],
        "b6": [[10, 3], [8], [24], [26, 35, 44, 53, 62]],
        "c6": [[11, 4], [9, 0], [25, 32], [27, 36, 45, 54, 63]],
        "d6": [[12, 5], [10, 1], [26, 33, 40], [28, 37, 46, 55]],
        "e6": [[13, 6], [11, 2], [27, 34, 41, 48], [29, 38, 47]],
        "f6": [[14, 7], [12, 3], [28, 35, 42, 49, 56], [30, 39]],
        "g6": [[15], [13, 4], [29, 36, 43, 50, 57], [31]],
        "h6": [[], [14, 5], [30, 37, 44, 51, 58], []],
        "a5": [[17, 10, 3], [], [], [33, 42, 51, 60]],
        "b5": [[18, 11, 4], [16], [32], [34, 43, 52, 61]],
        "c5": [[19, 12, 5], [17, 8], [33, 40], [35, 44, 53, 62]],
        "d5": [[20, 13, 6], [18, 9, 0], [34, 41, 48], [36, 45, 54, 63]],
        "e5": [[21, 14, 7], [19, 10, 1], [35, 42, 49, 56], [37, 46, 55]],
        "f5": [[22, 15], [20, 11, 2], [36, 43, 50, 57], [38, 47]],
        "g5": [[23], [21, 12, 3], [37, 44, 51, 58], [39]],
        "h5": [[], [22, 13, 4], [38, 45, 52, 59], []],
        "a4": [[25, 18, 11, 4], [], [], [41, 50, 59]],
        "b4": [[26, 19, 12, 5], [24], [40], [42, 51, 60]],
        "c4": [[27, 20, 13, 6], [25, 16], [41, 48], [43, 52, 61]],
        "d4": [[28, 21, 14, 7], [26, 17, 8], [42, 49, 56], [44, 53, 62]],
        "e4": [[29, 22, 15], [27, 18, 9, 0], [43, 50, 57], [45, 54, 63]],
        "f4": [[30, 23], [28, 19, 10, 1], [44, 51, 58], [46, 55]],
        "g4": [[31], [29, 20, 11, 2], [45, 52, 59], [47]],
        "h4": [[], [30, 21, 12, 3], [46, 53, 60], []],
        "a3": [[33, 26, 19, 12, 5], [], [], [49, 58]],
        "b3": [[34, 27, 20, 13, 6], [32], [48], [50, 59]],
        "c3": [[35, 28, 21, 14, 7], [33, 24], [49, 56], [51, 60]],
        "d3": [[36, 29, 22, 15], [34, 25, 16], [50, 57], [52, 61]],
        "e3": [[37, 30, 23], [35, 26, 17, 8], [51, 58], [53, 62]],
        "f3": [[38, 31], [36, 27, 18, 9, 0], [52, 59], [54, 63]],
        "g3": [[39], [37, 28, 19, 10, 1], [53, 60], [55]],
        "h3": [[], [38, 29, 20, 11, 2], [54, 61], []],
        "a2": [[41, 34, 27, 20, 13, 6], [], [], [57]],
        "b2": [[42, 35, 28, 21, 14, 7], [40], [56], [58]],
        "c2": [[43, 36, 29, 22, 15], [41, 32], [57], [59]],
        "d2": [[44, 37, 30, 23], [42, 33, 24], [58], [60]],
        "e2": [[45, 38, 31], [43, 34, 25, 16], [59], [61]],
        "f2": [[46, 39], [44, 35, 26, 17, 8], [60], [62]],
        "g2": [[47], [45, 36, 27, 18, 9, 0], [61], [63]],
        "h2": [[], [46, 37, 28, 19, 10, 1], [62], []],
        "a1": [[49, 42, 35, 28, 21, 14, 7], [], [], []],
        "b1": [[50, 43, 36, 29, 22, 15], [48], [], []],
        "c1": [[51, 44, 37, 30, 23], [49, 40], [], []],
        "d1": [[52, 45, 38, 31], [50, 41, 32], [], []],
        "e1": [[53, 46, 39], [51, 42, 33, 24], [], []],
        "f1": [[54, 47], [52, 43, 34, 25, 16], [], []],
        "g1": [[55], [53, 44, 35, 26, 17, 8], [], []],
        "h1": [[], [54, 45, 36, 27, 18, 9, 0], [], []]
    }, "R": {
        "a8": [[1, 2, 3, 4, 5, 6, 7], [], [], [8, 16, 24, 32, 40, 48, 56]],
        "b8": [[2, 3, 4, 5, 6, 7], [], [0], [9, 17, 25, 33, 41, 49, 57]],
        "c8": [[3, 4, 5, 6, 7], [], [1, 0], [10, 18, 26, 34, 42, 50, 58]],
        "d8": [[4, 5, 6, 7], [], [2, 1, 0], [11, 19, 27, 35, 43, 51, 59]],
        "e8": [[5, 6, 7], [], [3, 2, 1, 0], [12, 20, 28, 36, 44, 52, 60]],
        "f8": [[6, 7], [], [4, 3, 2, 1, 0], [13, 21, 29, 37, 45, 53, 61]],
        "g8": [[7], [], [5, 4, 3, 2, 1, 0], [14, 22, 30, 38, 46, 54, 62]],
        "h8": [[], [], [6, 5, 4, 3, 2, 1, 0], [15, 23, 31, 39, 47, 55, 63]],
        "a7": [[9, 10, 11, 12, 13, 14, 15], [0], [], [16, 24, 32, 40, 48, 56]],
        "b7": [[10, 11, 12, 13, 14, 15], [1], [8], [17, 25, 33, 41, 49, 57]],
        "c7": [[11, 12, 13, 14, 15], [2], [9, 8], [18, 26, 34, 42, 50, 58]],
        "d7": [[12, 13, 14, 15], [3], [10, 9, 8], [19, 27, 35, 43, 51, 59]],
        "e7": [[13, 14, 15], [4], [11, 10, 9, 8], [20, 28, 36, 44, 52, 60]],
        "f7": [[14, 15], [5], [12, 11, 10, 9, 8], [21, 29, 37, 45, 53, 61]],
        "g7": [[15], [6], [13, 12, 11, 10, 9, 8], [22, 30, 38, 46, 54, 62]],
        "h7": [[], [7], [14, 13, 12, 11, 10, 9, 8], [23, 31, 39, 47, 55, 63]],
        "a6": [[17, 18, 19, 20, 21, 22, 23], [8, 0], [], [24, 32, 40, 48, 56]],
        "b6": [[18, 19, 20, 21, 22, 23], [9, 1], [16], [25, 33, 41, 49, 57]],
        "c6": [[19, 20, 21, 22, 23], [10, 2], [17, 16], [26, 34, 42, 50, 58]],
        "d6": [[20, 21, 22, 23], [11, 3], [18, 17, 16], [27, 35, 43, 51, 59]],
        "e6": [[21, 22, 23], [12, 4], [19, 18, 17, 16], [28, 36, 44, 52, 60]],
        "f6": [[22, 23], [13, 5], [20, 19, 18, 17, 16], [29, 37, 45, 53, 61]],
        "g6": [[23], [14, 6], [21, 20, 19, 18, 17, 16], [30, 38, 46, 54, 62]],
        "h6": [[], [15, 7], [22, 21, 20, 19, 18, 17, 16], [31, 39, 47, 55, 63]],
        "a5": [[25, 26, 27, 28, 29, 30, 31], [16, 8, 0], [], [32, 40, 48, 56]],
        "b5": [[26, 27, 28, 29, 30, 31], [17, 9, 1], [24], [33, 41, 49, 57]],
        "c5": [[27, 28, 29, 30, 31], [18, 10, 2], [25, 24], [34, 42, 50, 58]],
        "d5": [[28, 29, 30, 31], [19, 11, 3], [26, 25, 24], [35, 43, 51, 59]],
        "e5": [[29, 30, 31], [20, 12, 4], [27, 26, 25, 24], [36, 44, 52, 60]],
        "f5": [[30, 31], [21, 13, 5], [28, 27, 26, 25, 24], [37, 45, 53, 61]],
        "g5": [[31], [22, 14, 6], [29, 28, 27, 26, 25, 24], [38, 46, 54, 62]],
        "h5": [[], [23, 15, 7], [30, 29, 28, 27, 26, 25, 24], [39, 47, 55, 63]],
        "a4": [[33, 34, 35, 36, 37, 38, 39], [24, 16, 8, 0], [], [40, 48, 56]],
        "b4": [[34, 35, 36, 37, 38, 39], [25, 17, 9, 1], [32], [41, 49, 57]],
        "c4": [[35, 36, 37, 38, 39], [26, 18, 10, 2], [33, 32], [42, 50, 58]],
        "d4": [[36, 37, 38, 39], [27, 19, 11, 3], [34, 33, 32], [43, 51, 59]],
        "e4": [[37, 38, 39], [28, 20, 12, 4], [35, 34, 33, 32], [44, 52, 60]],
        "f4": [[38, 39], [29, 21, 13, 5], [36, 35, 34, 33, 32], [45, 53, 61]],
        "g4": [[39], [30, 22, 14, 6], [37, 36, 35, 34, 33, 32], [46, 54, 62]],
        "h4": [[], [31, 23, 15, 7], [38, 37, 36, 35, 34, 33, 32], [47, 55, 63]],
        "a3": [[41, 42, 43, 44, 45, 46, 47], [32, 24, 16, 8, 0], [], [48, 56]],
        "b3": [[42, 43, 44, 45, 46, 47], [33, 25, 17, 9, 1], [40], [49, 57]],
        "c3": [[43, 44, 45, 46, 47], [34, 26, 18, 10, 2], [41, 40], [50, 58]],
        "d3": [[44, 45, 46, 47], [35, 27, 19, 11, 3], [42, 41, 40], [51, 59]],
        "e3": [[45, 46, 47], [36, 28, 20, 12, 4], [43, 42, 41, 40], [52, 60]],
        "f3": [[46, 47], [37, 29, 21, 13, 5], [44, 43, 42, 41, 40], [53, 61]],
        "g3": [[47], [38, 30, 22, 14, 6], [45, 44, 43, 42, 41, 40], [54, 62]],
        "h3": [[], [39, 31, 23, 15, 7], [46, 45, 44, 43, 42, 41, 40], [55, 63]],
        "a2": [[49, 50, 51, 52, 53, 54, 55], [40, 32, 24, 16, 8, 0], [], [56]],
        "b2": [[50, 51, 52, 53, 54, 55], [41, 33, 25, 17, 9, 1], [48], [57]],
        "c2": [[51, 52, 53, 54, 55], [42, 34, 26, 18, 10, 2], [49, 48], [58]],
        "d2": [[52, 53, 54, 55], [43, 35, 27, 19, 11, 3], [50, 49, 48], [59]],
        "e2": [[53, 54, 55], [44, 36, 28, 20, 12, 4], [51, 50, 49, 48], [60]],
        "f2": [[54, 55], [45, 37, 29, 21, 13, 5], [52, 51, 50, 49, 48], [61]],
        "g2": [[55], [46, 38, 30, 22, 14, 6], [53, 52, 51, 50, 49, 48], [62]],
        "h2": [[], [47, 39, 31, 23, 15, 7], [54, 53, 52, 51, 50, 49, 48], [63]],
        "a1": [[57, 58, 59, 60, 61, 62, 63], [48, 40, 32, 24, 16, 8, 0], [], []],
        "b1": [[58, 59, 60, 61, 62, 63], [49, 41, 33, 25, 17, 9, 1], [56], []],
        "c1": [[59, 60, 61, 62, 63], [50, 42, 34, 26, 18, 10, 2], [57, 56], []],
        "d1": [[60, 61, 62, 63], [51, 43, 35, 27, 19, 11, 3], [58, 57, 56], []],
        "e1": [[61, 62, 63], [52, 44, 36, 28, 20, 12, 4], [59, 58, 57, 56], []],
        "f1": [[62, 63], [53, 45, 37, 29, 21, 13, 5], [60, 59, 58, 57, 56], []],
        "g1": [[63], [54, 46, 38, 30, 22, 14, 6], [61, 60, 59, 58, 57, 56], []],
        "h1": [[], [55, 47, 39, 31, 23, 15, 7], [62, 61, 60, 59, 58, 57, 56], []]
    }, "N": {
        0: [10, 17],
        1: [11, 16, 18],
        2: [8, 12, 17, 19],
        3: [9, 13, 18, 20],
        4: [10, 14, 19, 21],
        5: [11, 15, 20, 22],
        6: [12, 21, 23],
        7: [13, 22],
        8: [2, 18, 25],
        9: [3, 19, 24, 26],
        10: [0, 4, 16, 20, 25, 27],
        11: [1, 5, 17, 21, 26, 28],
        12: [2, 6, 18, 22, 27, 29],
        13: [3, 7, 19, 23, 28, 30],
        14: [4, 20, 29, 31],
        15: [5, 21, 30],
        16: [1, 10, 26, 33],
        17: [0, 2, 11, 27, 32, 34],
        18: [1, 3, 8, 12, 24, 28, 33, 35],
        19: [2, 4, 9, 13, 25, 29, 34, 36],
        20: [3, 5, 10, 14, 26, 30, 35, 37],
        21: [4, 6, 11, 15, 27, 31, 36, 38],
        22: [5, 7, 12, 28, 37, 39],
        23: [6, 13, 29, 38],
        24: [9, 18, 34, 41],
        25: [8, 10, 19, 35, 40, 42],
        26: [9, 11, 16, 20, 32, 36, 41, 43],
        27: [10, 12, 17, 21, 33, 37, 42, 44],
        28: [11, 13, 18, 22, 34, 38, 43, 45],
        29: [12, 14, 19, 23, 35, 39, 44, 46],
        30: [13, 15, 20, 36, 45, 47],
        31: [14, 21, 37, 46],
        32: [17, 26, 42, 49],
        33: [16, 18, 27, 43, 48, 50],
        34: [17, 19, 24, 28, 40, 44, 49, 51],
        35: [18, 20, 25, 29, 41, 45, 50, 52],
        36: [19, 21, 26, 30, 42, 46, 51, 53],
        37: [20, 22, 27, 31, 43, 47, 52, 54],
        38: [21, 23, 28, 44, 53, 55],
        39: [22, 29, 45, 54],
        40: [25, 34, 50, 57],
        41: [24, 26, 35, 51, 56, 58],
        42: [25, 27, 32, 36, 48, 52, 57, 59],
        43: [26, 28, 33, 37, 49, 53, 58, 60],
        44: [27, 29, 34, 38, 50, 54, 59, 61],
        45: [28, 30, 35, 39, 51, 55, 60, 62],
        46: [29, 31, 36, 52, 61, 63],
        47: [30, 37, 53, 62],
        48: [33, 42, 58],
        49: [32, 34, 43, 59],
        50: [33, 35, 40, 44, 56, 60],
        51: [34, 36, 41, 45, 57, 61],
        52: [35, 37, 42, 46, 58, 62],
        53: [36, 38, 43, 47, 59, 63],
        54: [37, 39, 44, 60],
        55: [38, 45, 61],
        56: [41, 50],
        57: [40, 42, 51],
        58: [41, 43, 48, 52],
        59: [42, 44, 49, 53],
        60: [43, 45, 50, 54],
        61: [44, 46, 51, 55],
        62: [45, 47, 52],
        63: [46, 53]
    }
}
