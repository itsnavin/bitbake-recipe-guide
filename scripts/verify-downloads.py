"""Independent Python standard-library ZIP validation; never executes archive data."""
import hashlib
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parents[1]
downloads = root / "dist/downloads"
for archive in sorted(downloads.glob("*.zip")):
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None, archive.name
        names = z.namelist()
        assert len(names) == len(set(names)), "duplicate archive names"
        for name in names:
            assert not name.startswith("/") and ".." not in Path(name).parts, name
            data = z.read(name)
            assert data.endswith(b"\n") and b"\r" not in data, name
            assert data == (root / "examples" / name).read_bytes(), name
            if name.endswith(".bb"):
                import re
                match = re.search(rb"LIC_FILES_CHKSUM = \"file://LICENSE;md5=([a-f0-9]{32})\"", data)
                assert match, name
                folder = Path(name).parent
                pn = Path(name).stem.split("_")[0]
                license_bytes = z.read(str(folder / pn / "LICENSE"))
                assert hashlib.md5(license_bytes).hexdigest().encode() == match[1], name
        print(f"PASS independent ZIP bytes/CRC/licenses/newlines: {archive.name} ({len(names)} files)")
assert len(list(downloads.glob("*.zip"))) == 8
