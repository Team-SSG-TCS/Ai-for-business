import pymupdf

doc = pymupdf.open(r"c:\Users\deepa\OneDrive\Documents\Desktop\Visual Studio\TicketFlow\project_report\projectReportRef (2).pdf")
print("Total pages:", len(doc))

with open(r"c:\Users\deepa\OneDrive\Documents\Desktop\Visual Studio\TicketFlow\project_report\extracted_summary.txt", "w", encoding="utf-8") as f:
    f.write(f"Total pages: {len(doc)}\n\n")
    for i, page in enumerate(doc):
        text = page.get_text("text").strip()
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        first_few = " | ".join(lines[:3]) if lines else "[EMPTY / IMAGE ONLY]"
        f.write(f"Page {i+1}: {first_few}\n")
        if i < 7 or i >= len(doc) - 5:
            f.write(f"--- Full Page {i+1} ---\n{text}\n---------------------\n\n")

print("Inspection completed, written to extracted_summary.txt")
