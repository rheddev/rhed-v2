import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "drizzle-orm";
import { appAccessTokens } from "@/db/schema";
import { db } from "@/lib/db";
import type { Fetcher } from "@/types";
import type {
  AppAccessToken,
  TwitchAppAccessToken,
  TwitchError,
  TwitchVideos,
  Video,
} from "@/types/twitch";

const S_TO_MS = 1000;
const RHEDDEV_USER_ID = "1216055197";

// EventSub Types
export const EVENTSUB_TYPES = {
  CHANNEL: {
    CHAT: {
      CLEAR: { type: "channel.chat.clear", version: "1" },
      CLEAR_USER_MESSAGES: {
        type: "channel.chat.clear_user_messages",
        version: "1",
      },
      MESSAGE: { type: "channel.chat.message", version: "1" },
      MESSAGE_DELETE: { type: "channel.chat.message_delete", version: "1" },
      NOTIFICATION: { type: "channel.chat.notification", version: "1" },
      USER_MESSAGE_HOLD: {
        type: "channel.chat.user_message_hold",
        version: "1",
      },
      USER_MESSAGE_UPDATE: {
        type: "channel.chat.user_message_update",
        version: "1",
      },
    },
    CHAT_SETTINGS: {
      UPDATE: { type: "channel.chat_settings.update", version: "1" },
    },
    FOLLOW: { type: "channel.follow", version: "2" },
    SUBSCRIBE: { type: "channel.subscribe", version: "1" },
    SUBSCRIPTION: {
      END: { type: "channel.subscription.end", version: "1" },
      GIFT: { type: "channel.subscription.gift", version: "1" },
      MESSAGE: { type: "channel.subscription.message", version: "1" },
    },
  },
} as const;

function secondsToDate(token: TwitchAppAccessToken): AppAccessToken {
  return {
    accessToken: token.access_token,
    expirationDate: new Date(Date.now() + token.expires_in * S_TO_MS),
    tokenType: token.token_type,
  };
}

const buildUrl = (baseUrl: string, params?: Record<string, string>) => {
  const url = new URL(baseUrl);
  const searchParams = new URLSearchParams(params);
  searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
};

const createAccessToken: Fetcher<AppAccessToken> = createServerFn().handler(
  async () => {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing client ID or secret");
    }

    const url = buildUrl("https://id.twitch.tv/oauth2/token", {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    });

    const twitchToken = await fetch(url, {
      method: "POST",
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorBody = (await response.json()) as TwitchError;
          throw new Error(
            `Twitch API error (${errorBody.status || response.status}): ${errorBody.message || errorBody.error || response.statusText}`
          );
        }
        return (await response.json()) as TwitchAppAccessToken;
      })
      .catch((error) => {
        throw error;
      });
    const token: AppAccessToken = secondsToDate(twitchToken);

    // Add to database
    await db
      .insert(appAccessTokens)
      .values(token)
      .catch((error) => {
        throw error;
      });

    return token;
  }
);

const fetchAppAccessToken: Fetcher<AppAccessToken | null> =
  createServerFn().handler(async () => {
    const tokens = await db
      .select()
      .from(appAccessTokens)
      .orderBy(sql`${appAccessTokens.expirationDate} desc`)
      .limit(1)
      .catch((error) => {
        throw error;
      });

    if (tokens.length <= 0) {
      return await createAccessToken();
    }

    const token: AppAccessToken = tokens[0];
    const now = new Date();

    if (token.expirationDate <= now) {
      // Create a new token, and return that
      return await createAccessToken();
    }

    return token;
  });

const fetchVideos: Fetcher<Video[]> = createServerFn().handler(async () => {
  const url = buildUrl("https://api.twitch.tv/helix/videos", {
    user_id: RHEDDEV_USER_ID,
    first: "3",
  });

  const clientId = process.env.TWITCH_CLIENT_ID;

  if (!clientId) {
    console.error("Missing Twitch client ID");
    return null;
  }

  const appAccessToken: AppAccessToken = await fetchAppAccessToken();

  if (!appAccessToken) {
    throw new Error("Failed to get app access token");
  }

  const videos = await fetch(url, {
    headers: {
      Authorization: `Bearer ${appAccessToken.accessToken}`,
      "Client-Id": clientId,
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorBody = (await response.json()) as TwitchError;
        throw new Error(
          `Twitch API error (${errorBody.status || response.status}): ${errorBody.message || errorBody.error || response.statusText}`
        );
      }
      return (await response.json()) as TwitchVideos;
    })
    .catch((error) => {
      throw error;
    });

  return videos.data;
});

export const twitchVideosQueryOptions = () =>
  queryOptions({
    queryKey: ["twitch", "videos"],
    queryFn: () => fetchVideos(),
  });