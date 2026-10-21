SUMMARY = "Sample data and an editable configuration file"
DESCRIPTION = "Demonstrates installing package-owned data and declaring a conffile."
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b0c20440ae973cc87aa94387dd966ee5"

SRC_URI = "file://recipe-lab.conf file://greeting.txt file://LICENSE"
S = "${WORKDIR}"

do_install() {
    install -d "${D}${sysconfdir}/recipe-lab"
    install -m 0644 "${WORKDIR}/recipe-lab.conf" "${D}${sysconfdir}/recipe-lab/recipe-lab.conf"
    install -d "${D}${datadir}/recipe-lab"
    install -m 0644 "${WORKDIR}/greeting.txt" "${D}${datadir}/recipe-lab/greeting.txt"
}

# Preserve user edits to this configuration file on package upgrades.
CONFFILES:${PN} = "${sysconfdir}/recipe-lab/recipe-lab.conf"

FILES:${PN} += "${datadir}/recipe-lab"
