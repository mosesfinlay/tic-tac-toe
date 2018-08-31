// !function() {
// Hides the game board
$("#board").hide();

// Hides the win screen
$(".screen-win").hide();

const error = (isError, where) => {
  if (isError) {
    $(where).addClass("error");
  } else {
    $(where).removeClass("error");
  }
};

// Event triggered when the game starts
$("#start a.button").on("click", e => {
  const name = $(".name").val();

  if ($(".name").val()) {
    // Hides start screen
    $("#start").hide();
    // Shows the game
    $("#board").show();

    $(".player-name").remove();
    $(`<h1 class="player-name">${name} VS Computer</h1>`).insertAfter("h1+ul");
  } else {
    error(true, ".name");
  }
});

const players = ["o", "x"];
let currentPlayer = players[0];

// Game functions
const restartGame = selectedBoxes => {
  // Adds an event listener to restart button on the finish screen
  $(".screen-win .button").on("click", e => {
    // Sets the array of selected boxes to 0
    selectedBoxes.length = 0;
    $(".boxes .box").each((index, item) => {
      // Removes the class of active for player1 and player2
      $("#player1").removeClass("active");
      $("#player2").removeClass("active");
      // Removes the box-filled class for all the boxes
      $(item).removeClass("box-filled-1");
      $(item).removeClass("box-filled-2");
      // Adds a class of active to player1
      $("#player1").addClass("active");
      // Sets the current players turn to player1
      currentPlayer = players[0];
    });
    // Hides the win screen
    $(".screen-win").hide();
    // Shows the board
    $("#start").show();
  });
};
const win = selectedBoxes => {
  // Hides the board
  $("#board").hide();
  // Shows the win screen
  $(".screen-win").show();

  if (currentPlayer === "o") {
    // Changes the message on the win screen
    $(".screen-win p.message").text(`${$(".name").val()} Wins!`);
    /*
      Removes the screen-win-two class and
      adds the screen-win-one class to the finish screen
    */
    $("#finish").removeClass("screen-win-two");
    $("#finish").addClass("screen-win-one");
  } else if (currentPlayer === "x") {
    // Changes the message on the win screen
    $(".screen-win p.message").text(`Computer Wins!`);
    /*
      Removes the screen-win-one class and
      adds the screen-win-two class to the finish screen
    */
    $("#finish").removeClass("screen-win-one");
    $("#finish").addClass("screen-win-two");
  }
};
const draw = selectedBoxes => {
  // Hides the board
  $("#board").hide();

  // Removes the screen-win-one and the screen-win-two class from the finish screen
  $("#finish").removeClass("screen-win-one");
  $("#finish").removeClass("screen-win-two");

  // Shows the win screen
  $(".screen-win").show();
  // Changes the message on the win screen
  $(".screen-win p.message").text(`It's a Tie!`);
  // Adds the screen-win-tie class to the finish screen
  $("#finish").addClass("screen-win-tie");
};
const endGame = (drawOrWin, selectedBoxes) => {
  if (drawOrWin.toLowerCase() === "win") {
    win(selectedBoxes);
  } else if (drawOrWin.toLowerCase() === "draw") {
    draw(selectedBoxes);
  }
  restartGame(selectedBoxes);
};
const checkWin = player => {
  // Holds all of the wining combonations for getting three in a row
  const winCombonations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  let selectedBoxes = [];
  let boxClass;
  let win = false;

  if (currentPlayer === "o") {
    boxClass = ".box-filled-1";
  } else if (currentPlayer === "x") {
    boxClass = ".box-filled-2";
  }

  // Adds the selected boxes to the selectedBoxes array
  $(boxClass).each((index, item) => selectedBoxes.push(
    $(".box").index(item)+1)
  );

  if (selectedBoxes.length >= 3) {
    for (let i = 0; i < winCombonations.length; i++) {
      // Checks that there are three boxes in a row
      if (selectedBoxes.indexOf(winCombonations[i][0]) !== -1 && selectedBoxes.indexOf(winCombonations[i][1]) !== -1 && selectedBoxes.indexOf(winCombonations[i][2]) !== -1) {
        endGame("win", selectedBoxes);
        win = true
      }
    }
  }

  // If it is the fifth move show the end screen
  if (win === false && selectedBoxes.length === 5) {
    endGame("draw", selectedBoxes);
  }
};

const computerMove = item => {
  const move = () => {
    let selectedBoxes = [];
    let freeMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Adds the selected boxes to the selectedBoxes array
    $(".box").each((index, item) => {
      if (item.className === "box box-filled-1") {
        selectedBoxes.push($(".box").index(item)+1);
      }

      if (item.className === "box box-filled-2") {
        selectedBoxes.push($(".box").index(item)+1);
      }
    });

    // Removes taken moves from the freeMoves array
    for (let i = 0; i < selectedBoxes.length; i++) {
      for (let j = 0; j < freeMoves.length; j++) {
        if (selectedBoxes[i] === freeMoves[j]) {
          freeMoves.splice(j, 1);
        }
      }
    }


    const move = freeMoves[Math.floor(Math.random() * freeMoves.length)];

    return move;
  };

  $(`.box:nth-child(${move()})`).addClass("box-filled-2");
  $("#player2").removeClass("active");
  $("#player1").addClass("active");
  checkWin("x");
  currentPlayer = players[0];
};

const switchTurn = (player, item) => {
  if (player === "o") {
    if (item.className !== "box box-filled-1" && item.className === "box") {
      $(item).addClass("box-filled-1");
      $("#player1").removeClass("active");
      $("#player2").addClass("active");
      checkWin("o");
      currentPlayer = players[1];
    }
  } else if (player === "x") {
    computerMove(item);
  }
};

$(".boxes .box").each((index, item) => {
  // When the mouse hovers over a box, a background image appears
  $(item).on("mouseenter", () => {
    if (item.className !== "box box-filled-1" && item.className !== "box box-filled-2" && item.className === "box") {
      $(item).css("backgroundImage", `url(./img/${currentPlayer}.svg)`);
    }

  }).on("mouseleave", () => $(item).css("backgroundImage", "")); // When the mouse leaves a box the background image disappears

  $("#player1").addClass("active");

  $(item).on("click", () => {
    if (currentPlayer === "o") {
      switchTurn("o", item);
      switchTurn("x", item);
    }
  });
});


// }();
