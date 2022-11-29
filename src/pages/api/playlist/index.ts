import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "~/libraries/mongoose.library";
import { Playlist } from "~/models/Playlist.model";

import { DEFAULT_CARD_COLOR } from "~/config/common.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await dbConnect();

  if (req.method === "GET") {
    const playlists = await getPlaylists();
    res.status(200).send({ data: playlists });
  } else if (req.method === "POST") {
    await createPlaylist(req.body);
    const playlists = await getPlaylists();
    res.status(201).send({ data: playlists[playlists.length - 1] });
  }
}

async function getPlaylists() {
  const result = await Playlist.find();
  return result.map((doc) => {
    const playlist = doc.toObject();
    return {
      id: playlist._id.toString(),
      color: playlist.color || DEFAULT_CARD_COLOR,
      name: playlist.name,
      owner: playlist.owner,
      slug: playlist.slug,
      spotifyId: playlist.spotifyId,
      upvote: playlist.upvote,
    };
  });
}

async function createPlaylist(obj: unknown) {
  await Playlist.create(obj);
}
