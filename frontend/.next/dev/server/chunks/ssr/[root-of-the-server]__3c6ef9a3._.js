module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[project]/lib/ws.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "disconnectStompClient",
    ()=>disconnectStompClient,
    "getStompClient",
    ()=>getStompClient,
    "waitForConnection",
    ()=>waitForConnection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stomp$2f$stompjs$2f$esm6$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stomp/stompjs/esm6/client.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sockjs$2d$client$2f$lib$2f$entry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sockjs-client/lib/entry.js [app-ssr] (ecmascript)");
'use client';
;
;
let stompClient = null;
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:8080") || 'http://localhost:8080';
const WS_URL = `${API_BASE.replace(/\/$/, '')}/ws`;
function getStompClient() {
    if (stompClient) return stompClient;
    stompClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stomp$2f$stompjs$2f$esm6$2f$client$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Client"]({
        webSocketFactory: ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sockjs$2d$client$2f$lib$2f$entry$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](WS_URL),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: ()=>console.log("WebSocket connected"),
        onDisconnect: ()=>console.log("WebSocket disconnected"),
        onStompError: (frame)=>{
            console.error("STOMP error:", frame.headers["message"], frame.body);
        }
    });
    stompClient.activate();
    return stompClient;
}
function waitForConnection(client) {
    return new Promise((resolve)=>{
        if (client.connected) return resolve();
        const prevOnConnect = client.onConnect;
        client.onConnect = (frame)=>{
            if (prevOnConnect) prevOnConnect(frame);
            resolve();
            client.onConnect = prevOnConnect ?? (()=>{});
        };
    });
}
async function disconnectStompClient() {
    if (!stompClient) return;
    await stompClient.deactivate();
    stompClient = null;
}
}),
"[project]/lib/chatUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for chat features
 * Inspired by WhatsApp, Messenger, Instagram, and Omegle
 */ /**
 * Formats timestamp to relative time (e.g., "Just now", "2 min ago", "1 hour ago")
 * Similar to WhatsApp and Messenger
 */ __turbopack_context__.s([
    "formatDateSeparator",
    ()=>formatDateSeparator,
    "formatFullTimestamp",
    ()=>formatFullTimestamp,
    "formatMessageTime",
    ()=>formatMessageTime,
    "shouldShowDateSeparator",
    ()=>shouldShowDateSeparator
]);
function formatMessageTime(timestamp) {
    const now = Date.now();
    const messageTime = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
    const diffMs = now - messageTime;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    // For older messages, show date and time
    const date = new Date(messageTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday ${date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })}`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }
}
function formatFullTimestamp(timestamp) {
    const messageTime = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
    const date = new Date(messageTime);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
function shouldShowDateSeparator(currentMessage, previousMessage) {
    if (!previousMessage) return true;
    const currentDate = new Date(typeof currentMessage.timestamp === 'string' ? new Date(currentMessage.timestamp).getTime() : currentMessage.timestamp);
    const previousDate = new Date(typeof previousMessage.timestamp === 'string' ? new Date(previousMessage.timestamp).getTime() : previousMessage.timestamp);
    return currentDate.getDate() !== previousDate.getDate() || currentDate.getMonth() !== previousDate.getMonth() || currentDate.getFullYear() !== previousDate.getFullYear();
}
function formatDateSeparator(timestamp) {
    const date = new Date(typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    }
}
}),
"[project]/components/ChatRoom.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatRoom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ws$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ws.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/chatUtils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function ChatRoom({ sessionId, matchData }) {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [myUsername, setMyUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [peerUsername, setPeerUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [sessionEnded, setSessionEnded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [finding, setFinding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const API_BASE = ("TURBOPACK compile-time value", "http://localhost:8080") || 'http://localhost:8080';
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const subscriptionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const didSubscribeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const sessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(sessionId);
    // Handler function for processing messages
    const handleMessage = (messageBody)=>{
        try {
            const data = JSON.parse(messageBody);
            // Validate message structure
            if (data && typeof data.message === 'string') {
                // If this is a system 'Session ended.' message, clear previous messages and stop
                if (data.username === 'system' && data.message === 'Session ended.') {
                    setMessages([
                        {
                            ...data,
                            timestamp: Date.now()
                        }
                    ]);
                    // unsubscribe
                    if (subscriptionRef.current) {
                        subscriptionRef.current.unsubscribe();
                        subscriptionRef.current = null;
                    }
                    setSessionEnded(true);
                    sessionStorage.removeItem('matchData');
                    // navigate back to home
                    router.push('/');
                    return;
                }
                // Track peer's username from their messages
                if (data.senderSessionId && data.senderSessionId !== sessionIdRef.current) {
                    if (data.username) {
                        setPeerUsername(data.username);
                    }
                }
                // Ensure roomId and senderSessionId are set for room-based chat
                const roomMessage = {
                    ...data,
                    roomId: matchData.roomId,
                    senderSessionId: data.senderSessionId || sessionIdRef.current,
                    timestamp: data.timestamp || Date.now()
                };
                setMessages((prev)=>[
                        ...prev,
                        roomMessage
                    ]);
            }
        } catch (error) {
            console.error("Failed to parse chat message:", error);
        }
    };
    const setupConnection = async (isMounted)=>{
        try {
            const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ws$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStompClient"])();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ws$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForConnection"])(client);
            if (!isMounted) return;
            // React StrictMode can run effects twice in dev; guard to avoid double subscribe
            if (didSubscribeRef.current) return;
            didSubscribeRef.current = true;
            // Subscribe to room-specific topic
            subscriptionRef.current = client.subscribe(`/topic/chat/${matchData.roomId}`, (message)=>handleMessage(message.body));
        } catch (error) {
            console.error("Failed to setup chat connection:", error);
        }
    };
    // Generate or retrieve username for current user
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const storedUsername = sessionStorage.getItem(`chat_username_${sessionId}`);
        if (storedUsername) {
            setMyUsername(storedUsername);
        } else {
            // Generate a unique guest username using sessionId (UUID) to ensure uniqueness
            // Each UUID is unique, so we use multiple parts of it to create a unique numeric identifier
            const uuidHex = sessionId.replace(/-/g, '');
            // Use parts from different sections of the UUID and combine them
            const part1 = parseInt(uuidHex.substring(0, 6), 16);
            const part2 = parseInt(uuidHex.substring(8, 14), 16);
            const part3 = parseInt(uuidHex.substring(16, 22), 16);
            // Combine all parts using XOR to distribute values better
            const combined = (part1 ^ part2 ^ part3) % 99999999;
            const usernameSuffix = String(combined + 1).padStart(8, '0'); // +1 to avoid 00000000
            const username = `Friend${usernameSuffix}`;
            sessionStorage.setItem(`chat_username_${sessionId}`, username);
            setMyUsername(username);
        }
    }, [
        sessionId
    ]);
    // Keep sessionId ref updated
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        sessionIdRef.current = sessionId;
    }, [
        sessionId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        setupConnection(isMounted);
        return ()=>{
            isMounted = false;
            didSubscribeRef.current = false;
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            setSessionEnded(false);
        };
    }, [
        matchData.roomId
    ]);
    const sendMessage = async ()=>{
        const messageText = input.trim();
        if (!messageText) return;
        if (sessionEnded || finding) return;
        try {
            // Moderate message before sending
            const moderationResponse = await fetch('/api/moderate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: messageText
                })
            });
            const moderationResult = await moderationResponse.json();
            if (!moderationResult.isAppropriate) {
                alert(`Message cannot be sent: ${moderationResult.reason || 'Content violates community guidelines'}`);
                return;
            }
            const client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ws$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStompClient"])();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ws$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["waitForConnection"])(client);
            const chatMessage = {
                roomId: matchData.roomId,
                senderSessionId: sessionId,
                message: messageText,
                username: myUsername
            };
            client.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(chatMessage)
            });
            setInput("");
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Failed to send message. Please try again.");
        }
    };
    const endSession = async ()=>{
        try {
            await fetch(`${API_BASE}/api/session/${sessionId}/end`, {
                method: 'POST'
            });
        } catch (e) {
        // ignore errors
        }
        // Clear UI and stop subscribing
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }
        setMessages([]);
        setSessionEnded(true);
        // show neutral system message locally then navigate to home
        sessionStorage.removeItem('matchData');
        router.push('/');
    };
    const changeFriend = async ()=>{
        // retrieve matchingData (mood/age/country) to provide to backend
        const matchingDataRaw = sessionStorage.getItem('matchingData');
        let body = {};
        if (matchingDataRaw) {
            try {
                body = JSON.parse(matchingDataRaw);
            } catch  {
                body = {};
            }
        }
        try {
            await fetch(`${API_BASE}/api/session/${sessionId}/change-friend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        } catch (e) {
        // ignore
        }
        // Clear UI and show finding state
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }
        setMessages([]);
        setFinding(true);
        // navigate to matching which will enqueue and find a new friend
        router.push('/matching');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-[calc(100vh-4rem)] flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "h4 text-white mb-1",
                                    children: "Chat Room"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatRoom.tsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 bg-green-400 rounded-full animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatRoom.tsx",
                                            lineNumber: 249,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-white/80",
                                            children: peerUsername ? `Connected to ${peerUsername}` : "Connected"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ChatRoom.tsx",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ChatRoom.tsx",
                                    lineNumber: 248,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ChatRoom.tsx",
                            lineNumber: 246,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: changeFriend,
                                    className: "px-3 py-2 bg-white/10 text-white rounded-md hover:bg-white/20",
                                    children: "Change Friend"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatRoom.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: endSession,
                                    className: "px-3 py-2 bg-red-600 text-white rounded-md hover:opacity-90",
                                    children: "End Session"
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatRoom.tsx",
                                    lineNumber: 259,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ChatRoom.tsx",
                            lineNumber: 257,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ChatRoom.tsx",
                    lineNumber: 245,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ChatRoom.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 overflow-y-auto mb-4 min-h-0",
                children: messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center text-white/60 mt-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "h3 text-white mb-1",
                        children: "Start the conversation!"
                    }, void 0, false, {
                        fileName: "[project]/components/ChatRoom.tsx",
                        lineNumber: 267,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ChatRoom.tsx",
                    lineNumber: 266,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: messages.map((m, idx)=>{
                        const isMyMessage = m.senderSessionId === sessionIdRef.current;
                        const timestamp = typeof m.timestamp === 'string' ? new Date(m.timestamp).getTime() : m.timestamp;
                        const showDateSeparator = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["shouldShowDateSeparator"])(m, messages[idx - 1]);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                showDateSeparator && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center my-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateSeparator"])(timestamp)
                                    }, void 0, false, {
                                        fileName: "[project]/components/ChatRoom.tsx",
                                        lineNumber: 280,
                                        columnNumber: 23
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatRoom.tsx",
                                    lineNumber: 279,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-1`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `max-w-[75%] sm:max-w-[65%] ${isMyMessage ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white/20 text-white rounded-2xl rounded-tl-sm'} px-4 py-2.5 shadow-sm`,
                                        title: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatFullTimestamp"])(timestamp),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-sm sm:text-base wrap-break-word leading-relaxed",
                                                children: m.message
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatRoom.tsx",
                                                lineNumber: 295,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `text-[10px] opacity-70 mt-1.5 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`,
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$chatUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatMessageTime"])(timestamp)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ChatRoom.tsx",
                                                lineNumber: 298,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ChatRoom.tsx",
                                        lineNumber: 287,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ChatRoom.tsx",
                                    lineNumber: 285,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, idx, true, {
                            fileName: "[project]/components/ChatRoom.tsx",
                            lineNumber: 277,
                            columnNumber: 17
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/ChatRoom.tsx",
                    lineNumber: 270,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ChatRoom.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 items-end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 relative",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: input,
                            onChange: (e)=>setInput(e.target.value),
                            placeholder: "Type a message...",
                            rows: 1,
                            className: "w-full p-3 sm:p-4 text-base bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 resize-none min-h-[48px] max-h-32 overflow-y-auto scrollbar-hide",
                            onKeyDown: (e)=>{
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            },
                            style: {
                                height: 'auto'
                            },
                            onInput: (e)=>{
                                const target = e.target;
                                target.style.height = 'auto';
                                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/ChatRoom.tsx",
                            lineNumber: 312,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ChatRoom.tsx",
                        lineNumber: 311,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: sendMessage,
                        disabled: !input.trim(),
                        className: "px-5 sm:px-6 py-3 sm:py-4 bg-white height-8 text-blue-600 rounded-2xl font-medium hover:bg-white/90 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white flex items-center justify-center min-w-[64px]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            viewBox: "0 0 20 20",
                            fill: "currentColor",
                            className: "w-5 h-9",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
                            }, void 0, false, {
                                fileName: "[project]/components/ChatRoom.tsx",
                                lineNumber: 345,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ChatRoom.tsx",
                            lineNumber: 339,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ChatRoom.tsx",
                        lineNumber: 334,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ChatRoom.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ChatRoom.tsx",
        lineNumber: 243,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/chat/[roomId]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatRoomPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatRoom$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ChatRoom.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function ChatRoomPage() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const roomId = params.roomId;
    const [sessionId, setSessionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [matchData, setMatchData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Mark as mounted to indicate we're on the client
        setMounted(true);
        // Only access sessionStorage on the client side (sessionStorage is per-tab, localStorage is shared)
        const storedSessionId = sessionStorage.getItem('sessionId');
        const savedMatchData = sessionStorage.getItem('matchData');
        setSessionId(storedSessionId);
        if (savedMatchData) {
            try {
                const parsed = JSON.parse(savedMatchData);
                // Verify the roomId matches
                if (parsed.roomId === roomId) {
                    setMatchData(parsed);
                } else {
                    setMatchData(null);
                }
            } catch  {
                setMatchData(null);
            }
        } else {
            setMatchData(null);
        }
    }, [
        roomId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!mounted) return;
        if (!sessionId) {
            router.push('/');
            return;
        }
        if (!roomId) {
            router.push('/matching');
            return;
        }
        if (!matchData) {
            router.push('/matching');
            return;
        }
    }, [
        sessionId,
        roomId,
        matchData,
        router,
        mounted
    ]);
    // Always show loading until mounted and data is loaded
    if (!mounted || !sessionId || !matchData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center gradient-bg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-white text-lg",
                children: "Loading..."
            }, void 0, false, {
                fileName: "[project]/app/chat/[roomId]/page.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/chat/[roomId]/page.tsx",
            lineNumber: 65,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen gradient-bg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto p-4 sm:p-6 lg:p-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ChatRoom$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                sessionId: sessionId,
                matchData: matchData
            }, void 0, false, {
                fileName: "[project]/app/chat/[roomId]/page.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/chat/[roomId]/page.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/chat/[roomId]/page.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3c6ef9a3._.js.map