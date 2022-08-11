#ifndef CHESS_H
#define CHESS_H

#include <stdint.h>
#include <stdbool.h>

typedef int8_t square_t;
typedef uint64_t board_t;
typedef uint8_t info_t;

/**
 * Every 4 bits represents one square on the board, beginning with a8=0
 * and continuing with b8=4, c8=8, d8=12, ... , g1=248, h1=252. The lowest
 * three bits of each square represent the following:
 *      000 = Empty
 *      001 = King
 *      010 = Queen
 *      011 = Rook
 *      100 = Bishop
 *      101 = Knight
 *      110 = Pawn
 *      111 = En Passant
 * The highest bit means different things based on what the lower 3 bits are.
 * If the lowest 3 bits represent a piece [001 thru 110], the bit represents the
 * color of piece (0=white, 1=black). If the lower 3 bits are 000 (Empty), then
 * the highest bit represents something different based on how many empty
 * squares have already been found. These representations are as follows:
 *      0 = white to move ? (1 = white's turn; 0 = black's turn)
 *      1 = is the game over ? (1 = yes, game has ended; 0 = no, game is live)
 *      2 = did white win ? (1 = yes, white won; 0 = no, white lost or tied)
 *      3 = did black win ? (1 = yes, black won; 0 = no, black lost or tied)
 *      4 = can white castle kingside ? (1 = yes; 0 = no)
 *      5 = can white castle queenside ? (1 = yes; 0 = no)
 *      6 = can black castle kingside ? (1 = yes; 0 = no)
 *      7 = can black castle queenside ? (1 = yes; 0 = no)
 * For the En Passant square, if there is one, the highest bit represents Empty_0
 * This structure requires at least 8 empty squares to hold all necessary data.
 *      (A normal chess game will always have at least 32 empty squares)
 */
typedef struct _position_hash {
    uint64_t b0_63;
    uint64_t b64_127;
    uint64_t b128_191;
    uint64_t b192_255;
} position_hash;

typedef struct _position {
    board_t white_king, white_queen, white_rook, white_bishop, white_knight, white_pawn;
    board_t black_king, black_queen, black_rook, black_bishop, black_knight, black_pawn;
    
    uint16_t full_turn_counter;
    uint8_t fifty_move_counter;

    square_t en_passant;
    square_t king_square_w;
    square_t king_square_b;

    info_t info;
} position_t;

typedef struct _move {
    square_t source;
    square_t target;
    // lowest 3 bits:
    //    000 - none
    //    001 - King
    //    010 - Queen
    //    011 - Rook
    //    100 - Bishop
    //    101 - Knight
    //    110 - Pawn
    //    111 - en passant target square
    // 4th lowest bit = 1 if piece_is_white else 0
    // 5th-7th lowest bits:
    //    same as above, but represents a pawn promoting to that piece
    // highest bit = 1 if piece_is_captured else 0
    uint8_t piece;
} move_t;

square_t * translate(board_t board);
position_t * from_FEN(char * fen);
char * to_FEN(position_t position);

char * position_string(position_t position);
char * move_string(move_t move);
char * move_full_string(move_t move, position_t position);
char * board_string(board_t board);

move_t * legal_moves(position_t * position, bool captures_only);
move_t * calculate_sliding_moves(position_t * position, square_t square, move_t * legal_moves, uint8_t piece,
                                 board_t occupied_by_self, board_t occupied_by_other, board_t * defended, board_t * attacked);
move_t * calculate_pawn_moves(position_t * position, square_t square, move_t * legal_moves, board_t occupied_by_self,
                              board_t occupied_by_other, board_t * defended, board_t * attacked);
move_t * calculate_king_moves(position_t * position, square_t square, move_t * legal_moves, board_t occupied_by_self,
                              board_t occupied_by_other, board_t * defended, board_t * attacked);
move_t * calculate_knight_moves(position_t * position, square_t square, move_t * legal_moves, board_t occupied_by_self,
                                board_t occupied_by_other, board_t * defended, board_t * attacked);

void update_position_by_move(position_t * position, move_t move);
bool king_is_attacked(position_t * position, bool white_king);
bool check_move_legality(position_t * position, move_t * move);
position_t * play_move(position_t * position, move_t move);

#endif