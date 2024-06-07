import React from "react";
import vcs from "../assets/code-branch.svg";
import stats from "../assets/stats.svg"
import redirectIcon from '../assets/redirect.png'
const Repo = ({ name, url }) => {
  return (
    <div className="w-11/12 bg-gun-metal p-4 my-4 rounded-md flex justify-between shadow-lg items-center">
      <div>
        <div className="inline bg-black p-4 rounded-full">
          <img
            width={22}
            src={vcs}
            className="inline invert filter opacity-35 "
          />
        </div>
        <h1 className="text-2xl text-chinese-silver inline ml-4">{name}</h1>
      </div>
      <div className="flex justify-start gap-4">
        <a target="_blank" className="transition-colors duration-200 hover:bg-indigo-950 p-2 bg-slate-950 rounded-lg" href={url}>
            Github Repo
            <img src={redirectIcon} width={21} className="inline mx-2"/>
        </a>
        <a target="_blank" className="transition-colors duration-200 hover:bg-chinese-black p-2 bg-slate-950 rounded-lg" href={url}>
            Commit stats
            <img src={stats} width={21} className="inline mx-2"/>
        </a>
      </div>
    </div>
  );
};

export default Repo;
