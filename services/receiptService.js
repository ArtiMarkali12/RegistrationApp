const axios = require("axios");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const COLORS = {
  brand: "#1A237E", // deep indigo – header & accents
  brandLight: "#3949AB", // medium indigo – sub-header stripe
  accent: "#FF6F00", // amber orange – highlights & borders
  accentSoft: "#FFF3E0", // pale amber – alternating row fill
  white: "#FFFFFF",
  ink: "#1C1C1E", // near-black body text
  muted: "#6B7280", // grey captions
  rowEven: "#F0F4FF", // light indigo tint
  rowOdd: "#FFFFFF",
  tableHeader: "#283593", // table head bg
  divider: "#C5CAE9", // soft indigo line
  success: "#2E7D32",
  partial: "#E65100",
};

const FONT = {
  regular: "Helvetica",
  bold: "Helvetica-Bold",
  oblique: "Helvetica-Oblique",
};

const PAGE = { width: 595, height: 842 }; // A4
const MARGIN = 45;
const CONTENT_W = PAGE.width - MARGIN * 2;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

/** Filled rectangle shortcut */
function fillRect(doc, x, y, w, h, color) {
  doc.save().rect(x, y, w, h).fill(color).restore();
}

/** Draw a single table row */
function drawRow(doc, y, label, value, isEven, highlight) {
  const ROW_H = 26;
  const LBL_W = CONTENT_W * 0.55;
  const VAL_W = CONTENT_W - LBL_W;
  const x = MARGIN;

  // row background
  const bg = highlight
    ? COLORS.accentSoft
    : isEven
      ? COLORS.rowEven
      : COLORS.rowOdd;
  fillRect(doc, x, y, CONTENT_W, ROW_H, bg);

  // left border accent on highlight rows
  if (highlight) {
    fillRect(doc, x, y, 4, ROW_H, COLORS.accent);
  }

  // subtle horizontal separator
  doc
    .save()
    .moveTo(x, y + ROW_H)
    .lineTo(x + CONTENT_W, y + ROW_H)
    .strokeColor(COLORS.divider)
    .lineWidth(0.5)
    .stroke()
    .restore();

  // vertical divider between columns
  doc
    .save()
    .moveTo(x + LBL_W, y)
    .lineTo(x + LBL_W, y + ROW_H)
    .strokeColor(COLORS.divider)
    .lineWidth(0.5)
    .stroke()
    .restore();

  // label text
  doc
    .save()
    .font(highlight ? FONT.bold : FONT.regular)
    .fontSize(9.5)
    .fillColor(highlight ? COLORS.brand : COLORS.ink)
    .text(label, x + (highlight ? 10 : 8), y + 8, {
      width: LBL_W - 16,
      lineBreak: false,
    })
    .restore();

  // value text – right-align numbers
  const isNumeric = /^Rs\./.test(String(value));
  doc
    .save()
    .font(highlight ? FONT.bold : FONT.regular)
    .fontSize(9.5)
    .fillColor(highlight ? COLORS.accent : COLORS.ink)
    .text(String(value), x + LBL_W + 8, y + 8, {
      width: VAL_W - 16,
      lineBreak: false,
      align: isNumeric ? "right" : "left",
    })
    .restore();

  return ROW_H;
}

/** Decorative diamond separator */
function diamond(doc, cx, y) {
  const S = 4;
  doc
    .save()
    .polygon([cx, y - S], [cx + S, y], [cx, y + S], [cx - S, y])
    .fill(COLORS.accent)
    .restore();
}

/* ─────────────────────────────────────────────
   MAIN FUNCTION - GENERATE PDF BUFFER
───────────────────────────────────────────── */
async function generateReceiptPDF({
  studentDocId,
  modeOfPayment,
  transactionId,
  nextDueDate,
}) {
  try {
    /* ── FETCH DATA ── */
    const response = await axios.get(
      `http://localhost:5000/api/fees/student/${studentDocId}/summary`,
    );

    const data = response.data.data;
    const summary = data.summary;
    const details = data.details[0];
    const student = details.studentId;

    const { fname, mname, lname, registration_no, email } = student;
    const {
      discount,
      totalPaid,
      remainingAmount,
      installmentNo,
      feesStatus,
      receiptNumber,
    } = details;
    const { totalFees, totalInstallments } = summary;

    const finalFees = totalFees - (totalFees * (discount / 100) || 0);
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    /* ── BUILD PDF ── */
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 0, size: "A4" });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve({
          pdfBuffer,
          studentEmail: email,
          studentName: `${fname} ${mname || ""} ${lname}`.trim(),
          receiptNumber,
        });
      });

      doc.on("error", reject);

      generatePDFContent(doc, {
        fname,
        mname,
        lname,
        registration_no,
        discount,
        totalPaid,
        remainingAmount,
        installmentNo,
        feesStatus,
        receiptNumber,
        totalFees,
        totalInstallments,
        finalFees,
        today,
        modeOfPayment,
        transactionId,
        nextDueDate,
      });

      doc.end();
    });
  } catch (error) {
    console.error("Receipt PDF generation failed:", error.message);
    throw error;
  }
}

/* ─────────────────────────────────────────────
   PDF CONTENT GENERATION
───────────────────────────────────────────── */
function generatePDFContent(doc, data) {
  const {
    fname,
    mname,
    lname,
    registration_no,
    discount,
    totalPaid,
    remainingAmount,
    installmentNo,
    feesStatus,
    receiptNumber,
    totalFees,
    totalInstallments,
    finalFees,
    today,
    modeOfPayment,
    transactionId,
    nextDueDate,
  } = data;

  /* ════════════════════════════════════════
       HEADER BAND
    ════════════════════════════════════════ */
  // Deep indigo top band
  fillRect(doc, 0, 0, PAGE.width, 110, COLORS.brand);

  // Accent stripe at very top
  fillRect(doc, 0, 0, PAGE.width, 5, COLORS.accent);

  // Decorative right-side geometric fill
  doc
    .save()
    .polygon(
      [PAGE.width - 130, 0],
      [PAGE.width, 0],
      [PAGE.width, 110],
      [PAGE.width - 60, 110],
    )
    .fill(COLORS.brandLight)
    .restore();

  // Company name
  doc
    .save()
    .font(FONT.bold)
    .fontSize(26)
    .fillColor(COLORS.white)
    .text("ORANGE ITECH", MARGIN, 20, { width: CONTENT_W, align: "center" })
    .restore();

  // Tagline
  doc
    .save()
    .font(FONT.oblique)
    .fontSize(10)
    .fillColor("#C5CAE9")
    .text("Join to Learn & Grow up to Earn", MARGIN, 52, {
      width: CONTENT_W,
      align: "center",
    })
    .restore();

  // Address line
  doc
    .save()
    .font(FONT.regular)
    .fontSize(8.5)
    .fillColor("#9FA8DA")
    .text(
      "317, Rajdhani Complex, Near Shankar Maharaj Math, Dhankawadi, Pune – 411 043   |   Mob: 9623 922 545",
      MARGIN,
      70,
      { width: CONTENT_W, align: "center" },
    )
    .restore();

  /* ════════════════════════════════════════
       RECEIPT TITLE RIBBON
    ════════════════════════════════════════ */
  fillRect(doc, 0, 110, PAGE.width, 36, COLORS.accent);

  doc
    .save()
    .font(FONT.bold)
    .fontSize(13)
    .fillColor(COLORS.white)
    .text("PAYMENT  RECEIPT", MARGIN, 121, {
      width: CONTENT_W,
      align: "center",
      characterSpacing: 3,
    })
    .restore();

  /* ════════════════════════════════════════
       RECEIPT META  (Receipt No + Date)
    ════════════════════════════════════════ */
  let curY = 162;

  // Light background card
  fillRect(doc, MARGIN, curY, CONTENT_W, 42, COLORS.rowEven);

  // left border
  fillRect(doc, MARGIN, curY, 4, 42, COLORS.accent);

  doc
    .save()
    .font(FONT.bold)
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text("RECEIPT NO.", MARGIN + 14, curY + 8)
    .restore();
  doc
    .save()
    .font(FONT.bold)
    .fontSize(13)
    .fillColor(COLORS.brand)
    .text(receiptNumber, MARGIN + 14, curY + 20)
    .restore();

  doc
    .save()
    .font(FONT.bold)
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text("DATE", PAGE.width - MARGIN - 130, curY + 8)
    .restore();
  doc
    .save()
    .font(FONT.bold)
    .fontSize(13)
    .fillColor(COLORS.brand)
    .text(today, PAGE.width - MARGIN - 130, curY + 20)
    .restore();

  /* ════════════════════════════════════════
       STUDENT DETAILS SECTION
    ════════════════════════════════════════ */
  curY += 58;

  // Section heading
  fillRect(doc, MARGIN, curY, CONTENT_W, 24, COLORS.tableHeader);
  doc
    .save()
    .font(FONT.bold)
    .fontSize(9.5)
    .fillColor(COLORS.white)
    .text("STUDENT INFORMATION", MARGIN + 10, curY + 7, { characterSpacing: 1 })
    .restore();
  curY += 24;

  // Two-column info grid
  const infoRows = [
    ["Student Name", `${fname} ${mname ? mname + " " : ""}${lname}`],
    ["Registration No.", registration_no],
    ["Mode of Payment", modeOfPayment],
    ["Transaction ID", transactionId],
  ];

  const COL_W = CONTENT_W / 2;

  infoRows.forEach(([lbl, val], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * COL_W;
    const y = curY + row * 36;
    const bg = row % 2 === 0 ? COLORS.rowOdd : COLORS.rowEven;

    fillRect(doc, x, y, COL_W, 36, bg);

    doc
      .save()
      .font(FONT.regular)
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(lbl.toUpperCase(), x + 10, y + 6)
      .restore();
    doc
      .save()
      .font(FONT.bold)
      .fontSize(10)
      .fillColor(COLORS.ink)
      .text(val, x + 10, y + 18, { width: COL_W - 20, lineBreak: false })
      .restore();

    // cell borders
    doc
      .save()
      .rect(x, y, COL_W, 36)
      .strokeColor(COLORS.divider)
      .lineWidth(0.4)
      .stroke()
      .restore();
  });

  curY += Math.ceil(infoRows.length / 2) * 36 + 16;

  /* ════════════════════════════════════════
       FEES TABLE SECTION
    ════════════════════════════════════════ */

  // Section heading
  fillRect(doc, MARGIN, curY, CONTENT_W, 24, COLORS.tableHeader);
  doc
    .save()
    .font(FONT.bold)
    .fontSize(9.5)
    .fillColor(COLORS.white)
    .text("FEES DETAILS", MARGIN + 10, curY + 7, { characterSpacing: 1 })
    .restore();

  // Column headers
  curY += 24;
  fillRect(doc, MARGIN, curY, CONTENT_W, 22, "#1E3A8A");

  const LBL_W = CONTENT_W * 0.55;
  doc
    .save()
    .font(FONT.bold)
    .fontSize(8.5)
    .fillColor(COLORS.white)
    .text("DESCRIPTION", MARGIN + 8, curY + 7)
    .restore();
  doc
    .save()
    .font(FONT.bold)
    .fontSize(8.5)
    .fillColor(COLORS.white)
    .text("AMOUNT / VALUE", MARGIN + LBL_W + 8, curY + 7)
    .restore();
  curY += 22;

  // Data rows
  const tableRows = [
    ["Total Fees", `Rs. ${totalFees.toLocaleString("en-IN")}`, false, false],
    ["Discount (%)", `${discount}%`, false, false],
    [
      "Final Fees (After Discount)",
      `Rs. ${finalFees.toLocaleString("en-IN")}`,
      false,
      false,
    ],
    ["Installment No.", String(installmentNo), false, false],
    [
      "Total Fees Paid",
      `Rs. ${totalPaid.toLocaleString("en-IN")}`,
      false,
      true,
    ],
    [
      "Fees Balance (Remaining)",
      `Rs. ${remainingAmount.toLocaleString("en-IN")}`,
      false,
      true,
    ],
    ["Next Due Date", nextDueDate, false, false],
    ["Total Installments", String(totalInstallments), false, false],
  ];

  tableRows.forEach(([label, value, , highlight], idx) => {
    curY += drawRow(doc, curY, label, value, idx % 2 === 0, highlight);
  });

  // Table outer border
  doc
    .save()
    .rect(
      MARGIN,
      curY - tableRows.length * 26 - 22,
      CONTENT_W,
      tableRows.length * 26 + 22,
    )
    .strokeColor(COLORS.brand)
    .lineWidth(1)
    .stroke()
    .restore();

  /* ── STATUS BADGE ── */
  curY += 14;
  const STATUS_COLORS = {
    PAID: { bg: "#E8F5E9", text: COLORS.success, border: COLORS.success },
    PARTIAL: { bg: "#FFF3E0", text: COLORS.partial, border: COLORS.partial },
    UNPAID: { bg: "#FFEBEE", text: "#C62828", border: "#C62828" },
  };
  const sc = STATUS_COLORS[feesStatus.toUpperCase()] || STATUS_COLORS.PARTIAL;

  const badgeW = 140,
    badgeH = 30;
  const badgeX = PAGE.width - MARGIN - badgeW;

  fillRect(doc, badgeX, curY, badgeW, badgeH, sc.bg);
  doc
    .save()
    .rect(badgeX, curY, badgeW, badgeH)
    .strokeColor(sc.border)
    .lineWidth(1)
    .stroke()
    .restore();

  // left accent bar on badge
  fillRect(doc, badgeX, curY, 4, badgeH, sc.border);

  doc
    .save()
    .font(FONT.bold)
    .fontSize(9)
    .fillColor(sc.text)
    .text("PAYMENT STATUS", badgeX + 10, curY + 5)
    .restore();
  doc
    .save()
    .font(FONT.bold)
    .fontSize(11)
    .fillColor(sc.text)
    .text(feesStatus.toUpperCase(), badgeX + 10, curY + 16)
    .restore();

  /* ════════════════════════════════════════
       NOTE SECTION
    ════════════════════════════════════════ */
  curY += 50;

  fillRect(doc, MARGIN, curY, CONTENT_W, 2, COLORS.divider);
  curY += 10;

  // small diamond ornament
  diamond(doc, PAGE.width / 2, curY + 5);

  curY += 16;

  fillRect(doc, MARGIN, curY, CONTENT_W, 52, "#FFF8E7");
  fillRect(doc, MARGIN, curY, 4, 52, COLORS.accent);

  doc
    .save()
    .font(FONT.bold)
    .fontSize(8.5)
    .fillColor(COLORS.accent)
    .text("IMPORTANT NOTE", MARGIN + 12, curY + 6)
    .restore();

  doc
    .save()
    .font(FONT.regular)
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(
      "Admission once taken cannot be cancelled & fees will not be refunded under any circumstances.\n" +
        "Fees to one course is not transferable to other course / student.",
      MARGIN + 12,
      curY + 20,
      { width: CONTENT_W - 24, lineGap: 2 },
    )
    .restore();

  curY += 68;

  /* ════════════════════════════════════════
       SIGNATURE BLOCK
    ════════════════════════════════════════ */
  const sigX = PAGE.width - MARGIN - 160;

  // dashed line
  doc
    .save()
    .moveTo(sigX, curY)
    .lineTo(sigX + 160, curY)
    .dash(4, { space: 3 })
    .strokeColor(COLORS.divider)
    .lineWidth(1)
    .stroke()
    .restore();

  doc
    .save()
    .font(FONT.bold)
    .fontSize(9)
    .fillColor(COLORS.ink)
    .text("Authorized Signature", sigX, curY + 6, {
      width: 160,
      align: "center",
    })
    .restore();
  doc
    .save()
    .font(FONT.regular)
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text("(For Orange I Tech)", sigX, curY + 18, {
      width: 160,
      align: "center",
    })
    .restore();

  /* ════════════════════════════════════════
       FOOTER BAND
    ════════════════════════════════════════ */
  fillRect(doc, 0, PAGE.height - 36, PAGE.width, 36, COLORS.brand);
  fillRect(doc, 0, PAGE.height - 4, PAGE.width, 4, COLORS.accent);

  doc
    .save()
    .font(FONT.regular)
    .fontSize(8)
    .fillColor("#9FA8DA")
    .text(
      "This is a computer-generated receipt and does not require a physical signature.",
      MARGIN,
      PAGE.height - 24,
      { width: CONTENT_W, align: "center" },
    )
    .restore();
}

/* ─────────────────────────────────────────────
   SEND RECEIPT EMAIL
───────────────────────────────────────────── */
async function sendReceiptEmail({
  studentDocId,
  modeOfPayment,
  transactionId,
  nextDueDate,
}) {
  try {
    const { pdfBuffer, studentEmail, studentName, receiptNumber } =
      await generateReceiptPDF({
        studentDocId,
        modeOfPayment,
        transactionId,
        nextDueDate,
      });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Orange I Tech" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: `Fee Receipt – ${receiptNumber}`,
      text: `Dear ${studentName},\n\nPlease find your fee receipt attached.\n\nRegards,\nOrange I Tech`,
      attachments: [{ filename: `${receiptNumber}.pdf`, content: pdfBuffer }],
    });

    console.log("Receipt email sent successfully to:", studentEmail);
    return { success: true };
  } catch (error) {
    console.error("Receipt email sending failed:", error.message);
    throw error;
  }
}

module.exports = {
  generateReceiptPDF,
  sendReceiptEmail,
};
