import React, { useState, useEffect, useRef } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Audio } from 'expo-av'

const MusicPlayer = () => {
  const [songs, setSongs] = useState([])
  const [sound, setSound] = useState(null)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const soundRef = useRef(null)

  useEffect(() => {
    async function fetchSongs() {
      try {
        const songList = [
          require('../media/song1.mp3'),
          require('../media/song2.mp3'),
          require('../media/song3.mp3'),
          require('../media/song4.mp3'),
          require('../media/song5.mp3'),
          require('../media/song6.mp3'),
        ]
        setSongs(songList)
      } catch (error) {
        console.error('Error fetching music files:', error)
      }
    }
    fetchSongs()
  }, [])

  useEffect(() => {
    soundRef.current = sound
  }, [sound])

  const playSong = async (songIndex) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync()
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        songs[songIndex]
      )
      setSound(newSound)
      setCurrentSongIndex(songIndex)
      await newSound.playAsync()
    } catch (error) {
      console.error('Error playing song:', error)
    }
  }

  const pauseSong = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync()
        setPaused(true)
      }
    } catch (error) {
      console.error('Error pausing song:', error)
    }
  }

  const resumeSong = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync()
        setPaused(false)
      }
    } catch (error) {
      console.error('Error resuming song:', error)
    }
  }

  const stopSong = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync()
        await soundRef.current.unloadAsync()
        setSound(null)
        setPaused(false)
      }
    } catch (error) {
      console.error('Error stopping song:', error)
    }
  }

  const playNextSong = () => {
    const nextSongIndex = (currentSongIndex + 1) % songs.length
    playSong(nextSongIndex)
    setPaused(false)
  }

  const playPreviousSong = () => {
    const previousSongIndex =
      (currentSongIndex - 1 + songs.length) % songs.length
    playSong(previousSongIndex)
    setPaused(false)
  }

  const renderFontAwesomeIcon = (name, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={{ backgroundColor: '#fff' }}>
        <FontAwesome name={name} size={50} color="black" />
      </View>
    </TouchableOpacity>
  )

  const renderIoniconsIcon = (name, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={{ backgroundColor: '#fff' }}>
        <Ionicons name={name} size={50} color="black" />
      </View>
    </TouchableOpacity>
  )

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
          paddingVertical: 10,
          backgroundColor: '#FF00FF',
        }}
      >
        {paused
          ? renderFontAwesomeIcon('pause-circle-o', resumeSong)
          : renderFontAwesomeIcon('pause-circle', pauseSong)}
        {renderFontAwesomeIcon('play-circle', () => playSong(currentSongIndex))}

        {renderFontAwesomeIcon('stop-circle', stopSong)}
      </View>
      <FlatList
        data={songs}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => playSong(index)}>
            <View
              style={{
                padding: 10,
                borderBottomWidth: 0.7,
                borderBottomColor: '#808080',
              }}
            >
              <Text>Song - {index + 1}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
          paddingVertical: 10,
          backgroundColor: '#00B4D8',
        }}
      >
        {renderIoniconsIcon('play-back-circle', playPreviousSong)}

        {renderIoniconsIcon('play-forward-circle', playNextSong)}
      </View>
    </View>
  )
}

export default MusicPlayer
