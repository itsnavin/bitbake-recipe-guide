SUMMARY = "A greeting program built with CMake"
DESCRIPTION = "Demonstrates the CMake class with separate source and build directories."
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b0c20440ae973cc87aa94387dd966ee5"

SRC_URI = "file://CMakeLists.txt file://hello.c file://LICENSE"
S = "${WORKDIR}"
B = "${WORKDIR}/build"

# The class configures, builds, and installs with CMake.
inherit cmake
