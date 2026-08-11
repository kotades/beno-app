import sys
import os

try:
    import fitz  # PyMuPDF
except ImportError:
    print("❌ Error: PyMuPDF (fitz) not found.")
    print("Please run: pip install pymupdf")
    sys.exit(1)

def extract_pdf_to_text(pdf_path):
    if not os.path.exists(pdf_path):
        print(f"❌ Error: File not found at {pdf_path}")
        return

    doc = fitz.open(pdf_path)
    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    output_path = f"{base_name}_extracted.txt"

    print(f"📄 Extracting {pdf_path} ({doc.page_count} pages)...")

    full_text = ""
    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        full_text += f"\n--- Page {page_num + 1} ---\n\n"
        full_text += text

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    print(f"✅ Extraction complete! Text saved to: {output_path}")
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_text.py [path_to_pdf]")
        sys.exit(1)

    pdf_file = sys.argv[1]
    extract_pdf_to_text(pdf_file)
