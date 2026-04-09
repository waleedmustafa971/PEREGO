import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors, fonts, fontSize, spacing, radius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const STEPS = ['Basic Info', 'Documents', 'Face Match', 'Done'];

type DocType = 'id' | 'passport';
type DocSide = 'front' | 'back';

interface DocImages {
  idFront: string | null;
  idBack: string | null;
  passport: string | null;
}

interface FaceMatch {
  selfie: string | null;
  analyzing: boolean;
  result: 'pending' | 'match' | 'no_match' | null;
  score: number;
}

export default function RegisterScreen() {
  const [step, setStep] = useState(0);
  const login = useAuthStore(s => s.login);

  const [docs, setDocs] = useState<DocImages>({ idFront: null, idBack: null, passport: null });
  const [faceMatch, setFaceMatch] = useState<FaceMatch>({
    selfie: null, analyzing: false, result: null, score: 0,
  });

  const pickImage = async (key: keyof DocImages) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setDocs(prev => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets[0]) {
      setFaceMatch(prev => ({ ...prev, selfie: result.assets[0].uri, result: null }));
    }
  };

  const runFaceMatch = () => {
    setFaceMatch(prev => ({ ...prev, analyzing: true, result: null }));
    // Simulated analysis — in production this calls a face comparison API
    setTimeout(() => {
      const score = 87 + Math.floor(Math.random() * 10);
      setFaceMatch(prev => ({
        ...prev,
        analyzing: false,
        result: score >= 80 ? 'match' : 'no_match',
        score,
      }));
    }, 2500);
  };

  const handleDone = () => {
    login();
    router.replace('/(tabs)/home');
  };

  const canProceedDocs = docs.idFront !== null || docs.passport !== null;
  const canProceedFace = faceMatch.result === 'match';

  const docUploaded = (key: keyof DocImages) => docs[key] !== null;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Create Account" />

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.progressStep}>
            <View style={[styles.progressDot, i <= step && styles.progressDotActive, i < step && styles.progressDotDone]}>
              {i < step ? (
                <Text style={styles.progressCheck}>✓</Text>
              ) : (
                <Text style={[styles.progressNum, i === step && styles.progressNumActive]}>{i + 1}</Text>
              )}
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.progressLine, i < step && styles.progressLineDone]} />
            )}
          </View>
        ))}
      </View>
      <Text style={styles.stepLabel}>{STEPS[step]}</Text>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* STEP 0 — Basic Info */}
        {step === 0 && (
          <>
            <Text style={styles.heading}>Tell us about yourself</Text>
            <Input label="Full Name" placeholder="Enter your full name" icon="👤" />
            <Input label="Email" placeholder="you@email.com" icon="✉️" keyboardType="email-address" />
            <Input label="Phone" placeholder="+971 XX XXX XXXX" icon="📱" keyboardType="phone-pad" />
            <Button title="Continue" onPress={() => setStep(1)} full />
          </>
        )}

        {/* STEP 1 — Document Upload */}
        {step === 1 && (
          <>
            <Text style={styles.heading}>Upload your ID</Text>
            <Text style={styles.sub}>
              We need a government-issued document to verify your identity. Your face on the document will be matched in the next step.
            </Text>

            {/* National ID */}
            <Text style={styles.docSectionLabel}>National ID</Text>
            <View style={styles.docRow}>
              <TouchableOpacity style={[styles.docBox, docUploaded('idFront') && styles.docBoxDone]} onPress={() => pickImage('idFront')}>
                {docs.idFront ? (
                  <>
                    <Image source={{ uri: docs.idFront }} style={styles.docThumb} />
                    <View style={styles.docDoneOverlay}>
                      <Text style={styles.docDoneCheck}>✓</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.docIcon}>🪪</Text>
                    <Text style={styles.docLabel}>Front Side</Text>
                    <Text style={styles.docHint}>Tap to upload</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.docBox, docUploaded('idBack') && styles.docBoxDone, !docs.idFront && styles.docBoxDisabled]}
                onPress={() => docs.idFront && pickImage('idBack')}
              >
                {docs.idBack ? (
                  <>
                    <Image source={{ uri: docs.idBack }} style={styles.docThumb} />
                    <View style={styles.docDoneOverlay}>
                      <Text style={styles.docDoneCheck}>✓</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.docIcon}>🪪</Text>
                    <Text style={styles.docLabel}>Back Side</Text>
                    <Text style={styles.docHint}>{docs.idFront ? 'Tap to upload' : 'Upload front first'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Passport */}
            <Text style={styles.docSectionLabel}>Passport</Text>
            <TouchableOpacity style={[styles.docBoxWide, docUploaded('passport') && styles.docBoxDone]} onPress={() => pickImage('passport')}>
              {docs.passport ? (
                <View style={styles.passportDoneRow}>
                  <Image source={{ uri: docs.passport }} style={styles.passportThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docDoneText}>Passport uploaded ✓</Text>
                    <Text style={styles.docHint}>Tap to replace</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.docBoxWideInner}>
                  <Text style={{ fontSize: 28 }}>📘</Text>
                  <View>
                    <Text style={styles.docLabel}>Photo page</Text>
                    <Text style={styles.docHint}>The page with your photo and details</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={{ fontSize: 16 }}>🔒</Text>
              <Text style={styles.infoText}>
                Your documents are encrypted and only used for identity verification. They are never shared with third parties.
              </Text>
            </View>

            <Button title="Continue to Face Match" onPress={() => setStep(2)} full disabled={!canProceedDocs} />
            {!canProceedDocs && (
              <Text style={styles.disabledHint}>Upload at least one document to continue</Text>
            )}
          </>
        )}

        {/* STEP 2 — Face Match */}
        {step === 2 && (
          <>
            <Text style={styles.heading}>Face verification</Text>
            <Text style={styles.sub}>
              Take a selfie so we can confirm you are the same person shown on your uploaded document.
            </Text>

            {/* Reference doc face */}
            <View style={styles.matchContainer}>
              <View style={styles.matchSide}>
                <View style={styles.faceBox}>
                  {(docs.idFront || docs.passport) ? (
                    <Image source={{ uri: (docs.idFront || docs.passport)! }} style={styles.faceImage} />
                  ) : (
                    <Text style={{ fontSize: 32 }}>🪪</Text>
                  )}
                  <View style={styles.faceLabel}>
                    <Text style={styles.faceLabelText}>Document</Text>
                  </View>
                </View>
              </View>

              <View style={styles.matchArrow}>
                {faceMatch.analyzing ? (
                  <Text style={styles.matchArrowText}>⟳</Text>
                ) : faceMatch.result === 'match' ? (
                  <Text style={[styles.matchArrowText, { color: colors.green, fontSize: 28 }]}>✓</Text>
                ) : faceMatch.result === 'no_match' ? (
                  <Text style={[styles.matchArrowText, { color: colors.red, fontSize: 28 }]}>✕</Text>
                ) : (
                  <Text style={styles.matchArrowText}>↔</Text>
                )}
              </View>

              <View style={styles.matchSide}>
                <TouchableOpacity style={[styles.faceBox, faceMatch.selfie && styles.faceBoxFilled]} onPress={takePhoto} activeOpacity={0.85}>
                  {faceMatch.selfie ? (
                    <Image source={{ uri: faceMatch.selfie }} style={styles.faceImage} />
                  ) : (
                    <>
                      <Text style={{ fontSize: 32 }}>🤳</Text>
                      <Text style={styles.faceHint}>Tap to take selfie</Text>
                    </>
                  )}
                  <View style={styles.faceLabel}>
                    <Text style={styles.faceLabelText}>Your selfie</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Guidelines */}
            {!faceMatch.selfie && (
              <View style={styles.guideList}>
                {[
                  { icon: '💡', text: 'Find a well-lit area' },
                  { icon: '😶', text: 'No sunglasses or hats' },
                  { icon: '📸', text: 'Look straight at the camera' },
                  { icon: '🧑', text: 'Show your full face' },
                ].map(g => (
                  <View key={g.text} style={styles.guideRow}>
                    <Text style={{ fontSize: 16 }}>{g.icon}</Text>
                    <Text style={styles.guideText}>{g.text}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Result feedback */}
            {faceMatch.result === 'match' && (
              <View style={[styles.resultBox, { backgroundColor: colors.greenBg }]}>
                <Text style={{ fontSize: 22 }}>✅</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resultTitle, { color: colors.green }]}>Face matched — {faceMatch.score}% confidence</Text>
                  <Text style={styles.resultSub}>Your selfie matches the face on your document.</Text>
                </View>
              </View>
            )}

            {faceMatch.result === 'no_match' && (
              <View style={[styles.resultBox, { backgroundColor: colors.redBg }]}>
                <Text style={{ fontSize: 22 }}>❌</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resultTitle, { color: colors.red }]}>Face not matched — {faceMatch.score}% confidence</Text>
                  <Text style={styles.resultSub}>Please retake your selfie in better lighting.</Text>
                </View>
              </View>
            )}

            {faceMatch.analyzing && (
              <View style={[styles.resultBox, { backgroundColor: colors.tealBg }]}>
                <Text style={{ fontSize: 22 }}>🔍</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resultTitle, { color: colors.teal }]}>Analyzing faces...</Text>
                  <Text style={styles.resultSub}>Comparing your selfie to your document photo.</Text>
                </View>
              </View>
            )}

            {/* Actions */}
            {faceMatch.selfie && !faceMatch.analyzing && faceMatch.result === null && (
              <Button title="Run Face Match" onPress={runFaceMatch} full />
            )}

            {faceMatch.result === 'no_match' && (
              <View style={{ gap: 10 }}>
                <Button title="Retake Selfie" onPress={takePhoto} full />
                <Button title="Upload Different Document" onPress={() => setStep(1)} variant="ghost" full />
              </View>
            )}

            {faceMatch.result === 'match' && (
              <Button title="Continue" onPress={() => setStep(3)} full />
            )}

            {!faceMatch.selfie && (
              <Button title="Take Selfie" onPress={takePhoto} full />
            )}
          </>
        )}

        {/* STEP 3 — Submitted */}
        {step === 3 && (
          <View style={styles.successWrap}>
            <View style={styles.successCircle}>
              <Text style={{ fontSize: 36 }}>🛡️</Text>
            </View>
            <Text style={styles.successTitle}>Verification Submitted</Text>
            <Text style={styles.successSub}>
              Your face matched your document with {faceMatch.score}% confidence.{'\n\n'}
              Our team will do a final review within 24 hours. You'll receive a notification once fully verified.
            </Text>

            <View style={styles.summaryRow}>
              {[
                { icon: '👤', label: 'Basic Info', done: true },
                { icon: '🪪', label: 'Document', done: canProceedDocs },
                { icon: '🤳', label: 'Face Match', done: faceMatch.result === 'match' },
              ].map(item => (
                <View key={item.label} style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: item.done ? colors.greenBg : colors.gray100 }]}>
                    <Text style={{ fontSize: 18 }}>{item.done ? '✓' : item.icon}</Text>
                  </View>
                  <Text style={styles.summaryLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            <Button title="Go to Home" onPress={handleDone} full />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    paddingBottom: 4,
  },
  progressStep: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  progressDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.gray100,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.gray200,
  },
  progressDotActive: { borderColor: colors.teal, backgroundColor: colors.tealBg },
  progressDotDone: { backgroundColor: colors.teal, borderColor: colors.teal },
  progressCheck: { color: colors.white, fontFamily: fonts.bodyBold, fontSize: 12 },
  progressNum: { fontSize: 11, fontFamily: fonts.bodySemiBold, color: colors.gray400 },
  progressNumActive: { color: colors.teal },
  progressLine: { flex: 1, height: 2, backgroundColor: colors.gray200, marginHorizontal: 4 },
  progressLineDone: { backgroundColor: colors.teal },
  stepLabel: {
    textAlign: 'center', fontSize: fontSize.sm, fontFamily: fonts.bodyBold,
    color: colors.teal, letterSpacing: 0.5, paddingBottom: 12,
  },
  body: { flex: 1, paddingHorizontal: spacing.xl },
  heading: { fontFamily: fonts.heading, fontSize: fontSize.xl + 2, color: colors.night, marginBottom: 6 },
  sub: { fontSize: fontSize.md - 1, color: colors.gray400, marginBottom: 20, lineHeight: 22 },

  // Document upload
  docSectionLabel: {
    fontSize: 11, fontFamily: fonts.bodySemiBold,
    textTransform: 'uppercase', letterSpacing: 1.5,
    color: colors.gray400, marginBottom: 10,
  },
  docRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  docBox: {
    flex: 1, borderWidth: 2, borderColor: colors.gray200, borderStyle: 'dashed',
    borderRadius: radius.lg, paddingVertical: 20, alignItems: 'center',
    overflow: 'hidden', minHeight: 110,
  },
  docBoxDone: { borderColor: colors.green, borderStyle: 'solid', backgroundColor: colors.greenBg },
  docBoxDisabled: { opacity: 0.4 },
  docBoxWide: {
    borderWidth: 2, borderColor: colors.gray200, borderStyle: 'dashed',
    borderRadius: radius.lg, padding: 16, marginBottom: 14, overflow: 'hidden',
  },
  docBoxWideInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  docIcon: { fontSize: 26, marginBottom: 6 },
  docLabel: { fontSize: fontSize.sm, fontFamily: fonts.bodySemiBold, color: colors.gray600 },
  docHint: { fontSize: fontSize.xs + 1, color: colors.gray400, marginTop: 2 },
  docThumb: { width: '100%', height: 80, resizeMode: 'cover' },
  docDoneOverlay: {
    position: 'absolute', top: 6, right: 6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center',
  },
  docDoneCheck: { color: colors.white, fontSize: 12, fontFamily: fonts.bodyBold },
  docDoneText: { fontFamily: fonts.bodyBold, fontSize: fontSize.md - 1, color: colors.green },
  passportThumb: { width: 52, height: 52, borderRadius: 8, marginRight: 12 },
  passportDoneRow: { flexDirection: 'row', alignItems: 'center' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.gray200 },
  dividerText: { marginHorizontal: 10, fontSize: fontSize.sm, color: colors.gray400 },
  infoBox: {
    flexDirection: 'row', gap: 10, backgroundColor: colors.tealBg,
    borderRadius: radius.md, padding: 14, marginBottom: 20, alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: fontSize.sm, color: colors.gray600, lineHeight: 20 },
  disabledHint: { textAlign: 'center', fontSize: fontSize.sm, color: colors.gray400, marginTop: 8 },

  // Face match
  matchContainer: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  matchSide: { flex: 1 },
  matchArrow: { width: 40, alignItems: 'center' },
  matchArrowText: { fontSize: 22, color: colors.gray300 },
  faceBox: {
    aspectRatio: 1, borderWidth: 2, borderColor: colors.gray200,
    borderStyle: 'dashed', borderRadius: radius.xl,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', backgroundColor: colors.gray100,
  },
  faceBoxFilled: { borderStyle: 'solid', borderColor: colors.teal },
  faceImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  faceHint: { fontSize: fontSize.xs, color: colors.gray400, textAlign: 'center', marginTop: 4, paddingHorizontal: 8 },
  faceLabel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', paddingVertical: 4, alignItems: 'center',
  },
  faceLabelText: { fontSize: fontSize.xs, color: colors.white, fontFamily: fonts.bodySemiBold },
  guideList: {
    backgroundColor: colors.gray100, borderRadius: radius.lg,
    padding: 14, gap: 10, marginBottom: 16,
  },
  guideRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  guideText: { fontSize: fontSize.sm, color: colors.gray600, fontFamily: fonts.bodyMedium },
  resultBox: {
    flexDirection: 'row', gap: 12, borderRadius: radius.lg,
    padding: 14, marginBottom: 16, alignItems: 'flex-start',
  },
  resultTitle: { fontFamily: fonts.bodyBold, fontSize: fontSize.md - 1, marginBottom: 2 },
  resultSub: { fontSize: fontSize.sm, color: colors.gray500, lineHeight: 18 },

  // Success
  successWrap: { alignItems: 'center', paddingTop: 20 },
  successCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.greenBg,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  successTitle: { fontFamily: fonts.heading, fontSize: fontSize.xxl, color: colors.night, marginBottom: 10, textAlign: 'center' },
  successSub: { fontSize: fontSize.md - 1, color: colors.gray400, textAlign: 'center', lineHeight: 24, marginBottom: 32, paddingHorizontal: 10 },
  summaryRow: { flexDirection: 'row', gap: 20, marginBottom: 32 },
  summaryItem: { alignItems: 'center', gap: 6 },
  summaryIcon: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  summaryLabel: { fontSize: fontSize.xs + 1, color: colors.gray400, fontFamily: fonts.bodyMedium },
});
