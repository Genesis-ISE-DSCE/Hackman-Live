import React from "react";
import Graph from "../components/Graph";
import { HashLoader } from "react-spinners";
import Repo from "../components/Repo";
const host = import.meta.env.VITE_HOST;
const Home = () => {
  const [commitData, setCommitData] = React.useState([]);
  const [repos, setRepos] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [totalCommits, setTotalCommits] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (totalCommits < commitData.length) {
        setTotalCommits(totalCommits + 1);
      } else {
        clearInterval(interval); // Stop the interval once count reaches the array length
      }
    }, 25); // Interval time in milliseconds (1 second in this case)

    return () => clearInterval(interval); // Clean up on unmount
  }, [commitData.length, totalCommits]);
  const getCommitTimeline = () => {
    setIsLoaded(false);
    fetch(`${host}/org/commits/graph?interval=min`)
      .then((res) => res.json())
      .then((data) => {
        setCommitData(data);
        setIsLoaded(true);
      });
  };
  const getRepos = () => {
    setIsLoaded(false);
    fetch(`${host}/repos`)
      .then((res) => res.json())
      .then((data) => {
        setRepos(data);
        setIsLoaded(true);
      });
  };
  React.useEffect(() => {
    getCommitTimeline();
    getRepos();
  }, []);
  return (
    <div>
      <nav className="p-4 text-lg bg-dark-charcoal">
        <h1 className="font-outfit mx-4">
          HackmanV7{" "}
          <span class="text-lg mx-4 bg-philippine-yellow text-pink-800  font-medium me-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
            Live
          </span>
        </h1>
      </nav>

      {isLoaded ? (
        <div className=" my-8 font-outfit">
          <h1 className="my-6 text-5xl font-bold text-center">
            Total Commits made so far {totalCommits}
          </h1>
          <Graph data={commitData} />
          <div>
            <h1 className="my-6 text-5xl font-bold text-center">
              {repos.length} Repos{" "}
            </h1>
            <ul className="flex flex-col items-center justify-center">
              {
                repos.map((repo) => {
                  return <Repo name={repo.name} url={repo.html_url}/>
                })
              }
            </ul>
          </div>

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
