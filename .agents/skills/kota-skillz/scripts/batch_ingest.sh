#!/bin/bash
KNOWLEDGE_DIR="/home/sanniinuoluwadunsimi/Documents/Sanni Workspace/kotades Skillz/kota-skillz"
PYTHON="$KNOWLEDGE_DIR/venv/bin/python3"
EXTRACTOR="$KNOWLEDGE_DIR/scripts/pdf_to_text.py"

cd "/home/sanniinuoluwadunsimi/Documents/Sanni Workspace/kotades Skillz"

for f in *.pdf; do
    echo "🚀 Processing: $f"
    "$PYTHON" "$EXTRACTOR" "$f"
done

echo "✅ All 7 PDFs extracted!"
