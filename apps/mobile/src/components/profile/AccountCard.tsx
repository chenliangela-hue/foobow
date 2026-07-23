import { useAuth, useSignIn, useSignUp, useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useI18n } from "../../i18n/LocaleContext";
import { layout, typography } from "../../theme/theme";
import { useThemeColors } from "../../theme/ThemeContext";

type AccountCardProps = {
  seniorMode?: boolean;
};

// Rendered only inside ClerkProvider (App gates on clerkEnabled).
// The instance is username+password based, so the form stays simple and
// quiet: one card, no pressure, guest mode always allowed.
export function AccountCard({ seniorMode }: AccountCardProps) {
  const currentColors = useThemeColors();
  const { t } = useI18n();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { signIn, setActive: setActiveFromSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setActiveFromSignUp, isLoaded: signUpLoaded } = useSignUp();

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const headingColor = { color: currentColors.ink };
  const bodyColor = { color: currentColors.muted };
  const panelTheme = { backgroundColor: currentColors.surface, borderColor: currentColors.gold };

  const submit = async () => {
    if (busy || !username.trim() || !password) return;
    setBusy(true);
    setMessage("");
    try {
      if (mode === "signIn") {
        if (!signInLoaded) return;
        const attempt = await signIn.create({ identifier: username.trim(), password });
        if (attempt.status === "complete") {
          await setActiveFromSignIn({ session: attempt.createdSessionId });
        } else {
          setMessage(t("account.gentleError"));
        }
      } else {
        if (!signUpLoaded) return;
        const attempt = await signUp.create({ username: username.trim(), password });
        if (attempt.status === "complete") {
          await setActiveFromSignUp({ session: attempt.createdSessionId });
        } else {
          setMessage(t("account.gentleError"));
        }
      }
      setPassword("");
    } catch {
      setMessage(t("account.gentleError"));
    } finally {
      setBusy(false);
    }
  };

  if (isSignedIn) {
    return (
      <View style={[styles.card, panelTheme]}>
        <Text style={[styles.eyebrow, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
          {t("account.eyebrow")}
        </Text>
        <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
          {t("account.signedInAs", { name: user?.username ?? "" })}
        </Text>
        <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {t("account.signedInCopy")}
        </Text>
        <Pressable
          accessibilityRole="button"
          style={[styles.secondaryButton, { borderColor: currentColors.line }]}
          onPress={() => signOut()}
        >
          <Text style={[styles.secondaryButtonText, headingColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            {t("account.signOut")}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.card, panelTheme]}>
      <Text style={[styles.eyebrow, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
        {t("account.eyebrow")}
      </Text>
      <Text style={[styles.title, headingColor, seniorMode && { fontSize: typography.sizes.titleSenior }]}>
        {mode === "signIn" ? t("account.signInTitle") : t("account.signUpTitle")}
      </Text>
      <Text style={[styles.body, bodyColor, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
        {t("account.copy")}
      </Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder={t("account.usernamePlaceholder")}
        placeholderTextColor={currentColors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.input, { color: currentColors.ink, borderColor: currentColors.line }]}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={t("account.passwordPlaceholder")}
        placeholderTextColor={currentColors.muted}
        secureTextEntry
        style={[styles.input, { color: currentColors.ink, borderColor: currentColors.line }]}
      />

      {message.length > 0 && (
        <Text style={[styles.body, { color: currentColors.coral }, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
          {message}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        style={[styles.primaryButton, { backgroundColor: currentColors.jade }, busy && styles.busy]}
        onPress={submit}
      >
        {busy ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={[styles.primaryButtonText, seniorMode && { fontSize: typography.sizes.bodySenior }]}>
            {mode === "signIn" ? t("account.signIn") : t("account.signUp")}
          </Text>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setMessage("");
          setMode(mode === "signIn" ? "signUp" : "signIn");
        }}
        style={styles.switchMode}
      >
        <Text style={[styles.switchModeText, { color: currentColors.jade }, seniorMode && { fontSize: typography.sizes.body }]}>
          {mode === "signIn" ? t("account.switchToSignUp") : t("account.switchToSignIn")}
        </Text>
      </Pressable>

      <Text style={[styles.guestNote, bodyColor, seniorMode && { fontSize: typography.sizes.caption }]}>
        {t("account.guestNote")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: layout.spacing.md,
    borderRadius: layout.borderRadius.lg,
    borderWidth: 1.5,
    gap: layout.spacing.sm
  },
  eyebrow: {
    fontSize: typography.sizes.eyebrow,
    textTransform: "uppercase",
    letterSpacing: 0.8
  },
  title: {
    fontSize: typography.sizes.title,
    fontWeight: "700",
    fontFamily: typography.fontFamilySerif
  },
  body: {
    fontSize: typography.sizes.caption,
    lineHeight: 19
  },
  input: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: layout.spacing.sm,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    fontSize: typography.sizes.body
  },
  primaryButton: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadius.full,
    alignItems: "center",
    justifyContent: "center"
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: typography.sizes.body,
    fontWeight: "700"
  },
  busy: {
    opacity: 0.7
  },
  secondaryButton: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  secondaryButtonText: {
    fontSize: typography.sizes.body,
    fontWeight: "600"
  },
  switchMode: {
    minHeight: layout.minTouchTarget,
    justifyContent: "center",
    alignItems: "center"
  },
  switchModeText: {
    fontSize: typography.sizes.caption,
    fontWeight: "600"
  },
  guestNote: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center"
  }
});
