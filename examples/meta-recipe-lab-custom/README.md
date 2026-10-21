# meta-recipe-lab-custom

Optional companion layer for `meta-recipe-lab`. Add both layers to `BBLAYERS`
to apply the patch to `recipe-lab-hello`; the base layer alone keeps the
original greeting. This layer depends on both `core` and `recipe-lab`.
