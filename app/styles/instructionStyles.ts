import { StyleSheet, Platform, PixelRatio } from 'react-native';

// Helper function to handle responsive font sizes
const webFontSize = (size: number) => Platform.OS === 'web' ? size * 1.25 : size;

export const instructionStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: Platform.OS === 'web' ? '5%' : 16,
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    paddingBottom: 80,
    maxWidth: Platform.OS === 'web' ? '100%' : undefined,
    alignSelf: 'stretch',
  },
  title: {
    fontSize: webFontSize(24),
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: webFontSize(20),
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 16,
  },
  // Measurement item styles
  measurementItem: {
    marginBottom: 24,
    paddingHorizontal: 4,
    width: '100%',
    alignSelf: 'stretch',
  },
  measurementTitle: {
    fontSize: webFontSize(17),
    fontWeight: '600',
    marginBottom: 6,
  },
  measurementDescription: {
    fontSize: webFontSize(15),
    lineHeight: Platform.OS === 'web' ? 26 : 22,
  },
  // Instruction item styles
  instructionsContainer: {
    width: '100%',
    marginBottom: 16,
    alignSelf: 'auto',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
    width: '100%',
    justifyContent: 'flex-start',
  },
  numberContainer: {
    width: 16, // Reduced width for smaller gap
    alignItems: 'flex-start', // Left align for bullet points
    justifyContent: 'flex-start',
    paddingRight: 0,
  },
  instructionContent: {
    width: '90%',
    flex: 1,
    paddingTop: 0,
    paddingLeft: 4, // Reduced padding for smaller gap
  },
  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0, // Removed margin since we have padding in the container
    marginTop: 3,
    padding: 0,
    backgroundColor: 'transparent', // Remove green background
    borderWidth: Platform.OS === 'ios' ? (1/PixelRatio.get()) : 2, // Thinner border on iOS for consistency
    borderColor: '#000', // Black border instead
    overflow: 'hidden',
    minWidth: 10, // Ensure consistent width
    maxWidth: 20, // Fixed width to ensure consistency
    aspectRatio: 1, // Force perfect circle
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginLeft: 4,
  },
  numberText: {
    color: '#000', // Black text for contrast
    fontWeight: '700',
    fontSize: Platform.OS === 'ios' ? 18 : 16, // Slightly larger on iOS
    textAlign: 'center',
    textAlignVertical: 'center', // Center text vertically (Android)
    includeFontPadding: false, // Removes extra padding in Android
    width: 36, // Fixed width to prevent different digit widths affecting layout
    ...(Platform.OS === 'ios' ? {
      lineHeight: 36, // Match circle height on iOS
    } : {}),
  },
  instructionTitle: {
    fontSize: webFontSize(16),
    fontWeight: '600',
    marginBottom: 3,
  },
  instructionDetail: {
    fontSize: webFontSize(14),
    lineHeight: Platform.OS === 'web' ? 24 : 20,
    opacity: 0.8,
  },
  // Image and diagram styles
  imageContainer: {
    width: '100%',
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  imageCaption: {
    fontSize: webFontSize(16),
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionImage: {
    width: '100%',
    height: Platform.OS === 'web' ? 220 : 180,
    borderRadius: 8,
    maxWidth: 600, // Limit width on larger screens
  },
  imageTip: {
    fontSize: webFontSize(14),
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: webFontSize(16),
    opacity: 0.6,
  },
  // Note container styles
  noteContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(255, 230, 0, 0.1)',
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    alignSelf: 'stretch',
  },
  noteTitle: {
    fontSize: webFontSize(17),
    fontWeight: '700',
    marginBottom: 8,
    color: '#D4A400',
  },
  noteText: {
    fontSize: webFontSize(15),
    lineHeight: Platform.OS === 'web' ? 26 : 22,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '700',
  },
  // Button container styles
  buttonContainer: {
    marginTop: 60, 
    marginBottom: 20, 
    alignItems: 'center',
    width: '100%',
  },
  buttonWrapper: {
    width: 'auto',
    maxWidth: 220, // Reduced max width
    minWidth: 180, // Reduced min width
    alignSelf: 'center', // Center the button wrapper
  },
});
