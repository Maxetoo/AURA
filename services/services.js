const axios = require('axios');
const Tesseract = require('tesseract.js')
const pdf = require('pdf-parse');

const downloadFile = async (url) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
};

const extractTextFromImage = async (imageBuffer) => {
  const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
  return text;
};

const extractTextFromPDF = async (pdfBuffer) => {
  const data = await pdf(pdfBuffer);
  return data.text;
};

module.exports = {
  downloadFile,
  extractTextFromImage,
  extractTextFromPDF,
};