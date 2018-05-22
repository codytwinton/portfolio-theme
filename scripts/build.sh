#!/usr/bin/env bash
set -e # halt script on error

bundle install html-proofer

bundle exec jekyll build
bundle exec htmlproofer ./_site
