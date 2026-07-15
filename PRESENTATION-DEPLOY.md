# MindBridge Global สำหรับแชร์และ Present

ตอนนี้ใน repo นี้มีไฟล์ที่พร้อมใช้งานสำหรับ `แชร์ออนไลน์` และ `เปิดสำรองแบบออฟไลน์` แล้ว โดย generate มาจาก source ใน `mindbridge-global-webapp/`

## ไฟล์ที่พร้อมใช้

- `docs/index.html`
  ใช้สำหรับ `GitHub Pages` ได้เลย
- `docs/404.html`
  ไฟล์สำรองสำหรับ GitHub Pages
- `offline/mindbridge-global-offline.html`
  ไฟล์ HTML แบบไฟล์เดียว เปิดจากเครื่องได้ทันที ไม่ต้องรัน server

## วิธีใช้ตอน Present

แนะนำให้เตรียม 2 ทางพร้อมกัน:

1. ใช้ลิงก์ออนไลน์จาก `GitHub Pages` เป็นตัวหลัก
2. เก็บ `offline/mindbridge-global-offline.html` ไว้ในเครื่องสำหรับ fallback

## วิธีทำลิงก์ออนไลน์ด้วย GitHub Pages

ถ้าจะเอาไฟล์ชุดนี้ขึ้น GitHub แล้วเปิดเป็นลิงก์สาธารณะ ให้ทำตามนี้:

1. สร้าง GitHub repository ใหม่ หรือใช้ repo ที่มีอยู่
2. Push repo นี้ขึ้น GitHub
3. เข้า `Settings -> Pages`
4. ในหัวข้อ `Build and deployment` เลือก
   `Source: Deploy from a branch`
5. เลือก
   `Branch: main` หรือ `master`
   `Folder: /docs`
6. กด Save

หลังจากนั้น GitHub จะสร้างลิงก์ลักษณะนี้ให้:

`https://<github-username>.github.io/<repo-name>/`

ตัวอย่าง:

`https://example.github.io/mindbridge-global/`

## วิธีเปิดไฟล์สำรองออฟไลน์

เปิดไฟล์นี้ได้ตรงๆ:

- `offline/mindbridge-global-offline.html`

บน macOS ส่วนใหญ่แค่ double-click ก็เปิดใน browser ได้เลย

## ถ้ามีการแก้ source แล้วต้อง build ใหม่

ถ้าคุณแก้ไฟล์ต้นฉบับใน `mindbridge-global-webapp/` ให้รัน:

```bash
node mindbridge-global-webapp/scripts/build-static.mjs
```

คำสั่งนี้จะอัปเดตไฟล์เหล่านี้ใหม่:

- `docs/index.html`
- `docs/404.html`
- `offline/mindbridge-global-offline.html`
