import React from "react";
import Graph from "../components/Graph";
import { HashLoader } from "react-spinners";
import Repo from "../components/Repo";
import TeamsBarGraph from "../components/TeamsBarGraph";
const host = import.meta.env.VITE_HOST || "";
const Home = () => {
  const [commitData, setCommitData] = React.useState([]);
  const [teamsCommitCount, setTeamsCommitCount] = React.useState([]);
  const [repos, setRepos] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [totalCommits, setTotalCommits] = React.useState(0);
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (totalCommits < commitData.totalCommits) {
        setTotalCommits(totalCommits + 1);
      } else {
        clearInterval(interval); // Stop the interval once count reaches the array length
      }
    }, 5); // Interval time in milliseconds (1 second in this case)

    return () => clearInterval(interval); // Clean up on unmount
  }, [commitData.length, totalCommits]);
  const getCommitTimeline = () => {
    fetch(`${host}/org/commits/graph?interval=hour`)
      .then((res) => res.json())
      .then((data) => {
        setCommitData(data);
        setIsLoaded(true);
      });
  };

  const getRepos = () => {
    fetch(`${host}/repos`)
      .then((res) => res.json())
      .then((data) => {
        setRepos(data);
      });
  };
  const getTeamCommitsCount = ()=>{
    fetch(`${host}/org/commits-teams`)
      .then((res) => res.json())
      .then((data) => {
        data && setTeamsCommitCount(data.commits);
      });
  }
  React.useEffect(() => {
    getCommitTimeline();
    getRepos();
    getTeamCommitsCount();
  }, []);
  return (
    <div>
      {isLoaded ? (
        <div className=" my-8 font-outfit">
          <h1 className="my-6 text-5xl font-bold text-center">
            Total Commits made so far {totalCommits}
          </h1>
          <Graph data={commitData.graphData} />
          <TeamsBarGraph data={teamsCommitCount}/>
          <h1 className="my-6 text-5xl font-bold text-center">
            {repos.length} Repos{" "}
          </h1>
          <div className="flex justify-end w-[95vw]">
            <input
              value={search}
              type="text"
              className="p-2 rounded-md bg-gun-metal outline-none text-white text-lg border-none"
              placeholder="Search team..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <ul className="flex flex-col items-center justify-center">
            {repos?.filter(e => e.name.toLowerCase().includes(search.toLowerCase())).map((repo) => {
              return <Repo name={repo.name} url={repo.html_url} />;
            })}
          </ul>
        </div>
      ) : (
        <>
          <HashLoader
            size={150}
            isLoaded={isLoaded}
            color="#8884d8"
            cssOverride={{
              position: "absolute",
              left: 0,
              right: 0,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "200px",
            }}
          />
        </>
      )}
    </div>
  );
};

export default Home;
