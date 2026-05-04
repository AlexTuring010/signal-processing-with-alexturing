# Audio assets

## `intro-speech.mp3`

A short Greek-speech sample (3–5 sec) used by `<TimeFrequencyTeaser />`
in the intro page (`/intro`).

**Spec:**
- Format: mp3
- Duration: 3–5 seconds
- Content: Greek speech (vowels show clean harmonic structure in FFT)
- Sample rate: 16 kHz mono is fine; 44.1 kHz also fine
- File size: under 500 KB
- Place at: `public/audio/intro-speech.mp3`

If the file is missing the component renders a graceful "δεν βρέθηκε το audio
sample" placeholder — the rest of the page still works.
