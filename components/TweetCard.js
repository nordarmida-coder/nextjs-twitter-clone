"use client";
import Link from "next/link";

export default function TweetCard({ tweet, onReact }) {
  const likes = tweet.reactions?.likes ?? 0;
  const dislikes = tweet.reactions?.dislikes ?? 0;

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-[#1e3a8a] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <Link href={`/tweet/${tweet.id}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-[#a8c8ff] mb-2">
          {tweet.title || "Tweet"}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {tweet.body}
        </p>
      </Link>

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => onReact?.(tweet, "like")}
            className="hover:text-blue-600 dark:hover:text-[#60a5fa] transition"
            type="button"
          >
            👍 {likes}
          </button>
          <button
            onClick={() => onReact?.(tweet, "dislike")}
            className="hover:text-red-500 transition"
            type="button"
          >
            👎 {dislikes}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {Array.isArray(tweet.tags) &&
            tweet.tags.map((tag, i) => (
              <Link
                key={i}
                href={`/search?tag=${encodeURIComponent(tag)}`}
                className="text-blue-600 dark:text-[#60a5fa] hover:underline bg-blue-50 dark:bg-[#1e3a8a]/30 px-2 py-1 rounded-full text-xs font-medium transition"
              >
                #{tag}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}