import { LightningElement } from 'lwc';
export default class VoiceRecorder extends LightningElement {

    isRecording = false;
    isNotRecording = true;
    audioUrl = null;
    statusMessage = 'Click "Start Recording" to begin.';

    mediaRecorder;
    recordedChunks = [];

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/wav' });
                this.audioUrl = URL.createObjectURL(blob);
                this.statusMessage = 'Recording complete. You can play or download it.';
            };

            this.recordedChunks = [];
            this.mediaRecorder.start();

            this.isRecording = true;
            this.isNotRecording = false;
            this.statusMessage = 'Recording...';
        } catch (error) {
            console.error('Error accessing microphone:', error);
            this.statusMessage = 'Failed to access microphone. Please check permissions.';
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        this.isRecording = false;
        this.isNotRecording = true;
    }
}