export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((cookieString) => cookieString.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export function setCookie(name, value, options = {}) {
  if (typeof document === "undefined") return;
  const { path = "/", sameSite = "Lax", maxAge } = options;
  let cookieValue = `${name}=${encodeURIComponent(value)}; path=${path}; sameSite=${sameSite}`;
  if (typeof maxAge === "number") cookieValue += `; max-age=${maxAge}`;
  document.cookie = cookieValue;
}

export function removeCookie(name, options = {}) {
  setCookie(name, "", { ...options, maxAge: 0 });
}
