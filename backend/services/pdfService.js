const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (buffer) => {
  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return {
      text: result.text,
      pages: result.total,
    };
  } finally {
    await parser.destroy();
  }
};

module.exports = {
  extractTextFromPDF,
};