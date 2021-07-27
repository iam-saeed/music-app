const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const lyricsFinder = require('lyrics-finder')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/refresh', (req, res) => {
    const refresh = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:3000",
        clientId: 'dd765052203b40ab81362eb67f89a2f7',
        clientSecret: '4593bb9d2b3f4186b6ae7311830cbadf',
        refreshToken
    })
    spotifyApi.refreshAccessToken().then(
        (data) => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn,
            })
        })
        .catch(() => {
            res.send(400)
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: "http://localhost:3000",
        clientId: 'dd765052203b40ab81362eb67f89a2f7',
        clientSecret: '4593bb9d2b3f4186b6ae7311830cbadf'
    })
    spotifyApi.authorizationCodeGrant(code).then(data =>{
        res.status(200).json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch(err => {
        res.status(500).json({ message: err.message })
        console.log(err)
    }) 
})

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found"
    res.status(200).json({ lyrics })
})

app.listen(5000, () => {
    console.log('port listening on 5000')
})