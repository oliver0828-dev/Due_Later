// content.js
document.body.innerHTML = `
  <div style="font-family:sans-serif;text-align:center;margin-top:50px;">
    <p style="font-size: 90px; font-weight: bold;">Absolute Sigma grindset—grinding at avoiding work. 💀🔥</p>
    <p id="blockedApp" style="margin-top:10px;color:#555; font-size: 30px;"></p>
    <p style="margin-top:20px; font-size: 18px;">
      We suggest you go to 
      <a href="https://instagram.com" style="color:#3897f0;text-decoration:none; font-size: 30px;">Instagram</a>, 
      <a href="https://www.youtube.com/" style="color:#ff0000;text-decoration:none; font-size: 30px;">YouTube</a>, 
      <a href="https://www.snapchat.com" style="color:#fffc00;text-decoration:none; font-size: 30px;">Snapchat</a>, 
      <a href="https://www.tiktok.com/" style="color:#010101;text-decoration:none; font-size: 30px;">TikTok</a>, and 
      <a href="https://twitter.com" style="color:#1DA1F2;text-decoration:none; font-size: 30px;">Twitter</a>
      for your enjoyment.
    </p>
   <p style="font-size: 90px; font-weight: bold;">
   🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
   🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
   🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
   🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
   🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
   </p>
  </div>
`;


const url = window.location.href;
let blockedAppName = 'a productivity app';

if (url.includes('docs.google.com')) {
  blockedAppName = 'Google Docs';
} else if (url.includes('slides.google.com')) {
  blockedAppName = 'Google Slides';
} else if (url.includes('drive.google.com')) {
  blockedAppName = 'Google Drive';
} else if (url.includes('mail.google.com')) {
  blockedAppName = 'Gmail';
} else if (url.includes('calendar.google.com')) {
  blockedAppName = 'Google Calendar';
} else if (url.includes('meet.google.com')) {
  blockedAppName = 'Google Meet';
} else if (url.includes('sheets.google.com')) {
  blockedAppName = 'Google Sheets';
}

document.getElementById('blockedApp').textContent = `${blockedAppName} has been blocked.`;
