const COMMON = [
  "password", "password1", "password123", "passw0rd", "123456", "12345678", "123456789",
  "qwerty", "qwerty123", "letmein", "welcome", "iloveyou", "admin", "abc123", "111111",
  "monkey", "dragon", "football",
];

export const MIN_LENGTH = 8;

export const isCommon = (value: string) => COMMON.includes(value.trim().toLowerCase());

// The forced mix of character types that good rules do NOT ask for.
export const hasForcedMix = (value: string) =>
  /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);

export const COMMON_REASON =
  "That password is on lists of the most common ones, so it is easy to guess. Choose another.";
