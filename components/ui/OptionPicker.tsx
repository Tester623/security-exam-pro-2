// ══════════════════════════════════════════════════════
// Security+ Exam Pro — OptionPicker Component
// Modal bottom-sheet selector (replaces HTML <select>)
// Follows iOS Human Interface Guidelines & Material Design
// ══════════════════════════════════════════════════════

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHaptics } from '@/hooks/useHaptics';

interface Option {
  label: string;
  value: string;
}

interface OptionPickerProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  theme: {
    card: string;
    text: string;
    textSub: string;
    accent: string;
    bg: string;
    border: string;
  };
}

export const OptionPicker: React.FC<OptionPickerProps> = ({
  label,
  options,
  value,
  onChange,
  theme,
}) => {
  const [visible, setVisible] = useState(false);
  const haptics = useHaptics();

  const selectedLabel = options.find((o) => o.value === value)?.label || value;

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: theme.textSub }]}>{label}</Text>
      <Pressable
        onPress={() => {
          haptics.selection();
          setVisible(true);
        }}
        style={[styles.trigger, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <Text style={[styles.triggerText, { color: theme.text }]} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={14} color={theme.textSub} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.sheet, { backgroundColor: theme.card }]}>
            {/* Handle bar */}
            <View style={styles.handleBar}>
              <View style={[styles.handle, { backgroundColor: theme.border }]} />
            </View>

            <Text style={[styles.sheetTitle, { color: theme.text }]}>{label}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    onPress={() => {
                      haptics.light();
                      onChange(item.value);
                      setVisible(false);
                    }}
                    style={[
                      styles.option,
                      isSelected && { backgroundColor: `${theme.accent}15` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: isSelected ? theme.accent : theme.text },
                        isSelected && { fontFamily: 'Outfit-Bold' },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={theme.accent} />
                    )}
                  </Pressable>
                );
              }}
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Outfit-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  triggerText: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    flex: 1,
    marginRight: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    flex: 1,
  },
});
