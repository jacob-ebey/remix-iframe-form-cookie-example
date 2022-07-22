import * as RemixServer from "@remix-run/node";

const { commitSession, destroySession, getSession } =
  RemixServer.createCookieSessionStorage({
    cookie: {
      name: "__session",
      secure: process.env.NODE_ENV !== "development",
      secrets: [process.env.ENCRYPTION_KEY!],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 3,
      httpOnly: true,
    },
  });

export { commitSession, destroySession, getSession };
