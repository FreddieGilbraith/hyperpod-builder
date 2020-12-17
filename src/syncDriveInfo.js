const makeAsyncHyperFn = require("./makeAsyncHyperFn");

module.exports = async function syncDriveInfo(drive, feed) {
  console.log("syncDriveInfo");

  const readFile = makeAsyncHyperFn("readFile", drive);
  const writeFile = makeAsyncHyperFn("writeFile", drive);
  let updated = false;

  const indexJSON = await readFile("/index.json", "utf8")
    .catch(() => "{}")
    .then(JSON.parse);

  if (indexJSON.title !== feed.title) {
    updated = true;
    indexJSON.title = feed.title;
  }

  if (indexJSON.description !== feed.subtitle) {
    updated = true;
    indexJSON.description = feed.subtitle;
  }

  if (updated) {
    console.log("syncDriveInfo", "update");
    await writeFile("/index.json", JSON.stringify(indexJSON, null, 4));
  } else {
    console.log("syncDriveInfo", "up to date");
  }
};
