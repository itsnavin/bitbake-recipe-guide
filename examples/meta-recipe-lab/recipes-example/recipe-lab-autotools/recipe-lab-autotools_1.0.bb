SUMMARY = "A greeting program built with GNU Autotools"
DESCRIPTION = "Demonstrates autoreconf and out-of-tree configuration in BitBake."
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b0c20440ae973cc87aa94387dd966ee5"

SRC_URI = "file://configure.ac file://Makefile.am file://hello.c file://LICENSE"
S = "${WORKDIR}"
B = "${WORKDIR}/build"

# The class runs autoreconf and configures the separate build directory.
inherit autotools
