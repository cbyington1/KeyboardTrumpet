//Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
//ng serve --open

import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  trumpets: string[] = ['Trumpet0.png', 'Trumpet1.png', 'Trumpet2.png', 'Trumpet12.png', 'Trumpet13.png', 'Trumpet23.png', 'Trumpet123.png', 'Trumpet3.png'];
  currentTrumpetIndex: number = 0;
  currentTrumpet: string = this.trumpets[this.currentTrumpetIndex];
  leftKeyPressed: boolean = false;
  downKeyPressed: boolean = false;
  rightKeyPressed: boolean = false;
  audio: HTMLAudioElement | null = null;
  // Variable to track if audio is playing
  audioPlaying: boolean = false;

  constructor() {
    // Set the initial trumpet image when the component is created
    this.setTrumpet();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.leftKeyPressed = true;
    } else if (event.key === 'ArrowDown') {
      this.downKeyPressed = true;
    }
    else if (event.key === 'ArrowRight') {
      this.rightKeyPressed = true;
    }
    else if (event.key === 'a' || event.key === 'A') {
      if (!this.audioPlaying) { // Check if audio is not already playing
        this.playAudio(); // Call the playAudio method when 'A' key is pressed
      }
    }

    if(this.leftKeyPressed && this.downKeyPressed && this.rightKeyPressed){
      this.changeTrumpet(6)
    }
    else if (this.leftKeyPressed && this.downKeyPressed) {
      this.changeTrumpet(3); // Move to Trumpet12 when both left and down arrow keys are pressed
    } 
    else if(this.leftKeyPressed && this.rightKeyPressed){
      this.changeTrumpet(4)
    }
    else if(this.downKeyPressed && this.rightKeyPressed){
      this.changeTrumpet(5)
    }
    else if (this.leftKeyPressed) {
      this.changeTrumpet(1); // Move to Trumpet1 when left arrow key is pressed
    } 
    else if (this.downKeyPressed) {
      this.changeTrumpet(2); // Move to Trumpet2 when down arrow key is pressed
    }
    else if(this.rightKeyPressed){
      this.changeTrumpet(7)
    }
  }

  
  @HostListener('document:keyup', ['$event'])
handleKeyUpEvent(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    this.leftKeyPressed = false;
    this.changeTrumpet(this.downKeyPressed && this.rightKeyPressed ? 5 : (this.rightKeyPressed ? 7 : (this.downKeyPressed ? 2 : 0)));
  } else if (event.key === 'ArrowDown') {
    this.downKeyPressed = false;
    this.changeTrumpet(this.leftKeyPressed && this.rightKeyPressed ? 4 : (this.rightKeyPressed ? 7 : (this.leftKeyPressed ? 1 : 0))); 
  } else if (event.key === 'ArrowRight') {
    this.rightKeyPressed = false;
    this.changeTrumpet(this.leftKeyPressed && this.downKeyPressed ? 3 : (this.downKeyPressed ? 2 : (this.leftKeyPressed ? 1 : 0))); 
  } else if (event.key === 'a' || event.key === 'A') {
    // Stop audio playback if it's currently playing
    if (this.audioPlaying) {
      this.stopAudio();
    }
  }
}

  playAudio() {
    // Define the audio file URL
    const audioFileUrl = 'assets/TrumpetSounds/A3.mp3'; // Replace 'assets/audiofile.mp3' with your audio file path

    // Check if audio is already playing
    if (!this.audioPlaying) {
      // Create a new Audio object and play it
      this.audio = new Audio(audioFileUrl);
      if (this.audio) {
        this.audio.play();

        // Set audioPlaying to true
        this.audioPlaying = true;

        // Listen for audio end event to set audioPlaying back to false
        this.audio.onended = () => {
          this.audioPlaying = false;
        };
      }
    }
  }

  stopAudio() {
    // Check if audio is currently playing
    if (this.audio) {
      // Pause the audio playback
      this.audio.pause();

      // Set audioPlaying to false
      this.audioPlaying = false;
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