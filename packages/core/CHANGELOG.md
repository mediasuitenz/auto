# v8.4.0 (Mon Dec 16 2019)

#### 🐛  Bug Fix

- version: detect prerelease branch  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.3.0 (Mon Dec 16 2019)

#### 🐛  Bug Fix

- release: detect prerelease branch + be smarter about commit range  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump @octokit/rest from 16.35.0 to 16.35.2

Bumps [@octokit/rest](https://github.com/octokit/rest.js) from 16.35.0 to 16.35.2.
- [Release notes](https://github.com/octokit/rest.js/releases)
- [Commits](https://github.com/octokit/rest.js/compare/v16.35.0...v16.35.2)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>  ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump https-proxy-agent from 3.0.1 to 4.0.0

Bumps [https-proxy-agent](https://github.com/TooTallNate/node-https-proxy-agent) from 3.0.1 to 4.0.0.
- [Release notes](https://github.com/TooTallNate/node-https-proxy-agent/releases)
- [Commits](https://github.com/TooTallNate/node-https-proxy-agent/compare/3.0.1...4.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>  ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))
- Bump semver from 6.3.0 to 7.0.0

Bumps [semver](https://github.com/npm/node-semver) from 6.3.0 to 7.0.0.
- [Release notes](https://github.com/npm/node-semver/releases)
- [Changelog](https://github.com/npm/node-semver/blob/master/CHANGELOG.md)
- [Commits](https://github.com/npm/node-semver/compare/v6.3.0...v7.0.0)

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>  ([@dependabot-preview[bot]](https://github.com/dependabot-preview[bot]))

#### Authors: 2

- [@dependabot-preview[bot]](https://github.com/dependabot-preview[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.2.0 (Sun Dec 15 2019)

#### 🐛  Bug Fix

- fix and add tests  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- release: add flag to publish prerelease  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.3 (Sat Dec 14 2019)

#### 🐛  Bug Fix

- add test  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- omit next branch PR Title from being in release notes  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.2 (Sat Dec 14 2019)

#### 🐛  Bug Fix

- add test  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- ignore unknown labels during bump calc + fix none type release skipping  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- let modify config actually do something  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.1.0 (Sat Dec 14 2019)

#### 🐛  Bug Fix

- fix bug where merging a none would skip previously meged semver label, ex: merge next into master and next has a none label  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v8.0.0 (Wed Dec 11 2019)

#### 🐛  Bug Fix

- change skip-release releaseType to just skip  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add hash  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix tests  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix sub-pacakge changelogs  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only grant contributions for work in commit  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- display message when commit is omitted  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix bug where author would get matched incorrectly  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- handle unknown tag when supplying --from and --to  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add tests  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- omit commits that have already been released  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- do not call afterRelease hooks during dry run  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update docs  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- switch from dedent to endent to fix multitemplate indentation  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add release notes to prerelease PRs  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove false type  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- post comment prerelase version on prerelease version PR branches  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- allow any "N > 2" of --verbose flags for very verbose  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Deprecate "--very-verbose, -w" in favor of "-vv"  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- more logs  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix canary calcs  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- reset versions  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.8 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- change to more explicit property name  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.7 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move to top level util for ease of testing  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add email fallback back in  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add test for none  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add none release type  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- allow user to overwrite base label  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- check for depreacted config  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get label refactor working  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.6 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move determineNextVersion to core  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- move git clean check to core  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.5 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.4 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- change getPreviousVersion hook args. can access prefixRelease from root class instead  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.3 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- implment dry-run flag for next command  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.2 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix test  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- shipit: add flag to only publish to 'latest' tag when "release" label is present  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.1 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- allow user to configure what branches are treated as prerelease branches  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v8.0.0-next.0 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove prerelease label when released  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove old use of prerelease label + add prerelease label to released plugin  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.1 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v7.17.0-next.0 [skip ci]  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- must set git user before publishing so we know we can commit  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- call next from shipit on next branch  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- get next branch release working  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))