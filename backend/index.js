import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import moment from "moment";
import cors from "cors";
import path from "path";
dotenv.config();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_ORG = process.env.GITHUB_ORG;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Middleware to handle JSON responses
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
// Helper function to group commits by a specified interval
function groupCommitsByInterval(commits, interval) {
  const groupedCommits = {};

  commits.forEach((commit) => {
    const date = moment(commit.timestamp);
    let key;
    switch (interval) {
      case "minute":
        key = date.startOf("minute").format();
        break;
      case "hour":
        key = date.startOf("hour").format();
        break;
      case "day":
        key = date.startOf("day").format();
        break;
      case "week":
        key = date.startOf("week").format();
        break;
      case "month":
        key = date.startOf("month").format();
        break;
      default:
        key = date.startOf("day").format(); // Default to day if interval is not specified or invalid
        break;
    }

    if (!groupedCommits[key]) {
      groupedCommits[key] = 0;
    }
    groupedCommits[key]++;
  });

  return groupedCommits;
}
// Route to fetch organization repositories
app.get("/repos", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch repository commit history
app.get("/repos/:repo/commits", async (req, res) => {
  const { repo } = req.params;
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${GITHUB_ORG}/${repo}/commits`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/org/commits", async (req, res) => {
  try {
    // Fetch all repositories in the organization
    const reposResponse = await axios.get(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&type=owner`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );
    const repos = reposResponse.data;

    // Initialize an array to store commit data
    const commitsData = [];

    // Iterate through each repository and fetch commits
    for (const repo of repos) {
      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/commits`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );
      const commits = commitsResponse.data;
      for (const commit of commits) {
        commitsData.push({
          sha: commit.sha,
          message: commit.commit.message,
          timestamp: commit.commit.author.date,
          repo: repo.name,
        });
      }
    }

    // Calculate the total number of commits
    const totalCommits = commitsData.length;

    // Send response
    res.json({
      totalCommits,
      commits: commitsData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/org/commits-teams", async (req, res) => {
  try {
    const reposResponse = await axios.get(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&type=owner`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );
    const repos = reposResponse.data;

    const teamCommits = [];

    for (const repo of repos) {
      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/commits`,
        // https://api.github.com/orgs/<your-repo>/repos?per_page=100&type=owner
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );

      const teamCommit = {
        name: repo.name,
        commits: commitsResponse.length,
      };

      teamCommits.push(teamCommit);

      return res.status(200).json({ commits: teamCommits });
    }
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
});
// Route to fetch commit data for graph
app.get("/org/commits/graph", async (req, res) => {
  const interval = req.query.interval || "day"; // Default to grouping by day
  try {
    // Fetch all repositories in the organization
    const reposResponse = await axios.get(
      `https://api.github.com/orgs/${GITHUB_ORG}/repos?per_page=100&type=owner`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );
    const repos = reposResponse.data;

    // Initialize an array to store commit data
    const commitsData = [];

    // Iterate through each repository and fetch commits
    for (const repo of repos) {
      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/commits`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
          },
        }
      );
      const commits = commitsResponse.data;
      for (const commit of commits) {
        commitsData.push({
          sha: commit.sha,
          message: commit.commit.message,
          timestamp: commit.commit.author.date,
          repo: repo.name,
        });
      }
    }
    const totalCommits = commitsData.length;
    // Group commits by the specified interval
    const groupedCommits = groupCommitsByInterval(commitsData, interval);

    // Format the response
    let count = 0;
    const graphData = Object.keys(groupedCommits).map((key) => {
      count += groupedCommits[key];
      return {
        timestamp: key,
        commits: count,
      };
    });

    // Send response
    res.json({ graphData, totalCommits });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/repos/:repo/commits/graph", async (req, res) => {
  const { repo } = req.params;
  const interval = req.query.interval || "day"; // Default to grouping by day
  try {
    // Fetch commits for the specified repository
    const commitsResponse = await axios.get(
      `https://api.github.com/repos/${GITHUB_ORG}/${repo}/commits`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );
    const commits = commitsResponse.data;

    // Initialize an array to store commit data
    const commitsData = commits.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      timestamp: commit.commit.author.date,
      repo,
    }));

    // Group commits by the specified interval
    const groupedCommits = groupCommitsByInterval(commitsData, interval);

    // Format the response
    let count = 0;
    const graphData = Object.keys(groupedCommits).map((key) => {
      count += groupedCommits[key];
      return {
        timestamp: key,
        commits: count,
      };
    });

    // Send response
    res.json(graphData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
