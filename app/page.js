"use client";

import { useEffect, useState } from "react";
import TweetCard from "../components/TweetCard";
import Link from "next/link";

export default function HomePage() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    async function fetchTweets() {
      try {
        const [apiRes, localRes] = await Promise.all([
          fetch("https://dummyjson.com/posts").then((r) => r.json()),
          fetch("/api/tweets").then((r) => r.json()),
        ]);
        const allTweets = [...(localRes || []), ...(apiRes.posts || [])];
        setTweets(allTweets);
      } catch (err) {
        console.error("Error loading tweets:", err);
      }
    }

    fetchTweets();
  }, []);

  async function handleReact(tweet, action) {
    const isLocal = String(tweet.id).length >= 13;
    const url = isLocal
      ? `/api/tweets/${tweet.id}`
      : `https://dummyjson.com/posts/${tweet.id}`;

    try {
      const res = await fetch(url, {
        method: isLocal ? "PATCH" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        setTweets((prev) =>
          prev.map((t) =>
            t.id === tweet.id
              ? {
                  ...t,
                  reactions: {
                    likes:
                      action === "like"
                        ? (t.reactions?.likes ?? 0) + 1
                        : t.reactions?.likes ?? 0,
                    dislikes:
                      action === "dislike"
                        ? (t.reactions?.dislikes ?? 0) + 1
                        : t.reactions?.dislikes ?? 0,
                  },
                }
              : t
          )
        );
      }
    } catch (error) {
      console.error("Error updating tweet:", error);
    }
  }

  return (
    <main className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {tweets.length > 0 ? (
          tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} onReact={handleReact} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No tweets yet.</p>
        )}
      </div>

      <Link
        href="/tweet/new"
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 text-lg"
      >
        ➕ Add Tweet
      </Link>
    </main>
  );
}