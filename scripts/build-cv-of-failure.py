#!/usr/bin/env python3
"""Build the public CV-of-Failure PDF from its editable Markdown template."""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from tempfile import NamedTemporaryFile

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "documents" / "cv-of-failure-template.md"
DEFAULT_OUTPUT = ROOT / "public" / "documents" / "dai-jun-cv-of-failure-template.pdf"

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_X = 22 * mm
MARGIN_TOP = 19 * mm
MARGIN_BOTTOM = 18 * mm
YEAR_WIDTH = 20 * mm
GUTTER = 5 * mm
CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN_X

INK = colors.HexColor("#24180F")
HEADING = colors.HexColor("#5E3B18")
ACCENT = colors.HexColor("#8A541C")
FADED = colors.HexColor("#6E5D4B")
BORDER = colors.HexColor("#DBC9AD")
PAPER = colors.HexColor("#FFFDF8")


@dataclass
class Entry:
    year: str
    title: str
    context: str
    reflection: str


@dataclass
class Section:
    heading: str
    entries: list[Entry]


@dataclass
class DocumentData:
    name: str
    metadata: dict[str, str]
    intro: list[str]
    sections: list[Section]


def parse_source(path: Path) -> DocumentData:
    lines = path.read_text(encoding="utf-8").splitlines()
    name = "Dai-Jun"
    metadata: dict[str, str] = {}
    intro: list[str] = []
    sections: list[Section] = []
    current_section: Section | None = None

    for raw_line in lines:
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("# "):
            name = line[2:].strip()
            continue
        if line.startswith("## "):
            current_section = Section(line[3:].strip(), [])
            sections.append(current_section)
            continue
        if current_section and line.startswith("- "):
            parts = [part.strip() for part in line[2:].split("|")]
            parts += [""] * (4 - len(parts))
            current_section.entries.append(Entry(*parts[:4]))
            continue
        match = re.match(r"^(Label|Email|Website|GitHub|Updated):\s*(.+)$", line)
        if match and not sections:
            metadata[match.group(1)] = match.group(2)
            continue
        if not sections:
            intro.append(line)

    return DocumentData(name, metadata, intro, sections)


class SectionHeading(Flowable):
    def __init__(self, text: str):
        super().__init__()
        self.text = text
        self.height = 9 * mm

    def wrap(self, avail_width: float, avail_height: float) -> tuple[float, float]:
        return avail_width, self.height

    def draw(self) -> None:
        canvas = self.canv
        line_width = 24 * mm
        baseline = 3.1 * mm
        canvas.setStrokeColor(ACCENT)
        canvas.setLineWidth(2.2)
        canvas.line(0, baseline, line_width, baseline)
        canvas.setFillColor(ACCENT)
        canvas.setFont("Helvetica", 14.5)
        canvas.drawString(line_width + 4 * mm, 0.8 * mm, self.text)


class EntryFlowable(Flowable):
    def __init__(self, entry: Entry, styles: dict[str, ParagraphStyle]):
        super().__init__()
        self.entry = entry
        self.styles = styles
        self.title_context: Paragraph | None = None
        self.reflection: Paragraph | None = None
        self.entry_height = 0.0

    def wrap(self, avail_width: float, avail_height: float) -> tuple[float, float]:
        text_width = avail_width - YEAR_WIDTH - GUTTER
        title = f"<b>{escape(self.entry.title)}</b>"
        if self.entry.context:
            title += f" <i>{escape(self.entry.context)}</i>"
        self.title_context = Paragraph(title, self.styles["entry"])
        _, title_height = self.title_context.wrap(text_width, avail_height)

        reflection_height = 0.0
        if self.entry.reflection:
            self.reflection = Paragraph(escape(self.entry.reflection), self.styles["reflection"])
            _, reflection_height = self.reflection.wrap(text_width, avail_height)

        self.entry_height = title_height + reflection_height + (1.4 * mm if reflection_height else 0)
        return avail_width, self.entry_height + 2.1 * mm

    def draw(self) -> None:
        canvas = self.canv
        canvas.setFillColor(FADED)
        canvas.setFont("Helvetica", 9.5)
        year_width = stringWidth(self.entry.year, "Helvetica", 9.5)
        canvas.drawString(YEAR_WIDTH - year_width, self.entry_height - 9.5, self.entry.year)

        x = YEAR_WIDTH + GUTTER
        y = self.entry_height
        if self.title_context:
            _, height = self.title_context.wrap(CONTENT_WIDTH - x, self.entry_height)
            y -= height
            self.title_context.drawOn(canvas, x, y)
        if self.reflection:
            y -= 1.4 * mm
            _, height = self.reflection.wrap(CONTENT_WIDTH - x, self.entry_height)
            y -= height
            self.reflection.drawOn(canvas, x, y)


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "label": ParagraphStyle(
            "Label",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8.2,
            leading=10,
            textColor=ACCENT,
            tracking=1.2,
            spaceAfter=1.5 * mm,
        ),
        "name": ParagraphStyle(
            "Name",
            parent=base["Title"],
            fontName="Helvetica",
            fontSize=33,
            leading=35,
            textColor=INK,
            alignment=TA_LEFT,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8.7,
            leading=12,
            textColor=FADED,
            alignment=TA_RIGHT,
        ),
        "intro": ParagraphStyle(
            "Intro",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.7,
            leading=13.2,
            textColor=INK,
            spaceAfter=2.2 * mm,
        ),
        "entry": ParagraphStyle(
            "Entry",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=12.1,
            textColor=INK,
        ),
        "reflection": ParagraphStyle(
            "Reflection",
            parent=base["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=8.2,
            leading=10.3,
            textColor=FADED,
        ),
    }


def contact_markup(metadata: dict[str, str]) -> str:
    rows: list[str] = []
    if metadata.get("Email"):
        email = escape(metadata["Email"])
        rows.append(f'<link href="mailto:{email}" color="#6E5D4B">{email}</link>')
    for key in ("Website", "GitHub"):
        if metadata.get(key):
            url = metadata[key]
            label = url.removeprefix("https://").rstrip("/")
            rows.append(f'<link href="{escape(url)}" color="#6E5D4B">{escape(label)}</link>')
    if metadata.get("Updated"):
        rows.append(f'Updated {escape(metadata["Updated"])}')
    return "<br/>".join(rows)


def draw_page(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.45)
    canvas.line(MARGIN_X, 13.2 * mm, PAGE_WIDTH - MARGIN_X, 13.2 * mm)
    canvas.setFont("Helvetica-Oblique", 7.8)
    canvas.setFillColor(FADED)
    canvas.drawString(MARGIN_X, 8.6 * mm, "A record of attempts, not a measure of worth.")
    page_text = f"{doc.page} / {doc.page_count}"
    canvas.drawRightString(PAGE_WIDTH - MARGIN_X, 8.6 * mm, page_text)
    canvas.restoreState()


def build_pdf(source: Path, output: Path) -> None:
    data = parse_source(source)
    styles = make_styles()
    output.parent.mkdir(parents=True, exist_ok=True)

    from pypdf import PdfReader

    def make_story() -> list[Flowable]:
        label = escape(data.metadata.get("Label", "CV OF FAILURE - TEMPLATE"))
        header_left = [
            Paragraph(label, styles["label"]),
            Paragraph(escape(data.name), styles["name"]),
        ]
        header_right = Paragraph(contact_markup(data.metadata), styles["contact"])

        class HeaderRow(Flowable):
            def wrap(self, avail_width: float, avail_height: float) -> tuple[float, float]:
                self.left_width = avail_width * 0.58
                self.right_width = avail_width - self.left_width
                self.left_heights = [
                    item.wrap(self.left_width, avail_height)[1] for item in header_left
                ]
                self.right_height = header_right.wrap(self.right_width, avail_height)[1]
                self.row_height = max(sum(self.left_heights), self.right_height)
                return avail_width, self.row_height

            def draw(self) -> None:
                y = self.row_height
                for item, height in zip(header_left, self.left_heights):
                    y -= height
                    item.drawOn(self.canv, 0, y)
                header_right.drawOn(
                    self.canv,
                    self.left_width,
                    self.row_height - self.right_height,
                )

        story: list[Flowable] = [HeaderRow(), Spacer(1, 8.5 * mm)]
        for paragraph in data.intro:
            story.append(Paragraph(escape(paragraph), styles["intro"]))
        story.append(Spacer(1, 2.5 * mm))

        for index, section in enumerate(data.sections):
            block: list[Flowable] = [SectionHeading(section.heading)]
            block.extend(EntryFlowable(entry, styles) for entry in section.entries)
            story.append(KeepTogether(block))
            if index < len(data.sections) - 1:
                story.append(Spacer(1, 2.7 * mm))
        return story

    def build_once(destination: Path, page_count: int) -> None:
        frame = Frame(
            MARGIN_X,
            MARGIN_BOTTOM,
            CONTENT_WIDTH,
            PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM,
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )
        doc = BaseDocTemplate(
            str(destination),
            pagesize=A4,
            title=f"{data.name} - CV of Failure Template",
            author=data.name,
            subject="An editable CV of Failure template",
            creator="Dai-Jun's personal website",
            leftMargin=MARGIN_X,
            rightMargin=MARGIN_X,
            topMargin=MARGIN_TOP,
            bottomMargin=MARGIN_BOTTOM,
        )
        doc.page_count = page_count
        doc.addPageTemplates(PageTemplate(id="CV", frames=[frame], onPage=draw_page))
        doc.build(make_story())

    with NamedTemporaryFile(suffix=".pdf") as temporary:
        temporary_path = Path(temporary.name)
        build_once(temporary_path, 1)
        page_count = len(PdfReader(str(temporary_path)).pages)

    build_once(output, page_count)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    build_pdf(args.source.resolve(), args.output.resolve())
    print(args.output.resolve())


if __name__ == "__main__":
    main()
