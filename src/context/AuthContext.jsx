import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export const AuthContext =
  createContext(null);

function getErrorMessage(error) {
  if (!error) {
    return "Something went wrong.";
  }

  return (
    error.message ||
    "Authentication request failed."
  );
}

function AuthProvider({ children }) {
  const [session, setSession] =
    useState(null);

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [authError, setAuthError] =
    useState("");

  const clearAuthError =
    useCallback(() => {
      setAuthError("");
    }, []);

  useEffect(() => {
    let mounted = true;

    async function loadInitialSession() {
      try {
        setLoading(true);

        const {
          data,
          error,
        } =
          await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!mounted) {
          return;
        }

        const currentSession =
          data.session ?? null;

        setSession(currentSession);

        setUser(
          currentSession?.user ?? null
        );
      } catch (error) {
        console.error(
          "Unable to load Supabase session:",
          error
        );

        if (mounted) {
          setSession(null);
          setUser(null);
          setAuthError(
            getErrorMessage(error)
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadInitialSession();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (_event, currentSession) => {
          if (!mounted) {
            return;
          }

          setSession(
            currentSession ?? null
          );

          setUser(
            currentSession?.user ??
              null
          );

          setLoading(false);
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const register = useCallback(
    async ({
      name,
      email,
      password,
    }) => {
      try {
        setAuthError("");

        const cleanName =
          name?.trim() || "";

        const cleanEmail =
          email?.trim().toLowerCase() ||
          "";

        if (!cleanName) {
          throw new Error(
            "Full name is required."
          );
        }

        if (!cleanEmail) {
          throw new Error(
            "Email address is required."
          );
        }

        if (!password) {
          throw new Error(
            "Password is required."
          );
        }

        const {
          data,
          error,
        } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,

            options: {
              data: {
                full_name: cleanName,
              },

              emailRedirectTo:
                `${window.location.origin}/login`,
            },
          });

        if (error) {
          throw error;
        }

        return {
          success: true,
          user:
            data.user ?? null,
          session:
            data.session ?? null,
          requiresEmailConfirmation:
            !data.session,
        };
      } catch (error) {
        const message =
          getErrorMessage(error);

        setAuthError(message);

        return {
          success: false,
          error: message,
        };
      }
    },
    []
  );

  const login = useCallback(
    async ({ email, password }) => {
      try {
        setAuthError("");

        const cleanEmail =
          email?.trim().toLowerCase() ||
          "";

        if (!cleanEmail) {
          throw new Error(
            "Email address is required."
          );
        }

        if (!password) {
          throw new Error(
            "Password is required."
          );
        }

        const {
          data,
          error,
        } =
          await supabase.auth
            .signInWithPassword({
              email: cleanEmail,
              password,
            });

        if (error) {
          throw error;
        }

        return {
          success: true,
          user: data.user,
          session: data.session,
        };
      } catch (error) {
        const message =
          getErrorMessage(error);

        setAuthError(message);

        return {
          success: false,
          error: message,
        };
      }
    },
    []
  );

const logout = useCallback(
  async () => {
    try {
      setAuthError("");

      const { error } =
        await supabase.auth.signOut({
          scope: "local",
        });

      if (error) {
        throw error;
      }

      setSession(null);
      setUser(null);

      return {
        success: true,
      };
    } catch (error) {
      const message =
        getErrorMessage(error);

      setAuthError(message);

      return {
        success: false,
        error: message,
      };
    }
  },
  []
);

  const resetPassword =
    useCallback(async (email) => {
      try {
        setAuthError("");

        const cleanEmail =
          email?.trim().toLowerCase() ||
          "";

        if (!cleanEmail) {
          throw new Error(
            "Email address is required."
          );
        }

        const { error } =
          await supabase.auth
            .resetPasswordForEmail(
              cleanEmail,
              {
                redirectTo:
                  `${window.location.origin}/update-password`,
              }
            );

        if (error) {
          throw error;
        }

        return {
          success: true,
        };
      } catch (error) {
        const message =
          getErrorMessage(error);

        setAuthError(message);

        return {
          success: false,
          error: message,
        };
      }
    }, []);

  const updatePassword =
    useCallback(
      async (newPassword) => {
        try {
          setAuthError("");

          if (!newPassword) {
            throw new Error(
              "New password is required."
            );
          }

          const {
            data,
            error,
          } =
            await supabase.auth
              .updateUser({
                password:
                  newPassword,
              });

          if (error) {
            throw error;
          }

          return {
            success: true,
            user: data.user,
          };
        } catch (error) {
          const message =
            getErrorMessage(error);

          setAuthError(message);

          return {
            success: false,
            error: message,
          };
        }
      },
      []
    );

  const refreshSession =
    useCallback(async () => {
      try {
        const {
          data,
          error,
        } =
          await supabase.auth
            .refreshSession();

        if (error) {
          throw error;
        }

        setSession(
          data.session ?? null
        );

        setUser(
          data.user ?? null
        );

        return {
          success: true,
          session:
            data.session ?? null,
        };
      } catch (error) {
        const message =
          getErrorMessage(error);

        setAuthError(message);

        return {
          success: false,
          error: message,
        };
      }
    }, []);

  const value = useMemo(
  () => ({
    user,
    session,
    loading,
    isAuthenticated:
      Boolean(user && session),

    authError,
    clearAuthError,

    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    refreshSession,
  }),
  [
    user,
    session,
    loading,
    authError,
    clearAuthError,
    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    refreshSession,
  ]
);

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;