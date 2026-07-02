import fs from 'fs';
import * as pdfParse from 'pdf-parse';

const files = fs.readdirSync('.').filter(f => f.endsWith('.pdf'));
console.log('Bulunan PDF:', files[0]);

const buf = fs.readFileSync(files[0]);
try {
  const data = await pdfParse.default(buf);
  const text = data.text.slice(0, 80000);
  fs.writeFileSync('pdf_text.txt', text);
  console.log('Basarili: ' + data.numpages + ' sayfa, ' + data.text.length + ' karakter');
  console.log('\n--- ILK 3000 KARAKTER ---\n');
  console.log(text.slice(0, 3000));
} catch (err) {
  console.error('Hata:', err);
}