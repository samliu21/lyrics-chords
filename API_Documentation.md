# API Documentation

## Endpoints
- [Songs](#songs)
- [Comments](#comments)
- [Auth](#auth)
- [Email](#email)
- [Views](#views)

Note that the API calls that start with `$$` require authentication.

## <a name="songs">Songs</a>

#### $$ `/api/songs/`, methods = [`GET`, `POST`]

Usage: List the requester's songs. `POST` requires the contents of the new song in the request body

Sample interaction:
```json
$ curl https://lyrics-chords.herokuapp.com/api/songs/
[
   {
        "id": 61,
        "creator": "samliu12",
        "name": "Never say never",
        "artist": "Justin Bieber",
        "lyrics": "",
        "pulled_lyrics": "",
        "chords": "",
        "strumming_pattern": "",
        "public": true,
        "is_favourite": false
    }
]
```

#### $$ `/api/songs/<song id>/`, methods = [`GET`, `PATCH`, `PUT`, `DELETE`]

Usage: Manipulate one of the requester's songs. `PATCH` and `PUT` require the contents of the new song in the request body

Sample interaction:
```json
curl -u <username>:<password> https://lyrics-chords.herokuapp.com/api/songs/142/ -X PATCH -H "Content-Type: application/json" -d '{"is_favourite": true}'

[
   {
        "id": 61,
        "creator": "samliu12",
        "name": "Never say never",
        "artist": "Justin Bieber",
        "lyrics": "",
        "pulled_lyrics": "",
        "chords": "",
        "strumming_pattern": "",
        "public": true,
        "is_favourite": true
    }
]
```

#### `/api/songs/public/`, methods = `GET`

Usage: List the publicly available songs

Sample interaction:
```json
$ curl https://lyrics-chords.herokuapp.com/api/songs/public/
[
   {
        "id": 61,
        "creator": "samliu12",
        "name": "Never say never",
        "artist": "Justin Bieber",
        "lyrics": "",
        "pulled_lyrics": "",
        "chords": "",
        "strumming_pattern": "",
        "public": true,
        "is_favourite": false
    },
    {
        "id": 62,
        "creator": "samliu11",
        "name": "Never say never",
        "artist": "Justin Bieber",
        "lyrics": "",
        "pulled_lyrics": "",
        "chords": "",
        "strumming_pattern": "A B C D",
        "public": true,
        "is_favourite": true
    }
]
```

#### `/api/songs/<userame>/count/`, methods = `GET`

Usage: List the number of songs that the user has created

Sample interaction:
```json
$ curl https://lyrics-chords.herokuapp.com/api/songs/samliu11/count/
2
```

#### $$ `/api/songs/<song_id>/lyrics/`, methods = `GET`

Usage: Get the lyrics of song with id `song_id`

Sample interaction:
```json
$ curl -u <username>:<password> https://lyrics-chords.herokuapp.com/api/songs/142/lyrics/
"Loving him is like\nDriving a new Maserati down a dead-end street\nFaster than the wind, passionate as sin\nEnding so suddenly\nLoving him is like tryin' to change your mind\nOnce you're already flying through the free fall\nLike the colors in autumn, so bright\nJust before they lose it all\n\nLosing him was blue like I'd never known\nMissing him was dark gray, all alone\nForgetting him was like\nTryin' to know somebody you never met\nBut loving him was red\n\n(Red, red)\n(Red, red)\nLoving him was red\n(Red, red)\n(Red, red)\n\nTouching him was like\nRealizing all you ever wanted was right there in front of you\nMemorizing him was as\nEasy as knowing all the words to your old favorite song\nFighting with him was like\nTrying to solve a crossword and realizing there's no right answer\nRegretting him was like\nWishing you never found out that love could be that strong"
```
## <a name="comments">Comments</a>

#### `/api/comments/`, methods = [`GET`, `POST`]

Usage: Get a list of all comments. `POST` requires the contents of the new comment in the request body

Sample interaction:
```json
$ curl https://lyrics-chords.herokuapp.com/api/comments/
[
  {
    "id": 127,
    "song": 106,
    "username": "sjay05",
    "contents": "everyone must do aac3",
    "date_of_creation": "2021-07-28T23:49:41.572998Z",
    "edited": false,
    "parent": null
  }
]
```

#### $$ `/api/comments/<song id>/`, methods = [`GET`, `PATCH`, `PUT`, `DELETE`]

Usage: Manipulate one of the requester's comments. ``PATCH` and `PUT` require the contents of the new comment in the request body

Sample interaction:
```json
curl -u <username>:<password> https://lyrics-chords.herokuapp.com/api/comments/127/ -X DELETE
<Empty response>
```

#### `/api/comments/<song id>/get_song_comments/`, methods = `GET`

Usage: Get the comments on song specified by `song id`. 

Sample interaction:
```json
curl https://lyrics-chords.heokuapp.com/api/comments/157/get_song_comments/
[
  {
    "id": 154,
    "song": 157,
    "username": "vishnus",
    "contents": "orz",
    "date_of_creation": "2021-08-07T02:06:54.766834Z",
    "edited": false,
    "parent": null
  }
]
```

## <a name="auth">Auth</a>



## <a name="email">Email</a>

## <a name="views">Views</a>
