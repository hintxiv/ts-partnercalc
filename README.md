<p align="center"><a href="https://partnercalc.app"><img src="https://raw.githubusercontent.com/hintxiv/ts-partnercalc/main/public/logo.png" height="150" width="130" alt="logo"></a></p>

<h1 align="center">partnercalc</h1>

![Build](https://github.com/hintxiv/ts-partnercalc/actions/workflows/deploy.yml/badge.svg)

A tool for analyzing Dance Partner damage contribution in FFXIV.

## Getting Started

**Requirements**

* [git](https://git-scm.com/)
* [node.js](https://nodejs.org/en/)
* [yarn](https://yarnpkg.com/)

1. Clone the repo:

```bash
> git clone https://github.com/hintxiv/ts-partnercalc.git
> cd ts-partnercalc
```

* If you're interested in contributing, please instead make a fork and track this repo as an upstream remote.

2. Install dependencies:

```bash
> yarn install
```

3. Set environment variables:

* Rename `.env_dev` to `.env`.
* Fill in your FFLogs v1 API key (you can find it on your [profile](https://www.fflogs.com/profile)).

4. Launch the dev server:

```bash
> yarn serve
```

You should now be able to access the site at http://localhost:7000.
