import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useDocuments } from '@/providers/DocumentsProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { GlassPill } from '../glass/GlassPill';
import { DOCUMENT_CATEGORY_LABELS } from '@/types/business';
import type { DocumentCategory, DocumentType } from '@/types/business';

export interface DocumentUploadSheetRef {
  present: () => void;
  dismiss: () => void;
}

interface FileChoice {
  type: DocumentType;
  url?: string;
  size?: number;
  fileName?: string;
}

const CATEGORY_OPTIONS: DocumentCategory[] = [
  'pitch',
  'financial',
  'legal',
  'screenshot',
  'note',
  'other',
];

export const DocumentUploadSheet = forwardRef<DocumentUploadSheetRef>(function DocumentUploadSheet(
  _props,
  ref,
) {
  const theme = useTheme();
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['85%'], []);

  const { businesses } = useNetWorth();
  const { addDocument } = useDocuments();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('pitch');
  const [businessId, setBusinessId] = useState<string | undefined>(businesses[0]?.id);
  const [file, setFile] = useState<FileChoice | null>(null);
  const [notes, setNotes] = useState('');
  const [investorReady, setInvestorReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useImperativeHandle(ref, () => ({
    present: () => {
      setName('');
      setCategory('pitch');
      setBusinessId(businesses[0]?.id);
      setFile(null);
      setNotes('');
      setInvestorReady(false);
      sheetRef.current?.present();
    },
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.6} />
    ),
    [],
  );

  const pickPdf = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (!asset) return;
    setFile({
      type: 'pdf',
      url: asset.uri,
      fileName: asset.name,
      ...(typeof asset.size === 'number' ? { size: asset.size } : {}),
    });
    if (!name) setName(asset.name.replace(/\.pdf$/i, ''));
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow Crestwod Manager to access your photos to attach images.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
    });
    if (res.canceled) return;
    const asset = res.assets[0];
    if (!asset) return;
    setFile({
      type: 'image',
      url: asset.uri,
      fileName: asset.fileName ?? 'Image',
      ...(typeof asset.fileSize === 'number' ? { size: asset.fileSize } : {}),
    });
    if (!name) setName(asset.fileName ?? 'Screenshot');
  };

  const useNote = () => {
    setFile({ type: 'note' });
  };

  const useLink = () => {
    setFile({ type: 'link' });
  };

  const submit = async () => {
    if (!file || !businessId || !name.trim()) {
      Alert.alert('Missing info', 'Document name, business, and source are required.');
      return;
    }
    setSubmitting(true);
    try {
      await addDocument({
        name: name.trim(),
        category,
        type: file.type,
        businessId,
        ...(file.url ? { url: file.url } : {}),
        ...(file.size ? { size: file.size } : {}),
        ...(file.type === 'note' ? { content: notes.trim() } : {}),
        ...(notes.trim() && file.type !== 'note' ? { notes: notes.trim() } : {}),
        isInvestorReady: investorReady,
      });
      sheetRef.current?.dismiss();
    } catch (err) {
      Alert.alert('Could not save', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: theme.colors.surfaceElevated }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.borderStrong }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>New document</Text>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.textFaint, marginTop: 4 }]}>
          Pitch deck, financials, screenshots, legal, or a quick note.
        </Text>

        <Text style={[styles.section, theme.typography.caption, { color: theme.colors.textFaint }]}>
          DOCUMENT NAME
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Crestwod Seed Pitch · 2026"
          placeholderTextColor={theme.colors.textFaint}
          style={[
            theme.typography.body,
            styles.input,
            {
              color: theme.colors.text,
              backgroundColor: theme.colors.glassTint,
              borderColor: theme.colors.glassBorder,
              borderRadius: theme.radii.md,
            },
          ]}
        />

        <Text style={[styles.section, theme.typography.caption, { color: theme.colors.textFaint }]}>
          CATEGORY
        </Text>
        <View style={styles.row}>
          {CATEGORY_OPTIONS.map((c) => (
            <GlassPill key={c} active={category === c} onPress={() => setCategory(c)}>
              {DOCUMENT_CATEGORY_LABELS[c]}
            </GlassPill>
          ))}
        </View>

        <Text style={[styles.section, theme.typography.caption, { color: theme.colors.textFaint }]}>
          BUSINESS
        </Text>
        <View style={styles.row}>
          {businesses.map((b) => (
            <GlassPill key={b.id} active={businessId === b.id} onPress={() => setBusinessId(b.id)}>
              {b.name}
            </GlassPill>
          ))}
        </View>

        <Text style={[styles.section, theme.typography.caption, { color: theme.colors.textFaint }]}>
          SOURCE
        </Text>
        <View style={styles.sourceGrid}>
          <SourceTile icon="document-text-outline" label="PDF" active={file?.type === 'pdf'} onPress={pickPdf} />
          <SourceTile icon="image-outline" label="Image" active={file?.type === 'image'} onPress={pickImage} />
          <SourceTile icon="reader-outline" label="Note" active={file?.type === 'note'} onPress={useNote} />
          <SourceTile icon="link-outline" label="Link" active={file?.type === 'link'} onPress={useLink} />
        </View>
        {file?.fileName ? (
          <Text
            style={[theme.typography.bodySmall, { color: theme.colors.textMuted, marginTop: 8 }]}
            numberOfLines={1}
          >
            {file.fileName}
          </Text>
        ) : null}

        <Text style={[styles.section, theme.typography.caption, { color: theme.colors.textFaint }]}>
          {file?.type === 'note' ? 'NOTE BODY' : 'NOTES (OPTIONAL)'}
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={file?.type === 'note' ? 'Write your note…' : 'Anything investors should know…'}
          placeholderTextColor={theme.colors.textFaint}
          multiline
          style={[
            theme.typography.body,
            styles.input,
            styles.notes,
            {
              color: theme.colors.text,
              backgroundColor: theme.colors.glassTint,
              borderColor: theme.colors.glassBorder,
              borderRadius: theme.radii.md,
            },
          ]}
        />

        <Pressable
          onPress={() => setInvestorReady((v) => !v)}
          style={[
            styles.investorRow,
            {
              backgroundColor: investorReady ? theme.colors.accentSoft : theme.colors.glassTint,
              borderColor: theme.colors.glassBorder,
              borderRadius: theme.radii.md,
            },
          ]}
        >
          <Ionicons
            name={investorReady ? 'checkbox' : 'square-outline'}
            size={20}
            color={investorReady ? theme.colors.accent : theme.colors.textMuted}
          />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.body, { color: theme.colors.text, fontWeight: '600' }]}>
              Mark as investor-ready
            </Text>
            <Text style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 2 }]}>
              Shows in Investor View. Hides edit affordances.
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={submit}
          disabled={submitting}
          style={[
            styles.submit,
            {
              backgroundColor: theme.colors.accent,
              borderRadius: theme.radii.lg,
              opacity: submitting ? 0.6 : 1,
            },
          ]}
        >
          <Text style={[theme.typography.body, { color: theme.colors.bg, fontWeight: '700' }]}>
            {submitting ? 'Saving…' : 'Save document'}
          </Text>
        </Pressable>
      </ScrollView>
    </BottomSheetModal>
  );
});

interface SourceTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}

function SourceTile({ icon, label, active, onPress }: SourceTileProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.sourceTile,
        {
          backgroundColor: active ? theme.colors.accentSoft : theme.colors.glassTint,
          borderColor: active ? theme.colors.accent : theme.colors.glassBorder,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={22}
        color={active ? theme.colors.accent : theme.colors.textMuted}
      />
      <Text
        style={[
          theme.typography.caption,
          {
            color: active ? theme.colors.accent : theme.colors.textMuted,
            fontWeight: '600',
            marginTop: 6,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 60,
    gap: 4,
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  notes: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sourceGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  sourceTile: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  investorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginTop: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  submit: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 16,
  },
});
