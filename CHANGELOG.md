## [0.2.6](https://github.com/AndreaB2000/ASW-project/compare/0.2.5...0.2.6) (2025-02-03)

### Bug Fixes

* forget to pass prepare command to sem-rel/exec ([9c1819f](https://github.com/AndreaB2000/ASW-project/commit/9c1819fd515e7dc49c91f7d41c66b41518b280f2))
* move tar.gz file into dist folder ([81ff929](https://github.com/AndreaB2000/ASW-project/commit/81ff929646cf54572867c25625c908f71b607883))
* passing passphrase and private key to sem-rel ([b3b1fe5](https://github.com/AndreaB2000/ASW-project/commit/b3b1fe5295fb38e688290d246a992acb34bcd77c))

### Build and continuous integration

* change how to sign ([cd6e433](https://github.com/AndreaB2000/ASW-project/commit/cd6e43309ad34d941b0df91ee1345c7af575c331))

## [0.2.5](https://github.com/AndreaB2000/ASW-project/compare/0.2.4...0.2.5) (2025-02-03)

### Bug Fixes

* fake commit to trigger a new release ([6c17984](https://github.com/AndreaB2000/ASW-project/commit/6c179842a3aa507215061e13acd3c840accc0152))

### Build and continuous integration

* add artifact signing ([266e257](https://github.com/AndreaB2000/ASW-project/commit/266e2574332dd679e5e6c514931b5139f9075963))

### General maintenance

* update set-hooks.bat ([78f87ae](https://github.com/AndreaB2000/ASW-project/commit/78f87aedc48e6891c6180879dda0c0594f35fb82))

## [0.2.4](https://github.com/AndreaB2000/ASW-project/compare/0.2.3...0.2.4) (2025-02-03)

### Revert previous changes

* restore previous package.json ([1197c2d](https://github.com/AndreaB2000/ASW-project/commit/1197c2d9cb8c1a23d12190f48f53b0005a452448))

### General maintenance

* fourth try ([7c24cca](https://github.com/AndreaB2000/ASW-project/commit/7c24cca005383075e3a8dadfaf4d0702eb184ac9))

## [0.2.3](https://github.com/AndreaB2000/ASW-project/compare/0.2.2...0.2.3) (2025-02-03)

### Bug Fixes

* **build:** trying to not specify files item to package.json file ([0a7750f](https://github.com/AndreaB2000/ASW-project/commit/0a7750fa7ae2732f3760ea40c55e8ed0129eff85))

### Build and continuous integration

* change how builds are inserted into dist folder ([147cbaa](https://github.com/AndreaB2000/ASW-project/commit/147cbaa853ba003733c69863b2118b2d63c28546))
* fix build.bat ([5636493](https://github.com/AndreaB2000/ASW-project/commit/5636493fbdca125b7001737a734ec3ce87675050))

### General maintenance

* add a tree print to see what's wrong with build script in ci env ([087945c](https://github.com/AndreaB2000/ASW-project/commit/087945ce32556fe46ff566fb14af757eeea16ade))
* add cool infos in package.json ([7105ed0](https://github.com/AndreaB2000/ASW-project/commit/7105ed046528d07bd5aaefb17482d73e4b607fdc))
* second try ([3f3295f](https://github.com/AndreaB2000/ASW-project/commit/3f3295f91daf70e34a53c808a618b581468e4339))
* third try ([1fe5a3e](https://github.com/AndreaB2000/ASW-project/commit/1fe5a3ec72398ae9c071c6e4273b8cfdfbcdfada))

## [0.2.2](https://github.com/AndreaB2000/ASW-project/compare/0.2.1...0.2.2) (2025-02-03)

### Documentation

* update readme with all npm commands ([e7ca211](https://github.com/AndreaB2000/ASW-project/commit/e7ca21157b641968537add0cffd40130e6777132))

### Build and continuous integration

* add changelog, license and readme file to build artifact ([77f6509](https://github.com/AndreaB2000/ASW-project/commit/77f6509aab0363bf5b8ad21d8cbe2bdb77227d5b))
* avoid test file compilation in server ([1d7b82b](https://github.com/AndreaB2000/ASW-project/commit/1d7b82bea11b4d60f97a80b322fdab4e99a68411))

## [0.2.1](https://github.com/AndreaB2000/ASW-project/compare/0.2.0...0.2.1) (2025-02-03)

### Bug Fixes

* fake commit to trigger a new release ([1da3706](https://github.com/AndreaB2000/ASW-project/commit/1da3706497407a69e984f8d2fbc8c28cbda15ba1))

### Documentation

* update devops-todo ([19a3f7f](https://github.com/AndreaB2000/ASW-project/commit/19a3f7f2736ed798262533e0db389e4a03dfb3f1))

### Build and continuous integration

* add build task within release job ([16aabe7](https://github.com/AndreaB2000/ASW-project/commit/16aabe798e0814c418415028f22ff7bb359d4d99))
* add files item to package.json ([b91800c](https://github.com/AndreaB2000/ASW-project/commit/b91800cfccef7670c0bd13d5e01fddd20227aef0))
* change pkgRoot for npm to dist directory ([96bf3fa](https://github.com/AndreaB2000/ASW-project/commit/96bf3fac6682f1027fb9673be01395c164350030))
* create npm run set-hooks command ([dd339f1](https://github.com/AndreaB2000/ASW-project/commit/dd339f168b4d78fa23ce3baef1716aea968fa0c2))
* **fix:** replace all 'src/' occurence with '' in dist/package.json ([7f1469b](https://github.com/AndreaB2000/ASW-project/commit/7f1469bda7812c2e1952cf22ccee364b07b7106d))
* update build command ([5baf487](https://github.com/AndreaB2000/ASW-project/commit/5baf4877f089143e679c280517d0dbfd194a7ce3))
* update dockerfile to restore its functionality ([342b724](https://github.com/AndreaB2000/ASW-project/commit/342b724a06338f967ec8b7ddade1e0c0d69b8b90))

### Refactoring

* change sonar.javascript to sonar.typescript ([4759bda](https://github.com/AndreaB2000/ASW-project/commit/4759bdae797e345fa220f39169487b04375bbd93))
* create a separate build script ([daf49a9](https://github.com/AndreaB2000/ASW-project/commit/daf49a988170fdc88e3fc4792a1c149ccfbfdcdb))

## [0.2.0](https://github.com/AndreaB2000/ASW-project/compare/0.1.3...0.2.0) (2025-02-02)

### Features

* add client template project, still not checked all files ([1e19cb4](https://github.com/AndreaB2000/ASW-project/commit/1e19cb49fe136161362a229d8e13d99962d0a556))
* add server template project, still not checked all files ([c663dc3](https://github.com/AndreaB2000/ASW-project/commit/c663dc3f8b9b98bd0112d830fcf10db7f292dcba))
* create template server ([d45f0c1](https://github.com/AndreaB2000/ASW-project/commit/d45f0c1a7eb3b8d0d97b8f5a2679cb31d70c9708))

### Documentation

* add sonarqube stats to readme ([55d7f43](https://github.com/AndreaB2000/ASW-project/commit/55d7f4357d362e5f0cae7591732f476ef82d7b37))

### Revert previous changes

* before server template ([ec457c0](https://github.com/AndreaB2000/ASW-project/commit/ec457c08447b37499450eecba34dc562e4c6f4b6))

### Tests

* fix template tests (so that they pass) ([e433deb](https://github.com/AndreaB2000/ASW-project/commit/e433deb2a8faed0b7de70306cfa2cf531757e0d9))

### Build and continuous integration

* add automatic build before running e2e tests ([ff7c263](https://github.com/AndreaB2000/ASW-project/commit/ff7c2632662a44e416622cf39063fa6ee068f54a))
* add branch name so that sonar does not ignore it ([4a1706c](https://github.com/AndreaB2000/ASW-project/commit/4a1706c1dd044e4d3fe577b666091d801d0b8f9a))
* add commented build pipeline ([254d14b](https://github.com/AndreaB2000/ASW-project/commit/254d14b2749735f4791b7b865a4235470f1e1633))
* add sonar cloud to the pipeline ([4819150](https://github.com/AndreaB2000/ASW-project/commit/4819150a24ead9093a62ef829d1dd4dc7718e6c7))
* add test command and install deps command ([0b0f30f](https://github.com/AndreaB2000/ASW-project/commit/0b0f30f4d5a547373b6a64945748a892b51e5260))
* add test command before generating sonar analysis ([27c746e](https://github.com/AndreaB2000/ASW-project/commit/27c746e9ec0d843c1a3a056c020699e0afd3acd2))
* configure package.json ([04359ef](https://github.com/AndreaB2000/ASW-project/commit/04359efa2f3102de15c47ed343041b8ccb57b1c8))
* create build matrix ([5626f95](https://github.com/AndreaB2000/ASW-project/commit/5626f957fd5d718b82fe9bd300b4abd65222f55a))
* let sonarqube exclude tests folder from src files ([02e4352](https://github.com/AndreaB2000/ASW-project/commit/02e43525e54aaef1d259a30bebbedf4bab02799c))
* move sonarqube from matrix to independent task ([eb30045](https://github.com/AndreaB2000/ASW-project/commit/eb30045e7701a6c75781ff59e20db90db5401813))
* setup sonarqube ([5716b0b](https://github.com/AndreaB2000/ASW-project/commit/5716b0b8e4fb827c40bf17884e9f5f0d2329cb19))
* working on build matrix ([6aae273](https://github.com/AndreaB2000/ASW-project/commit/6aae2737e04dcdeaa32aec26ca2e19f56ec6f36a))

### General maintenance

* add authors names to package.json ([3cec249](https://github.com/AndreaB2000/ASW-project/commit/3cec249c59219d0d01fde0251019b5651467c5df))
* create a list of all todo devops ([90491b3](https://github.com/AndreaB2000/ASW-project/commit/90491b30590b70e2be8fd5cd696e12176cc68486))
* rebase ci onto dev ([31883a4](https://github.com/AndreaB2000/ASW-project/commit/31883a47ce7c474ceb770435c9169d65670d71d7))
* selected the latest version for semantic-release-preconfigured-conventional-commits ([bb83af8](https://github.com/AndreaB2000/ASW-project/commit/bb83af8e1f6aae57e4e40e9436d365c428728a21))
* typo ([3d64516](https://github.com/AndreaB2000/ASW-project/commit/3d645169b89928bdd2467e95825d7abf29cd552d))
* update githook echo message ([1c8b795](https://github.com/AndreaB2000/ASW-project/commit/1c8b79508cec0825580248ac2a26540aa9780374))

### Style improvements

* move token arg from .properties file to ci cd pipeline file ([f7fb2da](https://github.com/AndreaB2000/ASW-project/commit/f7fb2da91ad6baf11f4e98533e79e898045eeab7))

### Refactoring

* change scripts:dev -> scripts:serve ([09ce947](https://github.com/AndreaB2000/ASW-project/commit/09ce947fe9ac12024beb58b465538c0be709acd2))
* change var with const and let ([eae31b8](https://github.com/AndreaB2000/ASW-project/commit/eae31b833467b00640df87901686737b93750d02))
* move configuration files from server/client to root where possible ([3689b0a](https://github.com/AndreaB2000/ASW-project/commit/3689b0ae7376664ef760d46da304e0f57367d14b))
* remove some useless files in server and move one to .vscode due to its importance ([746bb78](https://github.com/AndreaB2000/ASW-project/commit/746bb78bda927fd1760537153e936822664e78e1))

## [0.1.3](https://github.com/AndreaB2000/ASW-project/compare/0.1.2...0.1.3) (2025-01-29)

### Bug Fixes

* let the package be public ([c50d0d9](https://github.com/AndreaB2000/ASW-project/commit/c50d0d92c9dfd572534cf660132548269a493a24))

## [0.1.2](https://github.com/AndreaB2000/ASW-project/compare/0.1.1...0.1.2) (2025-01-29)

### Bug Fixes

* empty commit to test semantic-release ([830c7fd](https://github.com/AndreaB2000/ASW-project/commit/830c7fd761288b6bd4b4d68055f3e71c87ace73b))

### Build and continuous integration

* add some features to push to npm, also add hello world script ([05967f2](https://github.com/AndreaB2000/ASW-project/commit/05967f24dc52ff74d442cc134dd20e6b550758db))
* change commit message for semantic release ([4064d95](https://github.com/AndreaB2000/ASW-project/commit/4064d95cf28623008d7e4a14f207bd71e4e77185))
* change release.config.js in order to push to docker ([38cf45a](https://github.com/AndreaB2000/ASW-project/commit/38cf45aebb6a84c2195b2d9908e04e352dd30bad))
* fix docker login job ([1ebd8a4](https://github.com/AndreaB2000/ASW-project/commit/1ebd8a417bc255376f0d9d8c27738159ae09b1a4))
* fix package name so that is a scoped package ([5ba4437](https://github.com/AndreaB2000/ASW-project/commit/5ba443762c52dddc301f8c2d07986422152269b0))

### Style improvements

* remove comments in github action yaml file ([bbb7dcc](https://github.com/AndreaB2000/ASW-project/commit/bbb7dcc07c7b44806cf2c4ab1e736cf3717ab55f))

## [0.1.1](https://github.com/AndreaB2000/ASW-project/compare/0.1.0...0.1.1) (2025-01-28)

### Documentation

* update README ([a6928d6](https://github.com/AndreaB2000/ASW-project/commit/a6928d600d078e5e60a2d961ebc0dd79877cbfd3))

### Build and continuous integration

* add configuration for semantic-release ([0bb3a17](https://github.com/AndreaB2000/ASW-project/commit/0bb3a17fd9b9113a891a6cb0344be74edcdae0df))
* added semantic-release to the project along with gitignore and attributes ([69091c9](https://github.com/AndreaB2000/ASW-project/commit/69091c97f77c62fd66bdc4cb3b145e4638d700fb))
* back-up git hooks ([6a75a66](https://github.com/AndreaB2000/ASW-project/commit/6a75a6624ba4b1aa395331528341050630419bd3))
* change filippogurioli-> andreabiagini5 ([cef8815](https://github.com/AndreaB2000/ASW-project/commit/cef8815c1fdfa6d0e5235a4b36550e61217456e3))
* create ci pipeline ([950c053](https://github.com/AndreaB2000/ASW-project/commit/950c053d3a30074a58f9fc3e7fd794f4f3103b63))
* created valid (hopefully) semantic-release action ([e8e12be](https://github.com/AndreaB2000/ASW-project/commit/e8e12be0d6670b3de716c224c5d02c9ba5d92a38))
* let send-notification depend on release ([4767800](https://github.com/AndreaB2000/ASW-project/commit/476780043843dc49149f1d3e8fa6ad746f014816))
* let send-notification notify a failed pipeline ([a845d10](https://github.com/AndreaB2000/ASW-project/commit/a845d106353f7a26750084b52963e3b9606f3efd))
* trying to leave directly to Release task docker password ([9ae490b](https://github.com/AndreaB2000/ASW-project/commit/9ae490baf62c6c578ec415a2b7ff04a296a738f8))
* update a bit send notification task ([fe71e44](https://github.com/AndreaB2000/ASW-project/commit/fe71e44a8edf4744dd64c05b5bad11bd6ffc88b3))
* update a bit send notification task ([a4f2ee8](https://github.com/AndreaB2000/ASW-project/commit/a4f2ee86420820d86e99646c931271f1709db13a))
* working on integrating Docker ([b39f09f](https://github.com/AndreaB2000/ASW-project/commit/b39f09f250399ab23ec4fc1333e73dd4c6e888c9))

### General maintenance

* remove a line in send notification output ([23a82b3](https://github.com/AndreaB2000/ASW-project/commit/23a82b38c466913fc671848179717a938670077a))
* typo ([4d58f7a](https://github.com/AndreaB2000/ASW-project/commit/4d58f7a937e6435a27a25e2be7e623aafa08e9bb))
* update package-lock (runned npm i) ([6cedb32](https://github.com/AndreaB2000/ASW-project/commit/6cedb32fe5f216ee3816c6c29aef7beade95580f))
* updated git attributes ([ec6e617](https://github.com/AndreaB2000/ASW-project/commit/ec6e6176ed4a3e4b76abb971ad942e973e56211b))
