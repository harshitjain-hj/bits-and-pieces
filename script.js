//Load a book from disk
function loadBook(filename, displayName) {
    let currentBook = "";
    let url = "books/" + filename;

    //reset our UI
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    //create a server request to load our book
    var xhr = new XMLHttpRequest();
    // true to make it async so that it does't lock the UI 
    xhr.open("GET", url, true );
    xhr.send();

    // check whether it is completed 
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            getDocStats(currentBook);

            // remove line breaks and carriage return and repalace with a <br> by the help of regular expression
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0; 

        } 
    };
}

// get the stats for the book
function getDocStats(fileContent){

    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    let wordDictionary = {};

    //Count every word in the wordArray
    for( let word in wordArray) {
        let wordValue = wordArray[word];
        if(wordDictionary[wordValue] > 0){
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    }

    //sort the array
    let wordList = sortProperties(wordDictionary);

    //Return the top 5 words used
    var top5Words = wordList.slice(0, 6);
    //Return the least 5 words used
    var least5Words = wordList.slice(-6, wordList.length);

    //Write the values to the page
    ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastUsed"));
}

function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for (i = 0; i < items.length - 1; i++) {
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
    }

    element.innerHTML = resultsHTML;

}

function sortProperties(obj) {
    //first convert the object to an array
    let rtnArray = Object.entries(obj);

    //Sort the array
    rtnArray.sort(function (first, second) {
        return second[1] - first[1];
    });

    return rtnArray;

}