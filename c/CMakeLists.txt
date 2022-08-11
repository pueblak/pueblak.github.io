cmake_minimum_required(VERSION 3.10)

project(Chess VERSION 1.0)
configure_file(config.h.in config.h)

add_executable(chess chess_main.c chess.c engine.c)

target_include_directories(chess PUBLIC "${PROJECT_BINARY_DIR}")