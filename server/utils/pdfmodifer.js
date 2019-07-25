const pageConfig = require("../controllers/pdftohtml.controller").pageConfig;
const fs = require('fs');
const { PDFDocumentFactory, PDFDocumentWriter, drawImage } = require('pdf-lib');

/* ========================= 1. Read in Assets ============================== */

const assets = {
  marioPngBytes: fs.readFileSync('../assets/sign.png'),
  taxVoucherPdfBytes: fs.readFileSync('../assets/16MCA039.pdf'),
};

/* ================== 2. Load and Setup the PDF Document ==================== */

const pdfDoc = PDFDocumentFactory.load(assets.taxVoucherPdfBytes);
// Next, we embed the PNG image we read in.
const [marioPngRef, marioPngDims] = pdfDoc.embedPNG(assets.marioPngBytes);
// Let's define constant that can be used as reference later.

const PNG = 'MarioPng';
const PNG_WIDTH = marioPngDims.width * 0.15;
const PNG_HEIGHT = marioPngDims.height * 0.10;
const pageNum =  pageConfig.PAGE_NUM;
const totalPage =  pageConfig.TOTAL_PAGES;
const posX =  pageConfig.SIGN_POSX;
const posY =  pageConfig.SIGN_POSY;

/* ====================== 3. Modify Existing Page =========================== */

const pages = pdfDoc.getPages();
const existingPage = pages[pageNum].addImageObject(PNG, marioPngRef);

// Here, we define a new "content stream" for the page. A content stream is
// simply a sequence of PDF operators that define what we want to draw on the
// page.

// Here we (1) register the content stream to the PDF document, and (2) add the
// reference to the registered stream to the page's content streams.
const newContentStream = pdfDoc.createContentStream(
    drawImage(PNG, {
    x: posX,
    y: posY * totalPage,
    width: PNG_WIDTH,
    height: PNG_HEIGHT,
  }),
);

existingPage.addContentStreams(pdfDoc.register(newContentStream));

/* =========== 4. Insert and Add Pages and Convert PDF to Bytes ============= */
// This step is platform independent. The same code can be used in any
// JavaScript runtime (e.g. Node, the browser, or React Native).

const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);

/* ========================== 7. Write PDF to File ========================== */
// This step is platform dependent. Since this is a Node script, we can just 
// save the `pdfBytes` to the file system, where it can be opened with a PDF reader.

var resultDir = `${__dirname}/results`;

if (!fs.existsSync(resultDir)){
    fs.mkdirSync(resultDir);
}
const filePath = `${__dirname}/results/modified.pdf`;
fs.writeFileSync(filePath, pdfBytes);
console.log(`PDF file written to: ${filePath}`);
