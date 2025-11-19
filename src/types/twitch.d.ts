export interface AppAccessToken {
  accessToken: string;
  expirationDate: Date;
  tokenType: string;
}

export interface TwitchAppAccessToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface MutedSegment {
  duration: number;
  offset: number;
}

export interface Video {
  id: string;
  stream_id: string | null;
  user_id: string;
  user_login: string;
  user_name: string;
  title: string;
  description: string;
  created_at: string;
  published_at: string;
  url: string;
  thumbnail_url: string;
  viewable: string;
  view_count: number;
  language: string;
  type: "archive" | "highlight" | "upload";
  duration: string;
  muted_segments: MutedSegment[] | null;
}

export interface Pagination {
  cursor?: string;
}

export interface TwitchVideos {
  data: Video[];
  pagination: Pagination;
}

export interface TwitchError {
  error?: string,
  status?: number,
  message?: string,
}