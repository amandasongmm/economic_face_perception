var img_lst = [
        {imgname: 'Google_1_Paul Reno_1_oval.jpg'},
        {imgname: 'Google_1_Sara Guajardo_1_oval.jpg'},
        {imgname: 'Google_1_Gertrude Bayne_11_oval.jpg'},
    ];

var fixed_lst = [
        {imgname: 'Google_1_Paul Reno_1_oval.jpg'},
        {imgname: 'Google_1_Sara Guajardo_1_oval.jpg'},
        {imgname: 'Google_1_Gertrude Bayne_11_oval.jpg'},
    ];

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Used like so
var arr = [
        {imgname: '1'},
        {imgname: '2'},
        {imgname: '3'}
    ];
arr = shuffle(arr);
console.log(arr);
