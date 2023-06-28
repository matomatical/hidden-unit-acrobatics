Hidden Unit Acrobatics
======================

A talk at SLTxA Summit 2023

Link to a github pages site hosting the talk: TODO

This repository contains the source code

Install
-------

Dependencies:

* react
* react-dom
* mafs
* mdx
* katex
* some libraries to plug that into mafs and mdx

Development dependencies (not bundled into the project, but required to
build it):

* [mdx](https://mdxjs.com/) esbuild plugin (`@mdx-js/esbuild`)
* [esbuild](https://esbuild.github.io/) (installed globally)
* make (because I am stubborn and don't want to use npm any more
  than I have to)


Develop
-------

write the talk / notebook

* write the talk in markdown in `src/main.mdx`
* actually, it's not markdown, it's mdx, or markdown with some JSX
  components embedded
* (will have to `:set syntax=markdown` for syntax highlighting until I bother
  to look up how to do that automatically)
* this create a notebook-style talk with some hand-coded interactive
  visualisations

write the components to use in the talk

* see `src/components.jsx`

style it:

* `src/mafs.css` and `src/font.css` are from mafs, slightly altered
* `src/matte.css` and `src/matte-hrule.css` are by me from

bring it all together

* etry-point for JS `src/main.jsx`
* this is bundled via esbuild and includes all necessary library code
* `src/index.html` links in that script and has the react hook on the main
  element
* `src/index.html` also has to manually include the stylesheets
  * I don't know how to bundle those with esbuild (or whether I should)

Build
-----

Just run `make` :)

The esbuild settings are in `build.mjs`.

I hard-coded them to deployment mode when it came time to deploy so to
develop again, would want to turn off minification I guess.
