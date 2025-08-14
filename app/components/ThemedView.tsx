import { StyleSheet, View, ViewProps } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'card' | 'container';
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'default',
  ...otherProps
}: ThemedViewProps) {
  // Always call the same hooks in the same order
  const bgColorName = variant === 'card' ? 'cardBackground' : 'background';
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    bgColorName
  );
  const borderColor = useThemeColor({}, 'border');
  
  return (
    <View
      style={[
        { backgroundColor },
        variant === 'default' ? styles.default : undefined,
        variant === 'card' ? [styles.card, { borderColor }] : undefined,
        variant === 'container' ? styles.container : undefined,
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
});
