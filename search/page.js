import Link from "next/link";
import { headers } from "next/headers";

async function getOrigin() {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return `${proto}://${host}`;
}

async function getLocalTweets() {
  const origin = await getOrigin();
  const res = await fetch(`${origin}/api/tweets`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getDummyTweets() {
  const res = await fetch("https://dummyjson.com/posts", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  const posts = Array.isArray(data?.posts) ? data.posts : [];
  return posts.map((d) => ({
    ...d,
    reactions:
      typeof d.reactions === "number"
        ? { likes: d.reactions, dislikes: 0 }
        : {
            likes: d.reactions?.likes ?? 0,
            dislikes: d.reactions?.dislikes ?? 0,
          },
  }));
}

export default async function SearchPage({ searchParams }) {
  const tag = (searchParams?.tag || "").toString().trim();
  const [local, dummy] = await Promise.all([getLocalTweets(), getDummyTweets()]);
  const all = [...local, ...dummy];

  const filtered = tag
    ? all.filter((t) =>
        Array.isArray(t.tags) &&
        t.tags.some((tg) => tg.toLowerCase() === tag.toLowerCase())
      )
    : all;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">
        {tag ? `#${tag}` : "Search by hashtag"}
      </h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          {tag ? "No tweets found for this hashtag." : "Pass ?tag=yourTag in the URL or click a hashtag."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tweet) => (
            <Link key={tweet.id} href={`/tweet/${tweet.id}`}>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-[#0f172a] shadow-sm hover:shadow-md transition">
                <h3 className="text-lg font-semibold mb-2 text-sky-700 dark:text-sky-300">
                  {tweet.title || "Tweet"}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                  {tweet.body}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Array.isArray(tweet.tags) &&
                    tweet.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs bg-sky-100 dark:bg-gray-800 text-sky-600 dark:text-sky-400 px-2 py-1 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}