"""Run real pinned parser/CLI checks. Not an OE build, and no stub classes."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument("--source", type=Path, required=True, help="Extracted pinned Poky tree")
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
source = args.source.resolve()
sys.path.insert(0, str(source / "bitbake/lib"))
import bb
import bb.data
import bb.parse
from bb.parse.parse_py import BBHandler

assert bb.__version__ == "2.8.1", bb.__version__
fixtures = json.loads((root / "tests/parser-fixtures.json").read_text())
with tempfile.TemporaryDirectory(prefix="bitbake-guide-parser-") as temp:
    for fixture in fixtures:
        file = Path(temp) / (fixture["name"] + ".conf")
        file.write_text(fixture["text"])
        d = bb.data.init()
        d.setVar("TOPDIR", temp)
        d.setVar("BBPATH", temp)
        bb.parse.handle(str(file), d)
        actual = {name: d.getVar(name) for name in fixture["expected"]}
        assert actual == fixture["expected"], (fixture["name"], actual, fixture["expected"])
        print("PASS parser output:", fixture["name"], actual)

# Actual BitBake syntax AST for complete recipe files, without evaluating
# OE inheritance/dependency metadata. This is deliberately NOT a build test.
for pattern in ("*.bb", "*.bbappend"):
    for file in (root / "examples").rglob(pattern):
        BBHandler.get_statements(str(file), str(file), file.stem)
        print("PASS syntax AST (not OE evaluation):", file.name)

env = dict(os.environ, PYTHONPATH=str(source / "bitbake/lib"), PYTHONDONTWRITEBYTECODE="1")
result = subprocess.run([sys.executable, str(source / "bitbake/bin/bitbake"), "--help"],
                        env=env, capture_output=True, text=True, check=True)
flags = ["-f", "-c", "-C", "-n", "-p", "-e", "-g", "-s", "-S", "-D", "-v",
         "--version", "--help", "--runall", "--no-setscene", "--skip-setscene", "--setscene-only"]
for flag in flags:
    assert flag in result.stdout, flag
print("PASS actual BitBake --help:", ", ".join(flags))
for name in ["cmake", "autotools", "systemd", "features_check"]:
    file = source / "meta/classes-recipe" / (name + ".bbclass")
    assert file.is_file(), file
    print("PASS real OE class present (not configured/evaluated):", file.name)

evidence = {
    "bitbake/lib/bblayers/query.py": ["show-layers", "show-recipes", "show-appends", "show-overlayed"],
    "bitbake/lib/bblayers/action.py": ["add-layer"],
    "meta/lib/bblayers/create.py": ["create-layer"],
    "scripts/lib/devtool/standard.py": ["add", "modify", "status", "update-recipe", "reset", "--append"],
    "scripts/lib/devtool/build.py": ["build"],
    "scripts/lib/recipetool/create.py": ["create"],
    "scripts/oe-pkgdata-util": ["list-pkg-files", "find-path"],
    "scripts/buildhistory-diff": ["--buildhistory-dir", "'-p'", "revisions"],
    "scripts/yocto-check-layer": ["argparse"],
}
for name, tokens in evidence.items():
    text = (source / name).read_text()
    for token in tokens:
        assert token in text, (name, token)
    print("PASS pinned tool definitions:", name)
print("Verified parser fixtures, recipe syntax ASTs, CLI help and real source definitions. No full OE build performed.")
