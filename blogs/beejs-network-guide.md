# Network Programming Fundamentals
## My Journey from Sockets to WebRTC

I wanted to understand WebRTC—how does real-time video calling work under the hood? But every article I read assumed knowledge of sockets, ports, and network layers. So I took a step back and dove into **Beej's Guide to Network Programming**, the legendary resource that has taught generations of programmers how networks actually work.

This is my distilled overview of what I learned.

---

## Why Start Here?

WebRTC is built on top of UDP sockets, ICE candidates, STUN/TURN servers—all concepts that assume you understand the fundamentals. Before you can appreciate *why* WebRTC works the way it does, you need to understand:

1. **How machines find each other** (IP addresses)
2. **How services are identified** (ports)
3. **How data flows** (sockets and protocols)

Let's build this foundation.

---

## Part 1: IP Addresses — Finding Machines on the Internet

Every device on the internet needs a unique identifier. That's your IP address.

![IP Address Concepts](beej/images/IP.excalidraw.svg)

### The Two Versions

- **IPv4**: The original (32-bit) — looks like `192.168.1.1`
- **IPv6**: The future (128-bit) — looks like `2001:0db8:85a3::8a2e:0370:7334`

Fun fact: IPv6 was championed by Vint Cerf, one of the "fathers of the internet."

### Anatomy of an Address

Every IP address has two parts:
1. **Network portion** — which network you're on
2. **Host portion** — which specific machine

A **netmask** tells you where the split is. For example:
- `192.168.1.0/24` means 24 bits for network, 8 bits for hosts (254 usable addresses)

### Special Addresses

- **Loopback** (`127.0.0.1` or `::1`): Routes back to yourself—great for testing
- **Private ranges**: `10.x.x.x`, `192.168.x.x`—used inside local networks

> 💡 **Analogy**: Think of an IP address as a hotel's street address. It gets you to the building, but you still need a room number.

---

## Part 2: Ports — Finding Services on a Machine

A single server can run many services: web server, database, SSH. How do clients know which one to talk to? **Ports**.

- Ports are 16-bit numbers (0-65535)
- They exist at the **Transport Layer**
- Combined with IP, they form a **socket address**: `192.168.1.1:8080`

### Well-Known Ports

Ports under 1024 require root/admin privileges:

| Port | Service |
|------|---------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 53 | DNS |

> 📁 On Unix systems, check `/etc/services` for the full list.

---

## Part 3: Byte Order — A Subtle Gotcha

Different CPU architectures store bytes differently:

- **Big Endian**: Most significant byte first (Network Byte Order)
- **Little Endian**: Least significant byte first (x86 processors)

When sending data over the network, you **must** convert to Big Endian:

```c
htons()  // host to network - short (16-bit)
htonl()  // host to network - long (32-bit)
ntohs()  // network to host - short
ntohl()  // network to host - long
```

Forget this, and your port numbers will look completely wrong on the receiving end!

---

## Part 4: Sockets — The Heart of Network Programming

Everything in Unix is a file. Sockets are no exception—they're just file descriptors that let you send and receive data over a network.

![Socket Programming Concepts](beej/images/Socket.excalidraw.svg)

### Two Types of Sockets

| Type | Protocol | Use Case |
|------|----------|----------|
| `SOCK_STREAM` | TCP | Reliable, ordered delivery (HTTP, SSH) |
| `SOCK_DGRAM` | UDP | Fast, unreliable (games, video, **WebRTC!**) |

### The Key Data Structures

```c
struct sockaddr_in {
    short sin_family;          // AF_INET
    unsigned short sin_port;   // Port (network byte order!)
    struct in_addr sin_addr;   // IP address
    unsigned char sin_zero[8]; // Padding
};
```

### Server Lifecycle

1. **`socket()`** — Create the endpoint
2. **`bind()`** — Attach to a local port
3. **`listen()`** — Mark as passive (ready to accept)
4. **`accept()`** — Block until a client connects, return new fd

### Client Lifecycle

1. **`socket()`** — Create the endpoint
2. **`connect()`** — Initiate connection to server

### Data Transfer

- **`send()` / `recv()`** — For connected sockets (TCP)
- **`sendto()` / `recvfrom()`** — For connectionless (UDP)

---

## Part 5: Beyond Blocking — poll() and select()

By default, socket calls **block**. Your program freezes until data arrives. For real applications, you need non-blocking I/O:

```c
struct pollfd fds[1];
fds[0].fd = socket_fd;
fds[0].events = POLLIN;  // Watch for incoming data

poll(fds, 1, timeout_ms);

if (fds[0].revents & POLLIN) {
    // Data ready to read!
}
```

This is crucial for building servers that handle multiple clients.

---

## Quick Reference

| Syscall | Purpose |
|---------|---------|
| `socket()` | Create endpoint |
| `bind()` | Assign local address |
| `listen()` | Enable incoming connections |
| `accept()` | Accept a connection |
| `connect()` | Connect to remote |
| `send()` / `recv()` | Transfer data |
| `close()` | Close the socket |
| `shutdown()` | Half-close (stop send or receive) |

---

## What's Next: WebRTC

Now that you understand sockets, here's the connection to WebRTC:

- WebRTC uses **UDP sockets** (`SOCK_DGRAM`) for low-latency media
- **STUN servers** help discover your public IP (NAT traversal)
- **TURN servers** relay traffic when direct P2P fails
- **ICE** is the protocol that orchestrates all of this

The fundamentals don't change—just the abstraction level.

---

## Resources

📚 **[Beej's Guide to Network Programming](https://beej.us/guide/bgnet/html/split/index.html)** — The legendary guide that taught generations of programmers how networks work. If you want to go deeper into any of these concepts, this is your starting point.

---

*These notes are from my study of Beej's Guide to Network Programming. It remains one of the best resources for understanding network programming from first principles.*
