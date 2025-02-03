const publishCmd = `
IMAGE_NAME="andreabiagini5/asw"
docker build -t "$IMAGE_NAME:\${nextRelease.version}" .
docker push --all-tags "$IMAGE_NAME"
`;

const prepareCmd = `
#!/bin/bash

tar -czf dist.tar.gz dist
mv dist.tar.gz dist/dist.tar.gz
if [[ -z "$GPG_PRIVATE_KEY" || -z "$GPG_PASSPHRASE" ]]; then
  echo "Error: GPG_PRIVATE_KEY and GPG_PASSPHRASE environment variables must be set."
  exit 1
fi
echo "$GPG_PRIVATE_KEY" | gpg --batch --import
export GPG_TTY=$(tty)
echo "$GPG_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback --passphrase-fd 0 --sign dist/dist.tar.gz
gpg --armor --detach-sign dist/dist.tar.gz
gpg --batch --yes --delete-secret-keys
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
      assets: ['dist/dist.tar.gz', 'dist/dist.tar.gz.asc'],
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
