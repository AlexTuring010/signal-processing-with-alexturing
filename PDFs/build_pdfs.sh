#!/usr/bin/env bash
# ======================================================================
#  build_pdfs.sh — compile every lecture .tex into a PDF.
#
#  Requirements:
#    * A Unicode TeX engine: XeLaTeX or LuaLaTeX (TeX Live / MiKTeX).
#      fontspec + babel-greek will NOT work under plain pdflatex.
#    * The "Latin Modern" and "DejaVu Sans Mono" fonts (both bundled with
#      a full TeX Live install).
#
#  Usage:
#    cd PDFs
#    ./build_pdfs.sh            # build all lectures
#    ./build_pdfs.sh L03        # build only files matching "L03"
#
#  Each file is compiled twice so the table of contents and internal
#  hyperlinks resolve. Auxiliary files are cleaned up at the end.
# ======================================================================
set -u
cd "$(dirname "$0")"

# Prefer XeLaTeX; fall back to LuaLaTeX (either works with this preamble).
if command -v xelatex >/dev/null 2>&1; then
  ENGINE="xelatex"
elif command -v lualatex >/dev/null 2>&1; then
  ENGINE="lualatex"
else
  echo "ERROR: neither 'xelatex' nor 'lualatex' found." >&2
  echo "       Install a full TeX Live distribution and retry." >&2
  exit 1
fi
echo "Using engine: $ENGINE"

PATTERN="${1:-L}"
shopt -s nullglob
FILES=( ${PATTERN}*.tex )
if [ ${#FILES[@]} -eq 0 ]; then
  echo "No .tex files matching '${PATTERN}*.tex' found." >&2
  exit 1
fi

FAILED=()
for f in "${FILES[@]}"; do
  echo "──────────────────────────────────────────────"
  echo "Compiling $f ..."
  if "$ENGINE" -interaction=nonstopmode -halt-on-error "$f" >/dev/null 2>&1 \
     && "$ENGINE" -interaction=nonstopmode -halt-on-error "$f" >/dev/null 2>&1; then
    echo "  OK -> ${f%.tex}.pdf"
  else
    echo "  FAILED: $f  (run '$ENGINE $f' directly to see the error)"
    FAILED+=( "$f" )
  fi
done

# Clean up LaTeX auxiliary files, keep the .pdf and .tex.
rm -f ./*.aux ./*.log ./*.out ./*.toc ./*.synctex.gz

echo "──────────────────────────────────────────────"
if [ ${#FAILED[@]} -eq 0 ]; then
  echo "All ${#FILES[@]} document(s) built successfully."
else
  echo "${#FAILED[@]} document(s) failed: ${FAILED[*]}"
  exit 1
fi
