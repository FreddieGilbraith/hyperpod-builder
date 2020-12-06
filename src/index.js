const R = require("ramda");
const hyperdrive = require("hyperdrive");
const { Client: HyperspaceClient } = require("hyperspace");
const getPodcastFeed = require("@little-bonsai/get-podcast-feed");

const syncDriveInfo = require("./syncDriveInfo");
const syncThumb = require("./syncThumb");
const syncEpisodes = require("./syncEpisodes");

const tempData = require("../tempData.json");

async function run(drive, rss) {
  const feed = tempData;
  //const feed = await getPodcastFeed(rss);

  await syncDriveInfo(drive, feed);
  await syncThumb(drive, feed);
  await syncEpisodes(drive, feed);
}

(async function main() {
  const key = process.argv[3]
    ? Buffer.from(process.argv[3].replace("hyper://", ""), "hex")
    : undefined;

  const rss = process.argv[2];
  const client = new HyperspaceClient();
  const drive = hyperdrive(client.corestore(), key);

  await new Promise((x) => drive.on("ready", x));

  console.log(`synching ${rss} to hyper://${drive.key.toString("hex")}`);

  try {
    await run(drive, rss);
  } catch (e) {
    console.error(e);
  }

  await new Promise((x) => drive.close(x));
  await new Promise((x) => client.close(x));

  console.log("DONE");
})();
