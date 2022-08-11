#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

#include "chess.h"
#include "chess_const.h"


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                                     UTILITY FUNCTIONS                                                    ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

square_t * translate(board_t board) {
    uint64_t size = 64 * sizeof(square_t);
    square_t * squares = malloc(size);
    memcpy(squares, EMPTY_SQUARES, size);

    square_t * squares_ptr = squares;
    for (square_t square = 0; square < 64; square++) {
        board_t mask = (board_t)1 << square;
        if (mask > board)
            break;
        else if (mask & board) {
            *squares_ptr = square;
            squares_ptr++;
        }
    }

    return squares;
}

position_t * from_FEN(char * fen) {
    position_t * p = calloc(1, sizeof(position_t));
    int mode = 0;
    board_t square = 1;
    char * ptr = fen;
    while (ptr && *ptr) {
        char c = *ptr;
        ptr++;
        if (c == ' ') {
            mode++;
            continue;
        }
        switch (mode) {
            case 0: // piece positions
                if (!square)
                    return NULL;
                if (c == '/')
                    break;
                else if (c == 'K')
                    p->white_king |= square;
                else if (c == 'Q')
                    p->white_queen |= square;
                else if (c == 'R')
                    p->white_rook |= square;
                else if (c == 'B')
                    p->white_bishop |= square;
                else if (c == 'N')
                    p->white_knight |= square;
                else if (c == 'P')
                    p->white_pawn |= square;
                else if (c == 'k')
                    p->black_king |= square;
                else if (c == 'q')
                    p->black_queen |= square;
                else if (c == 'r')
                    p->black_rook |= square;
                else if (c == 'b')
                    p->black_bishop |= square;
                else if (c == 'n')
                    p->black_knight |= square;
                else if (c == 'p')
                    p->black_pawn |= square;
                else if (c > '0' && c < '9')
                    square <<= c - '1';
                else
                    return NULL;
                square <<= 1;
                break;
            case 1: // player to move
                if (c == 'w')
                    p->info |= WHITE_TO_MOVE;
                else if (c != 'b')
                    return NULL;
                break;
            case 2: // castling rights
                if (c == '-')
                    break;
                else if (c == 'K')
                    p->info |= WHITE_CASTLE_K;
                else if (c == 'Q')
                    p->info |= WHITE_CASTLE_Q;
                else if (c == 'k')
                    p->info |= BLACK_CASTLE_K;
                else if (c == 'q')
                    p->info |= BLACK_CASTLE_Q;
                else
                    return NULL;
                break;
            case 3: // en passant target square
                if (c == '-')
                    p->en_passant = -1;
                else if (!p->en_passant && c >= 'a' && c <= 'h')
                    p->en_passant = c - 'a';
                else if (p->en_passant && c >= '1' && c <= '8') {
                    p->en_passant += ('8' - c) * 8;
                } else
                    return NULL;
                if (p->en_passant > 63)
                    return NULL;
                break;
            case 4: // fifty move rule
                if (c < '0' || c > '9')
                    return NULL;
                p->fifty_move_counter *= 10;
                p->fifty_move_counter += c - '0';
                if (p->fifty_move_counter > 100)
                    return NULL;
                break;
            case 5: // full-turn count
                if (c < '0' || c > '9')
                    return NULL;
                else if (p->full_turn_counter > 512) {
                    printf(">>> lol nah\n");
                    return NULL;
                }
                p->full_turn_counter *= 10;
                p->full_turn_counter += c - '0';
                break;
        }
    }
    if (p->full_turn_counter < 1)
        p->full_turn_counter = 1;
    if (!p->white_king || !p->black_king)
        return NULL;
    p->king_square_w = -1;
    p->king_square_b = -1;
    board_t mask = 1;
    square_t king_square = 0;
    while (p->king_square_w == -1 || p->king_square_b == -1) {
        if (mask & p->white_king)
            p->king_square_w = king_square;
        else if (mask & p->black_king)
            p->king_square_b = king_square;
        king_square++;
        mask <<= 1;
    }
    return p;
}


char * to_FEN(position_t position) {
    return NULL;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                             STRING GENERATORS FOR DEBUGGING                                              ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

char * position_string(position_t position) {
    char empty[] = "\nTurn 000[00]: W -- (flags=00000000)  KINGS: {00/00}\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n";
    char * output = malloc(190);
    strcpy_s(output, 190, empty);
    
    int counter = position.full_turn_counter;
    char * ptr = output + 6;
    if (counter > 999)
        counter = counter % 1000;
    *ptr = '0' + (counter / 100);
    ptr++;
    *ptr = '0' + (counter / 10);
    ptr++;
    *ptr = '0' + (counter % 10);
    ptr += 2;
    counter = position.fifty_move_counter;
    if (counter > 99) {
        *ptr = '-';
        *(ptr + 1) = '-';
    } else {
        *ptr = '0' + (counter / 10);
        *(ptr + 1) = '0' + (counter % 10);
    }

    *(output + 15) = (position.info & WHITE_TO_MOVE) ? 'W' : 'B';

    if (position.en_passant > -1) {
        *(output + 17) = square_names[position.en_passant][0];
        *(output + 18) = square_names[position.en_passant][1];
    }
    ptr = output + 27;
    uint8_t flag = 128U;
    while (flag > 0) {
        if (flag & position.info)
            *ptr = '1';
        ptr++;
        flag >>= 1;
    }

    ptr = output + 46;
    *ptr = '0' + (position.king_square_w / 10);
    *(ptr + 1) = '0' + (position.king_square_w % 10);
    *(ptr + 3) = '0' + (position.king_square_b / 10);
    *(ptr + 4) = '0' + (position.king_square_b % 10);

    ptr = output + 54;
    for (int shift = 0; shift < 64; shift++) {
        board_t square = (board_t)1 << shift;
        if (square & position.white_king)
            *ptr = 'K';
        else if (square & position.black_king)
            *ptr = 'k';
        else if (square & position.white_queen)
            *ptr = 'Q';
        else if (square & position.black_queen)
            *ptr = 'q';
        else if (square & position.white_rook)
            *ptr = 'R';
        else if (square & position.black_rook)
            *ptr = 'r';
        else if (square & position.white_bishop)
            *ptr = 'B';
        else if (square & position.black_bishop)
            *ptr = 'b';
        else if (square & position.white_knight)
            *ptr = 'N';
        else if (square & position.black_knight)
            *ptr = 'n';
        else if (square & position.white_pawn)
            *ptr = 'P';
        else if (square & position.black_pawn)
            *ptr = 'p';
        else if (shift == position.en_passant)
            *ptr = ':';
        ptr += 2;
        if (shift % 8 == 7)
            ptr++;
    }
    
    return output;
}

char * move_string(move_t move) {
    char * output = malloc(6);
    output[0] = BOARD_FILE_CHR[move.source % 8];
    output[1] = BOARD_RANK_CHR[move.source / 8];
    output[2] = BOARD_FILE_CHR[move.target % 8];
    output[3] = BOARD_RANK_CHR[move.target / 8];
    output[4] = ' ';
    if (move.piece & PROMOTE)
        output[4] = PIECE_NAME[(move.piece & PROMOTE) >> 4];
    output[5] = 0;
    return output;
}

char * move_full_string(move_t move, position_t position) {
    char * output = calloc(1, 8);
    int s_rank = move.source / 8;
    int s_file = move.source % 8;
    int t_rank = move.target / 8;
    int t_file = move.target % 8;
    bool white_to_move = position.info & WHITE_TO_MOVE;
    bool check_move = move.piece & CHECK;
    if ((move.piece & 7) == PAWN) {
        int out_idx = 0;
        if (move.piece & CAPTURE) {
            *output = BOARD_FILE_CHR[s_file];
            *(output + 1) = 'x';
            out_idx = 2;
        }
        *(output + out_idx) = BOARD_FILE_CHR[t_file];
        *(output + out_idx + 1) = BOARD_RANK_CHR[t_rank];
        out_idx += 2;
        uint8_t promote_piece = (move.piece & PROMOTE) >> 4;
        if (promote_piece) {
            *(output + out_idx) = '=';
            *(output + out_idx + 1) = PIECE_NAME[promote_piece];
            out_idx += 2;
        }
        if (check_move)
            *(output + out_idx) = '+';
        return output;
    } else if ((move.piece & 7) == KING) {
        if (move.source - move.target == 2) { // queenside castle
            if (check_move)
                return memcpy(output, "O-O-O+", 7);
            return memcpy(output, "O-O-O", 6);
        } else if (move.target - move.source == 2) { // kingside castle
            if (check_move)
                return memcpy(output, "O-O+", 5);
            return memcpy(output, "O-O", 4);
        }
    }

    uint8_t piece = move.piece & PIECE;
    *output = PIECE_NAME[piece];
    int out_idx = 1;

    // check if two of the same type of piece can make this move
    board_t piece_mask = (board_t)1 << move.source;
    bool is_white = piece_mask & (position.white_king | position.white_queen | position.white_rook | position.white_bishop | position.white_knight | position.white_pawn);
    board_t other_piece_exists = 0;
    if (piece == KNIGHT)
        other_piece_exists = (is_white ? position.white_knight : position.black_knight) ^ piece_mask;
    else if (piece == BISHOP)
        other_piece_exists = (is_white ? position.white_bishop : position.black_bishop) ^ piece_mask;
    else if (piece == ROOK)
        other_piece_exists = (is_white ? position.white_rook : position.black_rook) ^ piece_mask;
    else if (piece == QUEEN)
        other_piece_exists = (is_white ? position.white_queen : position.black_queen) ^ piece_mask;
    if (other_piece_exists) {
        // calculate all possible moves for duplicate pieces and see if any of them match (slow, but who cares)
        board_t occupied_by_self, occupied_by_other;
        bool white_to_move = position.info & WHITE_TO_MOVE;
        if (white_to_move) {
            occupied_by_self = position.white_king | position.white_queen | position.white_rook | position.white_bishop | position.white_knight | position.white_pawn;
            occupied_by_other = position.black_king | position.black_queen | position.black_rook | position.black_bishop | position.black_knight | position.black_pawn;
        } else {
            occupied_by_other = position.white_king | position.white_queen | position.white_rook | position.white_bishop | position.white_knight | position.white_pawn;
            occupied_by_self = position.black_king | position.black_queen | position.black_rook | position.black_bishop | position.black_knight | position.black_pawn;
        }
        board_t attacked = 0, defended = 0;
        square_t source = 0;
        // Honestly, I'm just hoping there are never more than 6 of these... seems like a safe bet?
        move_t duplicate_moves[] = { (move_t){ 0, 0, 0 }, (move_t){ 0, 0, 0 }, (move_t){ 0, 0, 0 }, (move_t){ 0, 0, 0 }, (move_t){ 0, 0, 0 }, (move_t){ 0, 0, 0 } };
        int dup_index = 0;
        while (other_piece_exists && dup_index < 6) { // check each other piece of the same type
            // find the location of the next piece
            while (!(other_piece_exists & 1)) {
                other_piece_exists >>= 1;
                source++;
            }
            other_piece_exists >>= 1;
            // compare all moves for this piece to see if any have the same target square
            move_t * moves = calloc(32, sizeof(position_t));
            if (piece == KNIGHT)
                calculate_knight_moves(&position, source, moves, occupied_by_self, occupied_by_other, &defended, &attacked);
            else
                calculate_sliding_moves(&position, source, moves, piece, occupied_by_self, occupied_by_other, &defended, &attacked);
            move_t * moves_ptr = moves;
            while (moves_ptr->piece) {
                if (moves_ptr->target == move.target) {
                    memcpy(duplicate_moves + dup_index, moves_ptr, sizeof(move_t));
                    dup_index++;
                    break;
                }
                moves_ptr++;
            }
            free(moves);
        }
        if (dup_index > 0) { // there is at least one other piece that can make this same move
            // is it possible to disambiguate using only the file?
            int d_file = move.source % 8;
            bool unique = true;
            for (int dx = 0; dx < dup_index; dx++) {
                if (duplicate_moves[dx].source % 8 == d_file) {
                    unique = false;
                    break;
                }
            }
            // regardless, add the file to this move string to help disambiguate it
            *(output + out_idx) = BOARD_FILE_CHR[d_file];
            out_idx++;
            if (!unique) {
                // if the file alone is not enough, then disambiguate it by using the rank as well
                int d_rank = move.source / 8;
                *(output + out_idx) = BOARD_RANK_CHR[d_rank];
                out_idx++;
            }
        }
    }

    if (move.piece & CAPTURE) {
        *(output + out_idx) = 'x';
        out_idx++;
    }
    *(output + out_idx) = BOARD_FILE_CHR[t_file];
    *(output + out_idx + 1) = BOARD_RANK_CHR[t_rank];
    if (check_move)
        *(output + out_idx + 2) = '+';

    return output;
}

char * board_string(board_t board) {
    char empty[] = " . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n . . . . . . . .\n";
    char * output = calloc(1, 137);
    memcpy(output, empty, 137);

    char * ptr = output + 1;
    for (int shift = 0; shift < 64; shift++) {
        board_t mask = (board_t)1 << shift;
        if (mask > board)
            break;
        if (board & mask)
            *ptr = 'X';
        ptr += 2;
        if (shift % 8 == 7)
            ptr++;
    }

    return output;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                                MOVE CALCULATION BY PIECE                                                 ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

move_t * calculate_pawn_moves(position_t * position, square_t square, move_t * legal_moves, board_t occupied_by_self, board_t occupied_by_other, board_t * defended, board_t * attacked) {
    bool white_to_move = position->info & WHITE_TO_MOVE;
    int rank = square / 8;

    move_t * moves_ptr = legal_moves;
    bool is_white = ((board_t)1 << square) & position->white_pawn;

    // forward move(s)
    if (is_white == white_to_move) {
        square_t forward = square + (is_white ? -8 : 8);
        if (!(((board_t)1 << forward) & (occupied_by_self | occupied_by_other))) {
            moves_ptr->source = square;
            moves_ptr->target = forward;
            moves_ptr->piece = PAWN;
            if (rank == (is_white ? 6 : 1)) {
                forward = square + (is_white ? -16 : 16);
                if (!(((board_t)1 << forward) & (occupied_by_self | occupied_by_other))) {
                    moves_ptr++;
                    moves_ptr->source = square;
                    moves_ptr->target = forward;
                    moves_ptr->piece = PAWN;
                }
            } else if (rank == (is_white ? 1 : 6)) { // pawn about to promote
                for (int opt = 0; opt < 4; opt++)
                    *(moves_ptr + opt) = (move_t){ moves_ptr->source, moves_ptr->target, ((opt + 2) << 4) | (moves_ptr->piece & ~PROMOTE) };
                moves_ptr += 3; // 4 options total, so 3 extra moves have been added
            }
            moves_ptr++;
        }
    }

    // diagonal captures
    board_t en_passant = position->en_passant == -1 ? 0 : (board_t)1 << position->en_passant;
    if (square & 7) { // not on a-file
        square_t left = square + (is_white ? -9 : 7);
        // update attacked/defended
        if (is_white == white_to_move)
            (*defended) |= (board_t)1 << left;
        else
            (*attacked) |= (board_t)1 << left;
        // update pseudolegal moves if necessary
        if (is_white == white_to_move && (((board_t)1 << left) & (occupied_by_other | en_passant))) {
            moves_ptr->source = square;
            moves_ptr->target = left;
            moves_ptr->piece = PAWN | CAPTURE;
            if (rank == (is_white ? 1 : 6)) { // pawn about to promote
                for (int opt = 0; opt < 4; opt++)
                    *(moves_ptr + opt) = (move_t){ moves_ptr->source, moves_ptr->target, ((opt + 2) << 4) | (moves_ptr->piece & ~PROMOTE) };
                moves_ptr += 3; // 4 options total, so 3 extra moves have been added
            }
            moves_ptr++;
        }
    }
    if ((square & 7) != 7) { // not on h-file
        square_t right = square + (is_white ? -7 : 9);
        // update attacked/defended
        if (is_white == white_to_move)
            (*defended) |= (board_t)1 << right;
        else
            (*attacked) |= (board_t)1 << right;
        // update pseudolegal moves if necessary
        if (is_white == white_to_move && (((board_t)1 << right) & (occupied_by_other | en_passant))) {
            moves_ptr->source = square;
            moves_ptr->target = right;
            moves_ptr->piece = PAWN | CAPTURE;
            if (rank == (is_white ? 1 : 6)) { // pawn about to promote
                for (int opt = 0; opt < 4; opt++)
                    *(moves_ptr + opt) = (move_t){ moves_ptr->source, moves_ptr->target, ((opt + 2) << 4) | (moves_ptr->piece & ~PROMOTE) };
                moves_ptr += 3; // 4 options total, so 3 extra moves have been added
            }
            moves_ptr++;
        }
    }

    return moves_ptr;
}

move_t * calculate_king_moves(position_t * position, square_t square, move_t * legal_moves, board_t occupied_by_self, board_t occupied_by_other, board_t * defended, board_t * attacked) {
    board_t king_board = (board_t)1 << square;
    bool can_move = king_board & occupied_by_self;
    move_t * moves_ptr = legal_moves;

    // check all normal moves
    const square_t * square_ptr = MOVES_LOOKUP[0][square];
    while (*square_ptr != -1) {
        board_t mask = (board_t)1 << (*square_ptr);
        if (can_move) {
            *defended |= mask;
            if (!(mask & (occupied_by_self | *attacked))) {
                moves_ptr->source = square;
                moves_ptr->target = *square_ptr;
                moves_ptr->piece = KING | (((mask & occupied_by_other) == mask) * CAPTURE);
                moves_ptr++;
            }
        } else
            *attacked |= mask;
        square_ptr++;
    }

    // check castling options
    bool is_white = king_board & position->white_king;
    if (!can_move || ((*attacked) & king_board)) // king in check cannot castle
        return moves_ptr;
    board_t occupied = occupied_by_self | occupied_by_other;
    board_t blocked = (*attacked) | occupied;
    if (is_white) {
        if ((position->info & WHITE_CASTLE_K) && !(WHITE_CASTLE_CHECK_K & blocked)) {
            *moves_ptr = (move_t){ 60, 62, KING };
            moves_ptr++;
        }
        if ((position->info & WHITE_CASTLE_Q) && !(WHITE_CASTLE_CHECK_Q & blocked) && !(WHITE_CASTLE_CHECK_Qx & occupied)) {
            *moves_ptr = (move_t){ 60, 58, KING };
            moves_ptr++;
        }
    } else {
        if ((position->info & BLACK_CASTLE_K) && !(BLACK_CASTLE_CHECK_K & blocked)) {
            *moves_ptr = (move_t){ 4, 6, KING };
            moves_ptr++;
        }
        if ((position->info & BLACK_CASTLE_Q) && !(BLACK_CASTLE_CHECK_Q & blocked) && !(BLACK_CASTLE_CHECK_Qx & occupied)) {
            *moves_ptr = (move_t){ 4, 2, KING };
            moves_ptr++;
        }
    }

    return moves_ptr;
}

move_t * calculate_knight_moves(position_t * position, square_t square, move_t * legal_moves, board_t occupied_by_self, board_t occupied_by_other, board_t * defended, board_t * attacked) {
    bool can_move = ((board_t)1 << square) & occupied_by_self;
    move_t * moves_ptr = legal_moves;
    const square_t * square_ptr = MOVES_LOOKUP[1][square];
    while (*square_ptr != -1) {
        board_t mask = (board_t)1 << (*square_ptr);
        if (can_move && !(mask & occupied_by_self)) {
            moves_ptr->source = square;
            moves_ptr->target = *square_ptr;
            moves_ptr->piece = KNIGHT | (((mask & occupied_by_other) != 0) * CAPTURE);
            moves_ptr++;
        }
        if (can_move)
            *defended |= mask;
        else
            *attacked |= mask;
        square_ptr++;
    }

    return moves_ptr;
}

move_t * calculate_sliding_moves(position_t * position, square_t square, move_t * legal_moves, uint8_t piece, board_t occupied_by_self, board_t occupied_by_other, board_t * defended, board_t * attacked) {
    bool can_move = ((board_t)1 << square) & occupied_by_self;
    move_t * moves_ptr = legal_moves;
    piece &= 7;
    for (int lookup_index = 2; lookup_index <= 3; lookup_index++) {
        if ((piece != QUEEN) && !((lookup_index == 2) && (piece == BISHOP)) && !((lookup_index == 3) && (piece == ROOK)))
            continue;
        const square_t * square_ptr = MOVES_LOOKUP[lookup_index][square];
        bool found = false;
        int dir = 0;
        while (dir < 4) {
            if (*square_ptr == -1) {
                dir++;
                found = false;
            } else if (!found) {
                board_t mask = (board_t)1 << (*square_ptr);
                found = mask & (occupied_by_self | occupied_by_other);
                if (can_move && !(mask & occupied_by_self)) {
                    moves_ptr->source = square;
                    moves_ptr->target = *square_ptr;
                    moves_ptr->piece = piece | (found * CAPTURE);
                    moves_ptr++;
                }
                if (can_move)
                    *defended |= mask;
                else
                    *attacked |= mask;
            }
            square_ptr++;
        }
    }

    return moves_ptr;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                           MOVE GENERATION AND APPLICATION                                                ///
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

void update_position_by_move(position_t * position, move_t move) {
    bool white_to_move = position->info & WHITE_TO_MOVE;
    board_t target_mask = (board_t)1 << move.target;
    board_t source_mask = (board_t)1 << move.source;
    if (move.target == position->en_passant && (move.piece & PIECE) == PAWN) {
        if (white_to_move) {
            position->white_pawn ^= (source_mask | target_mask);
            position->black_pawn ^= (target_mask << 8);
        } else {
            position->black_pawn ^= (source_mask | target_mask);
            position->white_pawn ^= (target_mask >> 8);
        }
    } else if (white_to_move) {
        if (position->white_pawn & source_mask)
            position->white_pawn ^= (source_mask | target_mask);
        else if (position->white_king & source_mask)
            position->white_king ^= (source_mask | target_mask);
        else if (position->white_queen & source_mask)
            position->white_queen ^= (source_mask | target_mask);
        else if (position->white_rook & source_mask)
            position->white_rook ^= (source_mask | target_mask);
        else if (position->white_bishop & source_mask)
            position->white_bishop ^= (source_mask | target_mask);
        else if (position->white_knight & source_mask)
            position->white_knight ^= (source_mask | target_mask);
        if (move.piece & CAPTURE) {
            // no enemy pieces can exist on the same square as this one
            target_mask = ~target_mask;
            position->black_queen &= target_mask;
            position->black_rook &= target_mask;
            position->black_bishop &= target_mask;
            position->black_knight &= target_mask;
            position->black_pawn &= target_mask;
            // note that the enemy king can never actually be captured
        }
    } else {
        if (position->black_pawn & source_mask)
            position->black_pawn ^= (source_mask | target_mask);
        else if (position->black_king & source_mask)
            position->black_king ^= (source_mask | target_mask);
        else if (position->black_queen & source_mask)
            position->black_queen ^= (source_mask | target_mask);
        else if (position->black_rook & source_mask)
            position->black_rook ^= (source_mask | target_mask);
        else if (position->black_bishop & source_mask)
            position->black_bishop ^= (source_mask | target_mask);
        else if (position->black_knight & source_mask)
            position->black_knight ^= (source_mask | target_mask);
        if (move.piece & CAPTURE) {
            // no enemy pieces can exist on the same square as this one
            target_mask = ~target_mask;
            position->white_queen &= target_mask;
            position->white_rook &= target_mask;
            position->white_bishop &= target_mask;
            position->white_knight &= target_mask;
            position->white_pawn &= target_mask;
            // note that the enemy king can never actually be captured
        }
    }
    if ((move.piece & PIECE) == KING) {
        if (white_to_move)
            position->king_square_w = move.target;
        else
            position->king_square_b = move.target;
        // special case for castling (move the rook as well)
        if (move.target - move.source == 2) { // kingside castle
            if (white_to_move)
                position->white_rook ^= WHITE_CASTLE_K_ROOK_MOVE;
            else
                position->black_rook ^= BLACK_CASTLE_K_ROOK_MOVE;
        } else if (move.source - move.target == 2) { // queenside castle
            if (white_to_move)
                position->white_rook ^= WHITE_CASTLE_Q_ROOK_MOVE;
            else
                position->black_rook ^= BLACK_CASTLE_Q_ROOK_MOVE;
        }
    }
}

bool king_is_attacked(position_t * position, bool white_king) {
    square_t king_square = white_king ? position->king_square_w : position->king_square_b;
    // check opponent's pawns
    if (white_king ? king_square > 8 : king_square < 56) { // not on last rank
        board_t opp_pawns = white_king ? position->black_pawn : position->white_pawn;
        board_t mask = 0;
        if (king_square & 7) // not on a-file
            mask |= (board_t)1 << (king_square + (white_king ? -9 : 7));
        if ((king_square & 7) != 7) // not on h-file
            mask |= (board_t)1 << (king_square + (white_king ? -7 : 9));
        if (opp_pawns & mask)
            return true;
    }
    // check opponent's knights
    board_t opp_knights = white_king ? position->black_knight : position->white_knight;
    const square_t * square_ptr = MOVES_LOOKUP[1][king_square];
    while (*square_ptr != -1) {
        board_t mask = (board_t)1 << (*square_ptr);
        if (mask & opp_knights)
            return true;
        square_ptr++;
    }
    // check opponent's sliding pieces
    board_t occupied = position->white_king | position->white_queen | position->white_rook
                     | position->white_bishop | position->white_knight | position->white_pawn
                     | position->black_king | position->black_queen | position->black_rook
                     | position->black_bishop | position->black_knight | position->black_pawn;
    board_t opp_rooks = white_king ? (position->black_rook | position->black_queen) : (position->white_rook | position->white_queen);
    board_t opp_bishops = white_king ? (position->black_bishop | position->black_queen) : (position->white_bishop | position->white_queen);
    for (int lookup_index = 2; lookup_index <= 3; lookup_index++) {
        const square_t * target_ptr = MOVES_LOOKUP[lookup_index][king_square];
        bool found = false;
        int dir = 0;
        while (dir < 4) {
            if ((*target_ptr) == -1) {
                dir++;
                found = false;
            } else if (!found) {
                board_t mask = (board_t)1 << (*target_ptr);
                found = mask & occupied;
                if (found && (((lookup_index == 2) && (mask & opp_bishops)) || ((lookup_index == 3) && (mask & opp_rooks))))
                    return true;
            }
            target_ptr++;
        }
    }
    // check opponent's king
    square_t opp_king_square = white_king ? position->king_square_b : position->king_square_w;
    board_t mask = 0;
    const square_t * target_ptr = MOVES_LOOKUP[0][king_square];
    while (*target_ptr != -1) {
        if (*target_ptr == opp_king_square)
            return true;
        target_ptr++;
    }

    return false;
}

bool check_move_legality(position_t * position, move_t * move) {
    // make the move on a copy of the original position
    bool white_to_move = position->info & WHITE_TO_MOVE;
    position_t virtual;
    memcpy(&virtual, position, sizeof(position_t));
    update_position_by_move(&virtual, *move);
    if (king_is_attacked(&virtual, !white_to_move))
        move->piece |= CHECK;
    return !king_is_attacked(&virtual, white_to_move);
}

move_t * legal_moves(position_t * position, bool captures_only) {
    // Note: max total moves in any position = 238; max moves for any piece (queen) = 27
    board_t occupied_by_self, occupied_by_other;
    bool white_to_move = position->info & WHITE_TO_MOVE;
    if (white_to_move) {
        occupied_by_self = position->white_king | position->white_queen | position->white_rook | position->white_bishop | position->white_knight | position->white_pawn;
        occupied_by_other = position->black_king | position->black_queen | position->black_rook | position->black_bishop | position->black_knight | position->black_pawn;
    } else {
        occupied_by_other = position->white_king | position->white_queen | position->white_rook | position->white_bishop | position->white_knight | position->white_pawn;
        occupied_by_self = position->black_king | position->black_queen | position->black_rook | position->black_bishop | position->black_knight | position->black_pawn;
    }
    board_t occupied = occupied_by_self | occupied_by_other;
    square_t king_square = -1;
    board_t defended = 0, attacked = 0;

    // calculate all pseudolegal moves
    move_t * pseudolegal_moves = calloc(256, sizeof(move_t));
    move_t * list_ptr = pseudolegal_moves; // this will update after each piece is calculated
    for (int rank = 0; rank < 8; rank++) {
        board_t b_rank = BOARD_RANK[rank];
        if (!(b_rank & occupied))
            continue;
        for (int file = 0; file < 8; file++) {
            board_t b_square = b_rank & BOARD_FILE[file];
            if (!(b_square & occupied))
                continue;
            square_t square = rank * 8 + file;
            if (b_square & (position->white_pawn | position->black_pawn))
                list_ptr = calculate_pawn_moves(position, square, list_ptr, occupied_by_self, occupied_by_other, &defended, &attacked);
            else if (b_square & (white_to_move ? position->white_king : position->black_king))
                king_square = square; // save this calculation for later
            else if (b_square & (white_to_move ? position->black_king : position->white_king))
                calculate_king_moves(position, square, list_ptr, occupied_by_self, occupied_by_other, &defended, &attacked);
            else if (b_square & (position->white_knight | position->black_knight))
                list_ptr = calculate_knight_moves(position, square, list_ptr, occupied_by_self, occupied_by_other, &defended, &attacked);
            else if (b_square & (position->white_bishop | position->black_bishop))
                list_ptr = calculate_sliding_moves(position, square, list_ptr, BISHOP, occupied_by_self, occupied_by_other, &defended, &attacked);
            else if (b_square & (position->white_rook | position->black_rook))
                list_ptr = calculate_sliding_moves(position, square, list_ptr, ROOK, occupied_by_self, occupied_by_other, &defended, &attacked);
            else if (b_square & (position->white_queen | position->black_queen))
                list_ptr = calculate_sliding_moves(position, square, list_ptr, QUEEN, occupied_by_self, occupied_by_other, &defended, &attacked);
        }
    }
    // update king only after the attacked and defended squares have been fully calculated
    list_ptr = calculate_king_moves(position, king_square, list_ptr, occupied_by_self, occupied_by_other, &defended, &attacked);
    
    move_t * moves = calloc(256, sizeof(move_t));
    // test each pseudolegal move to see if it is actually legal
    move_t * pseudo_moves_ptr = pseudolegal_moves;
    move_t * legal_moves_ptr = moves;
    while (pseudo_moves_ptr->piece) {
        if ((!captures_only || (pseudo_moves_ptr->piece & CAPTURE)) && check_move_legality(position, pseudo_moves_ptr)) {
            memcpy(legal_moves_ptr, pseudo_moves_ptr, sizeof(move_t));
            legal_moves_ptr++;
        }
        pseudo_moves_ptr++;
    }

    free(pseudolegal_moves);
    return moves;
}

position_t * play_move(position_t * position, move_t move) {
    position_t * next = malloc(sizeof(position_t));
    memcpy(next, position, sizeof(position_t));
    update_position_by_move(next, move);

    // update white_to_move
    bool white_move = position->info & WHITE_TO_MOVE;
    next->info ^= WHITE_TO_MOVE;
    // update full_turn_counter and fifty_move_counter if necessary
    if (!white_move)
        next->full_turn_counter++;
    if ((move.piece & CAPTURE) || (move.piece & PIECE) == PAWN)
        next->fifty_move_counter = 0;
    else
        next->fifty_move_counter++;
    next->en_passant = -1;
    // special case for pawn promotion
    if (move.piece & PROMOTE) {
        uint8_t promotion = (move.piece & PROMOTE) >> 4;
        board_t mask = (board_t)1 << move.target;
        if (white_move) {
            next->white_pawn ^= mask;
            if (promotion == QUEEN)
                next->white_queen |= mask;
            else if (promotion == ROOK)
                next->white_rook |= mask;
            else if (promotion == BISHOP)
                next->white_bishop |= mask;
            else if (promotion == KNIGHT)
                next->white_knight |= mask;
        } else {
            next->black_pawn ^= mask;
            if (promotion == QUEEN)
                next->black_queen |= mask;
            else if (promotion == ROOK)
                next->black_rook |= mask;
            else if (promotion == BISHOP)
                next->black_bishop |= mask;
            else if (promotion == KNIGHT)
                next->black_knight |= mask;
        }
    } else if ((move.piece & PIECE) == PAWN && ((move.source - move.target == 16) || (move.target - move.source == 16)))
        // update en passant square if necessary
        next->en_passant = white_move ? move.target + 8 : move.target - 8;
    if (next->info > 15U) { // if there are still any castling opportunities
        if ((move.piece & PIECE) == KING) {
            // any king move nullifies both castling opportunities
            if (white_move) {
                next->info &= ~WHITE_CASTLE_K;
                next->info &= ~WHITE_CASTLE_Q;
            } else {
                next->info &= ~BLACK_CASTLE_K;
                next->info &= ~BLACK_CASTLE_Q;
            }
        }
        // rook moves nullify the opportunity to castle on that side of the board
        if ((move.piece & PIECE) == ROOK) {
            if (move.source == 0)
                next->info &= ~BLACK_CASTLE_Q;
            else if (move.source == 7)
                next->info &= ~BLACK_CASTLE_K;
            else if (move.source == 56)
                next->info &= ~WHITE_CASTLE_Q;
            else if (move.source == 63)
                next->info &= ~WHITE_CASTLE_K;
        }
        // any captures on the rook's initial square means castling on that side is no longer possible
        if ((move.piece & CAPTURE)) {
            if (move.target == 0)
                next->info &= ~BLACK_CASTLE_Q;
            else if (move.target == 7)
                next->info &= ~BLACK_CASTLE_K;
            else if (move.target == 56)
                next->info &= ~WHITE_CASTLE_Q;
            else if (move.target == 63)
                next->info &= ~WHITE_CASTLE_K;
        }
    }

    return next;
}
