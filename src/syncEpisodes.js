const makeAsyncHyperFn = require("./makeAsyncHyperFn");
const cloneFromHttpToHyper = require("./cloneFromHttpToHyper");

async function syncEpisode(
  drive,
  {
    duration,
    pubDate,
    title,
    summary,
    slug,
    link,
    artwork,
    description,
    ...episode
  }
) {
  console.log("syncEpisodes", slug);

  const mkdir = makeAsyncHyperFn("mkdir", drive);
  const stat = makeAsyncHyperFn("stat", drive);
  const writeFile = makeAsyncHyperFn("writeFile", drive);

  const folderExists = await stat(`/media/${slug}`)
    .catch(() => false)
    .then(Boolean);

  if (!folderExists) {
    console.log("syncEpisodes", slug, "create");

    console.log("syncEpisodes", slug, "create", `/media/${slug}`);
    await mkdir(`/media/${slug}`);

    console.log(
      "syncEpisodes",
      slug,
      "create",
      `/media/${slug}/description.md`
    );
    await writeFile(`/media/${slug}/description.md`, description);

    console.log("syncEpisodes", slug, "create", `/media/${slug}/info.json`);
    await writeFile(
      `/media/${slug}/info.json`,
      JSON.stringify(
        {
          duration,
          pubDate,
          title,
          summary,
        },
        null,
        4
      )
    );

    console.log("syncEpisodes", slug, "create", `/media/${slug}/thumb`);
    await cloneFromHttpToHyper(drive, artwork, `/media/${slug}/thumb`);

    console.log("syncEpisodes", slug, "create", `/media/${slug}/media.mp3`);
    await cloneFromHttpToHyper(drive, link, `/media/${slug}/media`);
  } else {
    console.log("syncEpisodes", slug, "exists");
  }
}

module.exports = async function syncEpisodes(drive, feed) {
  console.log("syncEpisodes");

  for (const episode of feed.episodes) {
    await syncEpisode(drive, episode);
  }
};
