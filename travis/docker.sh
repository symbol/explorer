#!/bin/sh

if [ "${DOCKER_IMAGE_NAME}" = "" ]
then
  echo "Docker deployment error. Env DOCKER_IMAGE_NAME has not been provided"
  exit 128
fi

if [ "${DOCKER_USERNAME}" = "" ]
then
  echo "Docker deployment error. Env DOCKER_USERNAME has not been provided"
  exit 128
fi

if [ "${DOCKER_PASSWORD}" = "" ]
then
  echo "Docker deployment error. Env DOCKER_PASSWORD has not been provided"
  exit 128
fi

echo "Login into docker..."
echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin

CURRENT_VERSION=$(npm run version --silent)

echo "Creating image ${DOCKER_IMAGE_NAME}:${CURRENT_VERSION}"
docker build -t "${DOCKER_IMAGE_NAME}:${CURRENT_VERSION}" .

if [ "$TRAVIS_BRANCH" = "$MAIN_BRANCH" ]
then
    echo "Building for ${$MAIN_BRANCH} branch..."
    echo "Docker build latest version"
    docker tag ${DOCKER_IMAGE_NAME}:${CURRENT_VERSION} ${DOCKER_IMAGE_NAME}:latest
    docker push "${DOCKER_IMAGE_NAME}:latest"

    echo "Docker build alpha version"
    docker tag ${DOCKER_IMAGE_NAME}:${CURRENT_VERSION} ${DOCKER_IMAGE_NAME}:${VERSION}-alpha
    docker push "${DOCKER_IMAGE_NAME}:${VERSION}-alpha"
fi

if [ "$TRAVIS_BRANCH" = "$RELEASE_BRANCH" ]
then
    echo "Building for ${$RELEASE_BRANCH} branch..."
    echo "Docker build release version"
    docker tag ${DOCKER_IMAGE_NAME}:${CURRENT_VERSION} ${DOCKER_IMAGE_NAME}:release
    docker push "${DOCKER_IMAGE_NAME}:release"

    echo "Docker build release current version"
    docker push "${DOCKER_IMAGE_NAME}:${CURRENT_VERSION}"
fi
