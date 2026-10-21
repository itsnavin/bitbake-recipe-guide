SUMMARY = "A harmless systemd greeting oneshot"
DESCRIPTION = "Installs an opt-in oneshot that prints a greeting to the journal."
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://LICENSE;md5=b0c20440ae973cc87aa94387dd966ee5"

SRC_URI = "file://recipe-lab-greeting.service file://LICENSE"
S = "${WORKDIR}"

inherit systemd features_check
REQUIRED_DISTRO_FEATURES = "systemd"
RDEPENDS:${PN} = "recipe-lab-hello"

SYSTEMD_SERVICE:${PN} = "recipe-lab-greeting.service"
# Enable the unit explicitly on a system using systemd.
SYSTEMD_AUTO_ENABLE:${PN} = "disable"

do_install() {
    install -d "${D}${systemd_system_unitdir}"
    sed -e 's|@BINDIR@|${bindir}|g' "${S}/recipe-lab-greeting.service" > "${D}${systemd_system_unitdir}/recipe-lab-greeting.service"
    chmod 0644 "${D}${systemd_system_unitdir}/recipe-lab-greeting.service"
}

FILES:${PN} += "${systemd_system_unitdir}/recipe-lab-greeting.service"
