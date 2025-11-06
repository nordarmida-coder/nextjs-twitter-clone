import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const filePath = path.join(process.cwd(), "data", "tweets.json");

async function readTweets() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeTweets(tweets) {
  await fs.writeFile(filePath, JSON.stringify(tweets, null, 2), "utf8");
}


export async function GET() {
  const tweets = await readTweets();
  return NextResponse.json(tweets);
}


export async function POST(req) {
  const { title, body } = await req.json();
  if (!body)
    return NextResponse.json({ error: "Body is required" }, { status: 400 });

  const tweets = await readTweets();

  const newTweet = {
    id: Date.now().toString(), 
    title: title || "New Tweet",
    body,
    reactions: { likes: 0, dislikes: 0 },
    tags: ["local"],
  };

  tweets.unshift(newTweet);
  await writeTweets(tweets);

  return NextResponse.json(newTweet, { status: 201 });
}