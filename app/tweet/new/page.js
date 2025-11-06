"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTweetPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim() && !title.trim()) return;

    setLoading(true);
    const res = await fetch("/api/tweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body })
    });
    setLoading(false);

    if (res.ok) {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <main className="max-w-lg mx-auto mt-10 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 text-center">
        Create a New Tweet
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's happening?"
          rows={5}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Tweet"}
        </button>
      </form>
    </main>
  );
}