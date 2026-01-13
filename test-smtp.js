const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔍 Testing SMTP Connection...\n');
console.log('Gmail User:', process.env.GMAIL_USER);
console.log('App Password:', process.env.GMAIL_APP_PASSWORD ? '***configured***' : '❌ NOT SET');
console.log('\n');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

console.log('⏳ Verifying SMTP connection...\n');

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ SMTP Connection FAILED!\n');
    console.log('Error Details:');
    console.log('  Type:', error.code || 'Unknown');
    console.log('  Message:', error.message);
    console.log('\n');
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.log('🚫 This indicates that SMTP ports (587/465) are BLOCKED on this server.');
      console.log('💡 Solution: Switch to SendGrid or Mailgun (they use HTTP APIs)');
    } else if (error.message.includes('Invalid login')) {
      console.log('🔑 This indicates wrong credentials.');
      console.log('💡 Solution: Check GMAIL_USER and GMAIL_APP_PASSWORD in .env');
    }
  } else {
    console.log('✅ SMTP Server is ready to send emails!');
    console.log('✅ Gmail SMTP is working correctly on this server.');
    console.log('\n');
    console.log('📧 Sending test email...\n');
    
    const testMailOptions = {
      from: `"HavenTo Test" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'SMTP Test - HavenTo',
      text: 'If you receive this email, SMTP is working correctly!'
    };
    
    transporter.sendMail(testMailOptions, (err, info) => {
      if (err) {
        console.log('❌ Failed to send test email:', err.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('📬 Check your inbox:', process.env.GMAIL_USER);
      }
      process.exit(0);
    });
  }
});

setTimeout(() => {
  console.log('\n⏱️  Test timed out after 15 seconds');
  console.log('🚫 This confirms SMTP ports are BLOCKED on this server');
  console.log('💡 Recommendation: Switch to SendGrid');
  process.exit(1);
}, 15000);
