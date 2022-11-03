# Partnercalc

 A tool for analyzing Dance Partner damage contribution in FFXIV, now with 100% more TypeScript.

**This repository is a work in progress!** If you're looking for the original Partnercalc, [click here](https://partnercalc.herokuapp.com/).

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
