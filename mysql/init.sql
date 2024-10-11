-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS iot_device_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 해당 데이터베이스 사용
USE iot_device_db;

-- IoT 장비 정보를 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS device (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 장비 ID, 자동 증가
    name VARCHAR(255) NOT NULL,         -- 장비 이름
    description TEXT,                   -- 장비 설명
    schedule TEXT,                      -- 장비 스케줄
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 생성 시간
);

-- 샘플 데이터 삽입
INSERT INTO device (name, description, schedule) VALUES 
('Device 01', 'First IoT device description',   '11:10-22:20'),
('Device 02', 'Second IoT device description',  '22:20-09:30'),
('Device 03', 'Third IoT device description',   '09:30-23:20'),
('Device 04', 'Fourth IoT device description',  '06:00-18:00'),
('Device 05', 'Fifth IoT device description',   '08:00-20:00'),
('Device 06', 'Sixth IoT device description',   '12:00-21:00'),
('Device 07', 'Seventh IoT device description', '05:00-17:00'),
('Device 08', 'Eighth IoT device description',  '07:30-19:30'),
('Device 09', 'Ninth IoT device description',   '10:00-22:00'),
('Device 10', 'Tenth IoT device description',   '13:00-23:00');


-- root 사용자 비밀번호 설정
ALTER USER 'root'@'%' IDENTIFIED BY '1234';

-- 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';

-- 변경 사항 적용
FLUSH PRIVILEGES;
