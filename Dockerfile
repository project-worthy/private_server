# 베이스 이미지로 Python 3.12 사용
FROM python:3.12-slim

# 작업 디렉터리 설정
WORKDIR /app

# 필요한 라이브러리 설치
COPY ./src/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 소스 코드 복사
COPY ./src/main.py .

# FastAPI를 실행할 때 사용할 포트
EXPOSE 8000

# Uvicorn을 사용하여 FastAPI 서버 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
