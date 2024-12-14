# Bước 1: Sử dụng image Node.js làm base image
FROM node:18-alpine AS builder

# Bước 2: Thiết lập thư mục làm việc trong container
WORKDIR /app

# Bước 3: Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Bước 4: Cài đặt các phụ thuộc
RUN npm install

# Bước 5: Sao chép toàn bộ mã nguồn vào container
COPY . .

# Bước 6: Build ứng dụng Next.js
RUN npm run build

# Bước 7: Chuyển sang bước chạy ứng dụng
FROM node:18-alpine

# Thiết lập thư mục làm việc cho ứng dụng đã build
WORKDIR /app

# Sao chép thư mục đã build từ image builder
COPY --from=builder /app ./

# Cài đặt lại các phụ thuộc chỉ cần thiết cho môi trường production
RUN npm install --production

# Cấu hình container để chạy Next.js
CMD ["npm", "start"]

# Mở cổng 3000 để truy cập ứng dụng
EXPOSE 3000
