import React from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { instructionStyles } from '../styles/instructionStyles';

interface MeasurementItemProps {
  title: string;
  description: string;
}

export const MeasurementItem: React.FC<MeasurementItemProps> = ({ title, description }) => {
  return (
    <ThemedView style={instructionStyles.measurementItem}>
      <ThemedText style={instructionStyles.measurementTitle}>{title}</ThemedText>
      <ThemedText style={instructionStyles.measurementDescription}>{description}</ThemedText>
    </ThemedView>
  );
};

interface InstructionItemProps {
  number: string;
  instruction: string;
  detail: string;
}

export const InstructionItem: React.FC<InstructionItemProps> = ({ number, instruction, detail }) => {
  const accentColor = useThemeColor({}, 'accent');
  
  return (
    <ThemedView style={instructionStyles.instructionItem}>
      <ThemedView style={instructionStyles.numberContainer}>
        <ThemedView 
          style={[
            instructionStyles.bulletPoint, 
            { backgroundColor: accentColor }
          ]}
        />
      </ThemedView>
      <ThemedView style={instructionStyles.instructionContent}>
        <ThemedText style={instructionStyles.instructionTitle}>{instruction}</ThemedText>
        <ThemedText style={instructionStyles.instructionDetail}>{detail}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};
