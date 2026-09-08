// Helpers for reading FastAPI's 422 validation bodies.
//
// The shape is { detail: [{ type, loc, msg, ctx }] }, where `loc` names the
// offending field (e.g. ["body", "new_password"]). Reading it lets the UI point
// at the real problem instead of guessing — a rejected password and a spent
// token both arrive as a 422 on some endpoints.

interface ValidationIssue {
  type?: string;
  loc?: (string | number)[];
  msg?: string;
  ctx?: Record<string, unknown>;
}

const getIssues = (error: unknown): ValidationIssue[] => {
  const detail = (error as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return Array.isArray(detail) ? (detail as ValidationIssue[]) : [];
};

export const getStatus = (error: unknown): number | undefined =>
  (error as { response?: { status?: number } })?.response?.status;

/** True when a 422 names the given field as the thing that failed. */
export const hasFieldError = (error: unknown, field: string): boolean =>
  getIssues(error).some((issue) => issue.loc?.includes(field));

/**
 * A readable message for the first issue on `field`, or undefined if the error
 * isn't about that field. Pydantic's own wording ("String should have at least
 * 8 characters") leaks implementation detail, so the common length rules get
 * friendlier copy built from the server's own numbers — no rule is hardcoded,
 * so this stays correct if the backend changes its limits.
 */
export const getFieldMessage = (error: unknown, field: string): string | undefined => {
  const issue = getIssues(error).find((i) => i.loc?.includes(field));
  if (!issue) return undefined;

  const min = issue.ctx?.min_length;
  const max = issue.ctx?.max_length;

  if (issue.type === "string_too_short" && typeof min === "number") {
    return `Must be at least ${min} characters.`;
  }
  if (issue.type === "string_too_long" && typeof max === "number") {
    return `Must be ${max} characters or fewer.`;
  }
  return issue.msg;
};
