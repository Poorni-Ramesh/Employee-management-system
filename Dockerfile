# Build stage
FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app

# Copy the backend source (nested structure: ems-backend/ems-backend/)
COPY ems-backend/ems-backend ./backend

# Build
RUN mvn -f backend/pom.xml clean package -DskipTests

# Package stage
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy jar
COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]