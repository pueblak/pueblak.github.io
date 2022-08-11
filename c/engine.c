#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "engine.h"
#include "engine_const.h"
#include "chess.h"

#define MAX(a, b) = (((a) < (b)) * (b)) + (((a) >= (b)) * (a));

/**
 * @brief Start a new game at the given position and play it move-by-move until it ends.
 * 
 * @param position 
 * @param max_depth 
 * @param max_time 
 * @return int 
 */
int play(position_t * position, int max_depth, double max_time) {
    position_t * current = position;
    while(true) {
        move_t * moves = legal_moves(current, false);
        printf("\n%s", position_string(*current));
        move_t * moves_ptr = moves;
        int count = 0;
        while (moves_ptr->piece) {
            count++;
            printf("%2d. %s\n", count, move_full_string(*moves_ptr, *position));
            moves_ptr++;
        }
        int selection = -1;
        while (selection < 0 || selection > count) {
            printf(">>> ");
            scanf_s("%d", &selection);
        }
        position_t * next = play_move(current, *(moves + selection - 1));
        free(current);
        current = next;
        free(moves);
    }

    return 0;
}

void reverse_pv(char * pv, int total_moves) {
    int left = 0, right = total_moves - 1;
    while (left < right) {
        char temp_str[5];
        memcpy(temp_str, pv + (left * 6), 5);
        memcpy(pv + (left * 6), pv + (right * 6), 5);
        memcpy(pv + (right * 6), temp_str, 5);
        left++;
        right--;
    }
}

/**
 * @brief Take the given position and print out the best move.
 * 
 * @param position 
 * @param max_depth 
 * @param max_time 
 * @return int 
 */
int search(position_t * position, int max_depth, double max_time) {
    move_t * unsorted = legal_moves(position, false);
    move_t * moves = sorted_moves(position, unsorted);
    free(unsorted);
    size_t total = 0;
    move_t * moves_ptr = moves;
    while (moves_ptr->piece) {
        size_t node_count = 0;
        char * pv = calloc(1, 6 * max_depth);
        for (int d = 1; d < max_depth; d++)
            *(pv + (d * 6) - 1) = ' ';
        position_t * next = play_move(position, *moves_ptr);
        score_t score = negamax(next, max_depth - 1, MIN_SCORE, MAX_SCORE, position->info & 1, &node_count, pv);
        char score_str[10];
        if (score > 0) {
            score_str[0] = '+';
            sprintf_s(score_str + 1, 9, "%d cp", score);
        } else
            sprintf_s(score_str, 10, "%d cp", score);
        char * move_str = move_string(*moves_ptr);
        reverse_pv(pv, max_depth);
        printf("%8s : %-9s pv %s [%lld]\n", 
            move_str,
            score_str,
            pv,
            node_count
        );
        free(move_str);
        free(next);
        free(pv);
        total += node_count;
        moves_ptr++;
    }
    free(moves);

    if (total > 1000000000000000000)
        printf("SEARCHED : %.3f quintillion total nodes\n\n", ((double)total / 1000000000000000000));
    if (total > 1000000000000000)
        printf("SEARCHED : %.3f quadrillion total nodes\n\n", ((double)total / 1000000000000000));
    if (total > 1000000000000)
        printf("SEARCHED : %.3f trillion total nodes\n\n", ((double)total / 1000000000000));
    if (total > 1000000000)
        printf("SEARCHED : %.3f billion total nodes\n\n", ((double)total / 1000000000));
    if (total > 1000000)
        printf("SEARCHED : %.3f million total nodes\n\n", ((double)total / 1000000));
    else
        printf("SEARCHED : %lld total nodes\n\n", total);

    return 0;
}

void add_count(count_t * count, count_t addend) {
    count->total += addend.total;
    count->captures += addend.captures;
    count->checks += addend.checks;
    count->en_passants += addend.en_passants;
    count->promotions += addend.promotions;
    count->castles += addend.castles;
    count->checkmates += addend.checkmates;
    count->stalemates += addend.stalemates;
}

char * count_string(count_t count) {
    char * count_str = calloc(1, 256);
    sprintf_s(
        count_str, 256,
        "   TOTAL = %10lld\nCAPTURES = %10lld\n    E.P. = %10ld\n CASTLES = %10ld\nPROMOTES = %10ld\n  CHECKS = %10ld\n CHECKM. = %10d\n STALEM. = %10d",
        count.total, count.captures, count.en_passants, count.castles,
        count.promotions, count.checks, count.checkmates, count.stalemates
    );
    return count_str;
}

int score(position_t * position, int max_depth, double max_time) {
    printf("SCORE: %6d\n", score_position(position));
    return 0;
}

int divide(position_t * position, int max_depth, double max_time) {
    if (max_depth < 1)
        max_depth = 1;
    count_t total_count = (count_t){ 0, 0, 0, 0, 0, 0, 0, 0 };
    char * board_str = position_string(*position);
    printf("%s\n", board_str);
    free(board_str);
    move_t * moves = legal_moves(position, false);
    move_t * moves_ptr = moves;
    int index = 0;
    while (moves_ptr->piece) {
        index++;
        position_t * next = play_move(position, *moves_ptr);
        char * position_str = position_string(*next);
        char * move_str = move_full_string(*moves_ptr, *position);
        count_t move_count = count_moves(next, max_depth - 1);
        add_count(&total_count, move_count);
        char * count_str = count_string(move_count);
        printf("\n%3d. %s:\n%s\n%s\n\n", index, move_str, position_str, count_str);
        free(position_str);
        free(move_str);
        free(count_str);
        free(next);
        moves_ptr++;
    }

    char * count_str = count_string(total_count);
    printf("\nSUM OF RESULTS:\n%s\n\n", count_str);
    free(count_str);
    
    free(moves);
    return 0;
}

int count(position_t * position, int max_depth, double max_time) {
    if (max_depth < 1)
        max_depth = 1;
    char * count_str = count_string(count_moves(position, max_depth));
    printf("\n%s\n\n", count_str);
    free(count_str);
    return 0;
}

count_t count_moves(position_t * position, int depth) {
    count_t count = (count_t){ 0, 0, 0, 0, 0, 0, 0, 0 };
    if (position->info & 2U) // if game is over
        return count;
    else if (depth == 0)
        return (count_t){ 1, 0, 0, 0, 0, 0, 0, 0 };
    move_t * moves = legal_moves(position, false);
    if (!moves->piece) {
        if (depth == 0) {
            if (king_is_attacked(position, position->info & 1U))
                return (count_t){ 0, 0, 0, 0, 0, 0, 1, 0 };
            else
                return (count_t){ 0, 0, 0, 0, 0, 0, 0, 1 };
        } else
            return count;
    }
    move_t * moves_ptr = moves;
    while (moves_ptr->piece) {
        position_t * next = play_move(position, *moves_ptr);
        if (depth == 1) {
            count.total += 1;
            if (moves_ptr->piece & 8U) { // if this move captures a piece
                count.captures += 1;
                if (moves_ptr->target == position->en_passant)
                    count.en_passants += 1;
            }
            if (moves_ptr->piece & 112U) // if this move includes a pawn promotion
                count.promotions++;
            int diff = moves_ptr->source - moves_ptr->target;
            if ((moves_ptr->piece & 7U) == 1 && (diff == 2 || diff == -2)) // if this is a castling move
                count.castles++;
            if (moves_ptr->piece & 128U) { // if this move puts the enemy king in check
                count.checks++;
                if (next->info & 2U) // if the game is over
                    count.checkmates++;
            }
            if (next->info & 2U && ((next->info & 4U) == (next->info & 8U))) // if game is drawn
                count.stalemates++;
        } else
            add_count(&count, count_moves(next, depth - 1));
        free(next);
        moves_ptr++;
    }
    free(moves);
    return count;
}

bool is_endgame(position_t * position) {
    board_t rooks = position->white_rook | position->black_rook;
    board_t bishops = position->white_bishop | position->black_bishop;
    board_t knights = position->white_knight | position->black_knight;
    if (rooks && bishops && knights) {
        if (!(position->white_queen | position->black_queen))
            return true;
        return false;
    }
    if (position->white_queen && position->black_queen) {
        if ((rooks && bishops) || (rooks && knights) || (bishops && knights))
            return false;
    }
    if (position->info > 15)
        return false;
    return true;
}

score_t score_position(position_t * position) {
    score_t score = 0;
    bool endgame = is_endgame(position);

    if (endgame)
        score += SCORE_KING_ENDGAME[position->king_square_w];
    else
        score += SCORE_KING[position->king_square_w];
    
    square_t * white_pawns = translate(position->white_pawn);
    square_t * white_pawns_ptr = white_pawns;
    while (*white_pawns_ptr != -1) {
        score += S_PAWN;
        score += SCORE_PAWN[*white_pawns_ptr];
        white_pawns_ptr++;
    }
    free(white_pawns);
    
    square_t * white_knights = translate(position->white_knight);
    square_t * white_knights_ptr = white_knights;
    while (*white_knights_ptr != -1) {
        score += S_KNIGHT;
        score += SCORE_KNIGHT[*white_knights_ptr];
        white_knights_ptr++;
    }
    free(white_knights);

    square_t * white_bishops = translate(position->white_bishop);
    square_t * white_bishops_ptr = white_bishops;
    while (*white_bishops_ptr != -1) {
        score += S_BISHOP;
        score += SCORE_BISHOP[*white_bishops_ptr];
        white_bishops_ptr++;
    }
    free(white_bishops);

    square_t * white_rooks = translate(position->white_rook);
    square_t * white_rooks_ptr = white_rooks;
    while (*white_rooks_ptr != -1) {
        score += S_ROOK;
        score += SCORE_ROOK[*white_rooks_ptr];
        white_rooks_ptr++;
    }
    free(white_rooks);

    square_t * white_queens = translate(position->white_queen);
    square_t * white_queens_ptr = white_queens;
    while (*white_queens_ptr != -1) {
        score += S_QUEEN;
        score += SCORE_QUEEN[*white_queens_ptr];
        white_queens_ptr++;
    }
    free(white_queens);

    // note that all black pieces subtract points instead of adding them
    if (endgame)
        score -= SCORE_KING_ENDGAME[FLIP[position->king_square_w]];
    else
        score -= SCORE_KING[FLIP[position->king_square_w]];
    
    square_t * black_pawns = translate(position->black_pawn);
    square_t * black_pawns_ptr = black_pawns;
    while (*black_pawns_ptr != -1) {
        score -= S_PAWN;
        score -= SCORE_PAWN[FLIP[*black_pawns_ptr]];
        black_pawns_ptr++;
    }
    free(black_pawns);

    square_t * black_knights = translate(position->black_knight);
    square_t * black_knights_ptr = black_knights;
    while (*black_knights_ptr != -1) {
        score -= S_KNIGHT;
        score -= SCORE_KNIGHT[FLIP[*black_knights_ptr]];
        black_knights_ptr++;
    }
    free(black_knights);

    square_t * black_bishops = translate(position->black_bishop);
    square_t * black_bishops_ptr = black_bishops;
    while (*black_bishops_ptr != -1) {
        score -= S_BISHOP;
        score -= SCORE_BISHOP[FLIP[*black_bishops_ptr]];
        black_bishops_ptr++;
    }
    free(black_bishops);

    square_t * black_rooks = translate(position->black_rook);
    square_t * black_rooks_ptr = black_rooks;
    while (*black_rooks_ptr != -1) {
        score -= S_ROOK;
        score -= SCORE_ROOK[FLIP[*black_rooks_ptr]];
        black_rooks_ptr++;
    }
    free(black_rooks);

    square_t * black_queens = translate(position->black_queen);
    square_t * black_queens_ptr = black_queens;
    while (*black_queens_ptr != -1) {
        score -= S_QUEEN;
        score -= SCORE_QUEEN[FLIP[*black_queens_ptr]];
        black_queens_ptr++;
    }
    free(black_queens);

    return score;
}

score_t negamax(position_t * position, int depth, score_t alpha, score_t beta, bool is_white, size_t * node_count, char * pv) {
    move_t * unsorted = legal_moves(position, depth <= 0);
    if (depth <= 0 && !unsorted->piece) { // quiescence search (no good checks/captures remaining)
        (*node_count)++;
        return ((2 * is_white) - 1) * score_position(position); // leaf node
    } else if (!unsorted->piece) { // no legal moves = game over
        free(unsorted);
        (*node_count)++;
        if (king_is_attacked(position, is_white))
            return is_white ? MIN_SCORE : MAX_SCORE; // checkmate
        return 0; // stalemate
    }

    score_t best = SHRT_MIN;
    move_t * moves = sorted_moves(position, unsorted);
    free(unsorted);
    move_t * moves_ptr = moves;
    while(moves_ptr->piece) {
        position_t * next = play_move(position, *moves_ptr);
        score_t score = -negamax(next, depth - 1, -beta, -alpha, !is_white, node_count, pv);
        free(next);
        if (score > alpha) {
            alpha = score;
            best = score;
            if (depth > 0) {
                char * move_str = move_string(*moves_ptr);
                memcpy(pv + (6 * depth), move_str, 5);
                free(move_str);
            }
            if (alpha >= beta)
                break;
        } else if (score > best)
            best = score;
        moves_ptr++;
    }
    free(moves);

    return best;
}

bool append_move(move_t * dst, size_t limit, move_t * move) {
    int count = 0;
    while (dst->piece) {
        count++;
        if (count > limit)
            return false;
        dst++;
    }
    memcpy(dst, move, sizeof(move_t));
    return true;
}

move_t * sorted_moves(position_t * position, move_t * moves) {
    size_t size = 256;
    move_t * sorted = calloc(size, sizeof(move_t));
    move_t * lookup = calloc(size, sizeof(move_t));
    int total = 0;
    bool priority_moves_done = false;
    while (true) {
        move_t * moves_ptr = moves;
        while (moves_ptr->piece) {
            if (!priority_moves_done) {
                if (moves_ptr->piece & 112U) { // pawn promotion
                    uint8_t promotion = (moves_ptr->piece & 112U) >> 4;
                    score_t index = 4 * PROMOTE_TABLE[promotion];
                    append_move(lookup + index, size - index - 1, moves_ptr);
                } else if (moves_ptr->piece & 8U) { // capture
                    bool is_white = position->info & 1U;
                    uint8_t captor = moves_ptr->piece & 7U;
                    board_t mask = (board_t)1 << moves_ptr->target;
                    uint8_t target;
                    for (target = 6; target >= 2; target--) {
                        board_t opp = 0;
                        if (target == 6)
                            opp = is_white ? position->black_pawn : position->white_pawn;
                        else if (target == 5)
                            opp = is_white ? position->black_knight : position->white_knight;
                        else if (target == 4)
                            opp = is_white ? position->black_bishop : position->white_bishop;
                        else if (target == 3)
                            opp = is_white ? position->black_rook : position->white_rook;
                        else if (target == 2)
                            opp = is_white ? position->black_queen : position->white_queen;
                        if (opp & mask)
                            break;
                    }
                    score_t index = CAPTURE_TABLE[captor][target] * 4;
                    append_move(lookup + index, size - index - 1, moves_ptr);
                } else if (moves_ptr->piece & 128U) { // check
                    uint8_t piece = moves_ptr->piece & 7U;
                    score_t index = 4 * CHECK_TABLE[piece];
                    append_move(lookup + index, size - index - 1, moves_ptr);
                }
            } else if (moves_ptr->piece < 8U) { // other
                memcpy(sorted + total, moves_ptr, sizeof(move_t));
                total++;
            }
            moves_ptr++;
        }
        if (!priority_moves_done) {
            priority_moves_done = true;
            for (int index = 255; index >= 40; index--) { // all moves with a score over 9
                if ((lookup + index)->piece) {
                    memcpy(sorted + total, lookup + index, sizeof(move_t));
                    total++;
                }
            }
        } else {
            for (int index = 39; index >= 0; index--) { // all moves with a score under 10
                if ((lookup + index)->piece) {
                    memcpy(sorted + total, lookup + index, sizeof(move_t));
                    total++;
                }
            }
            break;
        }
    }
    free(lookup);

    // move_t * captures = calloc(256, sizeof(move_t));
    // move_t * checks = calloc(256, sizeof(move_t));
    // move_t * other = calloc(256, sizeof(move_t));
    // int cap_count = 0, chk_count = 0, otr_count = 0;
    // move_t * moves_ptr = moves;
    // while (moves_ptr->piece) {
    //     if (moves_ptr->piece & 8U) { // capture
    //         memcpy(captures + cap_count, moves_ptr, sizeof(move_t));
    //         cap_count++;
    //     } else if (moves_ptr->piece & 128U) { // check
    //         memcpy(checks + chk_count, moves_ptr, sizeof(move_t));
    //         chk_count++;
    //     } else { // other
    //         memcpy(other + otr_count, moves_ptr, sizeof(move_t));
    //         otr_count++;
    //     }
    //     moves_ptr++;
    // }

    // move_t * sorted_ptr = sorted;
    // moves_ptr = captures;
    // while(moves_ptr->piece)
    //     memcpy(sorted_ptr++, moves_ptr++, sizeof(move_t));
    // free(captures);
    // moves_ptr = checks;
    // while(moves_ptr->piece)
    //     memcpy(sorted_ptr++, moves_ptr++, sizeof(move_t));
    // free(checks);
    // moves_ptr = other;
    // while(moves_ptr->piece)
    //     memcpy(sorted_ptr++, moves_ptr++, sizeof(move_t));
    // free(other);

    return sorted;
}

score_t negamax_tree(position_t * position, int depth, int max_depth, score_t alpha, score_t beta, bool is_white) {
    move_t * unsorted = legal_moves(position, depth <= 0);
    if (depth <= 0 && !unsorted->piece) { // quiescence search (no good checks/captures remaining)
        for (int d = depth + 1; d < max_depth; d++)
            printf("   %c ", (d % 2) == (depth % 2) ? ':' : '|');
        score_t score = ((2 * is_white) - 1) * score_position(position);
        printf("^score = %d\n", score);
        return score; // leaf node
    } else if (!unsorted->piece) { // no legal moves = game over
        free(unsorted);
        score_t score = 0; // default stalemate
        if (king_is_attacked(position, is_white))
            score = is_white ? MIN_SCORE : MAX_SCORE; // checkmate
        for (int d = depth + 1; d < max_depth; d++)
            printf("   %c ", (d % 2) == (depth % 2) ? ':' : '|');
        printf("^score = %d\n", score);
        return score;
    }

    score_t best = MIN_SCORE;
    move_t * moves = sorted_moves(position, unsorted);
    free(unsorted);

    move_t * moves_ptr = moves;
    while(moves_ptr->piece) {
        for (int d = depth; d < max_depth; d++)
            printf("   %c ", (d % 2) == (depth % 2) ? '|' : ':');
        char * move_str = move_string(*moves_ptr);
        printf("%s\n", move_str);
        free(move_str);
        position_t * next = play_move(position, *moves_ptr);
        score_t score = -negamax_tree(next, depth - 1, max_depth, -beta, -alpha, !is_white);
        free(next);
        if (score > alpha) {
            alpha = score;
            best = score;
            if (alpha >= beta)
                break;
        } else if (score > best)
            best = score;
        moves_ptr++;
    }
    free(moves);
    for (int d = depth; d < max_depth - 1; d++)
        printf("   %c ", (d % 2) == (depth % 2) ? '|' : ':');
    printf("   depth %d best score = %d\n", depth, best);

    return best;
}

int tree(position_t * position, int max_depth, double max_time) {
    negamax_tree(position, max_depth, max_depth, MIN_SCORE, MAX_SCORE, position->info & 1);
    return 0;
}