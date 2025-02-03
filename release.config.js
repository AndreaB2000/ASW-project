const publishCmd = `
IMAGE_NAME="andreabiagini5/asw"
docker build -t "$IMAGE_NAME:\${nextRelease.version}" .
docker push --all-tags "$IMAGE_NAME"
`;

const prepareCmd = `
tar -czf dist.tar.gz dist
mv dist.tar.gz dist/dist.tar.gz
echo "$GPG_PRIVATE_KEY" | gpg --import --batch --yes
gpg --batch --yes --passphrase "$GPG_PASSPHRASE" --pinentry-mode loopback --detach-sign -o dist/dist.tar.gz.sig dist/dist.tar.gz
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
  [
    '@semantic-release/github',
    {
      assets: ['dist/dist.tar.gz', 'dist/dist.tar.gz.sig'],
    },
  ],
  [
    '@semantic-release/git',
    {
      assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]',
    },
  ]
);
module.exports = config;
