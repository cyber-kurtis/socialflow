declare const Netlify:
  | {
      env: {
        get(name: string): string | undefined;
      };
    }
  | undefined;

export function getEnv(name: string) {
  if (typeof Netlify !== "undefined") {
    return Netlify.env.get(name);
  }

  return process.env[name];
}

export function requireEnv(name: string) {
  const value = getEnv(name);

  if (!value) {
    throw new Error(`${name} ortam değişkeni eksik.`);
  }

  return value;
}
