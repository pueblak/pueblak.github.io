OBJS_DIR=.objs
CC=gcc
WARNINGS = -Wall -Wextra -Werror -Wno-error=unused-parameter -Wmissing-declarations -Wmissing-variable-declarations
INCLUDES=-I./includes/
CFLAGS = $(INCLUDES) -O2 $(WARNINGS) -g -std=c99 -c -MMD -MP -D_GNU_SOURCE
DEPS = move_search.h
LIBS=-lm

-include $(OBJS_DIR)/*.d

$(OBJS_DIR):
	@mkdir -p $(OBJS_DIR)
$(OBJS_DIR)/%.o: %.c $(DEPS) | $(OBJS_DIR)
	$(CC) -c -o $@ $< $(CFLAGS)

chess: chess_main.o chess.o engine.o
	$(CC) -o $@ $^ $(CFLAGS) $(LIBS)

.PHONY: clean

clean:
	rm -rf $(OBJS_DIR)