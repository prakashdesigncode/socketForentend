import { useEffect, useState } from "react";
import profileImage from "../../Assets/profile.png";
import "./style.scss";
import { SearchingIcon, Add02Icon } from "hugeicons-react";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SocketContext } from "../..";

const Index = () => {
  const [fulScreen, setFullScreen] = useState(false);
  const { userName } = useParams();
  const navigate = useNavigate();
  const { socketRef } = useContext(SocketContext);

  const goToChat = () => {
    navigate(`/chat?userName=${userName}&socketId=${socketRef.current.id}`);
  };
  useEffect(() => {
    socketRef.current = io.connect("http://54.89.60.230:5000");
    socketRef.current.on("connect", () => {
      socketRef.current.emit("join", "mad");
      socketRef.current.emit("userDetails", {
        userName,
        userId: socketRef.current.id,
        roomId: "mad",
      });
    });
    socketRef.current.on("disconnect", () =>
      console.log("connection discontiuned")
    );
  }, []);
  useEffect(() => {
    if (fulScreen) {
      const element = document.getElementById("dashboardRef");
      const isFullScreen = document.fullscreenElement;
      if (!isFullScreen) element.requestFullscreen();
    }
  }, [fulScreen]);

  return (
    <div
      className="dashboard"
      id="dashboardRef"
      onClick={() => setFullScreen(true)}
    >
      <div className="header d-flex justify-content-between px-3 pt-4 pb-2">
        <h5>Messages</h5>
        <SearchingIcon size={30} color={"#ffffff"} variant={"stroke"} />
      </div>
      <div className="recent px-3">
        <h6>RECENT</h6>
        <div className="recent-users mt-3">
          <div className="in-active-frame">
            <div className="default-recent d-flex justify-content-center align-items-center">
              <Add02Icon size={24} color={"#9fa1a7"} variant={"stroke"} />
            </div>
          </div>
        </div>
      </div>
      <div className="chats mt-4 text-danger pt-3 pb-5 overflow-y-scroll">
        <div className="user-card d-flex gap-3  px-3" onClick={goToChat}>
          <img className="user-image" src={profileImage} />
          <div className="user-details">
            <div className="text-white">Mad Family 🫧💗✨</div>
            <div className="text-secondary">For Family 🦋</div>
          </div>
          <div className="text-secondary flex-grow-1 text-end">08:43</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
