const fs = require('fs');
const { PDFDocument, PDFDocumentWriter, drawImage } = require('pdf-lib');
const path = require('path');
const resultDir = path.normalize(__dirname + '/../results/');

exports.modifyPDF = async function (pageConfig, PDF_DOC) {
    try {


        let filePathArray = PDF_DOC.split('/');
        const fileName = filePathArray[filePathArray.length - 1];
        const filePath = `${resultDir}` + fileName;

        const assets = {
            signPngBytes: fs.readFileSync(pageConfig[0].SIGN_PNG),
            pdfDocBytes: fs.readFileSync(PDF_DOC),
        };

        const pdfDoc = await PDFDocument.load(assets.pdfDocBytes);
        const marioPngRef = await pdfDoc.embedPng(assets.signPngBytes);

        const pages = pdfDoc.getPages()
        const { width, height } = pages[0].getSize();
        const PNG_WIDTH = (width / 9);
        const PNG_HEIGHT = (height / 35);

        pageConfig.forEach((pageObj) => {
            console.log("TCL: pageObj", pageObj)
            let coord_x = (pageObj.PAGE_RATIO_X * width);
            let coord_y = (pageObj.PAGE_RATIO_Y * height);
            pages[pageObj.PAGE_NUM - 1].drawImage(marioPngRef, {
                x: coord_x,
                y: (height - (coord_y + 23)),
                width: PNG_WIDTH,
                height: PNG_HEIGHT,
            })
        });


        if (!fs.existsSync(resultDir)) {
            fs.mkdirSync(resultDir);
        }

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(filePath, pdfBytes);

        console.log(`PDF file written to: ${filePath}`);
        return fileName;
    } catch (error) {
        console.log("TCL: error", error)
        return error;
    }
}
