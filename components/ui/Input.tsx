import React, { useState } from 'react';
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

export default function Input({
  label,
  value,
  placeholder,
  onChangeText,
  icon,
  editable = true,
  keyboardType,
  secureTextEntry,
  multiline,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrap,
        focused && styles.inputWrapFocused,
        !editable && styles.inputWrapDisabled,
      ]}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          placeholderTextColor={colors.gray300}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            multiline && { minHeight: 80, textAlignVertical: 'top' },
            !editable && { color: colors.gray500 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.bodySemiBold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.gray500,
    marginBottom: 7,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapFocused: {
    borderColor: colors.teal,
    backgroundColor: colors.white,
  },
  inputWrapDisabled: {
    opacity: 0.65,
  },
  icon: {
    fontSize: 15,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    fontFamily: fonts.body,
    color: colors.night,
    padding: 0,
  },
});
