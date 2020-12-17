const R = require("ramda");
const hyperdrive = require("hyperdrive");
const { Client: HyperspaceClient } = require("hyperspace");
const getPodcastFeed = require("@little-bonsai/get-podcast-feed");

const syncDriveInfo = require("./syncDriveInfo");
const syncThumb = require("./syncThumb");
const syncEpisodes = require("./syncEpisodes");

async function run(drive, rss) {
  const feed = require("../tempData.json");
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

  try {
    const client = new HyperspaceClient();
    const drive = hyperdrive(client.corestore(), key);

    await new Promise((x) => drive.on("ready", x));

    console.log(`Synching ${rss} to\nhyper://${drive.key.toString("hex")}\n`);
    console.warn("Please only use this tool to host podcasts that *YOU OWN*\n");

    try {
      await run(drive, rss);
    } catch (e) {
      console.error(e);
    }

    await new Promise((x) => drive.close(x));
    await new Promise((x) => client.close(x));
  } catch (e) {
    console.error("I don't think the hyperspace daemon is running");
  }

  console.log("DONE");
})();
