// Dashsingle.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import { useParams } from "react-router-dom";
import { MyContext } from "../context/Context";
import { AiOutlineLike } from "react-icons/ai";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import "../Styles/Dashsingle.css";
import { Link } from "react-router-dom";

const VideoCard1 = ({ videoId }) => {
  const [videoData1, setVideoData1] = useState(null);
  const API_KEY = "AIzaSyCLyB5T0faW7qGwhnq07DJCeSA4I5RXJ_M";

  useEffect(() => {
    const fetchVideoData1 = async () => {
      try {
        const response1 = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
        );
        setVideoData1(response1.data.items[0]);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData1();
  }, [videoId, API_KEY]);

  if (!videoData1) {
    return <div>Loading...</div>;
  }

  const opts2 = {
    height: "200",
    width: "300",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="youtube-dive">
      <div className="video-it">
        <YouTube videoId={videoId} opts={opts2} />
        <Link to={`/superdashboard/videos/${videoId}`} className="view-title">
          <p id="det">{videoData1.snippet.localized.title}</p>
        </Link>
        <div style={{ display: "flex", gap: "1px" }}>
          <p id="det">
            <MdOutlineRemoveRedEye /> {videoData1.statistics.viewCount}
          </p>
          <p id="det">
            {" "}
            <AiOutlineLike /> {videoData1.statistics.likeCount}
          </p>
          <p id="det">
            <FaRegComment /> {videoData1.statistics.commentCount}
          </p>
        </div>
        <p id="det">Channel: {videoData1.snippet.channelTitle}</p>
      </div>
    </div>
  );
};

const Dashsingle = () => {
  const { videoId } = useParams();
  const [videoInfo, setVideoInfo] = useState(null);
  const API_KEY = "AIzaSyCLyB5T0faW7qGwhnq07DJCeSA4I5RXJ_M";

  const { uploadedVideos } = MyContext();

  const videoLinks2 = uploadedVideos
    .map((video) => video?.linkOfVideo)
    .filter(Boolean);

  const getYouTubeVideoId = (url) => {
    const regex =
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoIdss2 = videoLinks2
    .map((link) => getYouTubeVideoId(link))
    .filter(Boolean);

  useEffect(() => {
    const fetchVideoInfo = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
        );
        setVideoInfo(response.data.items[0]);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    if (videoId) {
      fetchVideoInfo();
    }
  }, [videoId]);

  if (!videoInfo) {
    return <div>Loading...</div>;
  }

  const { viewCount, likeCount, commentCount } = videoInfo.statistics;
    const { title, channelTitle } = videoInfo.snippet;

  return (
    <div className="view-video">
      <div className="video-item123">
        <YouTube
          style={{ width: "100%" }}
          videoId={videoId}
          opts={{
            height: "350",
            width: "600",
            playerVars: { autoplay: 1, mute: 1 },
          }}
          allowFullScreen
        />
        <p className="singletitle">{title}</p>
        <div style={{ display: "flex", gap: "10%" }}>
          <p className="singletitle">
            <MdOutlineRemoveRedEye /> {viewCount}
          </p>
          <p className="singletitle">
            {" "}
            <AiOutlineLike /> {likeCount}
          </p>
          <p className="singletitle">
            <FaRegComment /> {commentCount}
          </p>
        </div>
        <p id="det">Channel: {channelTitle}</p>
      </div>

      <div className="video-container1">
        {videoIdss2
          .filter((id) => id !== videoId)
          .map((videoId2, index) => (
            <VideoCard1
              key={index}
              videoId={videoId2}
              title={`Video ${index + 1}`}
            />
          ))}
      </div>
    </div>
  );
};

export default Dashsingle;
