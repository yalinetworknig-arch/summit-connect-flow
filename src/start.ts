import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Startup check: fail fast (and log clearly) if required Supabase server
// env vars are missing, instead of crashing the first server function call.
const REQUIRED_SUPABASE_ENV = [
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

const missingSupabaseEnv = REQUIRED_SUPABASE_ENV.filter(
  (name) => !process.env[name],
);

if (missingSupabaseEnv.length > 0) {
  const message =
    `[Startup] Missing Supabase environment variable(s): ${missingSupabaseEnv.join(", ")}. ` +
    `Add these to your Vercel Environment Variables (Project Settings → Environment Variables), then redeploy.`;
  console.error("\n" + "=".repeat(80) + "\n" + message + "\n" + "=".repeat(80) + "\n");
}

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    const friendly =
      missingSupabaseEnv.length > 0
        ? `Server is missing required environment variables: ${missingSupabaseEnv.join(", ")}. ` +
          `Add these to your Vercel Environment Variables (Project Settings → Environment Variables), then redeploy.`
        : undefined;
    return new Response(renderErrorPage(), {
      status: 500,
      headers: {
        "content-type": "text/html; charset=utf-8",
        ...(friendly ? { "x-startup-error": friendly } : {}),
      },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
