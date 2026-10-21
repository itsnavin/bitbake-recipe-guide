# Optional change kept separate from the default recipe layer.
FILESEXTRAPATHS:prepend := "${THISDIR}/${PN}:"

SRC_URI += "file://hello.patch"
