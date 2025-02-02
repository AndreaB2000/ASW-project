const publishCmd = `
IMAGE_NAME="andreabiagini5/asw"
docker build -t "$IMAGE_NAME:\${nextRelease.version}" .
docker push --all-tags "$IMAGE_NAME"
`;

let config = require('semantic-release-preconfigured-conventional-commits');
config.plugins.push(
  '@semantic-release/npm',
  [
    '@semantic-release/exec',
    {
      publishCmd: publishCmd,
    },
  ],
  '@semantic-release/github',
  [
    '@semantic-release/git',
    {
      assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
    },
  ]
);
module.exports = config;
