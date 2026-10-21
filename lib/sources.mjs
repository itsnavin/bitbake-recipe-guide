export const baseline = {
  yocto: '5.0.13 Scarthgap',
  bitbake: '2.8.1',
  commit: 'f16cffd030d21d12dd57bb95cfc310bda41f8a1f',
  reviewed: '2026-10-21',
};
export const sources = {
  syntax: ['BitBake 2.8: syntax and operators', 'https://docs.yoctoproject.org/bitbake/2.8/bitbake-user-manual/bitbake-user-manual-metadata.html'],
  execution: ['BitBake 2.8: execution and signatures', 'https://docs.yoctoproject.org/bitbake/2.8/bitbake-user-manual/bitbake-user-manual-execution.html'],
  fetching: ['BitBake 2.8: fetchers', 'https://docs.yoctoproject.org/bitbake/2.8/bitbake-user-manual/bitbake-user-manual-fetching.html'],
  cli: ['Pinned BitBake command-line definitions', `https://github.com/yoctoproject/poky/blob/${baseline.commit}/bitbake/lib/bb/main.py`],
  tasks: ['Scarthgap: task reference', 'https://docs.yoctoproject.org/5.0.13/ref-manual/tasks.html'],
  variables: ['Scarthgap: variable glossary', 'https://docs.yoctoproject.org/5.0.13/ref-manual/variables.html'],
  classes: ['Scarthgap: class reference', 'https://docs.yoctoproject.org/5.0.13/ref-manual/classes.html'],
  recipes: ['Scarthgap: writing a new recipe', 'https://docs.yoctoproject.org/5.0.13/dev-manual/new-recipe.html'],
  layers: ['Scarthgap: layers', 'https://docs.yoctoproject.org/5.0.13/dev-manual/layers.html'],
  devtool: ['Scarthgap: devtool reference', 'https://docs.yoctoproject.org/5.0.13/ref-manual/devtool-reference.html'],
  sdk: ['Scarthgap: extensible SDK workflow', 'https://docs.yoctoproject.org/5.0.13/sdk-manual/extensible.html'],
  qa: ['Scarthgap: QA errors and warnings', 'https://docs.yoctoproject.org/5.0.13/ref-manual/qa-checks.html'],
  packages: ['Scarthgap: inspecting packages', 'https://docs.yoctoproject.org/5.0.13/dev-manual/packages.html'],
  buildhistory: ['Scarthgap: build history', 'https://docs.yoctoproject.org/5.0.13/dev-manual/build-quality.html'],
  source: ['Exact Poky source baseline', `https://github.com/yoctoproject/poky/tree/${baseline.commit}`],
};
