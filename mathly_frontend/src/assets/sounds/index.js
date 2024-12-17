// Sound effect URLs from mixkit.co (free sound effects)
const SOUND_EFFECTS = {
  correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  buttonClick: 'https://assets.mixkit.co/active_storage/sfx/1705/1705-preview.mp3',
  timeBonus: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'
};

// Cache audio objects
const audioCache = {};

export const playSound = (soundName, volume = 0.2) => {
  if (!SOUND_EFFECTS[soundName]) return;

  // Create and cache audio object if not exists
  if (!audioCache[soundName]) {
    audioCache[soundName] = new Audio(SOUND_EFFECTS[soundName]);
  }

  const audio = audioCache[soundName];
  audio.volume = volume;
  
  // Reset and play
  audio.currentTime = 0;
  audio.play().catch(error => {
    console.log('Audio playback failed:', error);
  });
};

export default SOUND_EFFECTS; 