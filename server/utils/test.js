const fs = require('fs');
const { PDFDocumentFactory, PDFDocumentWriter, drawImage } = require('pdf-lib');

exports.modifyPDF = function (pageConfig) {
    
    const assets = {
        signPngBytes: pageConfig.SIGN_PNG.data, // fs.readFileSync(pageConfig.SIGN_PNG), 
        pdfDocBytes: pageConfig.PDF_DOC.data //fs.readFileSync(pageConfig.PDF_DOC),
    };
    
    const pdfDoc = PDFDocumentFactory.load(assets.pdfDocBytes);
    const [marioPngRef, marioPngDims] = pdfDoc.embedPNG(assets.signPngBytes);
    
    const PNG = 'MarioPng';
    const PNG_WIDTH = marioPngDims.width * 0.15;
    const PNG_HEIGHT = marioPngDims.height * 0.10;
    
    const pages = pdfDoc.getPages();
    
    const existingPage = pages[pageConfig.PAGE_NUM].addImageObject(PNG, marioPngRef);
    
    console.log("TCL: exports.modifyPDF -> pageConfig", pageConfig)
    const newContentStream = pdfDoc.createContentStream(
        drawImage(PNG, {
            x: 452, //pageConfig.SIGN_POSX,
            y: 380 * pageConfig.TOTAL_PAGES, //pageConfig.SIGN_POSY * pageConfig.TOTAL_PAGES,
            width: PNG_WIDTH,
            height: PNG_HEIGHT,
        }),
        );
        
    existingPage.addContentStreams(pdfDoc.register(newContentStream));

    const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);

    var resultDir = `${__dirname}/results`;

    if (!fs.existsSync(resultDir)){
        fs.mkdirSync(resultDir);
    }
    const filePath = `${__dirname}/results/modified.pdf`;
    fs.writeFileSync(filePath, pdfBytes);
    console.log(`PDF file written to: ${filePath}`);
    return `PDF file written to: ${filePath}`;
}
