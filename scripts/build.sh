#!/usr/bin/env bash
set -e # halt script on error

bundle exec jekyll build

set +e

htmlproofer --http-status-ignore "999" ./_site
