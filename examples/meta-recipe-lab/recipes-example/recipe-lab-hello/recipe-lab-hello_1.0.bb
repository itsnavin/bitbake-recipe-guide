SUMMARY = "A small C greeting program built directly by BitBake"
DESCRIPTION = "Demonstrates compiling one C source file with the toolchain flags."
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b0c20440ae973cc87aa94387dd966ee5"

SRC_URI = "file://hello.c file://LICENSE"
S = "${WORKDIR}"

# Use every cross-toolchain flag category in this direct compile.
do_compile() {
    ${CC} ${CPPFLAGS} ${CFLAGS} "${S}/hello.c" ${LDFLAGS} -o "${B}/hello"
}

do_install() {
    install -d "${D}${bindir}"
    install -m 0755 "${B}/hello" "${D}${bindir}/recipe-lab-hello"
}
