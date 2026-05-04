# Stage 1: Build file .jar với Maven và Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Lấy file pom.xml và source code từ trong thư mục con promodo ra
COPY promodo/pom.xml .
COPY promodo/src ./src

# Build ra file .jar (bỏ qua Test cho nhanh)
RUN mvn clean package -DskipTests

# Stage 2: Môi trường chạy Java 21 chuẩn, tương thích cả Mac ARM và Windows
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy file .jar đã build ở Stage 1 sang
COPY --from=build /app/target/*.jar app.jar

# Mở cổng 8080 cho Spring Boot
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]