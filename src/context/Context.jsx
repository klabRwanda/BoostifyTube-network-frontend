import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const stateContext = createContext();

export const AppContext = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [ownerVideos, setOwnerVideos] = useState([]);
  const [videoLinks, setVideolinks] = useState([]);
  const [myOwnVideo, setMyOwnVideo] = useState([]);
  const [filterVideo, SetFilterVideo] = useState([]);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(
        "https://boostifytube-network-api.onrender.com/api/v1/video/getYourVideo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((data) => {
        setMyOwnVideo(data.data?.videos);
      })
      .catch((error) => {
        console.log(
          "Failed to get the video",
          error.response?.data || error.message
        );
        Notify.failure("Failed to get the video. Please try again later.");
      });
  }, []);

  const { data: uploadedVideos = [], isLoading } = useQuery({
    queryFn: async () => {
      const res = await axios.get(
        "https://boostifytube-network-api.onrender.com/api/v1/video/getAll",
        {
          headers: {
            Authorization: `Bearer ${accessToken?.access_token}`,
          },
        }
      );
      // console.log("Videos response", res);
      SetFilterVideo(res.data);

      return res.data;
    },
    onError: (data) => {
      console.log("onError", data.error);
    },
  });

  const videoLinksPerOwner = myOwnVideo
    .map((video) => video?.linkOfVideo)
    .filter(Boolean);

  const VideoDiscription = filterVideo
    .map((video) => video?.description)
    .filter(Boolean);

  const allVideoLink = filterVideo
    .map((video) => video?.linkOfVideo)
    .filter(Boolean);

  const getYouTubeVideoId = (url) => {
    const regex =
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoIdPerOwner = videoLinksPerOwner
    .map((link) => getYouTubeVideoId(link))
    .filter(Boolean);

  const allVideoID = allVideoLink
    .map((link) => getYouTubeVideoId(link))
    .filter(Boolean);

  let token = localStorage.getItem("token");

  const { data: youtuberHistory } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const res = await axios.get(
        "https://boostifytube-network-api.onrender.com/api/v1/payment/transactions",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.data;
    },
    onError: (data) => {
      // console.log("onError", data.error);
    },
  });
  const { data: fetchUsersData } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(
        "https://boostifytube-network-api.onrender.com/api/v1/user/getall",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return res.data;
    },
    onError: (data) => {
      console.log("onError", data.error);
    },
  });

  const { data: AllvideoTrackings } = useQuery({
    queryKey: ["trackings"],
    queryFn: async () => {
      const resp1 = await axios.get(
        "https://boostifytube-network-api.onrender.com/api/v1/video/getAllTracking",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return resp1.data;
    },
    onError: (data) => {
      console.log("onError", data.error);
    },
  });

  const { data: Singleusertracking } = useQuery({
    queryKey: ["singletrackings"],
    queryFn: async () => {
      const resp2 = await axios.get(
        "https://boostifytube-network-api.onrender.com/api/v1/video/getYourTracking",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return resp2.data;
    },
    onError: (data) => {
      console.log("onError", data.error);
    },
  });

  let user = JSON.parse(localStorage.getItem("userdata"));
  let data = user?.userInfo;
  let userId = data?._id;

  const { data: loggedUser } = useQuery({
    queryKey: ["logged_users"],
    queryFn: async () => {
      const res = await axios.get(
        `https://boostifytube-network-api.onrender.com/api/v1/user/getOneUser/${userId}`
      );
      return res.data;
    },
  });

  const { data: Messages, isLoading: messageLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const messsageres = await axios.get(
        "https://boostifytube-network-api.onrender.com/api/v1/user/getAllContact",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      return messsageres.data;
    },
  });

  return (
    <stateContext.Provider
      value={{
        videos,
        setVideos,
        ownerVideos,
        setOwnerVideos,
        fetchUsersData,
        messageLoading,
        Messages,
        
        loggedUser,
        uploadedVideos,
        VideoDiscription,
        allVideoID,
        videoIdPerOwner,
        youtuberHistory,
        isLoading,
        AllvideoTrackings,
        Singleusertracking,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

export const MyContext = () => useContext(stateContext);
