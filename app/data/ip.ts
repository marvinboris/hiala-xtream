export async function getIPAddress() {
  const ip: { ip?: string } = {};
  const RTCPeerConnection =
    window.RTCPeerConnection ||
    (<any>window).mozRTCPeerConnection ||
    (<any>window).webkitRTCPeerConnection;

  if (!RTCPeerConnection) {
    return;
  }

  const pc = new RTCPeerConnection({ iceServers: [] });

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      // parse IP address from candidate string
      const ipRegex =
        /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
      const ipAddr = ipRegex.exec(e.candidate.candidate)?.[1];

      // set IP address
      (<any>ip).ip = ipAddr;
    }
  };

  pc.createDataChannel("");

  pc.createOffer().then((offer) => pc.setLocalDescription(offer));

  return ip;
}
