// Your API key
const apiKey = 'AIzaSyC_s7e9NFEqyZgGmo8-mgTYuamT0oBBp4E';

// Function to fetch batch channel details from YouTube Data API
async function fetchBatchChannelDetails() {
    try {
        // Get the usernames entered by the user
        const usernames = document.getElementById('usernames').value.split(',').map(username => username.trim());
        
        // Check if any usernames are provided
        if (usernames.length === 0 || usernames.some(username => !username)) {
            alert('Please enter at least one YouTube username.');
            return;
        }

        // Array to store promises for fetching channel details
        const promises = [];

        // Fetch channel details for each username
        for (const username of usernames) {
            const promise = fetchChannelDetailsAndVideoMetrics(username, apiKey);
            promises.push(promise);
        }
        document.getElementById('loading').style.display = 'block';
        // Execute all promises concurrently
        const results = await Promise.all(promises);
        document.getElementById('loading').style.display = 'none';
        // Process responses and update DOM with channel details and video metrics
        const batchResults = document.getElementById('batch-results');
        batchResults.innerHTML = ''; // Clear previous results
        results.forEach(result => {
            if (result) {
                const { channelTitle, description, subscriberCount, viewCount, videoCount, videoMetrics } = result;
                
                // Display channel details
                let resultHTML = `
                    <h2>${channelTitle}</h2>
                    <p><strong>Description:</strong> ${description}</p>
                    <p><strong>Subscriber Count:</strong> ${subscriberCount}</p>
                    <p><strong>Total Views:</strong> ${viewCount}</p>
                    <p><strong>Total Videos:</strong> ${videoCount}</p>
                `;
                // Append channel details to batch results
                batchResults.innerHTML += resultHTML + '<hr>';

                // Display video metrics header
                batchResults.innerHTML += '<h3>Videos</h3>';
                resultHTML=''
                // Display video metrics
                if (videoMetrics && videoMetrics.length > 0) {
                    // resultHTML += '<h3>Video Metrics</h3>';
                    videoMetrics.forEach(video => {
                        resultHTML += `
                            <div class="video">
                                <h4>${video.title}</h4>
                                <p><strong>Likes:</strong> ${video.likes}</p>
                                <p><strong>Comments:</strong> ${video.comments}</p>
                                <p><strong>Views:</strong> ${video.views}</p>
                                <p><strong>Duration:</strong> ${video.duration} seconds</p>
                            </div>
                        `;
                    });
                }
                
                // Append channel details and video metrics to batch results
                batchResults.innerHTML += resultHTML + '<hr>';
            } else {
                // Display error if channel data is not found
                batchResults.innerHTML += `<p>Error: No channel found for username "${username}"</p>`;
            }
        });
    } catch (error) {
        // Handle errors
        console.error('Error fetching batch channel details:', error.message);
    }
}

async function fetchChannelDetailsAndVideoMetrics(username, apiKey) {
    try {
        const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
            params: {
                part: 'snippet,statistics',
                forUsername: username,
                key: apiKey
            }
        });

        const channelData = channelResponse.data.items[0];
        if (!channelData) {
            throw new Error(`No channel found for username "${username}"`);
        }

        const channelId = channelData.id;
        const channelTitle = channelData.snippet.title;
        const description = channelData.snippet.description;
        const subscriberCount = channelData.statistics.subscriberCount;
        const viewCount = channelData.statistics.viewCount;
        const videoCount = channelData.statistics.videoCount;

        // Fetch video metrics for the channel
        const videoMetrics = await fetchVideoMetrics(channelId, apiKey);
        
        return {
            channelTitle,
            description,
            subscriberCount,
            viewCount,
            videoCount,
            videoMetrics
        };
    } catch (error) {
        // if (error.response && error.response.status === 404) {
        //     // Display error message on the screen
            alert(`Channel not found for username: ${username}`);
            // document.getElementById('error-message').innerText = errorMessage;
        // }
        // console.error(`Error fetching channel details for username "${username}":`, error.message);
        return null;
    }
}

// Function to fetch video metrics for a channel
async function fetchVideoMetrics(channelId, apiKey) {
    console.log(channelId)
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                channelId: channelId,
                maxResults: 10,
                order: 'date',
                key: apiKey,
                type: 'video'
            }
        });

        const videos = response.data.items;
        console.log(videos)
        const videoMetrics = [];

        // Fetch metrics for each video
        for (const video of videos) {
            const videoId = video.id.videoId;
            const videoTitle = video.snippet.title;
            const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    part: 'statistics,contentDetails',
                    id: videoId,
                    key: apiKey
                }
            });
            // console.log(videoResponse)
            const videoData = videoResponse.data.items[0];
            console.log(videoData)
            const likes = videoData.statistics.likeCount;
            const dislikes = videoData.statistics.dislikeCount;
            const comments = videoData.statistics.commentCount;
            const views = videoData.statistics.viewCount;
            const duration = parseDuration(videoData.contentDetails.duration);

            videoMetrics.push({
                title: videoTitle,
                likes: likes,
                dislikes: dislikes,
                comments: comments,
                views: views,
                duration: duration
            });
        }

        return videoMetrics;
    } catch (error) {
        console.error('Error fetching video metrics:', error.message);
        return [];
    }
}
// Helper function to parse ISO 8601 duration format into seconds
function parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);

    return hours * 3600 + minutes * 60 + seconds;
}

// const forUsername = "SocialBlade";

// fetchChannelDetails(forUsername, apiKey);