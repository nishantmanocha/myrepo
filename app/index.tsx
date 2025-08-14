import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { ensurePermission } from "../utils/permissions";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [permissionsReady, setPermissionsReady] = useState(false);

  useEffect(() => {
    async function requestPermissions() {
      // List of permissions you want
      const perms = ["location", "microphone", "internet"];

      for (let p of perms) {
        try {
          const status = await ensurePermission(p);
          console.log(`${p} status:`, status);
        } catch (err) {
          console.warn(`Error checking permission ${p}:`, err);
        }
      }
      setPermissionsReady(true);
    }

    requestPermissions();
  }, []);

  // Wait until both auth loading and permission checking are done
  if (isLoading || !permissionsReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1a2e",
        }}
      >
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  // Redirect based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
