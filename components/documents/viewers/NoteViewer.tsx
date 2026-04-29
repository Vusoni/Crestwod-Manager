import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { GlassCard } from '../../glass/GlassCard';

interface Props {
  initial: string;
  editable: boolean;
  onSave: (content: string) => Promise<void> | void;
}

export function NoteViewer({ initial, editable, onSave }: Props) {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initial);

  const submit = async () => {
    await onSave(draft);
    setEditing(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <GlassCard padding="xl" radius="xl">
        {editing ? (
          <TextInput
            value={draft}
            onChangeText={setDraft}
            multiline
            autoFocus
            selectionColor={theme.colors.accent}
            style={[
              theme.typography.body,
              {
                color: theme.colors.text,
                minHeight: 220,
                textAlignVertical: 'top',
              },
            ]}
          />
        ) : (
          <Text style={[theme.typography.body, { color: theme.colors.text, lineHeight: 24 }]}>
            {initial}
          </Text>
        )}
        {editable ? (
          <View style={styles.actions}>
            {editing ? (
              <>
                <Pressable
                  onPress={() => {
                    setDraft(initial);
                    setEditing(false);
                  }}
                  style={[
                    styles.btn,
                    { borderColor: theme.colors.glassBorder, borderRadius: theme.radii.md },
                  ]}
                >
                  <Text style={[theme.typography.bodySmall, { color: theme.colors.textMuted, fontWeight: '600' }]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={submit}
                  style={[
                    styles.btn,
                    { backgroundColor: theme.colors.accent, borderRadius: theme.radii.md },
                  ]}
                >
                  <Text style={[theme.typography.bodySmall, { color: theme.colors.bg, fontWeight: '700' }]}>
                    Save
                  </Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={() => setEditing(true)}
                style={[
                  styles.btn,
                  { borderColor: theme.colors.glassBorderStrong, borderRadius: theme.radii.md },
                ]}
              >
                <Ionicons name="create-outline" size={16} color={theme.colors.text} />
                <Text style={[theme.typography.bodySmall, { color: theme.colors.text, fontWeight: '600' }]}>
                  Edit note
                </Text>
              </Pressable>
            )}
          </View>
        ) : null}
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 60,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
