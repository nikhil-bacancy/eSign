const fs = require('fs');
const { PDFDocument, PDFDocumentWriter, drawImage } = require('pdf-lib');
const path = require('path');
const resultDir = path.normalize(__dirname + '/../results/');

embbedImages = (pdfDoc, signPngBytes) => {
    return new Promise((resolve, reject) => {
        pdfDoc.embedPng(signPngBytes).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    });
}

drawImageToPdf = (pageConfig, pdfDoc, signPngBytes, pages, PNG_WIDTH, PNG_HEIGHT, width, height) => {
    let counter = 0;
    return new Promise((resolve, reject) => {
        try {
            pageConfig.forEach((pageObj, index) => {
                signPngBytes[index].then(signPngBytesData => {
                    embbedImages(pdfDoc, signPngBytesData).then(pngRef => {
                        let coord_x = (pageObj.PAGE_RATIO_X * width);
                        let coord_y = (pageObj.PAGE_RATIO_Y * height);
                        pages[pageObj.PAGE_NUM - 1].drawImage(pngRef, {
                            x: coord_x,
                            y: (height - (coord_y + 23)),
                            width: PNG_WIDTH,
                            height: PNG_HEIGHT,
                        })
                        if (++counter === pageConfig.length) {
                            resolve('all signes are drawn.!')
                        }
                    })
                });
            });
        } catch (error) {
            console.log("TCL: drawImageToPdf -> error", error)
            reject(error)
        }
    });
}

exports.modifyPDF = function (pageConfig, PDF_DOC) {
    return new Promise(async (resolve, reject) => {
        try {
            let filePathArray = PDF_DOC.split('/');
            const fileName = filePathArray[filePathArray.length - 1];
            const filePath = `${resultDir}` + fileName;

            const assets = {
                pdfDocBytes: fs.readFileSync(PDF_DOC),
            };
            const pdfDoc = await PDFDocument.load(assets.pdfDocBytes);
            const pages = pdfDoc.getPages()
            const { width, height } = pages[0].getSize();

            const PNG_WIDTH = (width / 9);
            const PNG_HEIGHT = (height / 35);

            let signPngBytes = pageConfig.map(async pageObj => {
                return fs.readFileSync(pageObj.SIGN_PNG)
            });

            drawImageToPdf(pageConfig, pdfDoc, signPngBytes, pages, PNG_WIDTH, PNG_HEIGHT, width, height).then(async res => {
                if (!fs.existsSync(resultDir)) {
                    fs.mkdirSync(resultDir);
                }
                const pdfBytes = await pdfDoc.save();
                fs.writeFileSync(filePath, pdfBytes);

                console.log(`PDF file written to: ${filePath}`);
                resolve(fileName);
            }).catch(error => {
                console.log("TCL: error", error)
                reject(error);
            })
        } catch (error) {
            console.log("TCL: error", error)
            reject(error);
        }
    });
}
