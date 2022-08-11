#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <stdbool.h>

#include "chess.h"
#include "engine.h"

void usage() {
    printf("\nUsage:\n  chess (PLAY|SEARCH) BOARD (-d DEPTH|-t TIME) [-p BEST_N_MOVES]\n    PLAY = \"PLAY\"\n    SEARCH = \"SEARCH\"\n    DEPTH = int{maximum depth to search}\n    TIME = int{maximum time (in milliseconds) to search}\n    BEST_N_MOVES = int{number of best moves to print out}\n\nExample:\n  chess SEARCH \"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1\" -d 12 -p 3\n\n");
    exit(1);
}

int main(int argc, char **argv) {
    int max_depth = -1;
    double max_time = -1;
    
    // [required] two exclusive modes: PLAY or SEARCH
    // [required] initial board state as FEN string: BOARD
    // [required] two exclusive options to limit runtime: -d DEPTH or -t TIME
    // [optional] one universal option: -p BEST_N_MOVES
    if (!((argc == 5) || (argc == 7)))
        usage();
    if (strcmp(argv[1], "PLAY") && strcmp(argv[1], "SEARCH") && strcmp(argv[1], "COUNT") && strcmp(argv[1], "DIVIDE") && strcmp(argv[1], "SCORE") && strcmp(argv[1], "TREE"))
        usage();
    if ((strcmp(argv[3], "-d") && strcmp(argv[3], "-t")) || atoi(argv[4]) < 1)
        usage();
    if (argc == 7 && (!strcmp(argv[5], "-p") || atoi(argv[6]) < 1))
        usage();

    if (!(strcmp(argv[3], "-d")))
        max_depth = atoi(argv[4]);
    else
        max_time = atoi(argv[4]);

    // debugging vv
    position_t * init_position = from_FEN(argv[2]);
    if (!init_position) {
        printf("Incorrect FEN format: \"%s\"", argv[2]);
        exit(1);
    }
    // debugging ^^

    clock_t start_time = clock();
    int ret;
    if (!(strcmp(argv[1], "PLAY")))
        ret = play(init_position, max_depth, max_time);
    else if (!(strcmp(argv[1], "SEARCH")))
        ret = search(init_position, max_depth, max_time);
    else if (!(strcmp(argv[1], "COUNT")))
        ret = count(init_position, max_depth, max_time);
    else if (!(strcmp(argv[1], "DIVIDE")))
        ret = divide(init_position, max_depth, max_time);
    else if (!(strcmp(argv[1], "TREE")))
        ret = tree(init_position, max_depth, max_time);
    else
        ret = score(init_position, max_depth, max_time);

    double elapsed = (double)(clock() - start_time) / CLOCKS_PER_SEC;

    printf("Total time: %.3f seconds.\n", elapsed);

    // cleanup
    free(init_position);

    return ret;
}