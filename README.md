# Truffle 开发套件的中文网站

原版网站地址：http://truffleframework.com

This is a [Metalsmith](http://www.metalsmith.io/) project.

Much of the static build process is coded by hand, to reflect the previous build system, Harp.js. All of this is coded in a middleware-like structure in `metalsmith.js`.

## Development

Make sure you have run `npm install` in the root directory to install all dependencies.

To run a local server to view the site (available on `localhost:9000`), in the root directory run:

```
npm run dev
```

To build the site, in the root directory, run:

```
npm run build
```

Running the build step will build the site and place it in the `build/` directory.

## Contributing

We welcome all contributions, typo corrections, and general feedback.

You can find the markdown source code inside the `src/` subdirectory.

For example: 

* For [tutorials](http://truffleframework.com/tutorials) see `src/tutorials`.

* For [docs](http://truffleframework.com/docs) see `src/docs`.

Commits to master (and PRs accepted) will trigger updates to the live site. Thank you!
