# Build stage
FROM maven:3.8.3-openjdk-17 AS build
WORKDIR /app

# Copy backend source
COPY ems-backend/ems-backend ./ems-backend

# Build using correct pom.xml
RUN mvn -f ems-backend/pom.xml clean package -DskipTests

# Package stage
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy jar from backend target
COPY --from=build /app/ems-backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]