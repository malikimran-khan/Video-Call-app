// WebRTC utility functions

const STUN_CONFIG: RTCConfiguration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ],
};

export const createPeerConnection = (
    onIceCandidate: (candidate: RTCIceCandidate) => void,
    onTrack: (stream: MediaStream) => void,
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void
): RTCPeerConnection => {
    const pc = new RTCPeerConnection(STUN_CONFIG);

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            onIceCandidate(event.candidate);
        }
    };

    pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
            onTrack(event.streams[0]);
        }
    };

    if (onConnectionStateChange) {
        pc.onconnectionstatechange = () => {
            onConnectionStateChange(pc.connectionState);
        };
    }

    return pc;
};

export const createOffer = async (pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
};

export const createAnswer = async (pc: RTCPeerConnection): Promise<RTCSessionDescriptionInit> => {
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
};

export const setRemoteDescription = async (
    pc: RTCPeerConnection,
    desc: RTCSessionDescriptionInit
): Promise<void> => {
    await pc.setRemoteDescription(new RTCSessionDescription(desc));
};

export const addIceCandidate = async (
    pc: RTCPeerConnection,
    candidate: RTCIceCandidateInit
): Promise<void> => {
    try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
        console.error("Error adding ICE candidate:", err);
    }
};

export const getMediaStream = async (
    callType: "voice" | "video"
): Promise<MediaStream> => {
    return await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
    });
};

export const stopMediaStream = (stream: MediaStream | null) => {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
};

export { STUN_CONFIG };
