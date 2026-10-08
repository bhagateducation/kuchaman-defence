# Editing the site by section

Each page has a `template.html` in `src/pages/`. Its `<!-- @include ... -->` markers point to the page's editable files in `sections/`. The home page, for example, separates the hero, programs strip, academy introduction, academic support, overview, student gallery, and enquiry area. Header and footer markup are also separate per page so page-specific active navigation stays accurate.

Edit a section file, then run `python3 scripts/build_site.py` from the repository root. This regenerates the seven deployable HTML pages in place. Run `python3 scripts/build_site.py --check` to verify they match their sections.

The source markup reflects the original site's frontend output. Keep the existing classes and element nesting when making visual changes; the local CSS under `wp-content/` supplies the original styling.
