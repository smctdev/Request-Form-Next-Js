"use client";

import authenticatedPage from "@/lib/authenticatedPage";
import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";

type Props = {};

const videoOptions = [
  {
    url: "https://www.youtube.com/watch?v=sIax0m7SQQY",
    title: "How to create an account",
  },
  {
    url: "https://www.youtube.com/watch?v=AqaAZnFe8Ik",
    title: "How to update profile information and change password",
  },
  {
    url: "https://www.youtube.com/watch?v=fWUlts5nTwI",
    title: "How to print request with Approved status",
  },
];

const HelpUser = (props: Props) => {
  const [currentVideo, setCurrentVideo] = useState(videoOptions[0].url);
  const [currentTitle, setCurrentTitle] = useState(videoOptions[0].title);

  const handleVideoChange = (url: string, title: string) => {
    setCurrentVideo(url);
    setCurrentTitle(title);
  };

  return (
    <div className="h-full pt-[26px] px-[35px]">
      <h1 className="text-primary dark:text-primaryD !text-[32px] font-bold">
        Help Guide
      </h1>
      <div className="bg-base-100 w-full mb-5 rounded-[12px] flex flex-col p-10">
        <div className="flex items-center justify-center mb-4">
          <ReactPlayer
            url={currentVideo}
            width="1280px"
            height="720px"
            controls
            pip
            playing
          />
        </div>
        <p className="font-bold">{currentTitle}</p>
        <div className="mt-10">
          <h2 className="text-primary  !text-[24px] font-bold">Other Video</h2>
          <ul>
            {videoOptions.map((option, index) => (
              <li key={index} className="mb-2">
                <button
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => handleVideoChange(option.url, option.title)}
                >
                  {option.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default authenticatedPage(HelpUser);
