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
    const playlist = await getPlaylist();
    res.status(200).send({ data: playlist });
  } else if (req.method === "POST") {
    await createPlaylist(req.body);
    const playlist = await getPlaylist();
    res.status(201).send({data: playlist[playlist.length-1]});
  }
}

async function getPlaylist() {
  const result = await Playlist.find();
  return result.map((doc) => {
    return {
      id: doc._id,
      color: doc._color || DEFAULT_CARD_COLOR,
      name: doc._name,
      owner: doc._owner,
      slug: doc._slug,
      spotifyId: doc._spotifyId,
      upvote: doc._upvote,
    };
  });
}

async function createPlaylist(obj: unknown) {
  await Playlist.create(obj);
}
