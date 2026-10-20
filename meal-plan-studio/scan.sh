#!/bin/bash
# usage: scan.sh file...  -> prints distinct lines mentioning forbidden foods
PAT='soy|tofu|tempeh|edamame|miso|tamari|broccoli|cauliflower|cabbage|kale|brussels|bok choy|arugula|radish|collard|turnip|mustard green|watercress|peanut|millet|kimchi|sauerkraut'
for f in "$@"; do
  case "$f" in
    *.pdf) pdftotext -layout "$f" - ;;
    *.pptx) unzip -p "$f" 'ppt/slides/*.xml' 'ppt/notesSlides/*.xml' | sed 's/<[^>]*>/ /g' ;;
    *.html) sed 's/<[^>]*>/\n/g;s/\\n/\n/g' "$f" | tr -s ' ' ;;
  esac | grep -i -o -E ".{0,60}($PAT).{0,60}" | sort -u | sed "s|^|[$(basename $f)] |"
done
