import express from "express"
import dotenv from "dotenv"
import axios from "axios"
import moment from "moment";
import cors from 'cors'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_ORG = process.env.GITHUB_ORG;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Middleware to handle JSON responses
app.use(express.json());
app.use(cors({
    origin:"*"
}))
// Helper function to group commits by a specified interval
function groupCommitsByInterval(commits, interval) {
    const groupedCommits = {};

    commits.forEach(commit => {
        const date = moment(commit.timestamp);
        const key = date.startOf(interval).format(); // Start of the interval (e.g., start of the day)

        if (!groupedCommits[key]) {
            groupedCommits[key] = 0;
        }
        groupedCommits[key]++;
    });

    return groupedCommits;
}
// Route to fetch organization repositories
app.get('/repos', async (req, res) => {
    try {
        const response = await axios.get(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to fetch repository commit history
app.get('/repos/:repo/commits', async (req, res) => {
    const { repo } = req.params;
    try {
        const response = await axios.get(`https://api.github.com/repos/${GITHUB_ORG}/${repo}/commits`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/org/commits', async (req, res) => {
    try {
        // Fetch all repositories in the organization
        const reposResponse = await axios.get(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
        });
        const repos = reposResponse.data;

        // Initialize an array to store commit data
        const commitsData = [];

        // Iterate through each repository and fetch commits
        for (const repo of repos) {
            const commitsResponse = await axios.get(`https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/commits`, {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                },
            });
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
// Route to fetch commit data for graph
app.get('/org/commits/graph', async (req, res) => {
    const interval = req.query.interval || 'day'; // Default to grouping by day
    try {
        // Fetch all repositories in the organization
        const reposResponse = await axios.get(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
        });
        const repos = reposResponse.data;

        // Initialize an array to store commit data
        const commitsData = [];

        // Iterate through each repository and fetch commits
        for (const repo of repos) {
            const commitsResponse = await axios.get(`https://api.github.com/repos/${GITHUB_ORG}/${repo.name}/commits`, {
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                },
            });
            const commits = commitsResponse.data;
            let count =0;
            for (const commit of commits) {
                commitsData.push({
                    sha: commit.sha,
                    message: commit.commit.message,
                    timestamp: commit.commit.author.date,
                    repo: repo.name,
                    cummulativeCount :count
                });
            }
        }

        // Group commits by the specified interval
        const groupedCommits = groupCommitsByInterval(commitsData, interval);

        // Format the response
        let count = 0;
        const graphData = Object.keys(groupedCommits).map(key => ({
            timestamp: key,
            commits: count += groupedCommits[key],
        }));

        // Send response
        res.json(graphData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
