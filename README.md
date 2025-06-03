# POS

## Description

เป็นระบบขายหน้าร้าน ซึ่งสามารถ
1. แสดงรายการสินค้าทั้งหมดในร้าน
  1.1 สามารถดูรายละเอียดของสินค้าได้ เมื่อกดดูสินค้า
2. ใช้ระบบค้นหาสินค้าจากชื่อหรือรายละเอียด
3. เลือกจำนวนสินค้าที่ต้องการและเพิ่มลงตะกร้า
4. แสดงรายการสินค้าในตะกร้าและคำนวณราคาสินค้าแต่ละชนิด
5. ใช้ระบบชำระเงิน ซึ่งมี 3 วิธีในการชำระเงินได้แก่ เงินสด, การ์ด, QR Code
  5.1 หลังชำระเงิน จะตัดสต็อกสินค้าออกจากระบบ

## Project setup

```bash
git clone https://github.com/Thom-ti/POS.git
cd POS
```

### .env setup in `server/`

```text
PORT=8888
MONGODB_URL=mongodb+srv://thomdev:OI8DZyaD5z6wvrQ0@cluster-ti.thoo734.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Ti
```

## Frontend & Backend setup with `docker-compose.yml`

```bash
docker-compose up -d --build
```

เมื่อรันเสร็จแล้ว เปิดบราวเซอร์และไปที่ `http://localhost:4200/`

## Down Container

```bash
docker-compose down	-v
```

---

<!-- ### Frontend setup

```bash
cd client/
npm install
```

#### Start local development server

```bash
npm run start
```

เมื่อสั่งรันแล้ว เปิดบราวเซอร์และไปที่ `http://localhost:4200/`

### Backend setup

```bash
cd server/
npm install
```

#### .env setup

```text
PORT=8888
MONGODB_URL=mongodb+srv://thomdev:OI8DZyaD5z6wvrQ0@cluster-ti.thoo734.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Ti
```

#### Compile and run the project

```bash
# watch mode
$ npm run start:dev
```

```bash
# development
$ npm run start
```

--- -->
