#!/usr/bin/env bash
set -e

echo "==> Installing JDK 21..."
curl -L -o jdk.tar.gz https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.5%2B11/OpenJDK21U-jdk_x64_linux_hotspot_21.0.5_11.tar.gz
mkdir -p "$HOME/java"
tar -xzf jdk.tar.gz -C "$HOME/java" --strip-components=1
rm jdk.tar.gz

export JAVA_HOME="$HOME/java"
export PATH="$JAVA_HOME/bin:$PATH"

echo "==> Java version:"
java -version

echo "==> Building Spring Boot application..."
chmod +x mvnw
./mvnw clean package -DskipTests
