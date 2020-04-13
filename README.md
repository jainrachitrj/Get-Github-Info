# Get-Github-Info
Get users' repositories and the info about those repos such as their date of creation, updation and the commits using the Github API<br>
To do so, you just need to know the <b>username</b> of the github user whose repositories you want to view.
This app fetches data from the Github API, so you can make only 60 requests to the Github API an hour if you are unauthorised.<br>
This app also makes use of an <b>OAuth App</b>, and so by connecting that app to your github account, you will be able to make upto <b>5000</b> requests to the Github API per hour. If that sounds interesting, just click the <b>Authorize</b> button and then you will be redirected to github.com to authorize the OAuth App. Click Authorize. After doing that, you will be redirected back to the site and then you are done.

<h3>Setting your own OAuth App</h3>
To make your own OAuth App, just navigate to the <b>Developer Settings</b> of your account and click on <b>Register a new App</b> under OAuth Apps.

<h3>Using your own Client Id and Secret</h3>
When you regster your OAuth App, you will get a unique <b>Client Id</b> and <b>Client Secret</b> for your app. Just replace the value of the variables <b>OAuthClientId</b> and <b>OAuthClientSecret</b> in the file server.js either directly or make environment variables and then access those.
