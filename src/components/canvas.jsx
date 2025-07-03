import styles from "../styles/canvas.module.css"
import { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import socket from "./socket"

const Canvas = ({user}) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [color, setColor] = useState('#000000');
  const [strokeSize, setStrokeSize] = useState(3);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const { id: lobbyId } = useParams();

  useEffect(() => {
    const handleMessage = ({username, message}) => {
      setChatMessages((prev) => [...prev, {username, message}]);
    };
    socket.on("chatMessage", handleMessage);
    return () => {
      socket.off("chatMessage", handleMessage);
    };
  }, []);

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
    setPaths((prev) => [...prev, { color, size: strokeSize, points: currentPath }]);
    setCurrentPath([]);
  };

  const handleUndo = () => {
    const updatedPaths = paths.slice(0, -1);
    setPaths(updatedPaths);
    redraw(updatedPaths);
  };

  const handleClear = () => {
    setPaths([]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    const messageToSend = chatInput.trim()
    if(!messageToSend) return;
    socket.emit("chatMessage", {roomId: lobbyId, username:user, message: messageToSend})
    setChatInput('');
  };

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
    </div>
  );
};

export default Canvas;