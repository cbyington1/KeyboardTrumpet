import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { afterNextRender } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'keyboard-trumpet'; // Define the title property
  trumpets: string[] = ['Trumpet0.png', 'Trumpet1.png', 'Trumpet2.png', 'Trumpet12.png', 'Trumpet13.png', 'Trumpet23.png', 'Trumpet123.png', 'Trumpet3.png'];
  notePaths: string[] = [
    'assets/TrumpetSounds/FSharp3.mp3',
    'assets/TrumpetSounds/G3.mp3',
    'assets/TrumpetSounds/GSharp3.mp3',
    'assets/TrumpetSounds/A3.mp3',
    'assets/TrumpetSounds/ASharp3.mp3',
    'assets/TrumpetSounds/B3.mp3',
    'assets/TrumpetSounds/C4.mp3',
    'assets/TrumpetSounds/CSharp4.mp3',
    'assets/TrumpetSounds/D4.mp3',
    'assets/TrumpetSounds/DSharp4.mp3',
    'assets/TrumpetSounds/E4.mp3',
    'assets/TrumpetSounds/F4.mp3',
    'assets/TrumpetSounds/FSharp4.mp3',
    'assets/TrumpetSounds/G4.mp3',
    'assets/TrumpetSounds/GSharp4.mp3',
    'assets/TrumpetSounds/A4.mp3',
    'assets/TrumpetSounds/ASharp4.mp3',
    'assets/TrumpetSounds/B4.mp3',
    'assets/TrumpetSounds/C5.mp3',
    'assets/TrumpetSounds/CSharp5.mp3',
    'assets/TrumpetSounds/D5.mp3',
    'assets/TrumpetSounds/DSharp5.mp3',
    'assets/TrumpetSounds/E5.mp3',
    'assets/TrumpetSounds/F5.mp3',
    'assets/TrumpetSounds/FSharp5.mp3',
    'assets/TrumpetSounds/G5.mp3',
    'assets/TrumpetSounds/GSharp5.mp3',
    'assets/TrumpetSounds/A5.mp3',
    'assets/TrumpetSounds/ASharp5.mp3',
    'assets/TrumpetSounds/B5.mp3',
    'assets/TrumpetSounds/C6.mp3',
    'assets/TrumpetSounds/CSharp6.mp3',
    'assets/TrumpetSounds/D6.mp3',
    'assets/TrumpetSounds/DSharp6.mp3',
    'assets/TrumpetSounds/E6.mp3',
    'assets/TrumpetSounds/F6.mp3',
  ];

  currentTrumpetIndex: number = 0;
  currentTrumpet: string = this.trumpets[this.currentTrumpetIndex];

  currentLeft: string = 'left.png'
  currentDown: string = 'down.png'
  currentRight: string = 'right.png'

  currentA: string = 'A.png'
  currentS: string = 'S.png'
  currentD: string = 'D.png'
  currentZ: string = 'Z.png'
  currentX: string = 'X.png'
  currentC: string = 'C.png'
  currentSpace: string = 'SPACENEW.png'

  leftKeyPressed: boolean = false;
  downKeyPressed: boolean = false;
  rightKeyPressed: boolean = false;

  AKeyPressed: boolean = false;
  SKeyPressed: boolean = false;
  DKeyPressed: boolean = false;
  ZKeyPressed: boolean = false;
  XKeyPressed: boolean = false;
  CKeyPressed: boolean = false;
  SpaceKeyPressed: boolean = false;

  AkeyFalse: boolean = false;
  SkeyFalse: boolean = false;
  DkeyFalse: boolean = false;
  ZkeyFalse: boolean = false;
  XkeyFalse: boolean = false;
  CkeyFalse: boolean = false;

  currNote: string = "";//Current keyboard button pressed
  audio: HTMLAudioElement | null = null;
  // Declare audioContext as null initially
  audioContext: AudioContext | null = null;
  // Variable to track if audio is playing
  audioPlaying: boolean = false;
  // Preloaded Audio objects
  preloadedAudios: { [key: string]: AudioBuffer } = {};
  // Store the reference to the currently playing source node
  sourceNode: AudioBufferSourceNode | null = null; // Add this line

  sliderVisible: boolean = false; // Add this line
  private hideSliderTimeout: any; // Add this line
  sliderValue: number = 100; // Initial value of the slider
  soundBarImage: string = "assets/SoundSymbols/SoundBar03.png"; // Default image

  currActualNote: string = ""; //actual note like musically and shit

  isPopupVisible = false;//for pop up info


  constructor(private sanitizer: DomSanitizer) {
    // Set the initial trumpet image when the component is created
    this.setTrumpet();

    // Create AudioContext after the component has been rendered
    //if (typeof window !== 'undefined') {
      //window.addEventListener('resize', this.applyScale.bind(this));
    //}

    // Create AudioContext after the component has been rendered
    afterNextRender(() => {
      // Check if AudioContext is available
      if (typeof AudioContext !== 'undefined') {
        // Create AudioContext instance
        this.audioContext = new AudioContext();
      } else if ((window as any).webkitAudioContext !== 'undefined') {
        // Some browsers (like Safari) use a prefixed version
        this.audioContext = new (window as any).webkitAudioContext();
      } else {
        // Web Audio API not supported, handle accordingly
        console.error('Web Audio API is not supported in this environment.');
      }

      // After AudioContext is created, preload audio files
      this.preloadAudios();
    });
  }

  async preloadAudios() {
    // Check if audioContext is null
    if (this.audioContext === null) {
      // If audioContext is null, log an error and return early
      console.error('AudioContext is null. Cannot preload audios.');
      return;
    }
  
    // Define the audio file URLs
    const audioFileUrls: string[] = this.notePaths; // Use the single array directly
  
    // Preload each audio file
    for (const url of audioFileUrls) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Check if audioContext is null
      if (this.audioContext === null) {
        // If audioContext is null, log an error and return early
        console.error('AudioContext is null. Cannot decode audio data.');
        return;
      }
  
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Store the preloaded Audio object
      this.preloadedAudios[url] = audioBuffer;
    }
  }
  

  @HostListener('document:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    
    if (event.key === 'ArrowLeft') {
      if(!this.leftKeyPressed){
        this.stopAudio()
      }
      this.leftKeyPressed = true;
      this.playAudio()
    } 
    else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if(!this.downKeyPressed){
        this.stopAudio()
      }
      this.downKeyPressed = true;
      this.playAudio()
    } 
    else if (event.key === 'ArrowRight') {
      if(!this.rightKeyPressed){
        this.stopAudio()
      }
      this.rightKeyPressed = true;
      this.playAudio()
    } 
    else if (event.key === 'a' || event.key === 'A') {
      if(this.currNote !== "A"){
        if(this.currNote === "S"){
          this.SKeyPressed = false
        }
        else if(this.currNote === "D"){
          this.DKeyPressed = false
        }
        else if(this.currNote === "Z"){
          this.ZKeyPressed = false
        }
        else if(this.currNote === "X"){
          this.XKeyPressed = false
        }
        else if(this.currNote === "C"){
          this.CKeyPressed = false
        }
        this.stopAudio();
      }

      this.currNote = "A"
      this.AKeyPressed = true;
      if (!this.audioPlaying) { // Check if audio is not already playing
        this.playAudio(); // Call the playAudio method when 'A' key is pressed
      }
    }
    else if (event.key === 's' || event.key === 'S') {
      if(this.currNote !== "S"){
        if(this.currNote === "A"){
          this.AKeyPressed = false
        }
        else if(this.currNote === "D"){
          this.DKeyPressed = false
        }
        else if(this.currNote === "Z"){
          this.ZKeyPressed = false
        }
        else if(this.currNote === "X"){
          this.XKeyPressed = false
        }
        else if(this.currNote === "C"){
          this.CKeyPressed = false
        }
        this.stopAudio();
      }

      this.currNote = "S"
      this.SKeyPressed = true;
      if (!this.audioPlaying) { // Check if audio is not already playing
        this.playAudio(); // Call the playAudio method when 'A' key is pressed
      }
    }
    else if (event.key === 'd' || event.key === 'D') {
      if(this.currNote !== "D"){
        if(this.currNote === "A"){
          this.AKeyPressed = false
        }
        else if(this.currNote === "S"){
          this.SKeyPressed = false
        }
        else if(this.currNote === "Z"){
          this.ZKeyPressed = false
        }
        else if(this.currNote === "X"){
          this.XKeyPressed = false
        }
        else if(this.currNote === "C"){
          this.CKeyPressed = false
        }
        this.stopAudio();
      }
      this.currNote = "D"
      this.DKeyPressed = true;
      if (!this.audioPlaying) { // Check if audio is not already playing
        this.playAudio(); // Call the playAudio method when 'A' key is pressed
      }
    }
    else if (event.key === 'z' || event.key === 'Z') {
      if(this.currNote !== "Z"){
        if(this.currNote === "A"){
          this.AKeyPressed = false
        }
        else if(this.currNote === "S"){
          this.SKeyPressed = false
        }
        else if(this.currNote === "D"){
          this.DKeyPressed = false
        }
        else if(this.currNote === "X"){
          this.XKeyPressed = false
        }
        else if(this.currNote === "C"){
          this.CKeyPressed = false
        }
        this.stopAudio();
      }
      this.currNote = "Z"
      this.ZKeyPressed = true;
      if (!this.audioPlaying) { // Check if audio is not already playing
        this.playAudio(); // Call the playAudio method when 'A' key is pressed
      }
    }
    else if (event.key === 'x' || event.key === 'X') {
      if(this.currNote !== "X"){
        if(this.currNote === "A"){
          this.AKeyPressed = false
        }
        else if(this.currNote === "S"){
          this.SKeyPressed = false
        }
        else if(this.currNote === "D"){
          this.DKeyPressed = false
        }
        else if(this.currNote === "Z"){
          this.ZKeyPressed = false
        }
        else if(this.currNote === "C"){
          this.CKeyPressed = false
        }
        this.stopAudio();
      }
      this.currNote = "X"
      this.XKeyPressed = true;
      if (!this.audioPlaying) { // Check if audio is not already playing
        this.playAudio(); // Call the playAudio method when 'A' key is pressed
      }
    }

    else if (event.key === 'c' || event.key === 'C') {
      if(this.currNote !== "C"){
        if(this.currNote === "A"){
          this.AKeyPressed = false
        }
        else if(this.currNote === "S"){
          this.SKeyPressed = false
        }
        else if(this.currNote === "D"){
          this.DKeyPressed = false
        }
        else if(this.currNote === "Z"){
          this.ZKeyPressed = false
        }
        else if(this.currNote === "X"){
          this.XKeyPressed = false
        }
        this.stopAudio();
      }
      this.currNote = "C"
      this.CKeyPressed = true;
      if (!this.audioPlaying) { // Check if audio is not already playing
        this.playAudio(); // Call the playAudio method when 'A' key is pressed
      }
    }

    else if(event.key === " "){
      if(this.SpaceKeyPressed === false){
        if(this.AKeyPressed || this.SKeyPressed || this.DKeyPressed || this.ZKeyPressed || this.XKeyPressed || this.CKeyPressed){
          this.stopAudio();
          this.playAudio();
        }
      }

      this.SpaceKeyPressed = true;
    }


    if (this.leftKeyPressed && this.downKeyPressed && this.rightKeyPressed) {
      this.changeTrumpet(6);
      this.blurKeys(6)
    } else if (this.leftKeyPressed && this.downKeyPressed) {
      this.changeTrumpet(3); // Move to Trumpet12 when both left and down arrow keys are pressed
      this.blurKeys(3)
    } else if (this.leftKeyPressed && this.rightKeyPressed) {
      this.changeTrumpet(4);
      this.blurKeys(4)
    } else if (this.downKeyPressed && this.rightKeyPressed) {
      this.changeTrumpet(5);
      this.blurKeys(5)
    } else if (this.leftKeyPressed) {
      this.changeTrumpet(1); // Move to Trumpet1 when left arrow key is pressed
      this.blurKeys(1)
    } else if (this.downKeyPressed) {
      this.changeTrumpet(2); // Move to Trumpet2 when down arrow key is pressed
      this.blurKeys(2)
    } else if (this.rightKeyPressed) {
      this.changeTrumpet(7);
      this.blurKeys(7)
    }

    this.changeButton()
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      if(this.leftKeyPressed){
        this.stopAudio()
      }
      this.leftKeyPressed = false;
      let trumpetValue: number = (this.downKeyPressed && this.rightKeyPressed ? 5 : (this.rightKeyPressed ? 7 : (this.downKeyPressed ? 2 : 0)));
      this.changeTrumpet(trumpetValue);
      this.blurKeys(trumpetValue)
      this.playAudio()
    } 
    else if (event.key === 'ArrowDown') {
      if(this.downKeyPressed){
        this.stopAudio()
      }
      this.downKeyPressed = false;
      let trumpetValue: number = (this.leftKeyPressed && this.rightKeyPressed ? 4 : (this.rightKeyPressed ? 7 : (this.leftKeyPressed ? 1 : 0)));
      this.changeTrumpet(trumpetValue);
      this.blurKeys(trumpetValue)
      this.playAudio()
    } 
    else if (event.key === 'ArrowRight') {
      if(this.rightKeyPressed){
        this.stopAudio()
      }
      this.rightKeyPressed = false;
      let trumpetValue: number = (this.leftKeyPressed && this.downKeyPressed ? 3 : (this.downKeyPressed ? 2 : (this.leftKeyPressed ? 1 : 0)));
      this.changeTrumpet(trumpetValue);
      this.blurKeys(trumpetValue)
      this.playAudio()
    } 
    else if (event.key === 'a' || event.key === 'A') {
      // Stop audio playback if it's currently playing
      this.AKeyPressed = false;
      if (this.audioPlaying && this.currNote === "A") {
        this.stopAudio();
      }
    }
    else if (event.key === 's' || event.key === 'S') {
      // Stop audio playback if it's currently playing
      this.SKeyPressed = false;
      if (this.audioPlaying && this.currNote === "S") {
        this.stopAudio();
      }
    }
    else if (event.key === 'd' || event.key === 'D') {
      // Stop audio playback if it's currently playing
      this.DKeyPressed = false;
      if (this.audioPlaying && this.currNote === "D") {
        this.stopAudio();
      }
    }
    else if (event.key === 'z' || event.key === 'Z') {
      // Stop audio playback if it's currently playing
      this.ZKeyPressed = false;
      if (this.audioPlaying && this.currNote === "Z") {
        this.stopAudio();
      }
    }
    else if (event.key === 'x' || event.key === 'X') {
      // Stop audio playback if it's currently playing
      this.XKeyPressed = false;
      if (this.audioPlaying && this.currNote === "X") {
        this.stopAudio();
      }
    }
    else if (event.key === 'c' || event.key === 'C') {
      // Stop audio playback if it's currently playing
      this.CKeyPressed = false;
      if (this.audioPlaying && this.currNote === "C") {
        this.stopAudio();
      }
    }

    else if(event.key === " "){
      this.SpaceKeyPressed = false;
    }

    this.changeButton()
  }



  playAudio() {
    // Check if audioContext is null
    if (this.audioContext === null) {
      // If audioContext is null, log an error and return early
      console.error('AudioContext is null. Cannot play audio.');
      return;
    }
  
    // Define the audio file URLs
    let audioFileUrl: string;
  
    // Call the notes function to get the audio file URLs
    const notes = this.notes();
    if (notes) {
      [audioFileUrl] = notes; // Remove audioFileUrlCont from the assignment
    } else {
      return;
    }
  
    // Check if audio is not already playing
    if (!this.audioPlaying) {
      // Create a new AudioBufferSourceNode for the audio
      const source = this.audioContext.createBufferSource();
      // Get the preloaded AudioBuffer for the audio file
      const audioBuffer = this.preloadedAudios[audioFileUrl];
      if (audioBuffer) {
        // Assign the preloaded audio buffer to the BufferSourceNode
        source.buffer = audioBuffer;
        
        // Create a gain node
        const gainNode = this.audioContext.createGain();
        // Set the gain value based on the slider value (range is 0 to 1)
        gainNode.gain.value = this.sliderValue / 100;
  
        // Connect the source to the gain node, and then to the destination
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
  
        // Store the source node reference
        this.sourceNode = source;
        
        // Start the audio playback
        source.start(0);
        
        // Set audioPlaying to true
        this.audioPlaying = true;
      }
    }
  }
  

  stopAudio() {
    // Check if audioContext is null
    this.displayNewNote("");
    if (this.audioContext === null) {
      // If audioContext is null, log an error and return early
      console.error('AudioContext is null. Cannot stop audio.');
      return;
    }
  
    // Check if there is a source node currently playing
    if (this.sourceNode !== null) {
      // Stop audio playback
      this.sourceNode.stop();
      // Set audioPlaying to false
      this.audioPlaying = false;
    }
  }

  notes(): [string, string] | null {
    if (this.leftKeyPressed && this.downKeyPressed && this.rightKeyPressed) {
      // F
      if (this.AKeyPressed){
        this.displayNewNote("F#3")
      return ['assets/TrumpetSounds/FSharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        this.displayNewNote("C#4")
        return ['assets/TrumpetSounds/CSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    }
    else if (this.leftKeyPressed && !this.downKeyPressed && this.rightKeyPressed) {
      // G
      if (this.AKeyPressed){
        this.displayNewNote("G3")
        return ['assets/TrumpetSounds/G3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        this.displayNewNote("D4")
        return ['assets/TrumpetSounds/D4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    }
    else if (!this.leftKeyPressed && this.downKeyPressed && this.rightKeyPressed) {
      // G#
      if (this.AKeyPressed){
        this.displayNewNote("G#3")
        return ['assets/TrumpetSounds/GSharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        this.displayNewNote("D#4")
        return ['assets/TrumpetSounds/DSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        this.displayNewNote("G#4")
        return ['assets/TrumpetSounds/GSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.CKeyPressed){
        this.displayNewNote("G#5")
        return ['assets/TrumpetSounds/GSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    } 
    else if (this.leftKeyPressed && this.downKeyPressed && !this.rightKeyPressed) {
      // A
      if (this.AKeyPressed){
        this.displayNewNote("A3")
        return ['assets/TrumpetSounds/A3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        this.displayNewNote("E4")
        return ['assets/TrumpetSounds/E4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        this.displayNewNote("A4")
        return ['assets/TrumpetSounds/A4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed){
        this.displayNewNote("C#5")
        return ['assets/TrumpetSounds/CSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.CKeyPressed){
        this.displayNewNote("A5")
        return ['assets/TrumpetSounds/A5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    } 
    else if (this.leftKeyPressed && !this.downKeyPressed && !this.rightKeyPressed) {
      // A#
      if (this.AKeyPressed){
        this.displayNewNote("A#3")
        return ['assets/TrumpetSounds/ASharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        this.displayNewNote("F4")
        return ['assets/TrumpetSounds/F4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        this.displayNewNote("A#4")
        return ['assets/TrumpetSounds/ASharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed){
        this.displayNewNote("D5")
        return ['assets/TrumpetSounds/D5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.XKeyPressed){
        this.displayNewNote("F5")
        return ['assets/TrumpetSounds/F5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.CKeyPressed){
        this.displayNewNote("A#5")
        return ['assets/TrumpetSounds/ASharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    } 
    else if (!this.leftKeyPressed && this.downKeyPressed && !this.rightKeyPressed) {
      // B
      if (this.AKeyPressed){
        this.displayNewNote("B3")
        return ['assets/TrumpetSounds/B3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        this.displayNewNote("F#4")
        return ['assets/TrumpetSounds/FSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        this.displayNewNote("B4")
        return ['assets/TrumpetSounds/B4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed){
        this.displayNewNote("D#5")
        return ['assets/TrumpetSounds/DSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.XKeyPressed){
        this.displayNewNote("F#5")
        return ['assets/TrumpetSounds/FSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.CKeyPressed){
        this.displayNewNote("B5")
        return ['assets/TrumpetSounds/B5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    }
    else if (!this.leftKeyPressed && !this.downKeyPressed && !this.rightKeyPressed) {
      // C
      if (this.AKeyPressed){
        this.displayNewNote("C4")
        return ['assets/TrumpetSounds/C4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        this.displayNewNote("G4")
        return ['assets/TrumpetSounds/G4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        this.displayNewNote("C5")
        return ['assets/TrumpetSounds/C5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed){
        this.displayNewNote("E5")
        return ['assets/TrumpetSounds/E5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.XKeyPressed){
        this.displayNewNote("G5")
        return ['assets/TrumpetSounds/G5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.CKeyPressed){
        this.displayNewNote("C6")
        return ['assets/TrumpetSounds/C6.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    }
    else {
      // If the condition is not met, return null
      return null;
    }
  }

  changeTrumpet(delta: number) {
    // Set to Trumpet0, Trumpet1, Trumpet2, or Trumpet12 depending on the delta
    this.currentTrumpetIndex = delta;
    this.currentTrumpet = this.trumpets[this.currentTrumpetIndex];
  }

  setTrumpet() {
    // Set the initial trumpet image when the component is initialized
    this.currentTrumpet = this.trumpets[this.currentTrumpetIndex];
  }


  ///////////////////////////////////////////////////////////////Background

  showSlider() {
    clearTimeout(this.hideSliderTimeout);
    this.sliderVisible = true;
    const soundButton = document.getElementById('sound-image');
    if (soundButton) {
      soundButton.style.left = 'calc(50% + 37.5%)'; // Move sound button to the right
    }
  }
  
  hideSlider() {
    this.hideSliderTimeout = setTimeout(() => {
      this.sliderVisible = false;
      const soundButton = document.getElementById('sound-image');
      if (soundButton) {
        soundButton.style.left = 'calc(50% + 43%)'; // Move sound button back to original position
      }
    }, 100);
  }

  @HostListener('mouseenter', ['$event.target'])
  onMouseEnter(target: EventTarget) {
    if (this.isSoundBarOrSlider(target)) {
      clearTimeout(this.hideSliderTimeout);
      this.showSlider();
    }
  }

  @HostListener('mouseleave', ['$event.target'])
  onMouseLeave(target: EventTarget) {
    if (!this.isSoundBarOrSlider(target)) {
      this.hideSlider();
    }
  }

  isSoundBarOrSlider(target: EventTarget): boolean {
    return (target as HTMLElement).classList.contains('slider') || 
           (target as HTMLElement).classList.contains('sound-bar');
  }

  onSliderChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const sliderValue = parseInt(target.value);

    if (sliderValue === 0) {
      this.soundBarImage = "assets/SoundSymbols/SoundBar001.png";
    } 
    else if(sliderValue > 0 && sliderValue < 50){
      this.soundBarImage = "assets/SoundSymbols/SoundBar01.png";
    }
    else if(sliderValue >= 50 && sliderValue < 100){
      this.soundBarImage = "assets/SoundSymbols/SoundBar02.png";
    }
    else {
      this.soundBarImage = "assets/SoundSymbols/SoundBar03.png";
    }
    this.sliderValue = sliderValue;
  }

  changeButton(){
    if(this.leftKeyPressed){
      this.currentLeft = 'leftPressed.png'
    }
    else{
      this.currentLeft = 'left.png'
    }
    if(this.downKeyPressed){
      this.currentDown = 'downPressed.png'
    }
    else{
      this.currentDown = 'down.png'
    }
    if(this.rightKeyPressed){
      this.currentRight = 'rightPressed.png'
    }
    else{
      this.currentRight = 'right.png'
    }
    if(this.AKeyPressed && !this.AkeyFalse){
      this.currentA = 'APressed.png'
      const element = document.getElementById('AButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
    }
    else if(this.AkeyFalse){
      const element = document.getElementById('AButton');
      if(element){
        element.style.opacity = '0.5'; // Set opacity to 50%
      }
    }
    else{
      const element = document.getElementById('AButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
      this.currentA = 'A.png'
    }
    if(this.SKeyPressed && !this.SkeyFalse){
      this.currentS = 'SPressed.png'
      const element = document.getElementById('SButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
    }
    else if(this.SkeyFalse){
      const element = document.getElementById('SButton');
      if(element){
        element.style.opacity = '0.5'; // Set opacity to 50%
      }
    }
    else{
      const element = document.getElementById('SButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
      this.currentS = 'S.png'
    }
    if(this.DKeyPressed && !this.DkeyFalse){
      this.currentD = 'DPressed.png'
      const element = document.getElementById('DButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
    }
    else if(this.DkeyFalse){
      const element = document.getElementById('DButton');
      if(element){
        element.style.opacity = '0.5'; // Set opacity to 50%
      }
    }
    else{
      const element = document.getElementById('DButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
      this.currentD = 'D.png'
    }
    if(this.ZKeyPressed && !this.ZkeyFalse){
      this.currentZ = 'ZPressed.png'
      const element = document.getElementById('ZButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
    }
    else if(this.ZkeyFalse){
      const element = document.getElementById('ZButton');
      if(element){
        element.style.opacity = '0.5'; // Set opacity to 50%
      }
    }
    else{
      const element = document.getElementById('ZButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
      this.currentZ = 'Z.png'
    }
    if(this.XKeyPressed && !this.XkeyFalse){
      this.currentX = 'XPressed.png'
      const element = document.getElementById('XButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
    }
    else if(this.XkeyFalse){
      const element = document.getElementById('XButton');
      if(element){
        element.style.opacity = '0.5'; // Set opacity to 50%
      }
    }
    else{
      const element = document.getElementById('XButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
      this.currentX = 'X.png'
    }
    if(this.CKeyPressed && !this.CkeyFalse){
      this.currentC = 'CPressed.png'
      const element = document.getElementById('CButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
    }
    else if(this.CkeyFalse){
      const element = document.getElementById('CButton');
      if(element){
        element.style.opacity = '0.5'; // Set opacity to 50%
      }
    }
    else{
      const element = document.getElementById('CButton');
      if(element){
        element.style.opacity = '1'; // Set opacity to 50%
      }
      this.currentC = 'C.png'
    }
    if(this.SpaceKeyPressed){
      this.currentSpace = 'PressedSPACENEW.png'
    }
    else{
      this.currentSpace = 'SPACENEW.png'
    }
  }

  blurKeys(delta: number){
    switch(delta){
      case 3:
        this.AkeyFalse = false;
        this.SkeyFalse = false;
        this.DkeyFalse = false;
        this.ZkeyFalse = false;
        this.XkeyFalse = true;
        this.CkeyFalse = false;
        break;
      case 4:
        this.AkeyFalse = false;
        this.SkeyFalse = false;
        this.DkeyFalse = true;
        this.ZkeyFalse = true;
        this.XkeyFalse = true;
        this.CkeyFalse = true;
        break;
      case 5:
        this.AkeyFalse = false;
        this.SkeyFalse = false;
        this.DkeyFalse = false;
        this.ZkeyFalse = true;
        this.XkeyFalse = true;
        this.CkeyFalse = false;
        break;
      case 6:
        this.AkeyFalse = false;
        this.SkeyFalse = false;
        this.DkeyFalse = true;
        this.ZkeyFalse = true;
        this.XkeyFalse = true;
        this.CkeyFalse = true;
        break;
      case 7:
        this.AkeyFalse = true;
        this.SkeyFalse = true;
        this.DkeyFalse = true;
        this.ZkeyFalse = true;
        this.XkeyFalse = true;
        this.CkeyFalse = true;
        break;
      default:
        this.AkeyFalse = false;
        this.SkeyFalse = false;
        this.DkeyFalse = false;
        this.ZkeyFalse = false;
        this.XkeyFalse = false;
        this.CkeyFalse = false;
        break;
      }
  }


  ShowNote() {
    var noteText = document.getElementById('note-text');
    if (noteText && noteText.style.display === 'inline') {
      noteText.style.display = 'none';
    } else if (noteText) {
      noteText.style.display = 'inline';
    }
  }

  displayNewNote(delta: string) {
    var noteText = document.getElementById('note-text');
    if(noteText)
    noteText.textContent = 'Note: ' + delta;
  }
}