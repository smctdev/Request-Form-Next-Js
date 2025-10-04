"use client";

import authenticatedPage from "@/lib/authenticatedPage";
import React, { useState } from "react";

type Props = {};

const videoOptions = [
  {
    url: "https://drive.google.com/file/d/1GvhQeg3AWdRtRFEA4_WulgJF719iqkXv/preview",
    title: "Add, Edit, Delete User",
  },
  {
    url: "https://drive.google.com/file/d/1K17kfu1nIfLJlH__FiTWfLZYcOq4Q2oC/preview",
    title: "Add, Edit, Delete Branch",
  },
  {
    url: "https://drive.google.com/file/d/1olgmbFCnVBPn8SPbrfqEaiY-8vs6VuDS/preview",
    title: "Add, Edit, Delete Approver",
  },
];

const HelpSetup = (props: Props) => {
  const [currentVideo, setCurrentVideo] = useState(videoOptions[0].url);
  const [currentTitle, setCurrentTitle] = useState(videoOptions[0].title);

  const handleVideoChange = (url: string, title: string) => {
    setCurrentVideo(url);
    setCurrentTitle(title);
  };
  return (
    <div className="bg-graybg dark:bg-blackbg h-full pt-[26px] px-[35px]">
      <h1 className="text-primary dark:text-primaryD !text-[32px] font-bold">
        Help Guide
      </h1>
      <div className="bg-base-100 w-full mb-5 rounded-[12px] flex flex-col p-10">
        <div className="flex items-center justify-center mb-4">
          <iframe
            src={currentVideo}
            width="1280"
            height="720"
            allow="autoplay"
          ></iframe>
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

export default authenticatedPage(HelpSetup);
