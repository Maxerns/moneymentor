import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../../.expo/types/types";
import {
  TRUELAYER_CLIENT_ID,
  TRUELAYER_CLIENT_SECRET,
  TRUELAYER_REDIRECT_URI,
} from "@env";

export default function LinkBankScreen() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 20,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
    },
    buttonText: {
      color: theme.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    bankList: {
      width: "100%",
      marginTop: 20,
    },
    bankItem: {
      backgroundColor: theme.surface,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
    },
  });

  const handleBankLink = async () => {
    setLoading(true);
    try {
      const authUrl = `https://auth.truelayer.com/?response_type=code&client_id=${TRUELAYER_CLIENT_ID}&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=${TRUELAYER_REDIRECT_URI}&providers=uk-ob-all%20uk-oauth-all`;

      await Linking.openURL(authUrl);

      console.log(authUrl);

      // Handle redirect back to app
      Linking.addEventListener("url", handleRedirect);
    } catch (error) {
      console.error("Error linking bank:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = async ({ url }: { url: string }) => {
    const code = url.split("code=")[1];

    if (code) {
      try {
        const tokenResponse = await fetch(
          "https://auth.truelayer.com/connect/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=authorization_code&client_id=${TRUELAYER_CLIENT_ID}&client_secret=${TRUELAYER_CLIENT_SECRET}&code=${code}&redirect_uri=${TRUELAYER_REDIRECT_URI}`,
          }
        );

        const tokenData = await tokenResponse.json();

        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, {
            bankAccessToken: tokenData.access_token,
            bankRefreshToken: tokenData.refresh_token,
          });

          await fetchAccountData(tokenData.access_token);
        }

        navigation.navigate("screens/Dashboard");
      } catch (error) {
        console.error("Error handling redirect:", error);
      }
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleRedirect);

    return () => {
      subscription.remove();
    };
  }, []);

  const fetchAccountData = async (accessToken: string) => {
    try {
      const accountsResponse = await fetch(
        "https://api.truelayer.com/data/v1/accounts",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const accountsData = await accountsResponse.json();

      if (auth.currentUser && accountsData.results?.length > 0) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          bankAccounts: accountsData.results,
        });
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Link Your Bank Account</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleBankLink}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.surface} />
        ) : (
          <Text style={styles.buttonText}>Connect Bank Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
