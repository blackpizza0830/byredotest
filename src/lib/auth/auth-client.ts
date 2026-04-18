import type { AuthClient, AuthResult, SignInInput, SignUpInput } from "@/types/auth";
import { getSupabaseClient } from "@/lib/supabase";

function readFullNameFromMetadata(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }
  const fullName = Reflect.get(metadata, "full_name");
  return typeof fullName === "string" && fullName.length > 0 ? fullName : null;
}

class BrowserSupabaseAuthClient implements AuthClient {
  public async signIn(input: SignInInput): Promise<AuthResult> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "Unable to sign in.");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email ?? input.email,
        fullName: readFullNameFromMetadata(data.user.user_metadata) ?? "Member",
      },
      accessToken: data.session?.access_token ?? null,
    };
  }

  public async signUp(input: SignUpInput): Promise<AuthResult> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
        },
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "Unable to create account.");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email ?? input.email,
        fullName: input.fullName,
      },
      accessToken: data.session?.access_token ?? null,
    };
  }

  public async requestPasswordReset(email: string): Promise<void> {
    const supabase = getSupabaseClient();
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      throw new Error(error.message);
    }
  }
}

let cachedClient: AuthClient | null = null;

export function getAuthClient(): AuthClient {
  if (!cachedClient) {
    cachedClient = new BrowserSupabaseAuthClient();
  }
  return cachedClient;
}
