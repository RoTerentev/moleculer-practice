import io from 'socket.io-client';

const WS_URL = `${window.location.origin}/www`;

export function open(wsUrl = WS_URL) {
  return io(WS_URL, {});
}