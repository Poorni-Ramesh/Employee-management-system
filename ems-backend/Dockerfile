FROM openjdk:17
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y maven
RUN mvn clean install -DskipTests
CMD ["java", "-jar", "target/*.jar"]