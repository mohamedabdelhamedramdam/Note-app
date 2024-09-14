// elements

//btns
const addBtnPinned = document.querySelector(".add-btn-pin");
const addBtnNormal = document.querySelector(".add-btn-normal");
const addNoteBtn = document.querySelector(".add-note-btn");
const noteBtn = document.querySelector(".btn-notes");
const headerBtn = document.querySelector('.btn-header');
const lineselector = document.querySelectorAll(".line");

const menu = document.querySelector('.menu');
const closeIcon=document.querySelector('.close-img');
const closeSearch=document.querySelector('.close-search');

// input 
const searchIcon = document.querySelector(".search-icon");
const searchBox = document.querySelector(".search-box"); 
const input = document.querySelector(".input");
const title =document.getElementById("title");
const author =document.getElementById("author");
const note =document.getElementById("Your-Note");

// sections
const header = document.querySelector("header");
const heading = document.querySelector(".heading");
const navigation = document.querySelector("nav");
const main = document.querySelector("main");
const notesCont = document.querySelector(".notes-cont");
const notesdetailSec = document.querySelector(".note-detail");
const notesdetail = document.querySelector(".note-detail-cont");
const addNoteSec= document.querySelector(".add-note-cont");
const pinnedList = document.querySelector(".pinned-list");
const notesReg = document.querySelector(".notes-reg");
const showNotesSec = document.querySelector(".nav-notes");
const showAddnotSec = document.querySelector(".nav-addNotes");


let regularNotes = [];
let pinnedNotes = [];

const bigpc = window.matchMedia('(min-width: 993px)');
const smallpc = window.matchMedia('(min-width: 769px) and (max-width: 992px)');
const TabletmediaQuery = window.matchMedia('(min-width: 600px) and (max-width: 768px)');
const mobilemediaQuery = window.matchMedia('(max-width: 600px)');
///////////////////////////////////////////  functions  ////////////////////////////////////////////////////////////////    
function showAddnoteSection(){
    addNoteSec.classList.remove("hide");
    notesCont.classList.add("hide");
    notesdetailSec.classList.add("hide");
    lineselector[1].classList.remove("visibility")
    lineselector[0].classList.add("visibility")
}
/******************************************************************************************* */
function showHomepage(){
    addNoteSec.classList.add("hide");
    notesCont.classList.remove("hide");
    notesdetailSec.classList.remove("hide");
    notesdetail.classList.add("visibility");
    lineselector[0].classList.remove("visibility")
    lineselector[1].classList.add("visibility")
}
/**************************************************************************************** */
/**
 * Formats a given date into a human-readable string.
 * @param {Date} date - The date to be formatted.
 * @return {string} A string representation of the date in the format 'Month Day, Year'.
*/
function formatDate(date) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

const now = new Date();
const date = formatDate(now);
/********************************************************************************************************************************* */
function Note(title, author, note, date) {
    this.title = title.value.trim();
    this.author = author.value.trim();
    this.note = note.value.trim();
    this.date = date;
}
/******************************************************************************************************************************* */
function checkNotes() {
    const noNotes = document.querySelectorAll(".no-notes");
    const regularObj = loadFromStorage(regularNotes);
    const pinnedObj = loadFromStorage(pinnedNotes);

    // Ensure there are two .no-notes elements
    if (noNotes.length < 2) {
        console.error("Expected at least two .no-notes elements in the DOM.");
        return;
    }

    // Check regular notes
    if (regularObj.length > 0) {
        noNotes[1].classList.add("hide"); // Hide the 'No Regular Notes' element
    } else {
        noNotes[1].classList.remove("hide"); // Show the 'No Regular Notes' element
    }

    // Check pinned notes
    if (pinnedObj.length > 0) {
        noNotes[0].classList.add("hide"); // Hide the 'No Pinned Notes' element
    } else {
        noNotes[0].classList.remove("hide"); // Show the 'No Pinned Notes' element
    }
}

/******************************************************************************************************************************* */
/**
 * Validates user input by checking for empty fields and displaying warnings accordingly.
*
* @return {boolean} A boolean indicating whether the input is valid or not.
*/
function renderinput(){
    const warning = document.querySelectorAll(".warning");
    let isValid = true;
    if (title.value === "") {
        warning[0].classList.remove("hide");
        isValid = false;}
        else {
            warning[0].classList.add("hide");
        }
        if (author.value === "") {
            warning[1].classList.remove("hide");
            isValid = false;
        }
        else{
            warning[1].classList.add("hide");
        }
        if (note.value === "") {
            warning[2].classList.remove("hide");
            isValid = false;
        }
        else {
            warning[2].classList.add("hide");
        }
        return isValid;
    }
    /******************************************************************************************************************* */
    /**
     * Creates a new note object and adds it to the specified array.
    *
    * @param {Array} typeofnotes - The array to add the new note object to.
    * @return {void} This function does not return a value.
    */
function createNote(typeofnotes){
    const noteOBJ = new Note(title, author, note, date);
    saveToStorage(noteOBJ, typeofnotes);
    typeofnotes.push(noteOBJ);
    title.value = "";
    author.value= "";
    note.value = "";
}
/****************************************************************************************************************** */
/**
 * Renders a single note in the notes section or pinned section of the homepage.
**/
function renderNotes(note, typeofnotes) {
    // Find the existing <ul> for pinned or regular notes, create if it doesn't exist
    let notesList = typeofnotes === regularNotes ? notesReg.querySelector("ul") : pinnedList.querySelector("ul");
    
    if (!notesList) {
        notesList = document.createElement("ul");
        notesList.classList.add(typeofnotes === regularNotes ? "notes" : "pinned-notes");
        if (typeofnotes === regularNotes) {
            notesReg.appendChild(notesList);
        } else {
            pinnedList.appendChild(notesList);
        }
    }
    // Check if the note already exists in the list (avoid duplicates)
    if ([...notesList.children].some(item => item.querySelector('.note-title').textContent === note.title)) {
        return; // If the note already exists, do nothing
    }

    // Create a new <li> element for the note
    const noteItem = document.createElement("li");
    noteItem.classList.add("note-ele");
    
    // Set the innerHTML of the <li> element to the note's title, description, date, and delete button
    noteItem.innerHTML = `
    <h2 class="note-title">${note.title}</h2>
    <p class="note-desc">${note.note.substring(0, 100)}</p>
    <div class="note-footer">
            <p class="date">${note.date}</p>
            <button class="delete-btn">Delete</button>
        </div>`;

    // Append the <li> to the <ul> (reused)
    notesList.appendChild(noteItem);
}

// search to find a specific note 
function filterNotes() {
    const filter = input.value.toUpperCase();
    const noteElements = document.querySelectorAll('.note-ele');

    for (let i = 0; i < noteElements.length; i++) {
        const noteContainer = noteElements[i];
        const noteTitle = noteContainer.querySelector('.note-title');
        const txtValue = noteTitle.textContent || noteTitle.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            noteContainer.style.display = "";
        } else {
            noteContainer.style.display = "none";
        }
    }
}
/*************************************************************************** */
function saveToStorage(note, typeofnotes) {
    // Ensure 'notes' is an array
    if (typeofnotes === regularNotes) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        
        // Add the new note to the array
        if (Array.isArray(notes)) {
            notes.push(note);
        } else {
            notes = [note];
        }

        // Save the updated notes array back to localStorage
        localStorage.setItem("notes", JSON.stringify(notes));
    } else if (typeofnotes === pinnedNotes) {
        let storedPinnedNotes = JSON.parse(localStorage.getItem("pinnedNotes")) || [];
        
        // Add the new note to the array
        if (Array.isArray(storedPinnedNotes)) {
            storedPinnedNotes.push(note);
        } else {
            storedPinnedNotes = [note];
        }
        
        // Save the updated notes array back to localStorage
        localStorage.setItem("pinnedNotes", JSON.stringify(storedPinnedNotes));
    }
}
/**************************************************************************************** */

/**
 * Retrieves notes from localStorage based on the specified type of notes.
 *
 * @param {string} typeofnotes - The type of notes to retrieve (regularNotes or pinnedNotes)
 * @return {array} An array of notes retrieved from localStorage
 */
function loadFromStorage(typeofnotes) {
    // Retrieve all notes from localStorage or return an empty array if none exist
    if (typeofnotes === regularNotes) {
        let notes = JSON.parse(localStorage.getItem("notes")) || [];
        return notes;
    }
    else if (typeofnotes === pinnedNotes) {
        let notes = JSON.parse(localStorage.getItem("pinnedNotes")) || [];
        return notes;
    }
    
}
/**************************************************************************************************** */




/**
 * Loads and renders notes from localStorage.
 *
 * This function retrieves the regular notes and pinned notes from localStorage.
 * It then renders all regular notes and pinned notes by calling the `renderNotes`
 * function. It also adds event listeners to the delete buttons of regular notes
 * and pinned notes.
 *
 * @return {void} This function does not return a value.
 */

function loadrenderNotes() {
    // Load from localStorage once when the page is loaded
    regularNotes = loadFromStorage(regularNotes) || [];
    pinnedNotes = loadFromStorage(pinnedNotes) || [];

    // Render all regular notes
    regularNotes.forEach(note => renderNotes(note, regularNotes));

    // Render all pinned notes
    pinnedNotes.forEach(note => renderNotes(note, pinnedNotes));
    
    document.querySelectorAll('.notes .delete-btn').forEach((btn) => {
        btn.addEventListener("click", (event) => {
            deleteItem(event, "notes");  // Pass the string "notes" for regular notes
            checkNotes();
        });
    });

    // Add delete event listeners for pinned notes
    document.querySelectorAll('.pinned-notes .delete-btn').forEach((btn) => {
        btn.addEventListener("click", (event) => {
            deleteItem(event, "pinnedNotes");  // Pass the string "pinnedNotes" for pinned notes
            checkNotes()
        });
    });
    
}




// Function to handle the click event on list items
function handleListItemClick(event, typeofnotes) {
    // Find the closest <li> ancestor
    const liElement = event.target.closest('li');
    
    if (liElement) {
        const index = Array.from(liElement.parentNode.children).indexOf(liElement);
        document.querySelector(".note-detail-title").innerHTML = `${typeofnotes[index].title}`;
        document.querySelector(".note-detail-date").innerHTML = `${typeofnotes[index].date}`;
        document.querySelector(".note-detail-content").innerHTML = `${typeofnotes[index].note}`;
    }
}

// Function to delete an item from the object in local storage
function deleteItem(event, typeofnotesKey) {
    if (event.target && event.target.nodeName === 'BUTTON') {
        const listItem = event.target.closest('li'); // Find the closest <li> ancestor
        const index = Array.from(listItem.parentNode.children).indexOf(listItem);
        
        // Load the notes from localStorage using the key passed in (typeofnotesKey)
        let obj = loadFromStorage(typeofnotesKey === "notes" ? regularNotes : pinnedNotes);
        
        if (Array.isArray(obj)) {
            obj.splice(index, 1); // Remove the note from the array
        }

        // Save the updated notes array back to localStorage using the correct key
        localStorage.setItem(typeofnotesKey, JSON.stringify(obj));

        // Remove the note from the UI
        listItem.remove();
    }
}

/**********************************************************************/
// apply some style to different media query
function applyTabletMediaQueryStyles() {
    const TabletmediaQuery = window.matchMedia('(min-width: 600px) and (max-width: 768px)');
    const mobilemediaQuery = window.matchMedia('(max-width: 600px)');

    function handleTabletChange(e) {
        if (e.matches) {
            // Apply styles and event listeners for the specific media query
            menu.addEventListener('click', toggelMenu);
            searchIcon.addEventListener('click', toggleElement);
            closeIcon.addEventListener('click', closeMenu);
            

            pinnedList.addEventListener('click', function(event) {
                handleListItemClick(event, pinnedNotes);
                note_details();
            });

            notesReg.addEventListener('click', function(event) {
                handleListItemClick(event, regularNotes);
                note_details();
            });
            addBtnPinned.addEventListener('click',()=>{
notesdetailSec.classList.add('hide');
            });
            addBtnNormal.addEventListener('click',()=>{
notesdetailSec.classList.add('hide');
            });
            notesdetailSec.classList.add('hide'); 

        }
        // else{
        //     // menu.removeEventListener('click',toggelMenu);
        //     // showNotesSec.removeEventListener('click',toggelMenu);
            
        // }
    }

    function handleMobileChange(e) {
        if (e.matches) {
            // Apply styles and event listeners for the mobile-specific media query
            searchIcon.addEventListener('click', openSearch);
            menu.addEventListener('click', toggelMenu);
            closeIcon.addEventListener('click', closeMenu);
            closeSearch.addEventListener('click', closeSearchfun);

            pinnedList.addEventListener('click', function(event) {
                handleListItemClick(event, pinnedNotes);
                note_details();
            });
            notesdetailSec.classList.add('hide');

            notesReg.addEventListener('click', function(event) {
                handleListItemClick(event, regularNotes);
                note_details();
            });
            notesdetailSec.classList.add('hide');
        }
    }

    // Check the media query initially and apply the styles
    handleTabletChange(TabletmediaQuery);
    handleMobileChange(mobilemediaQuery);

    // Listen for changes in the media query and apply the event listeners accordingly
    TabletmediaQuery.addEventListener('change', handleTabletChange);
    mobilemediaQuery.addEventListener('change', handleMobileChange);
}

// Apply styles for the tablet and mobile media query
applyTabletMediaQueryStyles();

// opening and closing search bar
function toggleElement() {
    if (input.classList.contains('hidden')) {
        input.classList.remove('hidden');
        input.style.backgroundColor = '#f2f2f2';
        input.style.padding = '0.3rem';
        input.style.borderRadius = '0.5rem';
        
    } else {
        input.classList.add ('hidden');
    }
}
// open search in phone
function openSearch() {
    searchBox.classList.toggle('search-box-phone');
    closeSearch.classList.toggle('hide');
    header.classList.toggle('gray');
    searchBox.classList.toggle('white');
    input.style.width="100%";
    input.style.backgroundColor="white";
}
// close search in phone
function closeSearchfun() {
    searchBox.classList.toggle('search-box-phone');
    closeSearch.classList.toggle('hide');
    header.classList.toggle('gray');
    searchBox.classList.toggle('white');
    input.style.width= '0'
}
// opening and closing menu
function toggelMenu() {
    
    main.classList.toggle('margin-left');
    heading.classList.toggle('margin-left');
    navigation.classList.toggle('hideNav');
    closeIcon.classList.toggle('hide');
    
}
// closing menu
function closeMenu() {
    closeIcon.classList.add('hide');
    navigation.classList.add('hideNav');
    main.classList.remove('margin-left');
    heading.classList.remove('margin-left');
}
// show note details section and hiding other sections
function note_details(){
    notesCont.classList.add('hide');
    notesdetailSec.classList.remove("hide");
}

//-----------------------------------------------Event listeners --------------------------------------------------------------
// <<<<<<<<<<<<<<<<  ✨ Add Note  >>>>>>>>>>>>>>>
addBtnNormal.addEventListener("click", () => {
    const TabletmediaQuery = window.matchMedia('(min-width: 600px) and (max-width: 768px)');
    const mobilemediaQuery = window.matchMedia('(max-width: 600px)');
    if (TabletmediaQuery || mobilemediaQuery){
        if (renderinput()) {        
            createNote(regularNotes);
            addNoteSec.classList.add("hide");
            notesCont.classList.remove("hide");
            notesdetailSec.classList.remove("hide");
            lineselector[0].classList.remove("visibility")
            lineselector[1].classList.add("visibility")
            loadrenderNotes()
            // renderNotes(regularNotes[regularNotes.length-1], regularNotes);
            checkNotes();
            notesdetailSec.classList.add('hide');

    }}
else{
    if (renderinput()) {        
        createNote(regularNotes);
        showHomepage();
        loadrenderNotes()
        // renderNotes(regularNotes[regularNotes.length-1], regularNotes);
        checkNotes();
    }
}});
/******************************************************************************************* */
addBtnPinned.addEventListener("click", () => {
    
    if (TabletmediaQuery || mobilemediaQuery){
        if(renderinput()){
            createNote(pinnedNotes);
            addNoteSec.classList.add("hide");
            notesCont.classList.remove("hide");
            notesdetailSec.classList.remove("hide");
            lineselector[0].classList.remove("visibility")
            lineselector[1].classList.add("visibility")
            loadrenderNotes();
            checkNotes();
            notesdetailSec.classList.add('hide');
        }
    
    else{
    if(renderinput()){
        createNote(pinnedNotes);
        showHomepage();
        loadrenderNotes();
        checkNotes();
    }
}
}});
/********************************************************************************************** */
// show add note section    
addNoteBtn.addEventListener("click", () => {
    showAddnoteSection();
    });
/********************************************************************************************* */
// show note section     
showNotesSec.addEventListener("click", () => {
    const TabletmediaQuery = window.matchMedia('(min-width: 600px) and (max-width: 768px)');
    const mobiletmediaQuery = window.matchMedia('(min-width: 600px) and (max-width: 768px)');

    if(!TabletmediaQuery || ! mobiletmediaQuery){
    showHomepage();}
    else {
            addNoteSec.classList.add("hide");
            notesCont.classList.remove("hide");
            lineselector[0].classList.remove("visibility")
            lineselector[1].classList.add("visibility")
            notesdetailSec.classList.add("hide");
    }
});
/******************************************************************************************** */
// show add note section    
showAddnotSec.addEventListener("click", () => {
    showAddnoteSection();
});

/******************************************************************************************** */
// Call loadAndRenderNotes when the page loads
document.addEventListener('DOMContentLoaded', function () {
    loadrenderNotes();
    checkNotes();
    if (smallpc.matches) {
        notesdetailSec.classList.add('hide');
    }
    if (bigpc.matches){
        notesdetailSec.classList.remove('hide');
    }
    
});
/****************************************************************************************** */
// show pinned list items on note details section

pinnedList.addEventListener('click', function(event) {
    handleListItemClick(event , pinnedNotes);
    addNoteSec.classList.add("hide");
    notesCont.classList.remove("hide");
    notesdetailSec.classList.remove("hide");
    // notesCont.classList.add('hide');
    if (smallpc.matches || mobilemediaQuery.matches){
        notesCont.classList.add('hide');
    }

});
// show note list items on note details section
notesReg.addEventListener('click', function(event) {
    handleListItemClick(event , regularNotes);
    addNoteSec.classList.add("hide");
    notesCont.classList.remove("hide");
    notesdetailSec.classList.remove("hide");
    if (smallpc.matches || mobilemediaQuery.matches){
        notesCont.classList.add('hide');
    }
});

noteBtn.addEventListener('click',function(){
    notesCont.classList.add('hide');
    headerBtn.classList.remove('hide');
});

headerBtn.addEventListener('click',function(){
    notesCont.classList.remove('hide');
    noteBtn.classList.remove('hide');
    headerBtn.classList.add('hide');
});

/* search for a sepcific note*/ 
input.addEventListener('keyup', filterNotes);
window.addEventListener('resize', () => {
    if (bigpc.matches) {
        notesdetailSec.classList.remove('hide');
        notesCont.classList.remove('hide')
        // closeSearch.classList.add('hide');
    } else if (smallpc.matches) {
        notesdetailSec.classList.add('hide');
    }
    else if (mobilemediaQuery.matches) {
        input.style.width='0';
    }
});

/*********************************************************************** */
