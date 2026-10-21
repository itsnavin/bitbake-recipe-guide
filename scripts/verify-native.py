"""Compile harmless supplied examples on the native host, never cross-build claims."""
from pathlib import Path
import shutil
import subprocess
import tempfile

root = Path(__file__).resolve().parents[1]
recipes = root / "examples/meta-recipe-lab/recipes-example"
def run(args, cwd):
    subprocess.run(args, cwd=cwd, check=True)

with tempfile.TemporaryDirectory(prefix="bitbake-guide-native-") as temp:
    work = Path(temp)
    for name in ["hello", "make", "cmake", "autotools"]:
        pn = "recipe-lab-" + name
        dest = work / pn
        shutil.copytree(recipes / pn / pn, dest)
        if name == "make":
            run(["make", "CC=gcc", "CFLAGS=-O2 -Wall -Wextra -Werror", "LDFLAGS=-Wl,--as-needed"], dest)
        else:
            run(["gcc", "-O2", "-Wall", "-Wextra", "-Werror", "hello.c", "-Wl,--as-needed", "-o", "hello"], dest)
        result = subprocess.check_output([str(dest / "hello")], text=True)
        assert "Hello" in result, (pn, result)
        print("PASS native C source" + (" and Makefile" if name == "make" else "") + ":", pn, result.strip())
    patch = root / "examples/meta-recipe-lab-custom/recipes-example/recipe-lab-hello/recipe-lab-hello/hello.patch"
    run(["git", "apply", "--check", str(patch)], work / "recipe-lab-hello")
    print("PASS patch matches supplied hello source")
    for name, command in [("cmake", "cmake"), ("autotools", "autoreconf")]:
        if not shutil.which(command):
            print("NOT RUN full native build system (missing tool):", command)
            continue
        dest = work / ("recipe-lab-" + name)
        build = dest / "build"
        build.mkdir()
        if name == "cmake":
            run(["cmake", "-S", str(dest), "-B", str(build)], dest)
            run(["cmake", "--build", str(build)], dest)
        else:
            run(["autoreconf", "-fi"], dest)
            run([str(dest / "configure")], build)
            run(["make"], build)
        print("PASS native build system:", name)
print("Native checks complete. No OE task, package, cross-build, image, service or boot validation claimed.")
