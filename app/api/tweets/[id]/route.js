import { NextResponse } from "next/server";
import fs from "node:fs/promises";

const FILE_PATH = "./data/tweets.json";

async function readTweets() {
  try {
    const data = await fs.readFile(FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeTweets(tweets) {
  await fs.writeFile(FILE_PATH, JSON.stringify(tweets, null, 2), "utf8");
}


export async function GET(_req, context) {
  const { id } = await context.params;
  const tweets = await readTweets();
  const tweet = tweets.find((t) => String(t.id) === String(id));
  if (!tweet) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }
  return NextResponse.json(tweet);
}


export async function PATCH(req, context) {
  const { id } = await context.params;
  const tweets = await readTweets();
  const index = tweets.findIndex((t) => String(t.id) === String(id));
  if (index === -1) {
    return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
  }

  const { action } = await req.json();
  const tweet = tweets[index];
  tweet.reactions = tweet.reactions || { likes: 0, dislikes: 0 };

  if (action === "like") tweet.reactions.likes++;
  if (action === "dislike") tweet.reactions.dislikes++;

  tweets[index] = tweet;
  await writeTweets(tweets);

  return NextResponse.json(tweet);
}