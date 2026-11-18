// Send mono 16 kHz PCM so microphone recordings have a consistent provider input format.
export async function encodeSpeakingRecording(blob: Blob) {
  const decoder = new AudioContext();
  let source: AudioBuffer;
  try {
    source = await decoder.decodeAudioData(await blob.arrayBuffer());
  } finally {
    await decoder.close();
  }
  const rate = 16000;
  const renderer = new OfflineAudioContext(1, Math.ceil(rate * source.duration), rate);
  const node = renderer.createBufferSource();
  node.buffer = source;
  node.connect(renderer.destination);
  node.start();
  const samples = (await renderer.startRendering()).getChannelData(0);
  const bytes = new Uint8Array(44 + samples.length * 2);
  const view = new DataView(bytes.buffer);
  const tag = (offset: number, name: string) => bytes.set(new TextEncoder().encode(name), offset);
  tag(0, 'RIFF');
  view.setUint32(4, bytes.length - 8, true);
  tag(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  tag(36, 'data');
  view.setUint32(40, bytes.length - 44, true);
  samples.forEach((s, i) => view.setInt16(44 + 2 * i, Math.max(-1, Math.min(1, s)) * (s < 0 ? 32768 : 32767), true));
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}
