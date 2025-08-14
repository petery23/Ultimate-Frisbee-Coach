import { Text, Pressable, StyleSheet, Platform } from "react-native";
import { useThemeColor } from "../app/hooks/useThemeColor";

export default function PrimaryButton({ label, onPress, disabled }: { label: string; onPress?: () => void; disabled?: boolean }) {
  const backgroundColor = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'background');
  
  return (
    <Pressable 
      style={[styles.button, { 
        backgroundColor,
        opacity: disabled ? 0.7 : 1 
      }]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 10,
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  label: { 
    fontWeight: "600",
    textAlign: 'center',
    fontSize: 16,
  },
});


