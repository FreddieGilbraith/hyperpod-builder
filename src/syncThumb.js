const makeAsyncHyperFn = require("./makeAsyncHyperFn");
const cloneFromHttpToHyper = require("./cloneFromHttpToHyper");

module.exports = async function syncThumb(drive, feed) {
  console.log("syncThumb");

  const readFile = makeAsyncHyperFn("readFile", drive);
  const stat = makeAsyncHyperFn("stat", drive);
  const writeFile = makeAsyncHyperFn("writeFile", drive);

  const thumbExists = await stat("/thumb")
    .catch(() => ({ size: 0 }))
    .then((x) => x.size > 0);

  if (!thumbExists) {
    console.log("syncThumb", "create");

    await cloneFromHttpToHyper(drive, feed.image.url, "/thumb");
  } else {
    console.log("syncThumb", "exists");
  }
};
