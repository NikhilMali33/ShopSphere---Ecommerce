# Use official Java image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Maven
RUN apt-get update && apt-get install -y maven

# Build project
RUN mvn clean install -DskipTests

# Run app
CMD ["java", "-jar", "target/ecom-proj-0.0.1-SNAPSHOT.jar"]