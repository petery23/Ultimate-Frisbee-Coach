// app/index.tsx
import { StyleSheet, View, Image, useColorScheme } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "./components/ThemedView";
import { ThemedText } from "./components/ThemedText";
import { useThemeColor } from "./hooks/useThemeColor";
import PrimaryButton from "../components/PrimaryButton";

export default function Index() {
  const colorScheme = useColorScheme();
  const buttonBgColor = useThemeColor({}, 'accent');
  const buttonTextColor = useThemeColor({}, 'background');
  
  return (
    <ThemedView variant="container" style={styles.container}>
      <ThemedView
        style={styles.logoContainer}
        variant="card"
      >
        {/* Try using a different logo image */}
        <Image 
          source={require('../assets/images/ultimate_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </ThemedView>
      <ThemedText type="title">Ultimate Frisbee Coach</ThemedText>
      <ThemedText type="caption">Record a 4s side‑view throw to analyze.</ThemedText>

      <View style={styles.buttonContainer}>
        <PrimaryButton 
          label="Record a throw" 
          onPress={() => router.push("/instructions")}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <PrimaryButton 
          label="View previous throws" 
          onPress={() => router.push("/throws" as any)}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 12 },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderRadius: 50, // Make it circular
    overflow: 'hidden',
    // No background color - the ThemedView will handle this
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logo: { 
    width: 80, 
    height: 80,
    // No tint color - show the logo as is
  },
  buttonContainer: {
    marginTop: 8,
    width: 'auto',
    maxWidth: 220,
    alignSelf: 'center',
  },
});
