
var config = {
    apiKey: "AIzaSyC2yxTqZs-3GN5V4kyEnKqDR7J0nAlpxJc",
    authDomain: "train-scheduler-8e371.firebaseapp.com",
    databaseURL: "https://train-scheduler-8e371.firebaseio.com",
    projectId: "train-scheduler-8e371",
    storageBucket: "",
    messagingSenderId: "568654097827"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("form").submit(function (event) {
    // $("#submitButton").on("click", function (event) {
    event.preventDefault();

    var newObj = {
        trainName: $("#trainName").val().trim(),
        destination: $("#destination").val().trim(),
        firstTrainTime: $("#firstTrainTime").val().trim(),
        frequency: $("#frequency").val().trim()
    };

    database.ref().push(newObj);

});

function displayRealTime() {
    setInterval(function(){
        $('#current-time').html("The current time is: " + moment().format('hh:mm A'))
      }, 1000);
    }
    displayRealTime();



database.ref().on("child_added", function (snapshot) {

   // DATABASE REFERENCES
    trainName = snapshot.val().trainName;
    console.log(trainName);
    destination = snapshot.val().destination;
    console.log(destination);
    firstTrainTime = snapshot.val().firstTrainTime;
    console.log(firstTrainTime);
    frequency = parseInt(snapshot.val().frequency);
    console.log(frequency);

    var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log("TIME CONVERTED: " + firstTrainTimeConverted);

    var tMinusFirstTrainStartTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + tMinusFirstTrainStartTime);

    var timeDifference = tMinusFirstTrainStartTime % frequency;
    console.log(timeDifference);

    
    var minutesAway = frequency - timeDifference;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    var nextArrivalTime = moment().add(minutesAway, "minutes").format("HH:mm");
  console.log("ARRIVAL TIME: " + moment(nextArrivalTime).format("HH:mm"));


    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td>").text(firstTrainTime),
        $("<td>").text(frequency),
        $("<td>").text(minutesAway),
        $("<td>").text(nextArrivalTime) 
    );

    $('.tbody').append(newRow);
 

}, function (errorObject) {


    console.log("The read failed: " + errorObject.code);
});





