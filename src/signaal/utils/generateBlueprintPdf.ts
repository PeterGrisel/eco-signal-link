import jsPDF from "jspdf";
import { LAYERS } from "../data/layers";

interface BlueprintPdfOptions {
  company: string;
  score: number;
  inputs: Record<number, Record<string, any>>;
}

const COLORS = {
  bg: '#111113',
  card: '#1A1A1E',
  border: '#2A2A2E',
  primary: '#E8945A',
  text: '#E4E4E7',
  muted: '#71717A',
  white: '#FFFFFF',
};

export async function generateBlueprintPdf({ company, score, inputs }: BlueprintPdfOptions): Promise<void> {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;
  const pageH = 297;
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 0;

  const addPage = () => {
    pdf.addPage();
    y = margin;
  };

  const checkSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      addPage();
    }
  };

  // ─── Cover page ───
  pdf.setFillColor(17, 17, 19);
  pdf.rect(0, 0, pageW, pageH, 'F');

  // Accent bar
  pdf.setFillColor(232, 148, 90);
  pdf.rect(0, 0, pageW, 3, 'F');

  // Title
  y = 80;
  pdf.setTextColor(232, 148, 90);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('SIGNAALDETECTIESYSTEEM', pageW / 2, y, { align: 'center' });

  y += 16;
  pdf.setTextColor(228, 228, 231);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Blueprint', pageW / 2, y, { align: 'center' });

  if (company) {
    y += 14;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(113, 113, 122);
    pdf.text(company, pageW / 2, y, { align: 'center' });
  }

  // Score circle
  y += 30;
  pdf.setDrawColor(232, 148, 90);
  pdf.setLineWidth(1);
  pdf.circle(pageW / 2, y, 18);
  pdf.setTextColor(232, 148, 90);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(score), pageW / 2, y + 3, { align: 'center' });
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(113, 113, 122);
  pdf.text('/100 SYSTEEM SCORE', pageW / 2, y + 24, { align: 'center' });

  // Date
  y = pageH - 40;
  pdf.setFontSize(9);
  pdf.setTextColor(113, 113, 122);
  const dateStr = new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.text(`Gegenereerd op ${dateStr}`, pageW / 2, y, { align: 'center' });

  pdf.setFontSize(8);
  pdf.text('b2bgroeimachine.io/signaal', pageW / 2, y + 6, { align: 'center' });

  // ─── Layer pages ───
  LAYERS.forEach((layer) => {
    addPage();

    // Page bg
    pdf.setFillColor(17, 17, 19);
    pdf.rect(0, 0, pageW, pageH, 'F');

    // Top accent line
    pdf.setFillColor(232, 148, 90);
    pdf.rect(0, 0, pageW, 1.5, 'F');

    y = margin + 5;

    // Layer number badge
    pdf.setFillColor(26, 26, 30);
    pdf.roundedRect(margin, y - 4, 14, 8, 2, 2, 'F');
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(232, 148, 90);
    pdf.text(`0${layer.id}`, margin + 7, y + 1, { align: 'center' });

    // Title
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(228, 228, 231);
    pdf.text(layer.title, margin + 18, y + 2);

    // Score contribution
    if (layer.scoreContribution > 0) {
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(113, 113, 122);
      pdf.text(`+${layer.scoreContribution} pts`, pageW - margin, y + 2, { align: 'right' });
    }

    y += 14;

    // Divider
    pdf.setDrawColor(42, 42, 46);
    pdf.setLineWidth(0.3);
    pdf.line(margin, y, pageW - margin, y);

    y += 8;

    // Velox Milestone
    pdf.setFillColor(232, 148, 90, 8);
    pdf.setDrawColor(232, 148, 90, 40);
    const milestoneLines = pdf.splitTextToSize(layer.veloxMilestone, contentW - 16);
    const milestoneH = milestoneLines.length * 5 + 10;
    pdf.roundedRect(margin, y, contentW, milestoneH, 2, 2, 'FD');

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(232, 148, 90);
    pdf.text('VELOX SOLUTIONS', margin + 6, y + 6);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(200, 160, 120);
    pdf.text(milestoneLines, margin + 6, y + 12);

    y += milestoneH + 8;

    // Configuration content
    const layerInputs = inputs[layer.id] || {};
    const hasContent = Object.keys(layerInputs).length > 0;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(228, 228, 231);
    pdf.text('CONFIGURATIE', margin, y);
    y += 6;

    if (hasContent) {
      const content = layer.blueprintTemplate(layerInputs);
      const lines = pdf.splitTextToSize(content, contentW - 4);

      // Card background
      const cardH = Math.max(lines.length * 4.5 + 10, 20);
      checkSpace(cardH + 4);

      pdf.setFillColor(26, 26, 30);
      pdf.setDrawColor(42, 42, 46);
      pdf.setLineWidth(0.2);
      pdf.roundedRect(margin, y, contentW, cardH, 2, 2, 'FD');

      pdf.setFontSize(8);
      pdf.setFont('courier', 'normal');
      pdf.setTextColor(161, 161, 170);
      pdf.text(lines, margin + 6, y + 7);

      y += cardH + 6;
    } else {
      checkSpace(16);
      pdf.setFillColor(26, 26, 30);
      pdf.roundedRect(margin, y, contentW, 12, 2, 2, 'F');
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(113, 113, 122);
      pdf.text('Nog niet ingevuld', margin + 6, y + 7);
      y += 18;
    }

    // Footer
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(63, 63, 70);
    pdf.text('Signaaldetectiesysteem — b2bgroeimachine.io', pageW / 2, pageH - 10, { align: 'center' });
  });

  // ─── Checklist page ───
  addPage();
  pdf.setFillColor(17, 17, 19);
  pdf.rect(0, 0, pageW, pageH, 'F');
  pdf.setFillColor(232, 148, 90);
  pdf.rect(0, 0, pageW, 1.5, 'F');

  y = margin + 5;
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(228, 228, 231);
  pdf.text('90-Daagse Review Checklist', margin, y);

  y += 12;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(113, 113, 122);
  pdf.text('Gebruik deze checklist om je systeem na 90 dagen te evalueren en bij te stellen.', margin, y);

  y += 12;

  const checklistItems = [
    { week: 'Week 1-2', items: ['ICP-definitie valideren met eerste resultaten', 'Signaalgewichten bijstellen op basis van eerste data', 'Drempelwaarde monitoren — te veel of te weinig alerts?'] },
    { week: 'Week 3-4', items: ['Eerste outreach resultaten analyseren', 'Response templates optimaliseren', 'Bronnen evalueren — welke leveren de beste signalen?'] },
    { week: 'Maand 2', items: ['Scorematrix finetunen op basis van conversiedata', 'Nieuwe signalen toevoegen of oude verwijderen', 'Automatisering uitbreiden waar mogelijk'] },
    { week: 'Maand 3', items: ['Volledige systeem-review uitvoeren', 'ROI berekenen: hoeveel deals via signalen?', 'Blueprint updaten met geleerde lessen', 'Besluit: opschalen of verfijnen?'] },
  ];

  checklistItems.forEach((section) => {
    checkSpace(section.items.length * 8 + 14);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(232, 148, 90);
    pdf.text(section.week, margin, y);
    y += 7;

    section.items.forEach((item) => {
      // Checkbox
      pdf.setDrawColor(113, 113, 122);
      pdf.setLineWidth(0.3);
      pdf.rect(margin + 2, y - 3, 4, 4);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(161, 161, 170);
      pdf.text(item, margin + 10, y);
      y += 7;
    });

    y += 4;
  });

  // Footer
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(63, 63, 70);
  pdf.text('Signaaldetectiesysteem — b2bgroeimachine.io', pageW / 2, pageH - 10, { align: 'center' });

  // Save
  const fileName = company
    ? `Blueprint-${company.replace(/\s+/g, '-')}-${dateStr}.pdf`
    : `Signaaldetectie-Blueprint-${dateStr}.pdf`;
  pdf.save(fileName);
}
