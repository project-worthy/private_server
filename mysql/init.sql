-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS iot_devices_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 해당 데이터베이스 사용
USE iot_devices_db;

-- IoT 장비 정보를 저장할 테이블 생성
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- 장비 ID, 자동 증가
    name VARCHAR(255) NOT NULL,         -- 장비 이름
    description TEXT,                   -- 장비 설명
    schedule TEXT,                      -- 장비 스케줄
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 생성 시간
);

-- 샘플 데이터 삽입
INSERT INTO devices (name, description, schedule) VALUES 
('Device 1', 'First IoT device description', '11:10-22:20'),
('Device 2', 'Second IoT device description', '22:20-9:30'),
('Device 3', 'Third IoT device description', '9:30-23:20');

-- root 사용자 비밀번호 설정
ALTER USER 'root'@'%' IDENTIFIED BY '1234';

-- 권한 부여
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';

-- 변경 사항 적용
FLUSH PRIVILEGES;
