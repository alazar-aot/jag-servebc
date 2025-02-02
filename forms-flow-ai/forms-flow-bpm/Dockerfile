# maven build
FROM artifacts.developer.gov.bc.ca/docker-remote/maven:3.6.1-jdk-11-slim AS MAVEN_TOOL_CHAIN

RUN apt-get update \
    && apt-get install -y git 
    
# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_BRANCH
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_BRANCH ${FORMFLOW_SOURCE_REPO_BRANCH}
# expect a build-time variable
ARG FORMFLOW_SOURCE_REPO_URL
# use the value to set the ENV var default
ENV FORMFLOW_SOURCE_REPO_URL ${FORMFLOW_SOURCE_REPO_URL}

#Debug
RUN pwd

# Clone code   
RUN git clone --branch ${FORMFLOW_SOURCE_REPO_BRANCH} ${FORMFLOW_SOURCE_REPO_URL} /bpm/

#Debug
RUN pwd
RUN ls .

COPY ./pom-docker.xml /tmp/pom.xml
COPY ./settings-docker.xml /usr/share/maven/ref/

# set working directory
WORKDIR /tmp/

#Debug
RUN pwd
RUN ls .

# This allows Docker to cache most of the maven dependencies
RUN mvn -s /usr/share/maven/ref/settings-docker.xml dependency:resolve-plugins dependency:resolve dependency:go-offline -B
RUN cp -r /bpm/forms-flow-bpm/src/ /tmp/src/

#Debug
RUN pwd
RUN ls /tmp/src/

ARG CUSTOM_SRC_DIR=src/
# Override these files those have custom changes in the jag-servebc directory
COPY ./${CUSTOM_SRC_DIR}/  /tmp/${CUSTOM_SRC_DIR}/

RUN mvn -s /usr/share/maven/ref/settings-docker.xml package

# final custom slim java image (for apk command see jdk-11.0.3_7-alpine-slim)
FROM artifacts.developer.gov.bc.ca/docker-remote/adoptopenjdk/openjdk11:jdk-11.0.3_7-alpine

ENV JAVA_VERSION jdk-11.0.3+7
ENV JAVA_HOME=/opt/java/openjdk \
    PATH="/opt/java/openjdk/bin:$PATH"

EXPOSE 8080
# OpenShift has /app in the image, but it's missing when doing local development - Create it when missing
RUN test ! -d /app && mkdir /app || :
# Add spring boot application
RUN mkdir -p /app
COPY --from=MAVEN_TOOL_CHAIN /tmp/target/forms-flow-bpm.jar ./app

RUN chmod a+rwx -R /app
WORKDIR /app
VOLUME /tmp
ENTRYPOINT ["java","-Ddebug=true -Djava.security.egd=file:/dev/./urandom","-jar","/app/forms-flow-bpm.jar"]
