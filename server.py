from socket import socket
from base64 import b64encode
from hashlib import sha1

MAGIC = b"258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

ws = socket()
ws.settimeout(60)  # ป้องกันค้างถ้าไม่มี client ต่อมาสักพัก
ws.bind(("", 80))
ws.listen(1)

try:
    conn, addr = ws.accept()
    conn.settimeout(30)  # ถ้า client ไม่ส่งอะไรเลยภายใน 30 วินาที จะตัดการเชื่อมต่อ
    print(f"New connection from {addr}")

    # Parse request
    nonce = None
    for line in conn.recv(4096).split(b"\r\n"):
        if line.startswith(b"Sec-WebSocket-Key"):
            nonce = line.split(b":")[1].strip()
    if not nonce:
        conn.close()
        raise ValueError("Missing Sec-WebSocket-Key in handshake")

    # Format response
    response = f"""\
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: {b64encode(sha1(nonce + MAGIC).digest()).decode()}

"""
    conn.send(response.replace("\n", "\r\n").encode())

    while True:  # decode messages from the client
        header = conn.recv(2)
        FIN = bool(header[0] & 0x80)  # bit 0
        assert FIN == 1, "We only support unfragmented messages"
        opcode = header[0] & 0xf  # bits 4-7
        assert opcode == 1 or opcode == 2, "We only support data messages"
        masked = bool(header[1] & 0x80)  # bit 8
        assert masked, "The client must mask all frames"
        payload_size = header[1] & 0x7f  # bits 9-15
        assert payload_size <= 125, "We only support small messages"
        masking_key = conn.recv(4)
        payload = bytearray(conn.recv(payload_size))
        for i in range(payload_size):
            payload[i] = payload[i] ^ masking_key[i % 4]
        print(payload)

except KeyboardInterrupt:
    print("Server shutdown.")

except Exception as e:
    print(f"Error: {e}")

finally:
    try:
        conn.close()
    except:
        pass
    try:
        ws.close()
    except:
        pass
