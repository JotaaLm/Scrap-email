
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
const { email } = require('./config');


async function scrapeData() {
  try {
  
    const url = 'https://example.com'; 

   
    const { data } = await axios.get(url);

    
    const $ = cheerio.load(data);

    
    const titles = [];
    $('h2.article-title').each((index, element) => {
      titles.push($(element).text());
    });

    return titles;
  } catch (error) {
    console.error('Erro ao fazer scraping:', error);
    return [];
  }
}


async function sendEmail(subject, body) {
  const transporter = nodemailer.createTransport({
    service: email.service,
    auth: {
      user: email.user,
      pass: email.pass,
    },
  });

  const mailOptions = {
    from: email.user,
    to: 'destinatario@example.com', 
    subject: subject,
    text: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado: ' + info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}


async function main() {
  const scrapedData = await scrapeData();
  
  if (scrapedData.length > 0) {
    const subject = 'Dados extraídos da página';
    const body = `Aqui estão os títulos extraídos da página:\n\n${scrapedData.join('\n')}`;
    
    await sendEmail(subject, body);
  } else {
    console.log('Nenhum dado foi extraído.');
  }
}

main();
