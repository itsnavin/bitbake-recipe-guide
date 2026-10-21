SUMMARY = "A greeting program built with Make"
DESCRIPTION = "Demonstrates a local Makefile invoked by BitBake's default compile task."
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b0c20440ae973cc87aa94387dd966ee5"

SRC_URI = "file://Makefile file://hello.c file://LICENSE"
S = "${WORKDIR}"

# The default do_compile task runs oe_runmake using the cross-toolchain environment.
do_install() {
    install -d "${D}${bindir}"
    install -m 0755 "${B}/hello" "${D}${bindir}/recipe-lab-make"
}
