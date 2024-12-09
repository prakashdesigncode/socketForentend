import { SearchingIcon, SentIcon } from "hugeicons-react";
import profileImage from "../../Assets/profile.png";
import "./style.scss";
import { useEffect, useState, useContext } from "react";
import { fromJS } from "immutable";
import { SocketContext } from "../..";

const Index = () => {
  const [fulScreen, setFullScreen] = useState(false);
  const [messages, setMessages] = useState(fromJS([]));
  const [input, setInput] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  //   const userName = queryParams.get("userName");
  const socketId = queryParams.get("socketId");
  const { socketRef } = useContext(SocketContext);

  const handleInput = (event) => {
    const value = event.target.value;
    setInput(value);
  };

  const handleSend = () => {
    socketRef.current.emit("sendMessage", { message: input, userId: socketId });
    socketRef.current.on("chatMessages", (data) => {
      setMessages(fromJS(data));
      setInput("");
    });
  };

  useEffect(() => {
    if (fulScreen) {
      const element = document.getElementById("dashboardRef");
      const isFullScreen = document.fullscreenElement;
      if (!isFullScreen) element.requestFullscreen();
    }
  }, [fulScreen]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit("currentMesage");
      socketRef.current.on("currentChats", (data) => {
        setMessages(fromJS(data));
      });
    }
  }, []);
  return (
    <div
      className="chat d-flex flex-column justify-content-between"
      id="dashboardRef"
      onClick={() => setFullScreen(true)}
    >
      <div className="header d-flex justify-content-between px-3 pt-4 pb-2 ">
        <div className="d-flex gap-3">
          <img className="user-image" src={profileImage} />
          <div className="text-white align-self-center">Mad Family 🫧💗✨</div>
        </div>
        <SearchingIcon
          className="align-self-center"
          size={30}
          color={"#ffffff"}
          variant={"stroke"}
        />
      </div>
      <div className="message-list flex-grow-1 mx-3 mt-2">
        {messages.map((message, index) => {
          const userId = message.get("userId", "");
          const time = message.get("time", "");
          const userName = message.get("userName", "");
          const data = message.get("message", "");
          const sameId = socketId === userId;
          return (
            <div className="message-card d-flex flex-column  my-2" key={index}>
              <div
                className={`user-details text-secondary  ${
                  !sameId && "text-end"
                }`}
              >
                {userName} ↔ {time}
              </div>
              <div className={`${!sameId && "text-end"}`}>
                <div
                  className={`${
                    sameId ? "form-message my-2 " : "to-message my-2"
                  }`}
                >
                  {data}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="user-input d-flex  align-items-center mx-3 mt-3 mb-5">
        <input
          className="message-input flex-grow-1"
          placeholder="Message"
          onChange={handleInput}
          value={input}
        />
        <SentIcon
          onClick={handleSend}
          className="mx-2"
          size={24}
          color={"#9fa1a7"}
          variant={"stroke"}
        />
      </div>
    </div>
  );
};

export default Index;
