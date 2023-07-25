let worda = words[Math.floor(Math.random() * words.length)];;

let guess = "";
var mobile = window.innerWidth<799;
function input(letter) {
  if(!canGuess) return;
  if(guess.length < 5) {
    guess += letter;

    document.getElementById(`slot${guess.length+(SlotGuesses*5)}`).style = 'border: #58585a solid 3px;';
    
    updateGuess();
    var a = guess.length;
    document.getElementById(`slot${guess.length+(SlotGuesses*5)}`).setAttribute('state', 'pop');
    setTimeout(function() {
      document.getElementById(`slot${a+(SlotGuesses*5)}`).setAttribute('state', '');
    }, 100)
  }
}

var SlotGuesses = 0;
var guesses = 1;
var leaderboard = {}
var typing = false;
var sent = false;

setInterval(function() {
  if(document.getElementById("nameValue") == document.activeElement) {
    typing = true;
    sent = false;
  } else {
    if(document.getElementById("nameValue").value.length > 1 && !sent) {
      sent = true;
      socket.emit('nameChange',localStorage.username,document.getElementById("nameValue").value)
      localStorage.username = document.getElementById("nameValue").value;
    }
  }
},100)

// Best Starter words
// tread
// spoil
// munch
// befog
// jokey
// use smarts to get last one
// use these and best one comes out at bottom
// var socket = io('https://WordleLeaderboard.friedcow.repl.co');

setTimeout(function() {
  var arr = document.getElementsByClassName('key');
  for(var i=0;i<arr.length-1;i++) {
    arr[i].style.width = window.innerWidth/11.5+"px"
  }
  document.getElementById('del').style.height = arr[0].getBoundingClientRect().height+'px';
  if(mobile) {
    var start = arr[0].getBoundingClientRect().height/6;
    document.getElementsByClassName('rowThree')[0].style.bottom = start+"px"
    document.getElementsByClassName('rowTwo')[0].style.bottom = start+(start*7)+"px"
    document.getElementsByClassName('rowOne')[0].style.bottom = start+(start*14)+"px" 
  }
},10)

// function doLeaderboard() {
//   socket.emit('addToLeaderBoard',localStorage.username,streak)
//   socket.emit('getLeaderboard')
// }

// socket.on('connect', function(){
//   if(!localStorage.username)
//     localStorage.username = `user${Math.floor(Math.random() * (100 - 1 + 1) + 1)}`
//   socket.emit('getLeaderboard')  
// })

// var leaderboardArray = []

// socket.on('setLeaderboard', function(data) {
//   leaderboard = JSON.parse(data)
//   leaderboardArray = [];
//   for(var user in leaderboard) {
//     leaderboardArray.push([user,leaderboard[user]])
//     leaderboardArray.sort(function(a, b){
//       a = a[1]
//       b = b[1]
//       return b-a;
//     });
//   }
//   var temp = "";
//   for(var i=0;i<leaderboardArray.length; i++) {
//     var obj = leaderboardArray[i];
//     temp+= `${obj[0]} ${obj[1]} streak<br>`
//   }
//   document.getElementById('peeps').innerHTML = temp
// })

function updateGuess() {
    var temp = " ";
    for (var i = 0; i < 5; i++) {
        if (i+(SlotGuesses*5)+1> 30) return;
        if (guess.charAt(i)) {
          temp = guess.charAt(i).toUpperCase();
        } else {
          document.getElementById(`slot${i+(SlotGuesses*5)+1}`).style.border = '#3a3a3c solid 3px'
        }
        document.getElementById(`slot${i+(SlotGuesses*5)+1}`).value = temp;
        temp = " ";
    }
}

function enter() {
    test();
}

function del() {
    guess = guess.slice(0, -1);
    updateGuess();
}

const isLetter = (character) => {
    return character && character.length === 1 && character.toLowerCase() !== character.toUpperCase();
}
var fadingKeys = [];
document.onkeydown = function(e) {
  if(!canGuess) return;
  if(typing) return;
  
  
  if (e.key == 'Backspace') {
      guess = guess.slice(0, -1);
      document.getElementById(`slot${guess.length+(SlotGuesses*5)+1}`).style = 'border: #3a3a3c solid 2px;';
  } else if (e.key == 'Enter') {
      test()
  } else if (isLetter(e.key)) {
    input(e.key)
    if(!fadingKeys.includes(e.key)) {
      fadingKeys.push(e.key)
      var stored = document.getElementById(e.key.toLowerCase()).style.background;
      document.getElementById(e.key.toLowerCase()).style.background = '#C2BECD';
      setTimeout(function() {
        fadingKeys.splice(fadingKeys.indexOf(e.key),1)
        document.activeElement = document.getElementById(e.key.toLowerCase()).style.background =stored
      },150) 
    }
  }
  updateGuess();
}

window.onload = function() {
  if (getCookie('streak')) {
    streak = parseFloat(getCookie('streak'));
  }
  if(getCookie('highscore')) {
    document.getElementById('highscore').innerText = 'Highscore: '+getCookie('highscore');
  } else {
    setCookie('highscore',0)
  }
  // if(localStorage.username)
  //   document.getElementById("nameValue").value = localStorage.username;
  document.getElementById('winstreak').innerHTML="Score: "+streak;
  worda = btoa(worda);
}


window.onbeforeunload = function(e) {
  if(!canleave && SlotGuesses > 0) {
    e.returnValue = "a";
    setCookie('streak',0);
    streak = 0;
  }
};

document.onclick = function() {
    if (canleave) {
      // doLeaderboard()
      location.reload()
    }
}
var num = -1;
function flipAndColor(slotNum, color,i,guess) {
    num++;
    setTimeout(function() {
      // start flip animation
      document.getElementById(`slot${slotNum}`).setAttribute('state', 'flipIn');
      setTimeout(function() {
          // set new style halfway through flip
          document.getElementById(`slot${slotNum}`).style = "background: " + color + "; border: none";
          // finish flip
          document.getElementById(`slot${slotNum}`).setAttribute('state', 'flipOut');
      }, 250)
    },num*325)
    setTimeout(function(){
      document.getElementById(guess.charAt(i)).style.background = color;
      document.getElementById(guess.charAt(i)).style.color = "white"; 
    }, 1800)
    if(num == 4) {
      num = -1;
    }
}
function doTing(i) {
    setTimeout(function() {
        document.getElementById(`slot${i+(SlotGuesses*5)+1}`).setAttribute('state', '');
    }, 600)
}

var canleave = false;
var winned = false;
var canGuess = true;

function test() {
    let word = atob(worda)
    var matchedLetters = 0;
    if (!allowedWords.includes(guess) && !words.includes(guess)) {
        if (guess.length == 5) {
            for (var i = 0; i < 5; i++) {
                document.getElementById(`slot${i+(SlotGuesses*5)+1}`).setAttribute('state', 'test');
                doTing(i)
            }
        }
        return;
    }

    for (var i = 0; i < 5; i++) {
        var element = document.getElementById(guess.charAt(i));
        if (guess.charAt(i) == word.charAt(i)) {
            flipAndColor(i + (SlotGuesses * 5) + 1, "#AAD174", i,guess);
            matchedLetters++;
        } else if (word.includes(guess.charAt(i))) {
            flipAndColor(i + (SlotGuesses * 5) + 1, "#F7CD47", i,guess);
        } else {
            flipAndColor(i + (SlotGuesses * 5) + 1, "#807E89", i,guess);
        }
    }

    if (matchedLetters == 5) {
        winned = true;
        setTimeout(function() {
            canleave = true;
        }, 1000);
    }

    if (getCookie('streak')) {
      streak = parseFloat(getCookie('streak'));
    } else {
      setCookie('streak', 0)
      streak = 0;
    }
    SlotGuesses++;
    canGuess = false;
    setTimeout(function() {
      canGuess = true;
      if (SlotGuesses == 6 || winned) {
        var notifText = document.getElementById('notificationText');
        var notifTitle = document.getElementById('notificationTitle');
        document.getElementById('notificationBox').style = "visibility: visible";
        if(winned) {
          streak += parseFloat(7-SlotGuesses);
          setCookie('streak', streak)
          if(parseFloat(getCookie('highscore')) < streak) {
            setCookie('highscore',streak)
          }

          notifTitle.innerHTML = "You Won!";
          notifText.innerHTML = `The word was ${word.toUpperCase()}<br>You Earned ${(7-SlotGuesses)} Points This Round!<br>Click anywhere to continue`;
        } else {
          notifTitle.innerHTML = "You Lost!";   
          notifText.innerHTML = "The word was "+word+"<br>Score: 0<br>Click anywhere to continue";
          
          streak = 0;
          setCookie('streak', streak)
        }
        setTimeout(function() {
            canleave = true;
        }, 1000);
      }
    }, 2000)
    
    guess = '';
    updateGuess();
}

var streak = 0;

function eliminate(letter) {
  document.getElementById('Guess').innerHTML = document.getElementById('Guess').innerHTML.replace(letter + " ", "")
}