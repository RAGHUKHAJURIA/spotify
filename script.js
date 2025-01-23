console.log('lets write java script');
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
  // Validate input; if not a number or less than 0, return "00:00"
  if (typeof seconds !== 'number' || seconds < 0 || isNaN(seconds)) {
    return "00:00";
  }

  // Round down to the nearest whole second
  seconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format minutes and seconds with leading zeros if necessary
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  // Combine minutes and seconds in mm:ss format
  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  console.log(as);

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }

  // show all song in the playlist
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songUL.innerHTML = ""
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

}

const playMusic =(track, pause=false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = `/${currFolder}/` + track;
  if(!pause){
    currentSong.play();
    play.src = "pause.svg"
  }
  
  
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

   
}




async function displayalbums (params) {
  
}







async function main() {
  // get the list of all songs
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  //display all albumms of the page
  displayalbums();

  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play();
      play.src = "pause.svg"
    }
    else {
      currentSong.pause();
      play.src = "playbtn.svg";

    }
  })

  //Listen for timeupdate event on audio

  currentSong.addEventListener("timeupdate", ()=>{
    
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}
    / ${formatTime(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  // add an event listener for an seek bar
  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100 ;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;

  })

  // add eventlistener to a hamerburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  })

   // add eventlistener to a close button
   document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  })

  // add an eventlisterner to prevois and next

  previous.addEventListener("click", () =>{
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    
    if((index-1) >= 0){
      playMusic(songs[index-1]);
    }
    
  })

  next.addEventListener("click", () =>{
    currentSong.pause();
    
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    
    if((index+1) < songs.length){
      playMusic(songs[index+1]);
    }
    
  })

  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e);
    currentSong.volume = parseInt(e.target.value)/100;
  })

  // load the library whenever the libraby is tab 

  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      
    })
  })


}

main();
