import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "~/libraries/mongoose.library";
import { Playlist } from "~/models/Playlist.model";

import { DEFAULT_CARD_COLOR } from "~/config/common.config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === "GET") {
    const playlist = await getPlaylist(id as string);
    res.status(200).send({ data: playlist });
  } else if (req.method === "DELETE") {
    await deletePlaylist(id as string);
    res.status(200).send({ data: null });
  }
}

async function getPlaylist(id: string) {
  const result = await Playlist.findById(id);
  if (!result) return null;
  const playlist = result.toObject();
  return {
    id: playlist.id.toString(),
    color: playlist.color || DEFAULT_CARD_COLOR,
    name: playlist.name,
    owner: playlist.owner,
    slug: playlist.slug,
    spotifyId: playlist.spotifyId,
    upvote: playlist.upvote,
  };
}

async function deletePlaylist(id: string) {
  await Playlist.findByIdAndDelete(id);
}
