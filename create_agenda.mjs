import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, BorderStyle, PageOrientation, HeadingLevel, AlignmentType } from 'docx';
import fs from 'fs';

const doc = new Document({
  page: {
    size: { width: 12240, height: 15840 }, // US Letter
    margins: { top: 720, right: 720, bottom: 720, left: 720 }
  },
  sections: [{
    properties: {},
    children: [
      // Title
      new Paragraph({
        text: "YALI NETWORK NIGERIA NATIONAL SUMMIT",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        style: "Heading1"
      }),

      // Subtitle
      new Paragraph({
        text: "AIDIEGL 2026",
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        style: "Heading2"
      }),

      // Date and Details
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Friday, 25 September 2026",
            bold: true,
            size: 24
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "8:00 AM – 4:00 PM",
            size: 22
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "Shiba Event Center, 20 Mobolaji Bank Anthony Way, Maryland, Ikeja, Lagos",
            size: 22
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: "Format: Hybrid Summit – Physical & Livestream",
            italics: true,
            size: 22
          })
        ]
      }),

      // Legend
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "● Keynote  ●  Panel / Discussion  ●  Masterclass  ●  Break / Networking",
            size: 20
          })
        ]
      }),

      // Schedule Table
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          // Header
          new TableRow({
            tableHeader: true,
            height: { value: 400, rule: "atLeast" },
            children: [
              new TableCell({
                width: { size: 20, type: WidthType.PERCENTAGE },
                children: [new Paragraph({
                  text: "TIME",
                  bold: true,
                  alignment: AlignmentType.CENTER
                })],
                shading: { type: "clear", fill: "0A1128", color: "auto" }
              }),
              new TableCell({
                width: { size: 25, type: WidthType.PERCENTAGE },
                children: [new Paragraph({
                  text: "SESSION",
                  bold: true,
                  alignment: AlignmentType.CENTER
                })],
                shading: { type: "clear", fill: "0A1128", color: "auto" }
              }),
              new TableCell({
                width: { size: 55, type: WidthType.PERCENTAGE },
                children: [new Paragraph({
                  text: "DETAILS / SPEAKER",
                  bold: true,
                  alignment: AlignmentType.CENTER
                })],
                shading: { type: "clear", fill: "0A1128", color: "auto" }
              })
            ]
          }),
          // Sessions
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("8:00 – 8:30 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Breakfast & Arrival")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Breakfast, tea and refreshments; arrival of participants.")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("8:30 – 9:00 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Registration & Networking")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Registration, networking and livestream readiness.")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("9:05 – 9:15 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Opening Address")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Rabihat Rabiu – National Head, YALI Network Nigeria")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("9:15 – 9:25 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Cultural Presentation")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Poetry & Cultural Dance")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("9:25 – 9:50 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Keynote I")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Leadership Mindset: Leading in the Age of AI – Julius Ilori, MWAFAAN President + Q&A")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("9:50 – 10:00 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Goodwill Remarks")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Casey Bonfield, Deputy Public Affairs Officer, U.S. Mission Nigeria")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("10:00 – 10:25 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Keynote II")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("AI & Digital Transformation: AI as a Catalyst for Africa's Transformation – Hon. Dr. Abdoul Baq Ladi Balogun + Q&A")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("10:25 – 10:45 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Break & Networking")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Networking, refreshments, and official group photograph")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("10:45 – 11:25 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Panel")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("FinTech & Inclusive Finance: Leveraging Digital Innovation for Economic Opportunity + Audience Q&A")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("11:25 – 11:55 AM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Masterclass")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("AI for Everyone: Practical Tools to Empower African Leaders – Olalekan Adeeko. Interactive AI Challenge.")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("11:55 AM – 12:20 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Masterclass")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Creative Innovation in the Digital Age – Dr. Salaimon Kassim, Executive Producer & Creative Leader")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("12:20 – 12:50 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Panel")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("AI x Creative Practice: Innovation Without Borders – Joint conversation on AI tools and creative practice in African innovation")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("12:50 – 1:00 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Website Launch")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Official Launch of YALI Network Nigeria Website")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("1:00 – 1:40 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Break")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Lunch, networking and media engagement")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("1:40 – 2:00 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Documentary")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("YALI Network Nigeria Impact Documentary: Our Impact, Our Journey")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("2:00 – 2:25 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Fireside Chat")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("From Ideas to Impact: Entrepreneurship, Technology, and African Prosperity – Dr. Adenike Agoola-Fayemi")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("2:25 – 3:05 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Panel")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Building a Resilient Africa: Technology, Innovation, Health, and Agriculture – Moderator: Khalifat Bint Ibrahim")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("3:05 – 3:35 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("● Debate")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("YALI Network Nigeria Leadership Debate: AI, Digital Innovation and the Future of African Leadership")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("3:35 – 3:45 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Commitment Poll")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Audience Poll & Leadership Challenge: What will you do differently after AIDIEGL 2026?")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("3:45 – 3:55 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Recognition")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Recognition of Partners, Sponsors & Contributors")] })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph("3:55 – 4:00 PM")] }),
              new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph("Closing")] }),
              new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph("Closing Remarks by Yahyah Saleh Muhammad, National Secretary, YALI Network Nigeria")] })
            ]
          })
        ]
      }),

      new Paragraph({ text: "", spacing: { after: 400 } }),

      // Footer
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: "SUMMIT EXPERIENCE: INSPIRE → CONNECT → LEARN → CREATE → DEBATE → COMMIT → IMPACT",
            bold: true,
            italics: true,
            size: 20
          })
        ]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "LEAD. INNOVATE. EMPOWER. CREATE IMPACT.",
            bold: true,
            size: 20
          })
        ]
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("AIDIEGL_2026_Official_Programme_Agenda.docx", buffer);
  console.log("✅ Agenda document created successfully!");
});
