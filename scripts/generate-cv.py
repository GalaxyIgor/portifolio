"""Build localized CV PDFs from cv-data.mjs output. Authoring requires reportlab."""
import json
import sys
from pathlib import Path
from html import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

root = Path(__file__).resolve().parents[1]
data = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8-sig"))
pdfmetrics.registerFont(TTFont("Pirata", str(root / "public/fonts/PirataOne-Regular.ttf")))
accent = colors.HexColor("#a4262d")
body = ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14, textColor=colors.HexColor("#252525"), spaceAfter=6)
small = ParagraphStyle("small", parent=body, fontSize=9, leading=12, textColor=colors.HexColor("#555555"))
title = ParagraphStyle("title", parent=body, fontName="Pirata", fontSize=34, leading=38)
heading = ParagraphStyle("heading", parent=body, fontName="Helvetica-Bold", fontSize=12, leading=16, textColor=accent, spaceBefore=12, spaceAfter=8)
subheading = ParagraphStyle("subheading", parent=body, fontName="Helvetica-Bold", fontSize=10.5, leading=14, spaceAfter=3)

def text(value):
    return escape(value.replace("—", "-").replace("–", "-"))

def p(value, style=body):
    return Paragraph(text(value), style)

english_terms = {"HTML semântico": "Semantic HTML", "CSS moderno": "Modern CSS", "Acessibilidade (WCAG)": "Accessibility (WCAG)", "Visão computacional": "Computer vision", "IA": "AI"}

for locale in ("pt", "en"):
    pt = locale == "pt"
    profile = data["profile"]
    messages = data["messages"][locale]
    output = root / "output/pdf" / f"igor-cv-{locale}.pdf"
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=44, leftMargin=44, topMargin=40, bottomMargin=42, title=f"{profile['name']} - {'Currículo' if pt else 'CV'}", author=profile["name"])
    story = [p(profile["name"], title), p(messages["hero"]["role"], subheading)]
    story.append(Paragraph(f'<link href="mailto:{profile["email"]}">{text(profile["email"])}</link> | {text(messages["about"]["facts"]["locationValue"])}', small))
    links = [f'<link href="{social["href"]}" color="#a4262d">{text(social["label"])}</link>' for social in profile["socials"]]
    links.append(f'<link href="{profile["siteUrl"]}/{locale}" color="#a4262d">{text(profile["siteUrl"])}/{locale}</link>')
    story += [Paragraph(" | ".join(links), small), Spacer(1, 6), p(messages["about"]["p1"]), p(messages["about"]["p2"])]
    story.append(p("Experiência e formação" if pt else "Experience and education", heading))
    for entry in data["experience"]:
        dates = f'{entry["start"]} - {entry["end"] or ("atual" if pt else "present")}'
        story.append(KeepTogether([p(entry["role"][locale], subheading), p(f'{entry["company"]} | {dates}', small), p(entry["summary"][locale]), Spacer(1, 4)]))
    story.append(p("Competências" if pt else "Skills", heading))
    for group in data["skills"]:
        items = [english_terms.get(item, item) if not pt else item for item in group["items"]]
        story.append(Paragraph(f'<b>{text(group["label"][locale])}:</b> {text(", ".join(items))}', body))
    story.append(p(("Idiomas: " if pt else "Languages: ") + messages["about"]["facts"]["languagesValue"], small))
    story += [PageBreak(), p(profile["name"], title), p("Projetos e certificações" if pt else "Projects and certifications", subheading), p("Projetos selecionados" if pt else "Selected projects", heading)]
    for project in data["projects"]:
        if not project["featured"] and project["slug"] != "splitcut":
            continue
        url = f'{profile["siteUrl"]}/{locale}/projects/{project["slug"]}'
        stack = [english_terms.get(item, item) if not pt else item for item in project["stack"]]
        story.append(KeepTogether([Paragraph(f'<link href="{url}" color="#a4262d"><b>{text(project["title"][locale])}</b></link> | {project["year"]}', subheading), p(project["summary"][locale]), p(" | ".join(stack), small), Spacer(1, 5)]))
    story.append(p("Certificações" if pt else "Certifications", heading))
    for cert in data["certifications"]:
        story.append(p(f'{cert["name"]} - {cert["issuer"]}' + (f' | {cert["date"]}' if cert["date"] else ""), small))

    def footer(canvas, document):
        canvas.saveState()
        width, height = A4
        canvas.setStrokeColor(accent)
        canvas.setLineWidth(0.6)
        canvas.line(44, height - 26, width - 44, height - 26)
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.HexColor("#666666"))
        canvas.drawString(44, 24, profile["name"] + " | " + profile["email"])
        canvas.drawRightString(width - 44, 24, str(document.page))
        canvas.restoreState()

    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(output)
