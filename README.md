# Kuchaman Defence Academy website clone

This repository contains a static code export of the seven public pages at [kuchamandefenceacademy.in](https://kuchamandefenceacademy.in/). It includes the original page content, layout styles, fonts, and images. It can be served without WordPress or the Elementor editor.

## Run locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://127.0.0.1:8000/`. Pages are available at `/about-us/`, `/program/`, `/admission/`, `/contact-us/`, `/blog/`, and `/privacy-policy/`.

## Preview and deployment

The GitHub Actions workflow checks a public source preview on each push. For native GitHub Pages deployment, select **GitHub Actions** under **Settings → Pages** in the repository, then rerun the workflow.

## Runtime limits

This is a static visual clone. The source site's Fluent Forms submission endpoint and WordPress backend are not included, so enquiry forms require a new backend before accepting submissions. The embedded Google Map and outbound social links still load from their original providers. Some bundled frontend scripts are output from the source site's WordPress plugins; editing the site does not require Elementor.
