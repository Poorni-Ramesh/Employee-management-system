FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y maven

# explicitly point to pom.xml
RUN mvn -f ems-backend/pom.xml clean install -DskipTests

CMD ["java", "-jar", "ems-backend/target/*.jar"]