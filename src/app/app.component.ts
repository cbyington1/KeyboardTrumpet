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
  trumpets: string[] = ['Trumpet0.png', 'Trumpet1.png', 'Trumpet2.png', 'Trumpet12.png', 'Trumpet13.png', 'Trumpet23.png', 'Trumpet123.png', 'Trumpet3.png'];
  notePaths: string[][] = [
    ['assets/TrumpetSounds/FSharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/G3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/GSharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/A3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/ASharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/B3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/C4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/CSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/D4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/DSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/E4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/F4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/FSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/G4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/GSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/A4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/ASharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/B4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/C5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/CSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/D5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/DSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/E5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/F5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/FSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/G5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/GSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/A5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/ASharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/B5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/C6.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/CSharp6.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/D6.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/DSharp6.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/E6.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
    ['assets/TrumpetSounds/F6.mp3', 'assets/TrumpetSounds/A3Cont.mp3'],
  ];

  currentTrumpetIndex: number = 0;
  currentTrumpet: string = this.trumpets[this.currentTrumpetIndex];
  leftKeyPressed: boolean = false;
  downKeyPressed: boolean = false;
  rightKeyPressed: boolean = false;
  AKeyPressed: boolean = false;
  SKeyPressed: boolean = false;
  DKeyPressed: boolean = false;
  ZKeyPressed: boolean = false;
  XKeyPressed: boolean = false;
  CKeyPressed: boolean = false;
  currNote: string = "";
  audio: HTMLAudioElement | null = null;
  // Declare audioContext as null initially
  audioContext: AudioContext | null = null;
  // Variable to track if audio is playing
  audioPlaying: boolean = false;
  // Preloaded Audio objects
  preloadedAudios: { [key: string]: AudioBuffer } = {};
  // Store the reference to the currently playing source node
  sourceNode: AudioBufferSourceNode | null = null; // Add this line

  constructor(private sanitizer: DomSanitizer) {
    // Set the initial trumpet image when the component is created
    this.setTrumpet();

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
    // Define the audio file URLs
    const audioFileUrls: string[] = [];

    this.notePaths.forEach((note) => {
      audioFileUrls.push(note[0], note[1]);
    });
  
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


    if (this.leftKeyPressed && this.downKeyPressed && this.rightKeyPressed) {
      this.changeTrumpet(6);
    } else if (this.leftKeyPressed && this.downKeyPressed) {
      this.changeTrumpet(3); // Move to Trumpet12 when both left and down arrow keys are pressed
    } else if (this.leftKeyPressed && this.rightKeyPressed) {
      this.changeTrumpet(4);
    } else if (this.downKeyPressed && this.rightKeyPressed) {
      this.changeTrumpet(5);
    } else if (this.leftKeyPressed) {
      this.changeTrumpet(1); // Move to Trumpet1 when left arrow key is pressed
    } else if (this.downKeyPressed) {
      this.changeTrumpet(2); // Move to Trumpet2 when down arrow key is pressed
    } else if (this.rightKeyPressed) {
      this.changeTrumpet(7);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      if(this.leftKeyPressed){
        this.stopAudio()
      }
      this.leftKeyPressed = false;
      this.changeTrumpet(this.downKeyPressed && this.rightKeyPressed ? 5 : (this.rightKeyPressed ? 7 : (this.downKeyPressed ? 2 : 0)));
      this.playAudio()
    } 
    else if (event.key === 'ArrowDown') {
      if(this.downKeyPressed){
        this.stopAudio()
      }
      this.downKeyPressed = false;
      this.changeTrumpet(this.leftKeyPressed && this.rightKeyPressed ? 4 : (this.rightKeyPressed ? 7 : (this.leftKeyPressed ? 1 : 0)));
      this.playAudio()
    } 
    else if (event.key === 'ArrowRight') {
      if(this.rightKeyPressed){
        this.stopAudio()
      }
      this.rightKeyPressed = false;
      this.changeTrumpet(this.leftKeyPressed && this.downKeyPressed ? 3 : (this.downKeyPressed ? 2 : (this.leftKeyPressed ? 1 : 0)));
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
    // let audioFileUrlCont: string; // Commented out, not used

    // Call the notes function to get the audio file URLs
    const notes = this.notes();
    if (notes) {
      [audioFileUrl] = notes; // Remove audioFileUrlCont from the assignment
    } else {
      return;
    }
  
    // Check if audio is not already playing
    if (!this.audioPlaying) {
      // Create a new AudioBufferSourceNode for A3.mp3
      const sourceA3 = this.audioContext.createBufferSource();
      // Get the preloaded AudioBuffer for A3.mp3
      const audioBufferA3 = this.preloadedAudios[audioFileUrl];
      if (audioBufferA3) {
        // Assign the preloaded audio buffer to the BufferSourceNode
        sourceA3.buffer = audioBufferA3;
        sourceA3.connect(this.audioContext.destination);
        // Store the source node reference
        this.sourceNode = sourceA3;
        
        // Create a new AudioBufferSourceNode for A3Cont.mp3
        // const sourceA3Cont = this.audioContext.createBufferSource(); // Commented out, not used
        // Get the preloaded AudioBuffer for A3Cont.mp3
        // const audioBufferA3Cont = this.preloadedAudios[audioFileUrlCont]; // Commented out, not used
        // if (audioBufferA3Cont) { // Commented out, not used
          // Assign the preloaded audio buffer to the BufferSourceNode
          // sourceA3Cont.buffer = audioBufferA3Cont; // Commented out, not used
          // sourceA3Cont.connect(this.audioContext.destination); // Commented out, not used

          // Set the onended event handler for sourceA3 to start playing A3Cont.mp3 after A3.mp3 ends
          // sourceA3.onended = () => { // Commented out, not used
            // Calculate the offset to start playing A3Cont.mp3 from the last half of the duration
            // const offset = audioBufferA3Cont.duration / 2; // Commented out, not used
            // sourceA3Cont.start(0, offset); // Start playing A3Cont.mp3 from the last half // Commented out, not used
          // }; // Commented out, not used

          // Start playing A3.mp3
          sourceA3.start(0);
          // Set audioPlaying to true
          this.audioPlaying = true;
        // } // Commented out, not used
      }
    }
}

  stopAudio() {
    // Check if audioContext is null
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
      return ['assets/TrumpetSounds/FSharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed || this.DKeyPressed || this.ZKeyPressed || this.XKeyPressed || this.CKeyPressed){
        return ['assets/TrumpetSounds/CSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    }
    else if (this.leftKeyPressed && !this.downKeyPressed && this.rightKeyPressed) {
      // G
      if (this.AKeyPressed){
        return ['assets/TrumpetSounds/G3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed || this.DKeyPressed || this.ZKeyPressed || this.XKeyPressed || this.CKeyPressed){
        return ['assets/TrumpetSounds/D4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    }
    else if (!this.leftKeyPressed && this.downKeyPressed && this.rightKeyPressed) {
      // G#
      if (this.AKeyPressed){
        return ['assets/TrumpetSounds/GSharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        return ['assets/TrumpetSounds/DSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        return ['assets/TrumpetSounds/GSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed || this.XKeyPressed || this.CKeyPressed){
        return ['assets/TrumpetSounds/GSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    } 
    else if (this.leftKeyPressed && this.downKeyPressed && !this.rightKeyPressed) {
      // A
      if (this.AKeyPressed){
        return ['assets/TrumpetSounds/A3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        return ['assets/TrumpetSounds/E4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        return ['assets/TrumpetSounds/A4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed){
        return ['assets/TrumpetSounds/CSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.XKeyPressed || this.CKeyPressed){
        return ['assets/TrumpetSounds/A5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    } 
    else if (this.leftKeyPressed && !this.downKeyPressed && !this.rightKeyPressed) {
      // A#
      if (this.AKeyPressed){
        return ['assets/TrumpetSounds/ASharp3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        return ['assets/TrumpetSounds/F4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        return ['assets/TrumpetSounds/ASharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed){
        return ['assets/TrumpetSounds/D5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.XKeyPressed){
        return ['assets/TrumpetSounds/F5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.CKeyPressed){
        return ['assets/TrumpetSounds/ASharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    } 
    else if (!this.leftKeyPressed && this.downKeyPressed && !this.rightKeyPressed) {
      // B
      if (this.AKeyPressed){
        return ['assets/TrumpetSounds/B3.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        return ['assets/TrumpetSounds/FSharp4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        return ['assets/TrumpetSounds/B4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed){
        return ['assets/TrumpetSounds/DSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.XKeyPressed){
        return ['assets/TrumpetSounds/FSharp5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.CKeyPressed){
        return ['assets/TrumpetSounds/B5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      return null
    }
    else if (!this.leftKeyPressed && !this.downKeyPressed && !this.rightKeyPressed) {
      // C
      if (this.AKeyPressed){
        return ['assets/TrumpetSounds/C4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.SKeyPressed){
        return ['assets/TrumpetSounds/G4.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.DKeyPressed){
        return ['assets/TrumpetSounds/C5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.ZKeyPressed){
        return ['assets/TrumpetSounds/E5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.XKeyPressed){
        return ['assets/TrumpetSounds/G5.mp3', 'assets/TrumpetSounds/A3Cont.mp3'];
      }
      else if (this.CKeyPressed){
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
}
