# Kuchaman Defence Academy website clone

This repository contains a code export of the seven public pages at [kuchamandefenceacademy.in](https://kuchamandefenceacademy.in/). It includes the original page content, layout styles, fonts, and images. It can be served without WordPress or the Elementor editor. Editable page sections live under `src/pages/`.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`. Pages are available at `/about-us/`, `/program/`, `/admission/`, `/contact-us/`, `/blog/`, and `/privacy-policy/`.

Edit a file under `src/pages/<page>/sections/`, then run `python3 scripts/build_site.py`. The generated HTML in the repository root and page directories is what the host serves. Run `python3 scripts/build_site.py --check` before packaging.

## Hostinger upload

Run `python3 scripts/package_hostinger.py`. It creates `/workspace/hostinger-upload.zip`, containing only the deployable files at its root. In Hostinger File Manager, upload this archive inside the temporary site's `public_html` directory and extract it there; `index.html` must end up directly in `public_html`, alongside `clone.js`, `api/`, `wp-content/`, and the page folders. Do not upload the repository's `.git`, `src`, or `scripts` directories as public web files.

## Preview and deployment

The GitHub Actions workflow checks a public source preview on each push. For native GitHub Pages deployment, select **GitHub Actions** under **Settings → Pages** in the repository, then rerun the workflow.

## Runtime limits

The enquiry form is handled by `api/enquiry.php` on a PHP-enabled Hostinger account and sends to the academy email shown on the source site. Mail delivery must be verified on the actual Hostinger temporary domain; local static previews show a clear preview-only message. The embedded Google Map and outbound social links still load from their original providers. Some bundled frontend scripts are output from the source site's WordPress plugins; editing the site does not require Elementor.
