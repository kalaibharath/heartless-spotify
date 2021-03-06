import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: [],
    }
    this.search = this.search.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  componentDidMount() {
    window.addEventListener('load', () => {Spotify.getAccessToken()});
  }

  search(term) {
    Spotify.search(term).then(searchResults => this.setState({searchResults: searchResults}));
  }

  addTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    if (playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      return;
    }
    playlistTracks.push(track);
    this.setState({playlistTracks: playlistTracks})
  }

  removeTrack(track) {
    let playlistTracks = this.state.playlistTracks;
    playlistTracks = playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({playlistTracks: playlistTracks})
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris);
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: [],
    });
    document.querySelectorAll('input')[1].value = 'New Playlist';
  }

  render() {
    return (
      <div>
        <h1> i<span className="highlight">AV</span>K
</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack}
            />
            <Playlist 
              playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
