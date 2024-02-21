# byob
To set up and run the application:

Prerequisites:

Make sure you have Node.js and npm (Node Package Manager) installed on your machine.
1. Clone the Repository
2. Install Dependencies:
npm install
3. Obtain YouTube Data API Key:
You need to obtain an API key from the Google Cloud Console for accessing the YouTube Data API. Follow the instructions here to get your API key.
4. Set API Key:
Open the index.js file and replace the current 'apiKey' with your actual YouTube Data API key.
5. Run the Application:
Once you've set up the API key, you can run the application using the following command:
npm start

6. Usage:

After running the application, open your web browser and go to http://localhost:3000.
Enter one or more YouTube usernames separated by commas into the input field and click the "Fetch Details" button.
The application will fetch the channel details and video metrics for the provided usernames and display them on the screen.
Development Decisions and Insights:

7. Choice of Technology:

The application is built using Axios for making HTTP requests to the YouTube Data API.
The frontend is implemented with HTML, CSS, and JavaScript for dynamic rendering of channel details and video metrics.

8. Concurrency and Error Handling:

Promises are used to fetch channel details and video metrics concurrently for multiple usernames, improving the performance of the application.
Error handling is implemented to gracefully handle cases where a channel is not found for a given username. Users are alerted with an error message in such cases.
Loading Indicator:

A loading indicator is displayed while fetching data from the YouTube Data API to provide feedback to users that the application is processing their request.
User Interface:

The user interface is designed to be simple and intuitive, allowing users to easily input YouTube usernames and view the corresponding channel details and video metrics.

9. Challenges Faced and Solutions:

Handling Asynchronous Operations:

Dealing with asynchronous operations, such as fetching data from external APIs, required careful management of promises and async/await syntax to ensure smooth execution and error handling.
API Rate Limits:

The YouTube Data API has rate limits on the number of requests that can be made within a certain time period. To avoid hitting these limits, the application implements efficient batching of requests and limits the number of videos fetched per channel.
Error Handling and User Feedback:

Providing meaningful error messages to users in case of invalid input or failed API requests was crucial for enhancing user experience. The application incorporates alert messages and error displays to communicate issues effectively.