const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  console.log('Key:', process.env.RESEND_API_KEY ? 'OK' : 'MISSING');
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'contact@tablou.net',
      to: 'd_dobroiu@yahoo.com',
      subject: 'Test Tablou Resend',
      html: '<strong>Test</strong>'
    });
    if (error) console.error('Error:', error);
    else console.log('Success:', data);
  } catch (e) {
    console.error('Exception:', e);
  }
}
test();
