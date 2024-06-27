import sys
from os import fspath
from pathlib import Path
from lxml.html import Element, parse
from more_itertools import first
from itertools import chain

candidates = [".pdf_RezJLT_Titel_Rezension", ".Titel_Rezension", "p"]


def prevent_empty_elements(doc):
    for elem in doc.iter():
        if elem.text is None:
            elem.text = ""


def fix_rezensent(file: Path | str):
    doc = parse(fspath(file))
    root = doc.getroot()
    title = first(root.cssselect("title"))
    if title is None:
        root.find("head").append(title := Element("title"))
    new_src = first(chain.from_iterable(root.cssselect(cand) for cand in candidates))
    if new_src is not None:
        title.text = new_src.text_content() + " – JLTonline"
        prevent_empty_elements(doc)
        doc.write(fspath(file), encoding="utf-8")
    else:
        print(file, ": kein neuer Titel gefunden")


if __name__ == "__main__":
    for file in sys.argv[1:]:
        if Path(file).name != "index.html":
            fix_rezensent(file)
