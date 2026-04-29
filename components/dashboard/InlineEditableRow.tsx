import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { formatCurrency } from '@/lib/format';
import type { Currency } from '@/types/netWorth';

interface Props {
  label: string;
  value: number;
  currency: Currency;
  onCommit: (value: number) => Promise<void> | void;
  readonly?: boolean;
}

export function InlineEditableRow({
  label,
  value,
  currency,
  onCommit,
  readonly = false,
}: Props) {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));

  const handleSubmit = async () => {
    const cleaned = draft.replace(/[^0-9.]/g, '');
    const parsed = Number.parseFloat(cleaned);
    if (Number.isFinite(parsed) && parsed !== value) {
      await onCommit(parsed);
    }
    setEditing(false);
  };

  return (
    <Pressable
      onPress={() => {
        if (readonly) return;
        setDraft(String(value));
        setEditing(true);
      }}
      style={styles.row}
    >
      <Text
        style={[theme.typography.bodySmall, { color: theme.colors.textMuted }]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {editing ? (
        <TextInput
          autoFocus
          keyboardType="decimal-pad"
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleSubmit}
          onBlur={handleSubmit}
          selectionColor={theme.colors.accent}
          style={[
            theme.typography.body,
            styles.input,
            {
              color: theme.colors.text,
              backgroundColor: theme.colors.glassTint,
              borderRadius: theme.radii.sm,
            },
          ]}
        />
      ) : (
        <Text style={[theme.typography.body, { color: theme.colors.text, fontWeight: '700' }]}>
          {formatCurrency(value, currency, { compact: value >= 10_000 })}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  input: {
    minWidth: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'right',
  },
});
