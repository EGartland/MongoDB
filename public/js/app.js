// utility class to toggle the note saving controls
function toggleModalControls(savenew) {
    if (savenew) {
        $("#save-controls").show();
        $("#update-controls").hide();
    } else {
        $("#save-controls").hide();
        $("#update-controls").show();
    }
}

// go to html routes
$(document).ready(function () {
    
    $("#home-link").on("click", function () {
        window.location = "/";
    });

    $("#scrape-link").on("click", function () {
        window.location = "/scrape";
    });

    $("#articles-link").on("click", function () {
        window.location = "/articles";
    });

});

$(document).on("click", ".save-article", function() {    
    event.preventDefault();
    var dataObj = {title:$(this).attr("data-title"), link:$(this).attr("data-href")};
    var parentObj = $(this).closest(".article");

    $.ajax({
        url: "/articles/",
        method: "POST",
        data: dataObj
    }).then(function (result) {
        //show a modal here
        if (result.hasOwnProperty("_id")) {
            parentObj.remove();
            alert("The article has been saved");
        }
    });
});

$("#new-note").on("click", function () {
    //clear the hidden input field
    $("#noteID").val("");

    //clear the inputs
    $("#note-title").val("");
    $("#note-body").val("");

    //show the save controls
    toggleModalControls(true);
});

// Delete an Article and all associated Notes
$(document).on("click", ".delete-article", function() {
    var articleObj = $(this).closest(".article");

    $.ajax({
        url: "/articles/" + $(this).attr("data-id"),
        type: "DELETE"
    }).then(function (result) {
        //show a modal here
        if (result) {
            articleObj.remove();
        }
    });    
}); 

// Action to launch modal that shows existing notes + form to add a new note
$(document).on("click", ".view-note", function () {
    var title = $(this).attr("data-title");
    var articleID = $(this).attr("data-id");

    $("#note-layer .saved-note").not(":first").remove();

    // set the modal header to the title of the article
    $("#notes-modal").find(".modal-title").text(title);

    // put articleID in a hidden input
    $("#articleID").val(articleID);
    // clear the noteID in case it was populated by a previous note update
    $("#noteID").val("");
    
    //default to save mode
    toggleModalControls(true);

    // clear the input and textbox in the modal
    $("#note-title").val("");
    $("#note-body").val("");

    // get all existing notes, construct html, and append them to note-layer
    $.ajax({
        url: "/articles/" + articleID,
        method: "GET"
    }).then(function (result) {
        if (result.notes.length > 0) {
            for (var i=0; i < result.notes.length; i++) {
                writeToNoteList(result.notes[i]._id, result.notes[i].title, result.notes[i].body)
            }
        }
    });

    $("#notes-modal").modal('show');
});

function writeToNoteList(id, title, body) {
    // make a new note from the templated note, remove the id, remove the class that is hiding it
    var newNote = $("#note-template").clone().prop('id', '').removeClass('dontshow');
    //set the id to the id of the note
    newNote.attr("id", id);
    //set the title of the note
    newNote.find("#note-text-area").html(title);
    //embed the note body to a data attribute
    newNote.find("#note-text-area").attr("data-body", body);
    //append the new note to the notes layer
    $("#note-layer").append(newNote);    
}

// When a saved note is clicked on
$(document).on("click", ".saved-note", function () {
    // move the contents of the saved note to the the input and textarea
    $("#note-title").val($(this).find("#note-text-area").text());
    $("#note-body").val($(this).find("#note-text-area").attr("data-body"));

    // set the noteID in the hidden input
    $("#noteID").val($(this).attr("id"));

    // hide the save controls for a new note and show the update existing note controls
    toggleModalControls(false);
});

// Action to save a note
$(document).on("click", "#save-note, #update-note", function () {
    //input validation
    if ($("#note-title").val().trim() == "" || $("#note-body").val().trim() == "") {
        alert("Please enter a title and body for the note");
        return false;
    }

    var formData = $("#note-form").serializeArray();

    var paramsData = {};
    formData.forEach(dataunit => {
        paramsData[dataunit.name] = dataunit.value
    });

    var url = "/articles/" + paramsData.articleID;

    $.ajax({
        url: url,
        method: "POST",
        data: formData
    }).then(function (result) {
        if (result) {
            var id = result.notes[result.notes.length -1]._id;            
            var title = result.notes[result.notes.length -1].title;
            var body = result.notes[result.notes.length -1].body;

            writeToNoteList(id, title, body);

            //clear the form inputs
            $("#note-title").val("");
            $("#note-body").val("")
        } else {
            alert("Sorry something went wrong. The note could not be saved.");
        }
    });
});

// Action to Delete a Note
$(document).on("click", ".note-delete", function () {
    var noteObj = $(this).closest(".saved-note");

    $.ajax({
        url: "/notes/" + noteObj.attr("id"),
        type: "DELETE",
        data: {articleID:$("#articleID").val()}
    }).then(function (result) {
        //show a modal here
        if (result) {
            //remove the note UI object on the modal window.
            noteObj.remove();

            //  Make sure there is no noteID because save and update share the same route and this 
            //  will make it think its an update if it accidentally gets passed back on a subsequent save
            $("#noteID").val("");
            
            //default to save mode
            toggleModalControls(true);
        
            // clear the input and textbox in the modal
            $("#note-title").val("");
            $("#note-body").val("");            
        }
    });  
});