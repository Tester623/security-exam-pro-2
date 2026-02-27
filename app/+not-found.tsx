import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.sub}>Screen not found</Text>
      <Pressable onPress={() => router.replace('/')} style={styles.btn}>
        <Text style={styles.btnText}>Go Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a12', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 48, fontFamily: 'Outfit-ExtraBold', color: '#818cf8' },
  sub: { fontSize: 16, fontFamily: 'Outfit-Regular', color: '#6b6b8d', marginTop: 8, marginBottom: 24 },
  btn: { backgroundColor: '#6366f1', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  btnText: { color: '#fff', fontFamily: 'Outfit-Bold', fontSize: 14 },
});
