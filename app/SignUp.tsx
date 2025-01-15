import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export type RootStackParamList = {
  Landing: undefined;

  SignUp: undefined;

  Login: undefined;
};

export default function SignUp() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/MoneyMentorLogoGradient.png")}
        style={styles.logo}
      />

      <TouchableOpacity style={styles.socialButton}>
        <Icon name="facebook" size={20} color="#000000" style={styles.icon} />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Icon name="google" size={20} color="#000000" style={styles.icon} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Icon name="apple" size={20} color="#000000" style={styles.icon} />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.emailButton}>
        <Text style={styles.emailText}>Sign up with email</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>Already have an account?</Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 20,
  },
  logo: {
    width: 75,
    height: 75,
    alignItems: "center",
    marginBottom: 100,
  },
  socialButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 20,
    top: 15,
    bottom: 15,
  },
  socialText: {
    fontSize: 16,
    color: "#4F4F4F",
  },
  emailButton: {
    backgroundColor: "#00ADB5",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  divider: {
    alignItems: "center",
    marginTop: 20,
  },
  dividerText: {
    fontSize: 14,
    color: "#828282",
    marginBottom: 10,
  },
  signInButton: {
    backgroundColor: "#B9ECEE",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#00ADB5",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  signInText: {
    fontSize: 16,
    color: "#00c6ff",
    fontWeight: "600",
  },
});
