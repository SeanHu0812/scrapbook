import { NextRequest, NextResponse } from "next/server";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    images: Array<{ url: string; width: number; height: number }>;
  };
  preview_url: string | null;
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

async function getSpotifyToken(clientId: string, clientSecret: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Failed to get Spotify token");
  const data = (await res.json()) as SpotifyTokenResponse;
  return data.access_token;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ tracks: [], error: "missing_query" }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ tracks: [], error: "not_configured" });
  }

  try {
    const token = await getSpotifyToken(clientId, clientSecret);

    const searchRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=6`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!searchRes.ok) {
      return NextResponse.json({ tracks: [], error: "spotify_error" }, { status: 502 });
    }

    const data = (await searchRes.json()) as SpotifySearchResponse;

    const tracks = data.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name ?? "",
      albumArt: track.album.images[0]?.url ?? null,
      previewUrl: track.preview_url ?? null,
    }));

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [], error: "internal_error" }, { status: 500 });
  }
}
