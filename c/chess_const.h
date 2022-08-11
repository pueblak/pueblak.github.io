#ifndef CHESS_CONST_H
#define CHESS_CONST_H

#include "chess.h"

/**
 *            BOARD REFERENCE (decimal)
 *   -----------------------------------------
 * 8 | 00 | 01 | 02 | 03 | 04 | 05 | 06 | 07 |
 *   |----+----+----+----+----+----+----+----|
 * 7 | 08 | 09 | 10 | 11 | 12 | 13 | 14 | 15 |
 *   |----+----+----+----+----+----+----+----|
 * 6 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
 *   |----+----+----+----+----+----+----+----|
 * 5 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 |
 *   |----+----+----+----+----+----+----+----|
 * 4 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 |
 *   |----+----+----+----+----+----+----+----|
 * 3 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 |
 *   |----+----+----+----+----+----+----+----|
 * 2 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 |
 *   |----+----+----+----+----+----+----+----|
 * 1 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 |
 *   -----------------------------------------
 *     a    b    c    d    e    f    g    h
 */

const board_t BOARD_RANK[] = { 0xff, 0xff00, 0xff0000, 0xff000000, 0xff00000000, 0xff0000000000, 0xff000000000000, 0xff00000000000000 };
const board_t BOARD_FILE[] = { 0x101010101010101, 0x202020202020202, 0x404040404040404, 0x808080808080808, 0x1010101010101010, 0x2020202020202020, 0x4040404040404040, 0x8080808080808080 };
const char BOARD_RANK_CHR[] = { '8', '7', '6', '5', '4', '3', '2', '1' };
const char BOARD_FILE_CHR[] = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' };

const char * square_names[] = {
    "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
    "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
    "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
    "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
    "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
    "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
    "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
    "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"
};

const uint8_t KING = 1;
const uint8_t QUEEN = 2;
const uint8_t ROOK = 3;
const uint8_t BISHOP = 4;
const uint8_t KNIGHT = 5;
const uint8_t PAWN = 6;
const char PIECE_NAME[] = { ' ', 'K', 'Q', 'R', 'B', 'N', 'P' };

const board_t WHITE_CASTLE_CHECK_K = 0x6000000000000000;        // squares  61, 62
const board_t WHITE_CASTLE_K_ROOK_MOVE = 0xa000000000000000;    // squares  61, 63
const board_t WHITE_CASTLE_CHECK_Q = 0xc00000000000000;         // squares  58, 59
const board_t WHITE_CASTLE_CHECK_Qx = 0x200000000000000;        // square   57
const board_t WHITE_CASTLE_Q_ROOK_MOVE = 0x900000000000000;     // squares  56, 59
const board_t BLACK_CASTLE_CHECK_K = 0x60;                      // squares  05, 06
const board_t BLACK_CASTLE_K_ROOK_MOVE = 0xa0;                  // squares  05, 07
const board_t BLACK_CASTLE_CHECK_Q = 0xc;                       // squares  02, 03
const board_t BLACK_CASTLE_CHECK_Qx = 0x2;                      // square   01
const board_t BLACK_CASTLE_Q_ROOK_MOVE = 0x9;                   // squares  00, 03

const info_t WHITE_TO_MOVE = 1U;
const info_t GAME_OVER = 2U;
const info_t WHITE_WINS = 4U;
const info_t BLACK_WINS = 8U;
const info_t WHITE_CASTLE_K = 16U;
const info_t WHITE_CASTLE_Q = 32U;
const info_t BLACK_CASTLE_K = 64U;
const info_t BLACK_CASTLE_Q = 128U;

const uint8_t PIECE = 7U;
const uint8_t CAPTURE = 8U;
const uint8_t PROMOTE = 112U;
const uint8_t CHECK = 128U;

const square_t EMPTY_SQUARES[] = {
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1
};

// lookup values for pre-calculated piece moves
const square_t K_AT_A8[] = { 1, 8, 9, -1 };
const square_t K_AT_B8[] = { 0, 2, 8, 9, 10, -1 };
const square_t K_AT_C8[] = { 1, 3, 9, 10, 11, -1 };
const square_t K_AT_D8[] = { 2, 4, 10, 11, 12, -1 };
const square_t K_AT_E8[] = { 3, 5, 11, 12, 13, -1 };
const square_t K_AT_F8[] = { 4, 6, 12, 13, 14, -1 };
const square_t K_AT_G8[] = { 5, 7, 13, 14, 15, -1 };
const square_t K_AT_H8[] = { 6, 14, 15, -1 };
const square_t K_AT_A7[] = { 0, 1, 9, 16, 17, -1 };
const square_t K_AT_B7[] = { 0, 1, 2, 8, 10, 16, 17, 18, -1 };
const square_t K_AT_C7[] = { 1, 2, 3, 9, 11, 17, 18, 19, -1 };
const square_t K_AT_D7[] = { 2, 3, 4, 10, 12, 18, 19, 20, -1 };
const square_t K_AT_E7[] = { 3, 4, 5, 11, 13, 19, 20, 21, -1 };
const square_t K_AT_F7[] = { 4, 5, 6, 12, 14, 20, 21, 22, -1 };
const square_t K_AT_G7[] = { 5, 6, 7, 13, 15, 21, 22, 23, -1 };
const square_t K_AT_H7[] = { 6, 7, 14, 22, 23, -1 };
const square_t K_AT_A6[] = { 8, 9, 17, 24, 25, -1 };
const square_t K_AT_B6[] = { 8, 9, 10, 16, 18, 24, 25, 26, -1 };
const square_t K_AT_C6[] = { 9, 10, 11, 17, 19, 25, 26, 27, -1 };
const square_t K_AT_D6[] = { 10, 11, 12, 18, 20, 26, 27, 28, -1 };
const square_t K_AT_E6[] = { 11, 12, 13, 19, 21, 27, 28, 29, -1 };
const square_t K_AT_F6[] = { 12, 13, 14, 20, 22, 28, 29, 30, -1 };
const square_t K_AT_G6[] = { 13, 14, 15, 21, 23, 29, 30, 31, -1 };
const square_t K_AT_H6[] = { 14, 15, 22, 30, 31, -1 };
const square_t K_AT_A5[] = { 16, 17, 25, 32, 33, -1 };
const square_t K_AT_B5[] = { 16, 17, 18, 24, 26, 32, 33, 34, -1 };
const square_t K_AT_C5[] = { 17, 18, 19, 25, 27, 33, 34, 35, -1 };
const square_t K_AT_D5[] = { 18, 19, 20, 26, 28, 34, 35, 36, -1 };
const square_t K_AT_E5[] = { 19, 20, 21, 27, 29, 35, 36, 37, -1 };
const square_t K_AT_F5[] = { 20, 21, 22, 28, 30, 36, 37, 38, -1 };
const square_t K_AT_G5[] = { 21, 22, 23, 29, 31, 37, 38, 39, -1 };
const square_t K_AT_H5[] = { 22, 23, 30, 38, 39, -1 };
const square_t K_AT_A4[] = { 24, 25, 33, 40, 41, -1 };
const square_t K_AT_B4[] = { 24, 25, 26, 32, 34, 40, 41, 42, -1 };
const square_t K_AT_C4[] = { 25, 26, 27, 33, 35, 41, 42, 43, -1 };
const square_t K_AT_D4[] = { 26, 27, 28, 34, 36, 42, 43, 44, -1 };
const square_t K_AT_E4[] = { 27, 28, 29, 35, 37, 43, 44, 45, -1 };
const square_t K_AT_F4[] = { 28, 29, 30, 36, 38, 44, 45, 46, -1 };
const square_t K_AT_G4[] = { 29, 30, 31, 37, 39, 45, 46, 47, -1 };
const square_t K_AT_H4[] = { 30, 31, 38, 46, 47, -1 };
const square_t K_AT_A3[] = { 32, 33, 41, 48, 49, -1 };
const square_t K_AT_B3[] = { 32, 33, 34, 40, 42, 48, 49, 50, -1 };
const square_t K_AT_C3[] = { 33, 34, 35, 41, 43, 49, 50, 51, -1 };
const square_t K_AT_D3[] = { 34, 35, 36, 42, 44, 50, 51, 52, -1 };
const square_t K_AT_E3[] = { 35, 36, 37, 43, 45, 51, 52, 53, -1 };
const square_t K_AT_F3[] = { 36, 37, 38, 44, 46, 52, 53, 54, -1 };
const square_t K_AT_G3[] = { 37, 38, 39, 45, 47, 53, 54, 55, -1 };
const square_t K_AT_H3[] = { 38, 39, 46, 54, 55, -1 };
const square_t K_AT_A2[] = { 40, 41, 49, 56, 57, -1 };
const square_t K_AT_B2[] = { 40, 41, 42, 48, 50, 56, 57, 58, -1 };
const square_t K_AT_C2[] = { 41, 42, 43, 49, 51, 57, 58, 59, -1 };
const square_t K_AT_D2[] = { 42, 43, 44, 50, 52, 58, 59, 60, -1 };
const square_t K_AT_E2[] = { 43, 44, 45, 51, 53, 59, 60, 61, -1 };
const square_t K_AT_F2[] = { 44, 45, 46, 52, 54, 60, 61, 62, -1 };
const square_t K_AT_G2[] = { 45, 46, 47, 53, 55, 61, 62, 63, -1 };
const square_t K_AT_H2[] = { 46, 47, 54, 62, 63, -1 };
const square_t K_AT_A1[] = { 48, 49, 57, -1 };
const square_t K_AT_B1[] = { 48, 49, 50, 56, 58, -1 };
const square_t K_AT_C1[] = { 49, 50, 51, 57, 59, -1 };
const square_t K_AT_D1[] = { 50, 51, 52, 58, 60, -1 };
const square_t K_AT_E1[] = { 51, 52, 53, 59, 61, -1 };
const square_t K_AT_F1[] = { 52, 53, 54, 60, 62, -1 };
const square_t K_AT_G1[] = { 53, 54, 55, 61, 63, -1 };
const square_t K_AT_H1[] = { 54, 55, 62, -1 };
const square_t N_AT_A8[] = { 10, 17, -1 };
const square_t N_AT_B8[] = { 11, 16, 18, -1 };
const square_t N_AT_C8[] = { 8, 12, 17, 19, -1 };
const square_t N_AT_D8[] = { 9, 13, 18, 20, -1 };
const square_t N_AT_E8[] = { 10, 14, 19, 21, -1 };
const square_t N_AT_F8[] = { 11, 15, 20, 22, -1 };
const square_t N_AT_G8[] = { 12, 21, 23, -1 };
const square_t N_AT_H8[] = { 13, 22, -1 };
const square_t N_AT_A7[] = { 2, 18, 25, -1 };
const square_t N_AT_B7[] = { 3, 19, 24, 26, -1 };
const square_t N_AT_C7[] = { 0, 4, 16, 20, 25, 27, -1 };
const square_t N_AT_D7[] = { 1, 5, 17, 21, 26, 28, -1 };
const square_t N_AT_E7[] = { 2, 6, 18, 22, 27, 29, -1 };
const square_t N_AT_F7[] = { 3, 7, 19, 23, 28, 30, -1 };
const square_t N_AT_G7[] = { 4, 20, 29, 31, -1 };
const square_t N_AT_H7[] = { 5, 21, 30, -1 };
const square_t N_AT_A6[] = { 1, 10, 26, 33, -1 };
const square_t N_AT_B6[] = { 0, 2, 11, 27, 32, 34, -1 };
const square_t N_AT_C6[] = { 1, 3, 8, 12, 24, 28, 33, 35, -1 };
const square_t N_AT_D6[] = { 2, 4, 9, 13, 25, 29, 34, 36, -1 };
const square_t N_AT_E6[] = { 3, 5, 10, 14, 26, 30, 35, 37, -1 };
const square_t N_AT_F6[] = { 4, 6, 11, 15, 27, 31, 36, 38, -1 };
const square_t N_AT_G6[] = { 5, 7, 12, 28, 37, 39, -1 };
const square_t N_AT_H6[] = { 6, 13, 29, 38, -1 };
const square_t N_AT_A5[] = { 9, 18, 34, 41, -1 };
const square_t N_AT_B5[] = { 8, 10, 19, 35, 40, 42, -1 };
const square_t N_AT_C5[] = { 9, 11, 16, 20, 32, 36, 41, 43, -1 };
const square_t N_AT_D5[] = { 10, 12, 17, 21, 33, 37, 42, 44, -1 };
const square_t N_AT_E5[] = { 11, 13, 18, 22, 34, 38, 43, 45, -1 };
const square_t N_AT_F5[] = { 12, 14, 19, 23, 35, 39, 44, 46, -1 };
const square_t N_AT_G5[] = { 13, 15, 20, 36, 45, 47, -1 };
const square_t N_AT_H5[] = { 14, 21, 37, 46, -1 };
const square_t N_AT_A4[] = { 17, 26, 42, 49, -1 };
const square_t N_AT_B4[] = { 16, 18, 27, 43, 48, 50, -1 };
const square_t N_AT_C4[] = { 17, 19, 24, 28, 40, 44, 49, 51, -1 };
const square_t N_AT_D4[] = { 18, 20, 25, 29, 41, 45, 50, 52, -1 };
const square_t N_AT_E4[] = { 19, 21, 26, 30, 42, 46, 51, 53, -1 };
const square_t N_AT_F4[] = { 20, 22, 27, 31, 43, 47, 52, 54, -1 };
const square_t N_AT_G4[] = { 21, 23, 28, 44, 53, 55, -1 };
const square_t N_AT_H4[] = { 22, 29, 45, 54, -1 };
const square_t N_AT_A3[] = { 25, 34, 50, 57, -1 };
const square_t N_AT_B3[] = { 24, 26, 35, 51, 56, 58, -1 };
const square_t N_AT_C3[] = { 25, 27, 32, 36, 48, 52, 57, 59, -1 };
const square_t N_AT_D3[] = { 26, 28, 33, 37, 49, 53, 58, 60, -1 };
const square_t N_AT_E3[] = { 27, 29, 34, 38, 50, 54, 59, 61, -1 };
const square_t N_AT_F3[] = { 28, 30, 35, 39, 51, 55, 60, 62, -1 };
const square_t N_AT_G3[] = { 29, 31, 36, 52, 61, 63, -1 };
const square_t N_AT_H3[] = { 30, 37, 53, 62, -1 };
const square_t N_AT_A2[] = { 33, 42, 58, -1 };
const square_t N_AT_B2[] = { 32, 34, 43, 59, -1 };
const square_t N_AT_C2[] = { 33, 35, 40, 44, 56, 60, -1 };
const square_t N_AT_D2[] = { 34, 36, 41, 45, 57, 61, -1 };
const square_t N_AT_E2[] = { 35, 37, 42, 46, 58, 62, -1 };
const square_t N_AT_F2[] = { 36, 38, 43, 47, 59, 63, -1 };
const square_t N_AT_G2[] = { 37, 39, 44, 60, -1 };
const square_t N_AT_H2[] = { 38, 45, 61, -1 };
const square_t N_AT_A1[] = { 41, 50, -1 };
const square_t N_AT_B1[] = { 40, 42, 51, -1 };
const square_t N_AT_C1[] = { 41, 43, 48, 52, -1 };
const square_t N_AT_D1[] = { 42, 44, 49, 53, -1 };
const square_t N_AT_E1[] = { 43, 45, 50, 54, -1 };
const square_t N_AT_F1[] = { 44, 46, 51, 55, -1 };
const square_t N_AT_G1[] = { 45, 47, 52, -1 };
const square_t N_AT_H1[] = { 46, 53, -1 };
const square_t B_AT_A8[] = { -1, -1, -1, 9, 18, 27, 36, 45, 54, 63, -1 };
const square_t B_AT_B8[] = { -1, -1, 8, -1, 10, 19, 28, 37, 46, 55, -1 };
const square_t B_AT_C8[] = { -1, -1, 9, 16, -1, 11, 20, 29, 38, 47, -1 };
const square_t B_AT_D8[] = { -1, -1, 10, 17, 24, -1, 12, 21, 30, 39, -1 };
const square_t B_AT_E8[] = { -1, -1, 11, 18, 25, 32, -1, 13, 22, 31, -1 };
const square_t B_AT_F8[] = { -1, -1, 12, 19, 26, 33, 40, -1, 14, 23, -1 };
const square_t B_AT_G8[] = { -1, -1, 13, 20, 27, 34, 41, 48, -1, 15, -1 };
const square_t B_AT_H8[] = { -1, -1, 14, 21, 28, 35, 42, 49, 56, -1, -1 };
const square_t B_AT_A7[] = { 1, -1, -1, -1, 17, 26, 35, 44, 53, 62, -1 };
const square_t B_AT_B7[] = { 2, -1, 0, -1, 16, -1, 18, 27, 36, 45, 54, 63, -1 };
const square_t B_AT_C7[] = { 3, -1, 1, -1, 17, 24, -1, 19, 28, 37, 46, 55, -1 };
const square_t B_AT_D7[] = { 4, -1, 2, -1, 18, 25, 32, -1, 20, 29, 38, 47, -1 };
const square_t B_AT_E7[] = { 5, -1, 3, -1, 19, 26, 33, 40, -1, 21, 30, 39, -1 };
const square_t B_AT_F7[] = { 6, -1, 4, -1, 20, 27, 34, 41, 48, -1, 22, 31, -1 };
const square_t B_AT_G7[] = { 7, -1, 5, -1, 21, 28, 35, 42, 49, 56, -1, 23, -1 };
const square_t B_AT_H7[] = { -1, 6, -1, 22, 29, 36, 43, 50, 57, -1, -1 };
const square_t B_AT_A6[] = { 9, 2, -1, -1, -1, 25, 34, 43, 52, 61, -1 };
const square_t B_AT_B6[] = { 10, 3, -1, 8, -1, 24, -1, 26, 35, 44, 53, 62, -1 };
const square_t B_AT_C6[] = { 11, 4, -1, 9, 0, -1, 25, 32, -1, 27, 36, 45, 54, 63, -1 };
const square_t B_AT_D6[] = { 12, 5, -1, 10, 1, -1, 26, 33, 40, -1, 28, 37, 46, 55, -1 };
const square_t B_AT_E6[] = { 13, 6, -1, 11, 2, -1, 27, 34, 41, 48, -1, 29, 38, 47, -1 };
const square_t B_AT_F6[] = { 14, 7, -1, 12, 3, -1, 28, 35, 42, 49, 56, -1, 30, 39, -1 };
const square_t B_AT_G6[] = { 15, -1, 13, 4, -1, 29, 36, 43, 50, 57, -1, 31, -1 };
const square_t B_AT_H6[] = { -1, 14, 5, -1, 30, 37, 44, 51, 58, -1, -1 };
const square_t B_AT_A5[] = { 17, 10, 3, -1, -1, -1, 33, 42, 51, 60, -1 };
const square_t B_AT_B5[] = { 18, 11, 4, -1, 16, -1, 32, -1, 34, 43, 52, 61, -1 };
const square_t B_AT_C5[] = { 19, 12, 5, -1, 17, 8, -1, 33, 40, -1, 35, 44, 53, 62, -1 };
const square_t B_AT_D5[] = { 20, 13, 6, -1, 18, 9, 0, -1, 34, 41, 48, -1, 36, 45, 54, 63, -1 };
const square_t B_AT_E5[] = { 21, 14, 7, -1, 19, 10, 1, -1, 35, 42, 49, 56, -1, 37, 46, 55, -1 };
const square_t B_AT_F5[] = { 22, 15, -1, 20, 11, 2, -1, 36, 43, 50, 57, -1, 38, 47, -1 };
const square_t B_AT_G5[] = { 23, -1, 21, 12, 3, -1, 37, 44, 51, 58, -1, 39, -1 };
const square_t B_AT_H5[] = { -1, 22, 13, 4, -1, 38, 45, 52, 59, -1, -1 };
const square_t B_AT_A4[] = { 25, 18, 11, 4, -1, -1, -1, 41, 50, 59, -1 };
const square_t B_AT_B4[] = { 26, 19, 12, 5, -1, 24, -1, 40, -1, 42, 51, 60, -1 };
const square_t B_AT_C4[] = { 27, 20, 13, 6, -1, 25, 16, -1, 41, 48, -1, 43, 52, 61, -1 };
const square_t B_AT_D4[] = { 28, 21, 14, 7, -1, 26, 17, 8, -1, 42, 49, 56, -1, 44, 53, 62, -1 };
const square_t B_AT_E4[] = { 29, 22, 15, -1, 27, 18, 9, 0, -1, 43, 50, 57, -1, 45, 54, 63, -1 };
const square_t B_AT_F4[] = { 30, 23, -1, 28, 19, 10, 1, -1, 44, 51, 58, -1, 46, 55, -1 };
const square_t B_AT_G4[] = { 31, -1, 29, 20, 11, 2, -1, 45, 52, 59, -1, 47, -1 };
const square_t B_AT_H4[] = { -1, 30, 21, 12, 3, -1, 46, 53, 60, -1, -1 };
const square_t B_AT_A3[] = { 33, 26, 19, 12, 5, -1, -1, -1, 49, 58, -1 };
const square_t B_AT_B3[] = { 34, 27, 20, 13, 6, -1, 32, -1, 48, -1, 50, 59, -1 };
const square_t B_AT_C3[] = { 35, 28, 21, 14, 7, -1, 33, 24, -1, 49, 56, -1, 51, 60, -1 };
const square_t B_AT_D3[] = { 36, 29, 22, 15, -1, 34, 25, 16, -1, 50, 57, -1, 52, 61, -1 };
const square_t B_AT_E3[] = { 37, 30, 23, -1, 35, 26, 17, 8, -1, 51, 58, -1, 53, 62, -1 };
const square_t B_AT_F3[] = { 38, 31, -1, 36, 27, 18, 9, 0, -1, 52, 59, -1, 54, 63, -1 };
const square_t B_AT_G3[] = { 39, -1, 37, 28, 19, 10, 1, -1, 53, 60, -1, 55, -1 };
const square_t B_AT_H3[] = { -1, 38, 29, 20, 11, 2, -1, 54, 61, -1, -1 };
const square_t B_AT_A2[] = { 41, 34, 27, 20, 13, 6, -1, -1, -1, 57, -1 };
const square_t B_AT_B2[] = { 42, 35, 28, 21, 14, 7, -1, 40, -1, 56, -1, 58, -1 };
const square_t B_AT_C2[] = { 43, 36, 29, 22, 15, -1, 41, 32, -1, 57, -1, 59, -1 };
const square_t B_AT_D2[] = { 44, 37, 30, 23, -1, 42, 33, 24, -1, 58, -1, 60, -1 };
const square_t B_AT_E2[] = { 45, 38, 31, -1, 43, 34, 25, 16, -1, 59, -1, 61, -1 };
const square_t B_AT_F2[] = { 46, 39, -1, 44, 35, 26, 17, 8, -1, 60, -1, 62, -1 };
const square_t B_AT_G2[] = { 47, -1, 45, 36, 27, 18, 9, 0, -1, 61, -1, 63, -1 };
const square_t B_AT_H2[] = { -1, 46, 37, 28, 19, 10, 1, -1, 62, -1, -1 };
const square_t B_AT_A1[] = { 49, 42, 35, 28, 21, 14, 7, -1, -1, -1, -1 };
const square_t B_AT_B1[] = { 50, 43, 36, 29, 22, 15, -1, 48, -1, -1, -1 };
const square_t B_AT_C1[] = { 51, 44, 37, 30, 23, -1, 49, 40, -1, -1, -1 };
const square_t B_AT_D1[] = { 52, 45, 38, 31, -1, 50, 41, 32, -1, -1, -1 };
const square_t B_AT_E1[] = { 53, 46, 39, -1, 51, 42, 33, 24, -1, -1, -1 };
const square_t B_AT_F1[] = { 54, 47, -1, 52, 43, 34, 25, 16, -1, -1, -1 };
const square_t B_AT_G1[] = { 55, -1, 53, 44, 35, 26, 17, 8, -1, -1, -1 };
const square_t B_AT_H1[] = { -1, 54, 45, 36, 27, 18, 9, 0, -1, -1, -1 };
const square_t R_AT_A8[] = { 1, 2, 3, 4, 5, 6, 7, -1, -1, -1, 8, 16, 24, 32, 40, 48, 56, -1 };
const square_t R_AT_B8[] = { 2, 3, 4, 5, 6, 7, -1, -1, 0, -1, 9, 17, 25, 33, 41, 49, 57, -1 };
const square_t R_AT_C8[] = { 3, 4, 5, 6, 7, -1, -1, 1, 0, -1, 10, 18, 26, 34, 42, 50, 58, -1 };
const square_t R_AT_D8[] = { 4, 5, 6, 7, -1, -1, 2, 1, 0, -1, 11, 19, 27, 35, 43, 51, 59, -1 };
const square_t R_AT_E8[] = { 5, 6, 7, -1, -1, 3, 2, 1, 0, -1, 12, 20, 28, 36, 44, 52, 60, -1 };
const square_t R_AT_F8[] = { 6, 7, -1, -1, 4, 3, 2, 1, 0, -1, 13, 21, 29, 37, 45, 53, 61, -1 };
const square_t R_AT_G8[] = { 7, -1, -1, 5, 4, 3, 2, 1, 0, -1, 14, 22, 30, 38, 46, 54, 62, -1 };
const square_t R_AT_H8[] = { -1, -1, 6, 5, 4, 3, 2, 1, 0, -1, 15, 23, 31, 39, 47, 55, 63, -1 };
const square_t R_AT_A7[] = { 9, 10, 11, 12, 13, 14, 15, -1, 0, -1, -1, 16, 24, 32, 40, 48, 56, -1 };
const square_t R_AT_B7[] = { 10, 11, 12, 13, 14, 15, -1, 1, -1, 8, -1, 17, 25, 33, 41, 49, 57, -1 };
const square_t R_AT_C7[] = { 11, 12, 13, 14, 15, -1, 2, -1, 9, 8, -1, 18, 26, 34, 42, 50, 58, -1 };
const square_t R_AT_D7[] = { 12, 13, 14, 15, -1, 3, -1, 10, 9, 8, -1, 19, 27, 35, 43, 51, 59, -1 };
const square_t R_AT_E7[] = { 13, 14, 15, -1, 4, -1, 11, 10, 9, 8, -1, 20, 28, 36, 44, 52, 60, -1 };
const square_t R_AT_F7[] = { 14, 15, -1, 5, -1, 12, 11, 10, 9, 8, -1, 21, 29, 37, 45, 53, 61, -1 };
const square_t R_AT_G7[] = { 15, -1, 6, -1, 13, 12, 11, 10, 9, 8, -1, 22, 30, 38, 46, 54, 62, -1 };
const square_t R_AT_H7[] = { -1, 7, -1, 14, 13, 12, 11, 10, 9, 8, -1, 23, 31, 39, 47, 55, 63, -1 };
const square_t R_AT_A6[] = { 17, 18, 19, 20, 21, 22, 23, -1, 8, 0, -1, -1, 24, 32, 40, 48, 56, -1 };
const square_t R_AT_B6[] = { 18, 19, 20, 21, 22, 23, -1, 9, 1, -1, 16, -1, 25, 33, 41, 49, 57, -1 };
const square_t R_AT_C6[] = { 19, 20, 21, 22, 23, -1, 10, 2, -1, 17, 16, -1, 26, 34, 42, 50, 58, -1 };
const square_t R_AT_D6[] = { 20, 21, 22, 23, -1, 11, 3, -1, 18, 17, 16, -1, 27, 35, 43, 51, 59, -1 };
const square_t R_AT_E6[] = { 21, 22, 23, -1, 12, 4, -1, 19, 18, 17, 16, -1, 28, 36, 44, 52, 60, -1 };
const square_t R_AT_F6[] = { 22, 23, -1, 13, 5, -1, 20, 19, 18, 17, 16, -1, 29, 37, 45, 53, 61, -1 };
const square_t R_AT_G6[] = { 23, -1, 14, 6, -1, 21, 20, 19, 18, 17, 16, -1, 30, 38, 46, 54, 62, -1 };
const square_t R_AT_H6[] = { -1, 15, 7, -1, 22, 21, 20, 19, 18, 17, 16, -1, 31, 39, 47, 55, 63, -1 };
const square_t R_AT_A5[] = { 25, 26, 27, 28, 29, 30, 31, -1, 16, 8, 0, -1, -1, 32, 40, 48, 56, -1 };
const square_t R_AT_B5[] = { 26, 27, 28, 29, 30, 31, -1, 17, 9, 1, -1, 24, -1, 33, 41, 49, 57, -1 };
const square_t R_AT_C5[] = { 27, 28, 29, 30, 31, -1, 18, 10, 2, -1, 25, 24, -1, 34, 42, 50, 58, -1 };
const square_t R_AT_D5[] = { 28, 29, 30, 31, -1, 19, 11, 3, -1, 26, 25, 24, -1, 35, 43, 51, 59, -1 };
const square_t R_AT_E5[] = { 29, 30, 31, -1, 20, 12, 4, -1, 27, 26, 25, 24, -1, 36, 44, 52, 60, -1 };
const square_t R_AT_F5[] = { 30, 31, -1, 21, 13, 5, -1, 28, 27, 26, 25, 24, -1, 37, 45, 53, 61, -1 };
const square_t R_AT_G5[] = { 31, -1, 22, 14, 6, -1, 29, 28, 27, 26, 25, 24, -1, 38, 46, 54, 62, -1 };
const square_t R_AT_H5[] = { -1, 23, 15, 7, -1, 30, 29, 28, 27, 26, 25, 24, -1, 39, 47, 55, 63, -1 };
const square_t R_AT_A4[] = { 33, 34, 35, 36, 37, 38, 39, -1, 24, 16, 8, 0, -1, -1, 40, 48, 56, -1 };
const square_t R_AT_B4[] = { 34, 35, 36, 37, 38, 39, -1, 25, 17, 9, 1, -1, 32, -1, 41, 49, 57, -1 };
const square_t R_AT_C4[] = { 35, 36, 37, 38, 39, -1, 26, 18, 10, 2, -1, 33, 32, -1, 42, 50, 58, -1 };
const square_t R_AT_D4[] = { 36, 37, 38, 39, -1, 27, 19, 11, 3, -1, 34, 33, 32, -1, 43, 51, 59, -1 };
const square_t R_AT_E4[] = { 37, 38, 39, -1, 28, 20, 12, 4, -1, 35, 34, 33, 32, -1, 44, 52, 60, -1 };
const square_t R_AT_F4[] = { 38, 39, -1, 29, 21, 13, 5, -1, 36, 35, 34, 33, 32, -1, 45, 53, 61, -1 };
const square_t R_AT_G4[] = { 39, -1, 30, 22, 14, 6, -1, 37, 36, 35, 34, 33, 32, -1, 46, 54, 62, -1 };
const square_t R_AT_H4[] = { -1, 31, 23, 15, 7, -1, 38, 37, 36, 35, 34, 33, 32, -1, 47, 55, 63, -1 };
const square_t R_AT_A3[] = { 41, 42, 43, 44, 45, 46, 47, -1, 32, 24, 16, 8, 0, -1, -1, 48, 56, -1 };
const square_t R_AT_B3[] = { 42, 43, 44, 45, 46, 47, -1, 33, 25, 17, 9, 1, -1, 40, -1, 49, 57, -1 };
const square_t R_AT_C3[] = { 43, 44, 45, 46, 47, -1, 34, 26, 18, 10, 2, -1, 41, 40, -1, 50, 58, -1 };
const square_t R_AT_D3[] = { 44, 45, 46, 47, -1, 35, 27, 19, 11, 3, -1, 42, 41, 40, -1, 51, 59, -1 };
const square_t R_AT_E3[] = { 45, 46, 47, -1, 36, 28, 20, 12, 4, -1, 43, 42, 41, 40, -1, 52, 60, -1 };
const square_t R_AT_F3[] = { 46, 47, -1, 37, 29, 21, 13, 5, -1, 44, 43, 42, 41, 40, -1, 53, 61, -1 };
const square_t R_AT_G3[] = { 47, -1, 38, 30, 22, 14, 6, -1, 45, 44, 43, 42, 41, 40, -1, 54, 62, -1 };
const square_t R_AT_H3[] = { -1, 39, 31, 23, 15, 7, -1, 46, 45, 44, 43, 42, 41, 40, -1, 55, 63, -1 };
const square_t R_AT_A2[] = { 49, 50, 51, 52, 53, 54, 55, -1, 40, 32, 24, 16, 8, 0, -1, -1, 56, -1 };
const square_t R_AT_B2[] = { 50, 51, 52, 53, 54, 55, -1, 41, 33, 25, 17, 9, 1, -1, 48, -1, 57, -1 };
const square_t R_AT_C2[] = { 51, 52, 53, 54, 55, -1, 42, 34, 26, 18, 10, 2, -1, 49, 48, -1, 58, -1 };
const square_t R_AT_D2[] = { 52, 53, 54, 55, -1, 43, 35, 27, 19, 11, 3, -1, 50, 49, 48, -1, 59, -1 };
const square_t R_AT_E2[] = { 53, 54, 55, -1, 44, 36, 28, 20, 12, 4, -1, 51, 50, 49, 48, -1, 60, -1 };
const square_t R_AT_F2[] = { 54, 55, -1, 45, 37, 29, 21, 13, 5, -1, 52, 51, 50, 49, 48, -1, 61, -1 };
const square_t R_AT_G2[] = { 55, -1, 46, 38, 30, 22, 14, 6, -1, 53, 52, 51, 50, 49, 48, -1, 62, -1 };
const square_t R_AT_H2[] = { -1, 47, 39, 31, 23, 15, 7, -1, 54, 53, 52, 51, 50, 49, 48, -1, 63, -1 };
const square_t R_AT_A1[] = { 57, 58, 59, 60, 61, 62, 63, -1, 48, 40, 32, 24, 16, 8, 0, -1, -1, -1 };
const square_t R_AT_B1[] = { 58, 59, 60, 61, 62, 63, -1, 49, 41, 33, 25, 17, 9, 1, -1, 56, -1, -1 };
const square_t R_AT_C1[] = { 59, 60, 61, 62, 63, -1, 50, 42, 34, 26, 18, 10, 2, -1, 57, 56, -1, -1 };
const square_t R_AT_D1[] = { 60, 61, 62, 63, -1, 51, 43, 35, 27, 19, 11, 3, -1, 58, 57, 56, -1, -1 };
const square_t R_AT_E1[] = { 61, 62, 63, -1, 52, 44, 36, 28, 20, 12, 4, -1, 59, 58, 57, 56, -1, -1 };
const square_t R_AT_F1[] = { 62, 63, -1, 53, 45, 37, 29, 21, 13, 5, -1, 60, 59, 58, 57, 56, -1, -1 };
const square_t R_AT_G1[] = { 63, -1, 54, 46, 38, 30, 22, 14, 6, -1, 61, 60, 59, 58, 57, 56, -1, -1 };
const square_t R_AT_H1[] = { -1, 55, 47, 39, 31, 23, 15, 7, -1, 62, 61, 60, 59, 58, 57, 56, -1, -1 };

const square_t * MOVES_LOOKUP[4][64] = {
    { // king moves
        K_AT_A8, K_AT_B8, K_AT_C8, K_AT_D8, K_AT_E8, K_AT_F8, K_AT_G8, K_AT_H8,
        K_AT_A7, K_AT_B7, K_AT_C7, K_AT_D7, K_AT_E7, K_AT_F7, K_AT_G7, K_AT_H7,
        K_AT_A6, K_AT_B6, K_AT_C6, K_AT_D6, K_AT_E6, K_AT_F6, K_AT_G6, K_AT_H6,
        K_AT_A5, K_AT_B5, K_AT_C5, K_AT_D5, K_AT_E5, K_AT_F5, K_AT_G5, K_AT_H5,
        K_AT_A4, K_AT_B4, K_AT_C4, K_AT_D4, K_AT_E4, K_AT_F4, K_AT_G4, K_AT_H4,
        K_AT_A3, K_AT_B3, K_AT_C3, K_AT_D3, K_AT_E3, K_AT_F3, K_AT_G3, K_AT_H3,
        K_AT_A2, K_AT_B2, K_AT_C2, K_AT_D2, K_AT_E2, K_AT_F2, K_AT_G2, K_AT_H2,
        K_AT_A1, K_AT_B1, K_AT_C1, K_AT_D1, K_AT_E1, K_AT_F1, K_AT_G1, K_AT_H1
    }, { // knight moves
        N_AT_A8, N_AT_B8, N_AT_C8, N_AT_D8, N_AT_E8, N_AT_F8, N_AT_G8, N_AT_H8,
        N_AT_A7, N_AT_B7, N_AT_C7, N_AT_D7, N_AT_E7, N_AT_F7, N_AT_G7, N_AT_H7,
        N_AT_A6, N_AT_B6, N_AT_C6, N_AT_D6, N_AT_E6, N_AT_F6, N_AT_G6, N_AT_H6,
        N_AT_A5, N_AT_B5, N_AT_C5, N_AT_D5, N_AT_E5, N_AT_F5, N_AT_G5, N_AT_H5,
        N_AT_A4, N_AT_B4, N_AT_C4, N_AT_D4, N_AT_E4, N_AT_F4, N_AT_G4, N_AT_H4,
        N_AT_A3, N_AT_B3, N_AT_C3, N_AT_D3, N_AT_E3, N_AT_F3, N_AT_G3, N_AT_H3,
        N_AT_A2, N_AT_B2, N_AT_C2, N_AT_D2, N_AT_E2, N_AT_F2, N_AT_G2, N_AT_H2,
        N_AT_A1, N_AT_B1, N_AT_C1, N_AT_D1, N_AT_E1, N_AT_F1, N_AT_G1, N_AT_H1
    }, { // bishop moves
        B_AT_A8, B_AT_B8, B_AT_C8, B_AT_D8, B_AT_E8, B_AT_F8, B_AT_G8, B_AT_H8,
        B_AT_A7, B_AT_B7, B_AT_C7, B_AT_D7, B_AT_E7, B_AT_F7, B_AT_G7, B_AT_H7,
        B_AT_A6, B_AT_B6, B_AT_C6, B_AT_D6, B_AT_E6, B_AT_F6, B_AT_G6, B_AT_H6,
        B_AT_A5, B_AT_B5, B_AT_C5, B_AT_D5, B_AT_E5, B_AT_F5, B_AT_G5, B_AT_H5,
        B_AT_A4, B_AT_B4, B_AT_C4, B_AT_D4, B_AT_E4, B_AT_F4, B_AT_G4, B_AT_H4,
        B_AT_A3, B_AT_B3, B_AT_C3, B_AT_D3, B_AT_E3, B_AT_F3, B_AT_G3, B_AT_H3,
        B_AT_A2, B_AT_B2, B_AT_C2, B_AT_D2, B_AT_E2, B_AT_F2, B_AT_G2, B_AT_H2,
        B_AT_A1, B_AT_B1, B_AT_C1, B_AT_D1, B_AT_E1, B_AT_F1, B_AT_G1, B_AT_H1
    }, { // rook moves
        R_AT_A8, R_AT_B8, R_AT_C8, R_AT_D8, R_AT_E8, R_AT_F8, R_AT_G8, R_AT_H8,
        R_AT_A7, R_AT_B7, R_AT_C7, R_AT_D7, R_AT_E7, R_AT_F7, R_AT_G7, R_AT_H7,
        R_AT_A6, R_AT_B6, R_AT_C6, R_AT_D6, R_AT_E6, R_AT_F6, R_AT_G6, R_AT_H6,
        R_AT_A5, R_AT_B5, R_AT_C5, R_AT_D5, R_AT_E5, R_AT_F5, R_AT_G5, R_AT_H5,
        R_AT_A4, R_AT_B4, R_AT_C4, R_AT_D4, R_AT_E4, R_AT_F4, R_AT_G4, R_AT_H4,
        R_AT_A3, R_AT_B3, R_AT_C3, R_AT_D3, R_AT_E3, R_AT_F3, R_AT_G3, R_AT_H3,
        R_AT_A2, R_AT_B2, R_AT_C2, R_AT_D2, R_AT_E2, R_AT_F2, R_AT_G2, R_AT_H2,
        R_AT_A1, R_AT_B1, R_AT_C1, R_AT_D1, R_AT_E1, R_AT_F1, R_AT_G1, R_AT_H1
    }
};

#endif

/**
 * DEFAULT FEN POSITION :
 * rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
 * 
 * INTERESTING FEN POSITONS :
 * 8/2PRNP2/1PnpprP1/1KpbkpB1/1BpqbpQ1/1PrppnP1/2PNRP2/8 b - - 0 1      {JOKE}
 * Perft:
 * r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1
 * 8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1
 * r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1
 * rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8
 * r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10
 */