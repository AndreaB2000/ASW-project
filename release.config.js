const publishCmd = `
IMAGE_NAME="andreabiagini5/asw"
docker build -t "$IMAGE_NAME:\${nextRelease.version}" .
docker push --all-tags "$IMAGE_NAME"
`;

const prepareCmd = `
npm run build
`;

let config = require('semantic-release-preconfigured-conventional-commits');
config.plugins.push(
  [
    '@semantic-release/npm',
    {
      pkgRoot: 'dist',
    },
  ],
  [
    '@semantic-release/exec',
    {
      prepareCmd: prepareCmd,
      publishCmd: publishCmd,
    },
  ],
  '@semantic-release/github',
  [
    '@semantic-release/git',
    {
      assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]',
    },
  ]
);
module.exports = config;
