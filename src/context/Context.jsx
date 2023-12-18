import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const stateContext = createContext();

export const AppContext = ({ children }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoIds = [
          "w0mI3_xGves",
          "ASFx79CSSOE",
          "vMWgA2h6OX0",
          "88542cowyIA",
          "-RsAP6A5rNs",
          "-RsAP6A5rNs",
          "cvIfzoeDPCk",
          "w0mI3_xGves",
          "-E74uXVVDcg",
        ];

        if (!videoIds || videoIds.length === 0) {
          console.error("No video IDs provided.");
          return;
        }

        const videoIdsParam = videoIds.join(",");
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoIdsParam}&key=AIzaSyDBwaf4NcPBZ5lpW1Qr9kTg84Dqa9Dsazc`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setVideos(data.items);
        } else {
          console.error("No videos found in the API response.");
        }
      } catch (error) {
        console.error("Error fetching videos:", error.message);
      }
    };

    fetchData();
  }, []);

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
      // console.log("response", res.data);
      return res.data;
    },
    onError: (data) => {
      console.log("onError", data.error);
    },
  });

  let user = JSON.parse(localStorage.getItem("userdata"));
  let data = user?.userInfo;
  let userId = data._id;
  // console.log("=================", userId);
  // let userData = user?.user;
  // console.log(userData);

  const { data: loggedUser } = useQuery({
    queryKey: ["logged_users"],
    queryFn: async () => {
      const res = await axios.get(
        `https://boostifytube-network-api.onrender.com/api/v1/user/getOneUser/${userId}`
      );
      // console.log("Responseeeeeeeeeeeeeeeee", res.data.user.image);
      return res.data;
    },
  });

  

  return (
    <stateContext.Provider
      value={{ videos, setVideos, fetchUsersData, loggedUser }}
    >
      {children}
    </stateContext.Provider>
  );
};

export const MyContext = () => useContext(stateContext);
