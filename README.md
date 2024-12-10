# Keyboard Trumpet

An interactive web-based trumpet simulator that lets you play musical notes using keyboard controls. Built with Angular, this application provides a realistic trumpet playing experience with visual feedback and audio output.

## Features

- **Interactive Trumpet Display**: 
  - Eight different trumpet valve combinations (Trumpet0.png through Trumpet123.png)
  - Real-time valve state visualization
  - Note display showing current played note
- **Keyboard Controls**: 
  - Arrow keys (←, ↓, →) control the trumpet valves
  - Letter keys (A, S, D, Z, X, C) play different notes
  - Spacebar for additional sound control
- **Real-time Visual Feedback**:
  - Dynamic trumpet valve visualization
  - Button highlighting when pressed
  - Current note display
- **Audio Features**:
  - High-quality trumpet sound samples
  - Volume control slider
  - Visual volume indicator

## How to Play

1. **Valve Control**:
   - Use arrow keys (←, ↓, →) to control trumpet valves
   - Different valve combinations produce different notes
   - Visual feedback shows current valve configuration

2. **Note Playing**:
   - Use A, S, D, Z, X, C keys to play different notes
   - Combine with valve controls for full note range
   - Current note is displayed on screen when enabled

3. **Sound Control**:
   - Adjust volume using the slider control
   - Volume indicator shows current level
   - Spacebar provides additional sound control

## Technical Details

### Prerequisites
- Node.js
- Angular CLI

### Installation
1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
ng serve
```

4. Navigate to `http://localhost:4200/`

### Project Structure
- Uses Angular framework with standalone components
- Implements Web Audio API for high-quality sound processing
- Asset management for images and audio files:
  - Trumpet images (`assets/Trumpets/`)
  - Button images (`assets/Buttons/`)
  - Sound symbols (`assets/SoundSymbols/`)
  - Trumpet sounds (`assets/TrumpetSounds/`)
- Responsive design with flex-based layouts

### Key Components
- Audio processing with Web Audio API:
  - Dynamic sound loading with AudioContext
  - Real-time volume control
  - Audio buffer management for smooth playback
- Interactive UI elements:
  - Volume slider with visual feedback
  - Note display system
  - Dynamic button states
- Comprehensive keyboard event handling
- State management for trumpet valve configurations
- Social media integration with GitHub and LinkedIn links

## Design Features
- Clean, intuitive user interface
- Real-time visual feedback
- Responsive layout
- Interactive sound controls

