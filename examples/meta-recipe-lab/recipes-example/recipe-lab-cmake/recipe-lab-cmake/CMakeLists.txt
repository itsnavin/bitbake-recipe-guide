cmake_minimum_required(VERSION 3.10)
project(recipe_lab_cmake C)
include(GNUInstallDirs)

add_executable(recipe-lab-cmake hello.c)
install(TARGETS recipe-lab-cmake RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})
