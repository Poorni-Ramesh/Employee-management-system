FROM maven:3.9.9-eclipse-temurin-17

WORKDIR /app

COPY . .

RUN mvn -f ems-backend/pom.xml clean package -DskipTests

CMD ["java", "-jar", "ems-backend/target/ems-backend-0.0.1-SNAPSHOT.jar"]