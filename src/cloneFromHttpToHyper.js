const got = require("got");

module.exports = async function cloneFromHttpToHyper(drive, url, path) {
  const writeStream = drive.createWriteStream(path);

  await new Promise((done, fail) => {
    got.stream(url).pipe(writeStream).on("error", fail);
    writeStream.on("finish", done);
    writeStream.on("error", fail);
  });
};
