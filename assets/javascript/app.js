
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

$(document).ready(function () {

$("form").submit(function (event) {
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
    setInterval(function () {
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
        
        $("<td>").addClass("td").text(trainName),
        $("<td>").addClass("td").text(destination),
        $("<td>").addClass("td").text(firstTrainTime),
        $("<td>").addClass("td").text(frequency),
        $("<td>").text(minutesAway),
        $("<td>").text(nextArrivalTime),
        $('<button/>').addClass("btn btn-info btn-sm editBtn").text("Edit"),
        $('<button/>').addClass("btn btn-danger btn-sm removeBtn").text("Remove")
    );

    $('.tbody').append(newRow);


}, function (errorObject) {


    console.log("The read failed: " + errorObject.code);
});

// FUNCTION THAT ALLOWS ME TO EDIT CELL DATA
database.ref().on("value", function(snapshot) {
    
function contentEditable() {
    $('.td').attr('contenteditable', 'true');
    $(this).text("Done");
    $(this).removeClass("editBtn");
    $(this).addClass("done");
}

function contentDone () {
    $('.td').attr('contenteditable', 'false');
    $(this).text("Edit");
    $(this).removeClass("done");
    $(this).addClass("editBtn");
}
console.log(contentEditable);

//ON CLICK OF .editBtn CLASS, ALLOW DATA TO BE EDITED BY RUNNING THE FUNCTION ABOVE

$(document).on("click", ".editBtn", contentEditable);
$(document).on("click", ".done", contentDone);

});
    


// function refreshTime() {

// }

});