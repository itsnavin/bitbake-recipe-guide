# meta-recipe-lab

A self-contained layer of six small BitBake recipes for learning Scarthgap
(Yocto 5.0). Add this layer to `BBLAYERS`; it depends only on `core`.

The examples cover a directly compiled C program, Make, CMake, Autotools,
installed data/configuration, and a systemd oneshot greeting service. The
service is installed disabled; enable it explicitly on a system that uses
systemd. Its recipe requires `systemd` in `DISTRO_FEATURES` and depends on
`recipe-lab-hello` at runtime. The service template is configured to the
actual `${bindir}` path during installation, not a hardcoded host path.

`meta-recipe-lab-custom` is a separate optional layer. Add it after
`meta-recipe-lab` to apply the hello-program patch; it is not enabled by
default.
