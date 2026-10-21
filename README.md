# BitBake Field Guide

A searchable, offline-friendly learning/reference app for writing BitBake recipes.
Public site: **https://itsnavin.github.io/bitbake-recipe-guide/**

Commands are displayed, never executed. There are no accounts, telemetry, external
fonts, external runtime APIs, code evaluation, or uploads.

## Release baseline

- Yocto **5.0.13 Scarthgap**, Poky checkout commit
  [`f16cffd030d21d12dd57bb95cfc310bda41f8a1f`](https://github.com/yoctoproject/poky/tree/f16cffd030d21d12dd57bb95cfc310bda41f8a1f).
- Embedded BitBake **2.8.1**, verified from that commit's
  `bitbake/lib/bb/__init__.py` and actual CLI/parser.
- Annotated tag object `529843b1c189ab7b133b7fdf197d4b2a4b71a6db` is **not**
  the checkout commit.
- Content reviewed **2026-10-21**. Every guide/operation links release-matched
  primary manuals or pinned source. Explanations are original, not copied manuals.

This is curated coverage, not a claim to document every present/future variable
or vendor class. The in-app coverage matrix distinguishes BitBake language,
OE-Core/Poky metadata, and machine/distribution policy.

## Run locally

Requires Node.js 22+ and npm. The app itself has no runtime dependencies.

```sh
npm ci
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/bitbake-recipe-guide/`. On PowerShell hosts whose
execution policy disables `npm.ps1`, use the normal `npm.cmd`/`npx.cmd` entry points.
`dist/` is generated and ignored. Do not serve the source tree directly: the build
generates example-file data, ZIPs, the manifest and the offline resource list.

## Content and downloadable examples

- `lib/commands.mjs`: operations with prerequisites, effects, stamps/cache/network
  implications, output interpretation, traps and source links.
- `lib/topics.mjs`: deep language and OE metadata explanations, worked outputs,
  troubleshooting, learning pathway and glossary.
- `lib/sources.mjs`: exact baseline and official references.
- `lib/examples.mjs`: complete-file lists and recipe-line annotations.
- `examples/meta-recipe-lab`: single C, Make, CMake, Autotools, data/config,
  and systemd service recipes with matching inputs.
- `examples/meta-recipe-lab-custom`: optional hello `.bbappend` and patch.

The workshop builds seven individual ZIPs plus one all-layers ZIP. Each ZIP
includes the required layer configuration and sources, not just a `.bb` file.
The service ZIP also supplies its hello runtime dependency. Add the extracted
base layer with `bitbake-layers add-layer /absolute/path/to/meta-recipe-lab` in
your initialized Linux build environment. Add the custom layer separately if
you want the patch. Follow the in-app learning path for packaging/image steps.

The examples use Scarthgap's `${WORKDIR}` unpack behavior, **not** newer
`UNPACKDIR` patterns. MIT license text is supplied and the recipe MD5 is computed
from its exact bytes. This is distinct from an upstream archive's SHA-256.
The service is disabled by default and requires `systemd` in `DISTRO_FEATURES`.
No firmware/proprietary assets are shipped.

**Reference snippets** may contain clearly labeled placeholders and are not
standalone recipes. **Complete supplied examples** have matching files, but that
label does not assert a successful full OE cross-build or device boot.

## Verification

```sh
npm run build
npm test
npx playwright install chromium
npm run test:browser
python3 scripts/verify-downloads.py
python3 scripts/verify-native.py
python3 scripts/verify-bitbake.py --source /path/to/extracted/pinned/poky
```

Run Python/native checks on Linux (WSL works). The source argument must point to
the exact Poky commit above, including `bitbake`, `meta` and `scripts`. CI downloads
the immutable commit archive into its runner's temporary directory.

Checks cover:

- Unique IDs, crossrefs, primary sources, required content fields and coverage.
- Supplied files, actual license MD5, newlines, complete download contents and
  independent Python `zipfile` CRC/byte validation.
- Nine real BitBake parser fixtures: assignments, weak defaults, whitespace,
  lazy/immediate expansion, inline Python and override priority. Displayed
  fixture inputs are checked against the executable fixture definitions.
- Seven complete recipe/append syntax ASTs from the actual BitBake parser,
  **without** fake OE classes. This is syntax validation, not OE evaluation.
- Actual BitBake `--help` and pinned helper source definitions; real class
  presence is checked separately, not treated as a successful build.
- Native GCC compilation/execution for the supplied C sources, Make build,
  patch application; full CMake/Autotools native builds when those tools exist.
- Chromium desktop and touch/mobile search, filters, keyboard focus, deep-link
  reload/back, line annotations, source selection, downloads, cleanup copy
  acknowledgement, denied clipboard/manual fallback, and offline routes/ZIPs.
- Automated axe WCAG A/AA rules on the home, syntax, cleanup, recipe and coverage
  surfaces at desktop and mobile sizes; these complement, not replace, manual
  accessibility testing with assistive technologies.

**Limits:** no configured Yocto cross-build, package QA run, image generation,
service execution or hardware boot was performed locally. Native C/Make checks
do not establish those outcomes. CMake/Autotools tools are absent on the local
WSL host; CI uses them if available and explicitly reports skips otherwise.
Other browsers, assistive technologies and every possible machine configuration
are not exhaustively tested.

## Maintenance

Edit content modules, not generated `dist`. Preserve stable IDs for deep links.
Update matching parser fixtures when changing worked outputs. Keep source URLs
release-specific. Compare actual helper flags/source when adding operations.
Do not infer task availability from a JSON catalog: check release metadata and
teach `bitbake -c listtasks TARGET`.

After reviewing a license text change, `node scripts/normalize-examples.mjs`
normalizes sample text to LF and updates the shared example MIT checksums.
Never use it to accept an upstream license change without review. When editing
recipes, update annotation line numbers and file lists, rerun all relevant
checks, and inspect ZIPs independently. New files must be listed in the example
catalog to ship in downloads.

Search indexes full explanations and supplied source locally. User input is
rendered as text/escaped HTML, never evaluated. Cleanup command copying requires
per-operation acknowledgement; failure to access clipboard gives selectable
manual text. Diagnostic parse/dry-run commands are not advertised as sandboxes.

The service worker precaches the same-origin guide, sources and ZIPs. Offline
readiness is shown explicitly; first load needs HTTPS/localhost and connectivity.
External manual links remain online-only. Storage eviction/private modes may
disable offline use. Updates wait for the user's reload action; cache names are
content-hashed and cleanup only touches this app's cache namespace.

## Publishing

GitHub Pages is configured with **GitHub Actions** as the build source. The
`Verify and publish guide` workflow runs on pull requests and main pushes.
Only a successful main verification uploads `dist` and deploys it with the
Pages/OIDC permissions. Hash routing works on project Pages without rewrite
rules. Asset URLs are relative to `/bitbake-recipe-guide/`.

Push reviewed changes to `main`, inspect the workflow result and check the live
site and its ZIP after deployment. No other repository is modified by this app.
Related apps are linked as separate tools; they are not runtime dependencies.
