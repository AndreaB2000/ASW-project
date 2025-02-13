const publishCmd = `
CLIENT_IMAGE_NAME="andreabiagini5/aswclient"
SERVER_IMAGE_NAME="andreabiagini5/aswserver"

docker build -t "$CLIENT_IMAGE_NAME:\${nextRelease.version}" ./src/client
docker push --all-tags "$CLIENT_IMAGE_NAME"

docker build -t "$SERVER_IMAGE_NAME:\${nextRelease.version}" ./src/server
docker push --all-tags "$SERVER_IMAGE_NAME"
`;

let config = require('semantic-release-preconfigured-conventional-commits');
config.plugins.push(
  ['@semantic-release/npm', { pkgRoot: 'dist' }],
  ['@semantic-release/exec', { publishCmd: publishCmd }],
  ['@semantic-release/github', { assets: ['dist/dist.tar.gz', 'dist/dist.tar.gz.asc'] }],
  [
    '@semantic-release/git',
    {
      assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]',
    },
  ]
);
module.exports = config;
