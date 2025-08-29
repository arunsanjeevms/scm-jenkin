"console.log('Hello CI')" 
const axios = require('axios');

const JENKINS_URL = 'http://localhost:8080';
const JOB_NAME = 'my-node-app-build';
const USERNAME = 'your-username';
const API_TOKEN = 'your-api-token';

const auth = {
  username: USERNAME,
  password: API_TOKEN
};

async function triggerBuild() {
  try {
    console.log(`Triggering job: ${JOB_NAME}...`);
    const response = await axios.post(
      `${JENKINS_URL}/job/${JOB_NAME}/build`,
      {},
      { auth }
    );
    if (response.status === 201) {
      console.log('Build triggered successfully');
    } else {
      console.log('Unexpected status:', response.status);
    }
  } catch (error) {
    console.error('Error triggering build:', error.message);
  }
}

async function getLastBuildStatus() {
  try {
    console.log(`Fetching status of last build for: ${JOB_NAME}...`);
    const response = await axios.get(
      `${JENKINS_URL}/job/${JOB_NAME}/lastBuild/api/json`,
      { auth }
    );
    const { number, result, building } = response.data;
    console.log(`Build #${number}`);
    console.log(`Status: ${building ? 'Building' : result}`);
  } catch (error) {
    console.error('Error fetching build status:', error.message);
  }
}

async function getBuildLogs(buildNumber) {
  try {
    console.log(`Fetching logs for build #${buildNumber}...`);
    const response = await axios.get(
      `${JENKINS_URL}/job/${JOB_NAME}/${buildNumber}/consoleText`,
      { auth }
    );
    console.log('--- Build Logs ---');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching build logs:', error.message);
  }
}

(async () => {
  await triggerBuild();
  setTimeout(async () => {
    await getLastBuildStatus();
    await getBuildLogs(1);
  }, 5000);
})();
