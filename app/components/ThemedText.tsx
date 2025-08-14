import { StyleSheet, Text, TextProps } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'caption' | 'heading' | 'link' | 'button';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...otherProps
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  
  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'caption' ? styles.caption : undefined,
        type === 'heading' ? styles.heading : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'button' ? styles.button : undefined,
        style,
      ]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  caption: {
    fontSize: 14,
    color: '#666', // This will be overridden by the color prop when used
    marginBottom: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
});
