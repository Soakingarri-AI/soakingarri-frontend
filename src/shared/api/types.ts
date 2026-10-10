// Response shapes every feature can meet, independent of any one endpoint.

// What /auth/refresh returns: a bare rotated pair.
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MessageResponse {
  message: string;
}

export interface ApiError {
  detail: Array<{
    loc: (string | number)[];
    msg: string;
    type: string;
    input: string;
    ctx: Record<string, any>;
  }>;
}
