import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radius, fonts, fontSize } from '@/lib/theme';

interface InputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  icon?: string;
  editable?: boolean;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  secureTextEntry?: boolean;
  multiline?: boolean;
}

export default function Input({ label, value, placeholder, onChangeText, icon, editable = true, keyboardType, secureTextEntry, multiline }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrap}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          placeholderTextColor={colors.gray400}
          style={[styles.input, multiline && { minHeight: 80, textAlignVertical: 'top' }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: fontSize.xs + 1,
    fontFamily: fonts.bodySemiBold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.gray400,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  icon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    color: colors.night,
  },
});
