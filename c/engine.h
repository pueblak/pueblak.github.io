#ifndef ENGINE_H
#define ENGINE_H

#include "chess.h"

typedef int16_t score_t;
typedef struct _count {
    uint64_t total;
    uint64_t captures;
    uint32_t en_passants;
    uint32_t castles;
    uint32_t promotions;
    uint32_t checks;
    uint16_t checkmates;
    uint16_t stalemates;
} count_t;

void add_count(count_t * count, count_t addend);
char * count_string(count_t count);
count_t count_moves(position_t * position, int depth);

int play(position_t * position, int max_depth, double max_time);
int search(position_t * position, int max_depth, double max_time);
int count(position_t * position, int max_depth, double max_time);
int divide(position_t * position, int max_depth, double max_time);
int score(position_t * position, int max_depth, double max_time);
int tree(position_t * position, int max_depth, double max_time);

score_t negamax(position_t * position, int depth, score_t alpha, score_t beta, bool is_white, size_t * node_count, char * pv);
score_t negamax_tree(position_t * position, int depth, int max_depth, score_t alpha, score_t beta, bool is_white);
score_t score_position(position_t * position);
move_t * sorted_moves(position_t * position, move_t * moves);

#endif