import {
  type UseSuspenseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Suspense, useState } from "react";
import { Loading } from "@/components/Loading";
import { twitchVideosQueryOptions } from "@/lib/twitch";
import type { RouteContext } from "@/types";
import type { Video } from "@/types/twitch";

export const Route = createFileRoute("/_sidebar/")({
  component: App,
  loader: async ({ context }: { context: RouteContext }): Promise<void> => {
    await context.queryClient.ensureQueryData(twitchVideosQueryOptions());
  },
});

function Hero() {
  const scrollToStreams = () => {
    document.getElementById("streams")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center px-8 md:px-16 lg:px-24">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="title text-5xl md:text-6xl lg:text-7xl mb-4">
              <span>{"<"}</span>
              <span className="playwrite-us-trad text-[#aa0000] text-shadow-[0_0_1rem_#aa0000]">
                Rhed
              </span>
              <span>{" />"}</span>
            </h1>
            <h4 className="subtitle text-2xl md:text-3xl">
              Coders of the world unite!
            </h4>
          </div>
          <p className="text-md max-w-md">
            Join me as we build for a brighter future. It's time to turn the
            tides in our favor.
          </p>
        </div>
        {/* Livestream */}
        <div className="flex items-center justify-center">
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
            <iframe
              title="Live Stream"
              src="https://player.twitch.tv/?channel=RhedDev&parent=rhed.rhamzthev.com&parent=localhost"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      </div>
      {/* Floating Arrow Button */}
      <button
        type="button"
        onClick={scrollToStreams}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce p-4 rounded-full glass-hover shadow-md transition-all"
        aria-label="Scroll to streams"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>Arrow Button</title>
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </button>
    </div>
  );
}

function Stream({ video }: { video: Video }) {
  const [imageError, setImageError] = useState<boolean>(false);

  // Parse duration from format like "1h2m3s" to readable format
  const formatDuration = (duration: string): string => {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)m/);
    const seconds = duration.match(/(\d+)s/);

    const parts = [];
    if (hours) parts.push(`${hours[1]}h`);
    if (minutes) parts.push(`${minutes[1]}m`);
    if (seconds && !hours) parts.push(`${seconds[1]}s`);

    return parts.join(" ") || "0s";
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get thumbnail URL (replace template variables)
  const thumbnailUrl = video.thumbnail_url
    .replace("%{width}", "480")
    .replace("%{height}", "270");

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block glass-hover shadow-xl rounded-lg overflow-hidden transition-all hover:scale-105 duration-300"
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        {!imageError ? (
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-black" />
        )}
        <div className="absolute bottom-2 right-2 glass px-2 py-1 rounded text-sm">
          {formatDuration(video.duration)}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="subtitle text-lg line-clamp-2 transition-colors">
          {video.title}
        </h3>
        <p className="text-sm">{formatDate(video.created_at)}</p>
      </div>
    </a>
  );
}

function SuspenseStreams() {
  const twitchVideosQuery: UseSuspenseQueryResult<Video[], Error> =
    useSuspenseQuery(twitchVideosQueryOptions());
  const videos = twitchVideosQuery.data;

  return videos ? (
    videos.map((video: Video) => <Stream key={video.id} video={video} />)
  ) : (
    <div className="col-span-full flex items-center justify-center p-8">
      <div className="glass-hover shadow-xl rounded-lg p-8 max-w-md text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="w-12 h-12 text-yellow-500" />
        </div>
        <h3 className="subtitle text-xl">Configuration Error</h3>
        <p className="text-sm opacity-80">
          Please check your environment configuration.
        </p>
      </div>
    </div>
  );
}

function Streams() {
  return (
    <div className="h-full w-full pt-16 pb-32 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="title text-4xl md:text-5xl mb-12">Recent Streams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<Loading />}>
            <SuspenseStreams />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="m-0 p-0">
      {/* Hero */}
      <Hero />
      {/* Recent Streams */}
      <Streams />
    </div>
  );
}
