"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TweetPage({ params }) {
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState(null);

  useEffect(() => {
    async function unwrapParams() {
      const p = await params;
      setId(p.id);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const localRes = await fetch(`/api/tweets/${id}`, { cache: "no-store" });
        if (localRes.ok) {
          const data = await localRes.json();
          setTweet({
            ...data,
            reactions:
              typeof data.reactions === "number"
                ? { likes: data.reactions, dislikes: 0 }
                : {
                    likes: data.reactions?.likes ?? 0,
                    dislikes: data.reactions?.dislikes ?? 0,
                  },
            source: "local",
          });
          return;
        }

        const extRes = await fetch(`https://dummyjson.com/posts/${id}`, { cache: "no-store" });
        if (extRes.ok) {
          const d = await extRes.json();
          setTweet({
            ...d,
            reactions:
              typeof d.reactions === "number"
                ? { likes: d.reactions, dislikes: 0 }
                : {
                    likes: d.reactions?.likes ?? 0,
                    dislikes: d.reactions?.dislikes ?? 0,
                  },
            source: "external",
          });
          return;
        }

        setTweet(null);
      } catch {
        setTweet(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleReact(action) {
    if (!tweet) return;
    if (tweet.source === "local") {
      const res = await fetch(`/api/tweets/${tweet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTweet({
          ...updated,
          reactions:
            typeof updated.reactions === "number"
              ? { likes: updated.reactions, dislikes: 0 }
              : {
                  likes: updated.reactions?.likes ?? 0,
                  dislikes: updated.reactions?.dislikes ?? 0,
                },
          source: "local",
        });
      }
    } else {
      setTweet((prev) => {
        if (!prev) return prev;
        const likes = prev.reactions.likes + (action === "like" ? 1 : 0);
        const dislikes = prev.reactions.dislikes + (action === "dislike" ? 1 : 0);
        return { ...prev, reactions: { likes, dislikes } };
      });
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!tweet)
    return (
      <div className="text-center mt-10">
        <p className="text-gray-600 dark:text-gray-300 mb-4">Tweet not found.</p>
        <Link href="/" className="text-blue-600 dark:text-[#60a5fa] hover:underline">
          ← Back to Home
        </Link>
      </div>
    );

  const likes = tweet.reactions.likes ?? 0;
  const dislikes = tweet.reactions.dislikes ?? 0;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-2xl bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-[#1e3a8a] shadow-md">
      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-[#a8c8ff]">
        {tweet.title || "Tweet"}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        {tweet.body || ""}
      </p>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => handleReact("like")}
            type="button"
            className="hover:text-blue-600 dark:hover:text-[#60a5fa] transition"
          >
            👍 <span className="text-blue-600 dark:text-[#60a5fa]">{likes}</span>
          </button>
          <button
            onClick={() => handleReact("dislike")}
            type="button"
            className="hover:text-red-500 transition"
          >
            👎 <span className="text-red-500">{dislikes}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {Array.isArray(tweet.tags) &&
            tweet.tags.map((tag, i) => (
              <span
                key={i}
                className="text-blue-600 dark:text-[#60a5fa] bg-blue-50 dark:bg-[#1e3a8a]/30 px-2 py-1 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
        </div>
      </div>

      <Link
        href="/"
        className="inline-block mt-8 text-blue-600 dark:text-[#60a5fa] hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}