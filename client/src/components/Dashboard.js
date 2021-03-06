import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Form } from 'react-bootstrap'
import Player from './Player'
import TrackSearchResult from './TrackSearchResult'
import useAuth from '../hooks/useAuth'
import '../styles/dashboard.css'
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyWebApi = new SpotifyWebApi({
    clientId: 'dd765052203b40ab81362eb67f89a2f7'
})

const Dashboard = ({ code }) => {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState('')

    const chooseTrack = (track) => {
        setPlayingTrack(track)
        setSearch('')
        setLyrics('')
    }

    useEffect(() => {
        if(!playingTrack) return 

        axios.get('http://localhost:5000/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist,
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    useEffect(() => {
        if(!accessToken) return
        spotifyWebApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([])
        if(!accessToken) return 
        let cancel = false;
        spotifyWebApi.searchTracks(search).then(res => {
            if(cancel === true) return 
            setSearchResults(res.body.tracks.items.map(track => { 
                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image
                    return smallest
                }, track.album.images[0])
                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })
        return () => cancel = true
    }, [search, accessToken])

    return (
        <Container className="d-flex flex-column py-2" style={{ height: '100vh'}}>
          <Form.Control type="search" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value) }/>

        <div className="flex-grow-1 my-2" style={{ overflowY: 'auto' }}>
            {searchResults.map(track => {
                return <TrackSearchResult track={track} key={track.uri} chooseTrack={chooseTrack} />
            })}
            {searchResults.length === 0 && (
                <div className="text-center" stlye={{  }}>
                    <p>{lyrics}</p>
                </div>
            )}
        </div>
        <div><Player accessToken={accessToken} trackUri={playingTrack?.uri}/></div>
        </Container>
    )
}

export default Dashboard
 