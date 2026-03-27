declare module 'react-speech-recognition' {
  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
  }

  export interface ListeningOptions {
    continuous?: boolean;
    lang?: string;
  }

  export interface SpeechRecognition {
    startListening(options?: ListeningOptions): Promise<void>;
    stopListening(): Promise<void>;
    abortListening(): Promise<void>;
    browserSupportsSpeechRecognition(): boolean;
  }

  const SpeechRecognition: SpeechRecognition;
  export default SpeechRecognition;

  export function useSpeechRecognition(options?: {
    clearTranscriptOnListen?: boolean;
    commands?: any[];
  }): {
    transcript: string;
    interimTranscript: string;
    finalTranscript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
    isMicrophoneAvailable: boolean;
  };
}
