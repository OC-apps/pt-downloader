import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Format = 'Video MP4' | 'Audio MP3';
type Job = { id: number; title: string; detail: string; progress: number };

const RED = '#E20B2F';
const presets = [50, 75, 90, 100, 110, 125, 150];

function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></Pressable>;
}

function AppContent() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<Format>('Video MP4');
  const [playlist, setPlaylist] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [preservePitch, setPreservePitch] = useState(true);
  const [semitones, setSemitones] = useState(0);
  const [removeVocals, setRemoveVocals] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const durationText = useMemo(() => speed === 100 ? 'Duración original' : `${(100 / speed).toFixed(2)}× la duración original`, [speed]);

  const start = () => {
    if (!url.trim()) return Alert.alert('Falta el enlace', 'Pega un enlace autorizado o directo para continuar.');
    if (!accepted) return Alert.alert('Confirma el permiso', 'Debes confirmar que el contenido es tuyo o que tienes autorización para descargarlo.');
    const detail = `${format} · ${speed}% · ${semitones > 0 ? '+' : ''}${semitones} st${removeVocals ? ' · Sin voz' : ''}`;
    setJobs(j => [{ id: Date.now(), title: playlist ? 'Playlist importada' : 'Contenido multimedia', detail, progress: 8 }, ...j]);
    Alert.alert('Añadido a la cola', 'La solicitud está lista para enviarse al procesador autorizado configurado.');
  };

  return <LinearGradient colors={['#250109', '#09090B', '#050506']} style={styles.flex}>
    <StatusBar style="light" />
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}>
          <LinearGradient colors={['#FF3154', '#870018']} style={styles.logo}><Text style={styles.logoText}>PT</Text></LinearGradient>
          <View><Text style={styles.brand}>PT DOWNLOADER</Text><Text style={styles.tagline}>Pistas de un cantante, para cantantes.</Text></View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>DESCARGA Y TRANSFORMA</Text>
          <Text style={styles.title}>Tu contenido.{`\n`}A tu manera.</Text>
          <Text style={styles.subtitle}>Importa contenido autorizado, ajusta tempo y tono, y prepara versiones instrumentales.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>ENLACE DEL CONTENIDO</Text>
          <View style={styles.inputRow}><Ionicons name="link" size={20} color="#A8A8AF" /><TextInput value={url} onChangeText={setUrl} placeholder="Pega aquí un enlace permitido" placeholderTextColor="#686870" autoCapitalize="none" style={styles.input} /></View>
          <View style={styles.rowWrap}><Chip label="Un video" active={!playlist} onPress={() => setPlaylist(false)} /><Chip label="Playlist completa" active={playlist} onPress={() => setPlaylist(true)} /></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>FORMATO</Text>
          <View style={styles.rowWrap}><Chip label="Video MP4" active={format === 'Video MP4'} onPress={() => setFormat('Video MP4')} /><Chip label="Audio MP3" active={format === 'Audio MP3'} onPress={() => setFormat('Audio MP3')} /></View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeading}><View><Text style={styles.label}>VELOCIDAD</Text><Text style={styles.bigValue}>{speed}%</Text></View><Text style={styles.muted}>{durationText}</Text></View>
          <Slider minimumValue={50} maximumValue={150} step={1} value={speed} onValueChange={setSpeed} minimumTrackTintColor={RED} maximumTrackTintColor="#34343A" thumbTintColor="#FF3658" />
          <View style={styles.presetRow}>{presets.map(p => <Pressable key={p} onPress={() => setSpeed(p)} style={[styles.preset, speed === p && styles.presetActive]}><Text style={styles.presetText}>{p}</Text></Pressable>)}</View>
          <View style={styles.switchRow}><View><Text style={styles.option}>Conservar tono original</Text><Text style={styles.muted}>Evita que la voz se vuelva grave o aguda</Text></View><Switch value={preservePitch} onValueChange={setPreservePitch} trackColor={{ false: '#3A3A40', true: '#8D0920' }} thumbColor={preservePitch ? '#FF3154' : '#AAA'} /></View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeading}><View><Text style={styles.label}>CAMBIO DE TONO</Text><Text style={styles.bigValue}>{semitones > 0 ? '+' : ''}{semitones} semitonos</Text></View><Pressable onPress={() => setSemitones(0)}><Text style={styles.reset}>Restablecer</Text></Pressable></View>
          <Slider minimumValue={-12} maximumValue={12} step={1} value={semitones} onValueChange={setSemitones} minimumTrackTintColor={RED} maximumTrackTintColor="#34343A" thumbTintColor="#FF3658" />
          <View style={styles.ends}><Text style={styles.muted}>−12</Text><Text style={styles.muted}>Original</Text><Text style={styles.muted}>+12</Text></View>
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}><View style={styles.optionIcon}><Ionicons name="mic-off" size={22} color="#FF4562" /><View><Text style={styles.option}>Quitar voz</Text><Text style={styles.muted}>Crea una versión instrumental</Text></View></View><Switch value={removeVocals} onValueChange={setRemoveVocals} trackColor={{ false: '#3A3A40', true: '#8D0920' }} thumbColor={removeVocals ? '#FF3154' : '#AAA'} /></View>
        </View>

        <Pressable onPress={() => setAccepted(!accepted)} style={styles.consent}><Ionicons name={accepted ? 'checkbox' : 'square-outline'} size={23} color={accepted ? '#FF3154' : '#888'} /><Text style={styles.consentText}>Confirmo que el contenido es mío, es de dominio público o tengo autorización para descargarlo y procesarlo.</Text></Pressable>
        <Pressable onPress={start}><LinearGradient colors={['#FF3154', '#B30020']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.primary}><Ionicons name="cloud-download" size={23} color="white" /><Text style={styles.primaryText}>PREPARAR DESCARGA</Text></LinearGradient></Pressable>

        {jobs.length > 0 && <View><Text style={styles.queueTitle}>COLA</Text>{jobs.map(job => <View style={styles.job} key={job.id}><View style={styles.jobIcon}><Ionicons name="musical-notes" size={20} color="#FF3154" /></View><View style={styles.jobBody}><Text style={styles.option}>{job.title}</Text><Text style={styles.muted}>{job.detail}</Text><View style={styles.bar}><View style={[styles.barFill, { width: `${job.progress}%` }]} /></View></View></View>)}</View>}
        <Text style={styles.footer}>PT Downloader no evade DRM, inicios de sesión ni restricciones de plataformas.</Text>
      </ScrollView>
    </SafeAreaView>
  </LinearGradient>;
}

export default function App() { return <SafeAreaProvider><AppContent /></SafeAreaProvider>; }

const styles = StyleSheet.create({
  flex:{flex:1},page:{padding:20,paddingBottom:48},brandRow:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:22},logo:{width:48,height:48,borderRadius:14,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#FF5B74'},logoText:{color:'white',fontSize:20,fontWeight:'900',fontStyle:'italic'},brand:{color:'white',fontWeight:'900',letterSpacing:2,fontSize:16},tagline:{color:'#8E8E96',fontSize:11,marginTop:2},hero:{paddingVertical:18,marginBottom:12},eyebrow:{color:'#FF3658',fontWeight:'800',letterSpacing:2,fontSize:11},title:{color:'white',fontSize:40,lineHeight:43,fontWeight:'900',marginTop:7},subtitle:{color:'#B5B5BC',lineHeight:21,marginTop:10,maxWidth:340},card:{backgroundColor:'rgba(24,24,28,0.94)',borderWidth:1,borderColor:'#2E2E34',borderRadius:20,padding:17,marginTop:12},label:{color:'#AFAFB6',fontSize:11,fontWeight:'800',letterSpacing:1.5},inputRow:{height:52,marginTop:11,borderRadius:13,backgroundColor:'#0D0D10',borderWidth:1,borderColor:'#33333A',flexDirection:'row',alignItems:'center',paddingHorizontal:14},input:{color:'white',flex:1,marginLeft:10,fontSize:15},rowWrap:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:13},chip:{paddingHorizontal:14,paddingVertical:10,borderRadius:99,backgroundColor:'#29292F',borderWidth:1,borderColor:'#38383F'},chipActive:{backgroundColor:'#500712',borderColor:'#D21435'},chipText:{color:'#B8B8BF',fontWeight:'700',fontSize:13},chipTextActive:{color:'#FF6B83'},sectionHeading:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between'},bigValue:{color:'white',fontSize:24,fontWeight:'900',marginTop:5},muted:{color:'#898991',fontSize:12,lineHeight:17},presetRow:{flexDirection:'row',justifyContent:'space-between',marginTop:7},preset:{width:37,height:31,borderRadius:9,backgroundColor:'#29292F',alignItems:'center',justifyContent:'center'},presetActive:{backgroundColor:'#B30925'},presetText:{color:'white',fontSize:11,fontWeight:'800'},switchRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:16,paddingTop:15,borderTopWidth:1,borderTopColor:'#303036'},option:{color:'#F2F2F4',fontWeight:'700',fontSize:14},reset:{color:'#FF526D',fontSize:12,fontWeight:'700'},ends:{flexDirection:'row',justifyContent:'space-between'},optionIcon:{flexDirection:'row',alignItems:'center',gap:12},consent:{flexDirection:'row',gap:10,alignItems:'flex-start',marginVertical:18,paddingHorizontal:4},consentText:{color:'#A1A1A8',fontSize:12,lineHeight:18,flex:1},primary:{height:58,borderRadius:17,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,shadowColor:'#FF153D',shadowOpacity:.35,shadowRadius:15,shadowOffset:{width:0,height:7}},primaryText:{color:'white',fontWeight:'900',letterSpacing:1},queueTitle:{color:'#AFAFB6',fontSize:11,fontWeight:'800',letterSpacing:1.5,marginTop:28,marginBottom:10},job:{backgroundColor:'#17171B',borderRadius:16,padding:14,flexDirection:'row',gap:12,borderWidth:1,borderColor:'#2E2E34'},jobIcon:{width:38,height:38,borderRadius:12,backgroundColor:'#3B0710',alignItems:'center',justifyContent:'center'},jobBody:{flex:1},bar:{height:4,borderRadius:3,backgroundColor:'#34343A',marginTop:9},barFill:{height:4,borderRadius:3,backgroundColor:'#FF3154'},footer:{color:'#62626A',textAlign:'center',fontSize:10,lineHeight:15,marginTop:28}}
);
