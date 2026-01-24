import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/generate-sanction-letter', async (req, res) => {
  try {
    const { customer, loanDetails, underwritingResult } = req.body;
    
    if (!customer || !loanDetails || !underwritingResult) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required data for sanction letter' 
      });
    }
    
    // Create PDF with custom margins
    const doc = new PDFDocument({ 
      margin: 0,
      size: 'A4'
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sanction-letter-${customer.customerId}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Header - Blue background with company name
    doc.rect(0, 0, doc.page.width, 130).fill('#004b87');
    
    doc.fontSize(32)
       .fillColor('#ffffff')
       .font('Helvetica-Bold')
       .text('LoanKit', 50, 40, { align: 'center' });
    
    doc.fontSize(11)
       .fillColor('#ffffff')
       .font('Helvetica')
       .text('Personal Loans - Quick & Simple', 50, 85, { align: 'center' });
    
    // Yellow accent line
    doc.rect(0, 130, doc.page.width, 8).fill('#FDB913');
    
    // Letter number and date
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const letterNo = `TC/PL/${new Date().getFullYear()}/C3FB8`;
    
    doc.fontSize(9)
       .fillColor('#000000')
       .font('Helvetica')
       .text(`Letter No: ${letterNo}`, 50, 160);
    
    doc.text(`Date: ${currentDate}`, 400, 160);
    
    // Title - LOAN SANCTION LETTER
    doc.fontSize(18)
       .fillColor('#000000')
       .font('Helvetica-Bold')
       .text('LOAN SANCTION LETTER', 50, 220, { align: 'center', underline: true });
    
    // Greeting
    doc.fontSize(11)
       .fillColor('#000000')
       .font('Helvetica')
       .text(`Dear ${customer.name},`, 50, 280);
    
    // Body text
    doc.fontSize(10)
       .text('We are pleased to inform you that your application for a Personal Loan has been approved. The', 50, 310);
    doc.text('details of your sanctioned loan are as follows:', 50, 325);
    
    // Loan Details box with gray background
    const boxY = 370;
    doc.rect(50, boxY, 512, 260).fillAndStroke('#f5f5f5', '#dddddd');
    
    // Loan Details heading
    doc.fontSize(13)
       .fillColor('#004b87')
       .font('Helvetica-Bold')
       .text('Loan Details', 70, boxY + 20);
    
    // Loan details content
    const detailsY = boxY + 55;
    const labelX = 93;
    const valueX = 400;
    
    doc.fontSize(10)
       .fillColor('#000000')
       .font('Helvetica');
    
    // Sanctioned Loan Amount
    doc.text('Sanctioned Loan Amount', labelX, detailsY);
    doc.font('Helvetica-Bold').text(`Rs. ${underwritingResult.loanAmount.toLocaleString('en-IN')}`, valueX, detailsY, { align: 'right', width: 150 });
    
    // Loan Tenure
    doc.font('Helvetica').text('Loan Tenure', labelX, detailsY + 35);
    doc.font('Helvetica-Bold').text(`${underwritingResult.tenure} months`, valueX, detailsY + 35, { align: 'right', width: 150 });
    
    // Rate of Interest
    doc.font('Helvetica').text('Rate of Interest', labelX, detailsY + 70);
    doc.font('Helvetica-Bold').text(`${underwritingResult.interestRate}% per annum`, valueX, detailsY + 70, { align: 'right', width: 150 });
    
    // Monthly EMI
    doc.font('Helvetica').text('Monthly EMI', labelX, detailsY + 105);
    doc.font('Helvetica-Bold').text(`Rs. ${underwritingResult.proposedEMI.toLocaleString('en-IN')}`, valueX, detailsY + 105, { align: 'right', width: 150 });
    
    // Processing Fee
    const processingFee = Math.round(underwritingResult.loanAmount * 0.02);
    doc.font('Helvetica').text('Processing Fee', labelX, detailsY + 140);
    doc.font('Helvetica-Bold').text(`Rs. ${processingFee.toLocaleString('en-IN')}`, valueX, detailsY + 140, { align: 'right', width: 150 });
    
    // Expected Disbursement
    const disbursementDate = new Date();
    disbursementDate.setDate(disbursementDate.getDate() + 3);
    const disbursementDateStr = disbursementDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.font('Helvetica').text('Expected Disbursement', labelX, detailsY + 175);
    doc.font('Helvetica-Bold').text(disbursementDateStr, valueX, detailsY + 175, { align: 'right', width: 150 });
    
    // Terms & Conditions
    doc.fontSize(11)
       .fillColor('#000000')
       .font('Helvetica-Bold')
       .text('Terms & Conditions:', 50, 660);
    
    doc.fontSize(9)
       .font('Helvetica');
    
    const terms = [
      'This sanction is valid for 30 days from the date of issue.',
      'The loan amount will be disbursed to your registered bank account.',
      'EMI will be debited from your account on the 5th of each month.',
      'Prepayment is allowed after 6 EMIs with applicable charges.',
      'This sanction is subject to standard terms and conditions of LoanKit.'
    ];
    
    let termY = 680;
    terms.forEach((term) => {
      doc.text(`• ${term}`, 50, termY, { width: 500 });
      termY += 18;
    });
    
    // Footer
    doc.fontSize(10)
       .font('Helvetica')
       .text('Thank you for choosing LoanKit. We value your trust in us.', 50, 770);
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
