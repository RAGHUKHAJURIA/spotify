console.log('lets write java script');
let currentSong = new Audio();

async function getSongs() {

  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  console.log(as);

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1])
    }
  }

  return songs;

}

const playMusic =(track) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "/songs/" + track;
  currentSong.play();
}



async function main() {



  // get the list of all songs
  let songs = await getSongs();
  console.log(songs);

  // show all song in the playlist
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> 


              <img src="music.svg" alt="">
              <div class="info">
                <div>${song.replaceAll("%20", " ")} </div>
                <div>Raghu</div>
              </div>
              <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="playbtn.svg" alt="">
              </div> </li>`;
  }

  // Attach an event listener to each song

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element=> {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
 
  })

  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "pause.svg"
    }
    else {
      currentSong.paused();
      play.src = "playbtn.svg";

    }
  })

}

main();
