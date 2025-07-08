import styles from "../styles/canvas.module.css"
import { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import socket from "./socket"

const Canvas = ({user, setPaths}) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [color, setColor] = useState('#000000');
  const [strokeSize, setStrokeSize] = useState(3);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [clearRequest, setClearRequest] = useState(null)
  const chatEndRef = useRef(null)
  const { id: lobbyId } = useParams();

  useEffect(() => {
    if (!lobbyId || !user) return;
    socket.emit("joinRoom", {roomId: lobbyId, username: user});
    const handleUserJoined = (username) => {
      setChatMessages((prev) => [...prev, {username:`RoomBot`, message:`${username} joined the room`}])
    };
    const handleUserLeft = (username) => {
      setChatMessages((prev) => [...prev, {username:`RoomBot`, message:`${username} has left the room`}])
    };
    const handleMessage = ({username, message}) => {
      setChatMessages((prev) => [...prev, {username, message}]);
    };
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft) 
    socket.on("chatMessage", handleMessage);
    return () => {
      socket.emit("leaveRoom", {roomId: lobbyId, username: user});
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
      socket.off("chatMessage", handleMessage);
    };
  }, [lobbyId, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  },[chatMessages])

  useEffect(() => {
    if (!lobbyId || !user) return;
    socket.on("drawing", (data) => {
      setPaths((prev) => {
        const updated = [...prev, data]
        redraw(updated)
        return updated
      })
    });
    socket.on("init-paths", (initialPaths) => {
      setPaths(initialPaths);
      redraw(initialPaths)
    });
    socket.on("updatePaths", (newPaths) => {
      setPaths(newPaths)
      redraw(newPaths)
    });
    socket.on("clear", () => {
      setPaths([]);
      const ctx = getContext();
      ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height);
    });
    socket.on("clear-declined", ({by}) => {
      alert(`${by} declined the clear request.`);
    });
    socket.on("confirmClear", ({ requester }) => {
      setClearRequest({requester})
    });
    return () => {
      socket.off("drawing");
      socket.off("init-paths");
      socket.off("updatePaths");
      socket.off("clear");
      socket.off("clear-declined");
      socket.off("confirmClear");
    };
  }, [lobbyId, user])

  const canvasSize = {
    height: 650,
    width: 1150
  };

  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas.getContext('2d');
  };

  const redraw = (allPaths) => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allPaths.forEach((path) => {
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size;
      ctx.beginPath();
      path.points.forEach((pt, i) => {
        if (i === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      });
      ctx.stroke();
    });
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = e.nativeEvent;
    setCurrentPath([{ x: offsetX, y: offsetY }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const newPoint = { x: offsetX, y: offsetY };
    setCurrentPath((prev) => {
      const newPath = [...prev, newPoint];
      const ctx = getContext();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeSize;
      ctx.beginPath();
      ctx.moveTo(prev[prev.length - 1].x, prev[prev.length - 1].y);
      ctx.lineTo(newPoint.x, newPoint.y);
      ctx.stroke();
      return newPath;
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const newStroke = { color, size: strokeSize, points: currentPath };
    setPaths((prev) => [...prev, newStroke]);
    setCurrentPath([]);
    socket.emit("drawing", {
      roomId: lobbyId,
      data: newStroke
    })
  };

  const handleUndo = () => {
    socket.emit("undo", {roomId: lobbyId})
  };

  const handleClear = () => {
    socket.emit("requestClear", {roomId: lobbyId, username: user})
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    const messageToSend = chatInput.trim()
    if(!messageToSend) return;
    socket.emit("chatMessage", {roomId: lobbyId, username:user, message: messageToSend})
    setChatInput('');
  };

  const handleClearAccept = () => {
    socket.emit("clearResponse", { roomId: lobbyId, accepted: true });
    setClearRequest(null);
  }

  const handleClearReject = () => {
    socket.emit("clearResponse", { roomId: lobbyId, accepted: false });
    setClearRequest(null);
  }

  return (
    <div id={styles.canvas}>
      <div id={styles.drawingUtili}>
        <label>
          Pick a color:
          <input id={styles.colorSpan}
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <label id={styles.strokeSize}>
          Stroke size:
          <input
            type="range"
            min="1"
            max="20"
            value={strokeSize}
            onChange={(e) => setStrokeSize(Number(e.target.value))}
          />
          <span>{strokeSize}px</span>
        </label>

        <button onClick={handleUndo} id={styles.undo}>Undo</button>
        <button onClick={handleClear} id={styles.clear}>Clear</button>
      </div>

      <canvas id={styles.drawingCanvas}
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div>
        <div id={styles.chat}>
          {chatMessages.map((msg, idx) => (
            <div id={styles.messages} key={idx}>
              <strong>{msg.username}</strong>: {msg.message}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

          <form onSubmit={handleChatSubmit}>
            <input 
              id={styles.chatBar}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button id={styles.sendButton} type="submit">
              Send
            </button>
          </form>
      </div>

      {clearRequest && (
        <div id={styles.clearReqPop}>
          <div id={styles.clearReqBar}>
            <div>
              <p>{clearRequest.requester} is requesting to clear the canvas.</p>
              <button onClick={handleClearAccept}>Accept</button>
              <button onClick={handleClearReject}>Decline</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;