FROM mysql:8

COPY init.sql /docker-entrypoint-initdb.d/init.sql
COPY my.cnf /etc/mysql/my.cnf

ENV MySQL_DATABASE world
ENV MYSQL_ROOT_PASSWORD 1234

EXPOSE 3306