export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const bufferTime = 60 * 1000;
    return currentTime >= expirationTime - bufferTime;
  } catch (error) {
    return true;
  }
}

export function getTokenExpirationTime(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
  } catch (error) {
    return null;
  }
}
