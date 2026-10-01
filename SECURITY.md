# Security policy

pdfcn-vue distributes Vue PDF components through a copy-and-paste registry and provides a Nuxt documentation website. Report vulnerabilities privately so maintainers can investigate and coordinate a fix.

## Supported versions

Security fixes target the latest commit on `main`. There are no long-term support branches. Registry consumers own their installed source files and need to apply fixes to those copies as well as update affected dependencies.

## Reporting a vulnerability

Use [GitHub Security Advisories](https://github.com/xcvzmoon/pdfcn-vue/security/advisories/new) to report a vulnerability privately. Do not include security details in public issues or pull requests.

Include:

- The affected component, block, website feature, or build tool, and its version or commit.
- Reproduction steps or a minimal proof of concept.
- The likely impact and conditions needed to trigger the issue.
- Suggested remediation, if available.

## What to expect

Maintainers aim to acknowledge reports within three business days and provide an initial assessment within five business days. After triage, maintainers will communicate the expected resolution timeline and keep you updated. With your permission, the published advisory will credit your report.

Allow time to investigate and patch the issue before disclosing it publicly. Limit access to or modification of data to what is necessary to demonstrate the vulnerability.

## Scope

Reports may cover:

- Injection or unsafe handling of document data, links, images, or source previews.
- Exposure of secrets or private data through the website or rendering pipeline.
- Registry payloads or build tooling that install or execute unintended code.
- Dependency vulnerabilities with a reproducible exploitation path through this project.

Issues confined to an upstream dependency should be reported upstream. Deployment-specific misconfiguration, traffic-volume denial of service, and social engineering are outside this project's scope.

## Disclosure

Once a fix is available, maintainers will publish a GitHub Security Advisory describing the impact, affected code, and remediation. pdfcn-vue does not offer a paid bug bounty.
