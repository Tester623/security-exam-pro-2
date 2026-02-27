// ══════════════════════════════════════════════════════
// Security+ Exam Pro — Flashcards Screen
// Ports, Acronyms, and Custom cards from mistakes
// ══════════════════════════════════════════════════════

import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useQuizStore } from '@/store/useQuizStore';
import { THEME, FLASHCARDS } from '@/core/constants';
import { shuffle } from '@/core/algorithms';
import { useHaptics } from '@/hooks/useHaptics';

type Mode = 'ports' | 'acronyms' | 'custom' | null;

export default function FlashcardsScreen() {
  const { ud, darkMode, incrementFlashcards, removeCustomFlashcard } = useQuizStore();
  const t = darkMode ? THEME.dark : THEME.light;
  const haptics = useHaptics();

  const [mode, setMode] = useState<Mode>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = useMemo(() => {
    if (!mode) return [];
    if (mode === 'custom') {
      return shuffle(ud.cf.map(c => ({ f: c.front, b: c.back, id: c.id })));
    }
    return shuffle(FLASHCARDS[mode].map((c, i) => ({ ...c, id: `${mode}_${i}` })));
  }, [mode, ud.cf.length]);

  // Mode selection screen
  if (!mode) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: t.bg }]} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={[styles.title, { color: t.text }]}>Flashcards</Text>

        {/* Built-in decks */}
        {([
          { m: 'ports' as Mode, n: 'Ports', sub: `${FLASHCARDS.ports.length} cards`, icon: 'globe-outline' },
          { m: 'acronyms' as Mode, n: 'Acronyms', sub: `${FLASHCARDS.acronyms.length} cards`, icon: 'text-outline' },
        ]).map((deck) => (
          <Pressable
            key={deck.m}
            onPress={() => { setMode(deck.m); setIndex(0); setFlipped(false); }}
            style={[styles.deckCard, { backgroundColor: t.card }]}
          >
            <Ionicons name={deck.icon as any} size={24} color={t.accent} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.deckTitle, { color: t.text }]}>{deck.n}</Text>
              <Text style={[styles.deckSub, { color: t.textSub }]}>{deck.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={t.textSub} />
          </Pressable>
        ))}

        {/* Custom flashcards from mistakes */}
        <View style={[styles.customSection, { borderTopColor: t.border }]}>
          <View style={styles.customHeader}>
            <Ionicons name="create-outline" size={20} color={t.neon} />
            <Text style={[styles.customTitle, { color: t.neon }]}>MY STUDY CARDS</Text>
          </View>
          <Text style={[styles.customDesc, { color: t.textSub }]}>
            When you get a question wrong, tap "Save as Flashcard" to add it here for review.
          </Text>

          {ud.cf.length > 0 ? (
            <>
              <Pressable
                onPress={() => { setMode('custom'); setIndex(0); setFlipped(false); }}
                style={[styles.deckCard, { backgroundColor: t.card, borderLeftColor: t.neon, borderLeftWidth: 3 }]}
              >
                <Ionicons name="bookmark" size={24} color={t.neon} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[styles.deckTitle, { color: t.text }]}>My Cards</Text>
                  <Text style={[styles.deckSub, { color: t.textSub }]}>{ud.cf.length} saved from mistakes</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={t.textSub} />
              </Pressable>

              {/* Preview list of custom cards */}
              {ud.cf.slice(0, 5).map((card) => (
                <View key={card.id} style={[styles.previewCard, { backgroundColor: t.card }]}>
                  <Text style={[styles.previewQ, { color: t.text }]} numberOfLines={2}>{card.front}</Text>
                  <Pressable onPress={() => {
                    Alert.alert('Delete Card?', 'Remove this flashcard?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => removeCustomFlashcard(card.id) },
                    ]);
                  }}>
                    <Ionicons name="trash-outline" size={16} color={t.error} />
                  </Pressable>
                </View>
              ))}
              {ud.cf.length > 5 && (
                <Text style={[styles.moreText, { color: t.textSub }]}>
                  +{ud.cf.length - 5} more cards
                </Text>
              )}
            </>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: t.card }]}>
              <Ionicons name="bookmark-outline" size={32} color={t.textSub} />
              <Text style={[styles.emptyText, { color: t.textSub }]}>
                No custom cards yet. Get a question wrong and save it!
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <Text style={[styles.statsText, { color: t.textSub }]}>
          {ud.fr} cards reviewed total
        </Text>
      </ScrollView>
    );
  }

  // Card review screen
  const card = cards[index];
  if (!card) { setMode(null); return null; }

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={styles.header}>
        <Pressable onPress={() => setMode(null)}>
          <Ionicons name="arrow-back" size={22} color={t.textSub} />
        </Pressable>
        <Text style={[styles.counter, { color: t.text }]}>
          {index + 1} / {cards.length}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <Pressable
        onPress={() => {
          setFlipped(!flipped);
          if (!flipped) { incrementFlashcards(); haptics.light(); }
        }}
        style={[styles.flashcard, { backgroundColor: t.card }]}
      >
        <Text style={[styles.fcLabel, { color: t.textSub }]}>
          {flipped ? (mode === 'custom' ? 'ANSWER & EXPLANATION' : 'ANSWER') : (mode === 'custom' ? 'QUESTION' : 'TERM')}
        </Text>
        <Text style={[styles.fcText, {
          color: flipped ? t.success : t.text,
          fontSize: flipped ? (mode === 'custom' ? 14 : 18) : (mode === 'custom' ? 14 : 26),
        }]}>
          {flipped ? card.b : card.f}
        </Text>
        <Text style={[styles.fcHint, { color: t.textSub }]}>Tap to flip</Text>
      </Pressable>

      {/* Delete button for custom cards */}
      {mode === 'custom' && flipped && (
        <Pressable onPress={() => {
          removeCustomFlashcard((card as any).id);
          if (index >= cards.length - 1) setMode(null);
          else setFlipped(false);
        }} style={[styles.deleteBtn, { borderColor: t.error }]}>
          <Text style={[styles.deleteBtnText, { color: t.error }]}>Got it — Remove Card</Text>
        </Pressable>
      )}

      <View style={styles.btnRow}>
        <Pressable
          onPress={() => { setIndex(Math.max(0, index - 1)); setFlipped(false); }}
          disabled={index === 0}
          style={[styles.navBtn, { backgroundColor: t.card, opacity: index === 0 ? 0.3 : 1 }]}
        >
          <Text style={[styles.navBtnText, { color: t.text }]}>Previous</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            if (index + 1 < cards.length) { setIndex(index + 1); setFlipped(false); }
            else setMode(null);
          }}
          style={[styles.navBtn, { backgroundColor: t.accent }]}
        >
          <Text style={[styles.navBtnText, { color: '#fff' }]}>
            {index + 1 >= cards.length ? 'Done' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontFamily: 'Outfit-ExtraBold', marginBottom: 18 },
  deckCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, marginBottom: 10 },
  deckTitle: { fontSize: 15, fontFamily: 'Outfit-Bold' },
  deckSub: { fontSize: 11, fontFamily: 'Outfit-Regular', marginTop: 2 },
  customSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
  customHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  customTitle: { fontSize: 10, fontFamily: 'Outfit-Bold', letterSpacing: 2 },
  customDesc: { fontSize: 12, fontFamily: 'Outfit-Regular', marginBottom: 12, lineHeight: 18 },
  previewCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 6, gap: 10 },
  previewQ: { flex: 1, fontSize: 12, fontFamily: 'Outfit-Regular' },
  moreText: { fontSize: 11, fontFamily: 'Outfit-Regular', textAlign: 'center', marginTop: 4 },
  emptyState: { borderRadius: 14, padding: 24, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 12, fontFamily: 'Outfit-Regular', textAlign: 'center', lineHeight: 18 },
  statsText: { fontSize: 10, fontFamily: 'Outfit-Regular', textAlign: 'center', marginTop: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  counter: { fontSize: 13, fontFamily: 'Outfit-Bold' },
  flashcard: { borderRadius: 20, padding: 28, minHeight: 240, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  fcLabel: { fontSize: 10, fontFamily: 'Outfit-Bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 },
  fcText: { fontFamily: 'Outfit-Bold', textAlign: 'center', lineHeight: 28 },
  fcHint: { fontSize: 11, fontFamily: 'Outfit-Regular', marginTop: 20 },
  deleteBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  deleteBtnText: { fontSize: 13, fontFamily: 'Outfit-Bold' },
  btnRow: { flexDirection: 'row', gap: 10 },
  navBtn: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  navBtnText: { fontSize: 14, fontFamily: 'Outfit-Bold' },
});
