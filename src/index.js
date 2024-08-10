//importing the functions required to run firebase db
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const firebaseConfig = { 
    databaseURL: "https://ezkartdb-default-rtdb.firebaseio.com/"
}

// Initialize Firebase

const app = initializeApp(firebaseConfig); //initializing the firebase database using the unique URL
const database = getDatabase(app); //getting the database from the initialized app
const cartInDB = ref(database, "itemsList"); //getting the reference of the database

const addToCart = document.getElementById("add-btn"); 
const item = document.getElementById("item-el"); 
const shoppingList = document.getElementById("shopping-list");

addToCart.addEventListener("click", function(){
    
    let itemName = item.value;
    push(cartInDB, itemName); //pushing the item name to the firebase database

    clearInputField(); //clears the input section once item is added to DB
})

function clearInputField(){
    item.value = "";
}

function clearShoppingList(){
    shoppingList.innerHTML = "";
}

onValue(cartInDB, function(snapshot){ //checks if there is any data in the DB at a specific time.
    
    if (snapshot.exists()){
        let data = snapshot.val();
        let entriesInData = Object.entries(data);
        clearShoppingList(); //clears all previous items in the shopping list and then appends all the new ones when new data is added to the DB

        for (let i=0; i<entriesInData.length; i++){
            let currentItem = entriesInData[i];
            appendItemsToCart(currentItem); //appending all the new items into the shopping list using function
        }

    }
    else{
        shoppingList.innerHTML = "No items in cart yet...";
    }
})

function appendItemsToCart(item){

    let itemID = item[0];
    let itemName = item[1];

    let newLiEl = document.createElement("li");
    newLiEl.textContent = itemName;
    shoppingList.append(newLiEl);

    newLiEl.addEventListener("click", function(){
        remove(ref(database, `itemsList/${itemID}`)); //removes the itemID from the DB using remove function by referencing the database and itemsList section of DB.
    })

}