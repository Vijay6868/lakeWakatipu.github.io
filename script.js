
var bookings;
var Menu;
var Ttotal;

var fullName;
var date;
var num;
var time;
var temp;
var food;
var boatN;

var TSeat;
var totalPrice;
var price;
var current;


var original;

function init(){
    
    var currDate = new Date();
    var todayDate = SetTheDate(1,currDate);
    var maxD = SetTheDate(2,currDate);
    

    original = document.getElementById('stage2').innerHTML;

    var datePick = document.getElementById("bookingDate");
    datePick.setAttribute('min',todayDate);
    datePick.setAttribute('max',maxD);
    datePick.setAttribute('value',todayDate);

    addheaderEvent();
    addEvent();
    PopulateBooking();
    loadWeather();
    

 

}
//dynamically changes the home heading. from maori to english and vice versa
function addheaderEvent(){
    var heading= document.getElementById("headingLakeWakatipu");
    
    heading.addEventListener('mouseenter', function(){
        heading.innerHTML = "<i>(Whakatipu waimaori)<i>"
    })

    heading.addEventListener('mouseleave', function(){
        heading.innerHTML = "Lake Wakatipu"
    })
    if(heading.innerHTML == "Lake Wakatipu"){
        
    }

}
//setting date
function SetTheDate(int, date){
    var currYear = date.getFullYear();
    var currMonth = date.getMonth()+1;
    var currDay = date.getDate();
    var numofDays = new Date(currYear, currMonth, 0).getDate();
    var thisDate;


    if(int == 1){

        if (currMonth < 10) {
            currMonth = "0" + currMonth;
        }
        if (currDay < 10) {
            currDay = "0" + currDay;
        }
    }
    else{
        if((currDay + 4) > numofDays){
            currDay = (currDay + 4)-numofDays;
            if (currDay < 10) {
                currDay = "0" + currDay;
            }
            currMonth = currMonth + 1;
            if(currMonth<10){
                currMonth = "0" + currMonth;
            }

        }
        else{
            currDay =(currDay + 4);
            
            if (currMonth < 10) {
                currMonth = "0" + currMonth;

            }
            if (currDay < 10) {
                currDay = "0" + currDay;
            }
        }
    }

    thisDate = currYear + "-" + currMonth +"-" + currDay;
    return thisDate;
}

//loads weather details from api
function loadWeather(){
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=Queenstown,nz&appid=0792631c7ab888d4224dbede269105f5&units=metric')
        .then(response=>response.json())
        .then(data=> {
            var conEl = document.getElementById("c_container");
            conEl.innerHTML= "";
            data['list'].forEach(function(item){
                if(item['dt_txt'].includes("12:00")){
                                       
                    var mode= document.createElement("div");
                    mode.setAttribute("class","modal-content");
                    mode.setAttribute("id",item['dt_txt'].substr(0,10));

                    var ch1=document.createElement("div");
                    ch1.setAttribute("class", "WeatherDate");
                    ch1.innerHTML = item['dt_txt'].substr(8,2);

                    var ch2=document.createElement("div");
                    ch2.setAttribute("class", "WeatherIcon");
                    var chi2_img=document.createElement("IMG");
                    var code= "Images/Icons/"+item['weather'][0].icon+".png"
                    chi2_img.setAttribute("src",code);
                    ch2.appendChild(chi2_img);

                    var ch3=document.createElement("div");
                    ch3.setAttribute("class", "WeatherTemp");
                    var chi3_img=document.createElement("IMG");
                    chi3_img.setAttribute("src","Images/temp.png");
                    //if this innerhtml is changed to 14 the system should not allow booking
                    ch3.innerText=Math.round(item['main'].temp);
                    
                    ch3.appendChild(chi3_img);
                    
                    mode.appendChild(ch1);
                    mode.appendChild(ch2);
                    mode.appendChild(ch3);
                    conEl.appendChild(mode);
                
                }
            });
            
        })
    .catch(err => alert("Error!!!" + err))
}


//modal functions
function showModal() {
    myModal.style.display = "block";
}
function closeModal() {
    myModal.style.display = "none";
}


//opening menu  tab content
function openContent(evt, contentName) {
    var i, tabCon, taButton;
    tabCon = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabCon.length; i++) {
      tabCon[i].style.display = "none";
      
    }
    taButton = document.getElementsByClassName("tabbutton");
    for (i = 0; i < taButton.length; i++) {
        taButton[i].className = taButton[i].className.replace(" active", "");
    }
    document.getElementById(contentName).style.display = "block";
    evt.currentTarget.className += " active";
  }



//booking constructor
function Booking(Reference, BoatName, BDate, BTime, BSeat, BPerson, BFood, BTotal){
    this.Reference = Reference;
    this.BoatName = BoatName;
    this.BDate = BDate;
    this.BTime = BTime;
    this.BSeat = BSeat;
    this.BPerson = BPerson;
    this.BFood = BFood;
    this.BTotal = BTotal;
}

//loading bookings from xml to booking array
function PopulateBooking(){
    bookings=[];
    var xmlhttp;
            
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest(); 
    }   
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    xmlhttp.open("GET","Bookings.xml", false); 
    xmlhttp.send(); 
    xmlDoc = xmlhttp.responseXML; 
    var z = xmlDoc.getElementsByTagName("Booking"); 

    var Reference = "";
    var BoatName = "";;
    var BDate = "";
    var BTime = "";
    var BSeat = "";
    var BPerson = "";
    var BFood = "";
    var BTotal = "";

    for (i = 0; i < z.length; i++){
        Reference = z[i].getElementsByTagName("Reference")[0].childNodes[0].nodeValue;
        BoatName = z[i].getElementsByTagName("Boat")[0].childNodes[0].nodeValue;
        BDate = z[i].getElementsByTagName("Date")[0].childNodes[0].nodeValue;
        BTime = z[i].getElementsByTagName("Time")[0].childNodes[0].nodeValue;
        BSeat = z[i].getElementsByTagName("Seat")[0].childNodes[0].nodeValue;
        BPerson = z[i].getElementsByTagName("Person")[0].childNodes[0].nodeValue;
        BFood = z[i].getElementsByTagName("Food")[0].childNodes[0].nodeValue;
        BTotal = z[i].getElementsByTagName("Total")[0].childNodes[0].nodeValue;
        var booking = new Booking(Reference, BoatName, BDate, BTime, BSeat, BPerson, BFood,BTotal);
        bookings[i] = booking;
    }

}

//constructor for menu
function MenuItem(itemID,fName,fDesc,fType, fCat,fimage, funit, fCost){
    this.itemID = itemID;
    this.fName = fName;
    this.fDesc = fDesc;
    this.fType = fType;
    this.fCat = fCat;
    this.fimage = fimage;
    this.funit = funit;
    this.fCost = fCost;

}
//loading menu items from xml to menu array
function menuPopulate(){
    Menu=[];
    var xmlhttp;
            
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest(); 
    }   
    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    xmlhttp.open("GET","Menu.xml", false); 
    xmlhttp.send(); 
    xmlDoc = xmlhttp.responseXML; 
    var y = xmlDoc.getElementsByTagName("Item"); 

    var fID = "";
    var f_name = "";;
    var f_desc = "";
    var f_type = "";
    var f_cat = "";
    var f_image = "";
    var f_unit = "";
    var f_cost = "";

    for (i = 0; i < y.length; i++){
        fID = Number(y[i].getElementsByTagName("ID")[0].childNodes[0].nodeValue);
        f_name = y[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
        f_desc = y[i].getElementsByTagName("Description")[0].childNodes[0].nodeValue;
        f_type = y[i].getElementsByTagName("Type")[0].childNodes[0].nodeValue;
        f_cat = y[i].getElementsByTagName("Category")[0].childNodes[0].nodeValue;
        f_image = y[i].getElementsByTagName("Image")[0].childNodes[0].nodeValue;
        f_unit = Number(y[i].getElementsByTagName("Unit")[0].childNodes[0].nodeValue);
        f_cost = Number(y[i].getElementsByTagName("Cost")[0].childNodes[0].nodeValue);
        
        var item = new MenuItem(fID,f_name, f_desc, f_type, f_cat, f_image, f_unit, f_cost);
        Menu[i] = item;
    }
}



function showTrips(){
    menuLoad();
    num = document.getElementById('adults').value;
    date= document.getElementById('bookingDate').value;

    if(!weatherCheck(date)){
        stage1_1.style.display = "flex";

    }
}

function checkAvailablility(){


    var selected = document.getElementsByName('trip');
    for(var i = 0; i<selected.length; i++){
        if(selected[i].checked){
            time=selected[i].value;
            boatN=selected[i].parentNode.id;
        }
    }
    seatAvail();

    
}

function seatAvail(){
    
    TSeat = [];
    
    var AvailableSeat = 0;
    Ttotal = 0;


    for(j = 0; j < bookings.length; j++){
        if(bookings[j].BoatName == boatN && bookings[j].BDate == date && bookings[j].BTime == time){
            Ttotal = Ttotal + 1;
            TSeat.push(bookings[j].BSeat);
        }
    } 

    var capacity = document.getElementById(boatN+" Desc").children[4].innerText;

    if(capacity > (Ttotal + num)){
        AvailableSeat = capacity - Ttotal;
        document.getElementById(boatN+" Desc").children[2].innerHTML = "Seat Available: "+AvailableSeat;
    }
    else{
        AvailableSeat = 0;
        document.getElementById(boatName).children[0].disabled = true;
        document.getElementById(boatName).children[2].innerHTML = "All Booked";
        document.getElementById(boatName).style.backgroundColor = "rgb(73, 72, 72)";
        document.getElementById(boatName+" Desc").children[2].innerHTML = "Seat Available: "+AvailableSeat;
    }
    var desc = document.querySelectorAll(".descCell");
    desc.forEach(function(item){
        if(item.id !== boatN+" Desc"){
            item.children[2].innerHTML = "";
        }
    })
}


function st1Change(){

    if(stage1_1.style.display == 'flex'){
        stage1_1.style.display = 'none';
    }

}
// shows alert if the date selected's temp is above 14
function weatherCheck(date){
    var temps= document.getElementsByClassName("WeatherTemp");
    if(temps.length > 0){
        for(var i= 0; i<temps.length; i++){
            if(temps[i].innerText >= 14 && date == temps[i].parentNode.id){
                alert("Bad Weather condition trips get cancelled on that day");
                return true;
            }

        }
    }
}

function tripSelected(){
    
    var chk = document.querySelectorAll('#trip_checkbox:checked');
    if(chk.length>0){
        temp = [];
        food = [];

        showSeat();
        progressbar();
        loadSeat();
        var selectedtrip = document.querySelector('#trip_checkbox:checked').parentNode.id;

        document.getElementById(selectedtrip+" Container").style.display = 'block';
    
        var triboat= document.getElementById('tripBoat');
        var tridate = document.getElementById('tripDate');
        var tritime = document.getElementById('tripTime');
    
        triboat.innerHTML = boatN;
        tridate.innerHTML = date;
        tritime.innerHTML = time;
        document.getElementById('tripSeat').innerHTML = num; 

       
    }else{alert("Please Select trip!")}
}

//loads taken seats
function loadSeat(){
    var seats= document.getElementsByClassName('seat');
    TSeat.forEach(function(item){
        

        for(var e = 0 ; e< seats.length; e++){
            if(seats[e].innerHTML == item){
                seats[e].className = 'seated';
            }
        }
    })
}





function addEvent(){
    
    var cells = document.querySelectorAll('.seat');
    cells.forEach(function(cell){
        cell.addEventListener('click',function(){
            if(this.id == "selected"){
                for(var i = 0; i< temp.length; i++){
                    if( temp[i] == this.innerHTML){
                      temp.pop(temp[i]);
                      
                    }
                }
                this.id = "";

            }
            else{
                if(temp.length < num){
                    this.id = "selected";
                    temp.push(this.innerHTML);
                }
            }
            updatecart();
            
        })
  
    
    })
  
}
// loads menu from the menu array
function menuLoad(){
    menuPopulate();

    var tableFood = document.getElementById('foodtable');
    var tableDrink = document.getElementById('drinkstable');

    tableFood.innerHTML ="";
    tableDrink.innerHTML= "";

    for(var i = 0; i<Menu.length; i++){

        var neRow = document.createElement("TR");
        
        var cel1 = document.createElement("TD");
        cel1.setAttribute('id','imageCell');
        var ima=document.createElement("IMG");
        ima.setAttribute('src', Menu[i].fimage);
        cel1.appendChild(ima);

        var cel2 = document.createElement("TD");
        cel2.setAttribute('id','menuCell');
        var label1= document.createTextNode(Menu[i].fName+". ");
        var label= document.createTextNode(Menu[i].fDesc);
        cel2.appendChild(label1);
        cel2.appendChild(label);
        
        var cel3 = document.createElement("TD");
        cel3.setAttribute('id','foodtype');
        
        if(Menu[i].fType == 'none'){}
        else{
            var typ=document.createElement("IMG");
            typ.setAttribute('src', Menu[i].fType);
            cel3.appendChild(typ);
        }
        
        var cel4 = document.createElement("TD");
        cel4.setAttribute('id','costCell');
        var pricelabel= document.createTextNode("$"+ parseFloat(Menu[i].fCost));
        cel4.appendChild(pricelabel);

        var cel5 = document.createElement("TD");
        var btn = document.createElement("INPUT");
        btn.setAttribute("type", "Button");
        btn.setAttribute("class", "btn_add");
        btn.setAttribute("value", "ADD");
        btn.setAttribute("onclick", "FoodtoCart(this)");
        btn.setAttribute("id", Menu[i].itemID);
        cel5.appendChild(btn);


        neRow.appendChild(cel1);
        neRow.appendChild(cel2);
        neRow.appendChild(cel3);
        neRow.appendChild(cel4);
        neRow.appendChild(cel5);



        if(Menu[i].fCat == "Drinks"){
            tableDrink.appendChild(neRow);
        }
        else{
            tableFood.appendChild(neRow);
        }

    }    
    
    
}



function proceed(){

    positionCheck(current);
}

function seatPrice(seatnum){
    price=0;
    switch(seatnum.charAt(0)){
        case "A":
        case "B":
            price = 30;
            break;
        case "C":
        case "D":
        case "E":
            price = 25;
            break;
        case "F":
        case "G":
        case "H":
        case "I":
        case "J":
        case "K":
        case "L":
        case "M":
            price = 20;
            break;
        
    }
}



function FoodtoCart(addbtn){

    var foodItem;
    food.forEach(function(item){
        if(item.itemID == addbtn.id){
           foodItem = item;
        }
    })
    if(food.includes(foodItem)){
        changeUnits('plus', addbtn);
    }
    else{
        const fItem = Menu.find((food)=> food.itemID == addbtn.id);
        food.push({
            ...fItem,
            quantityofItem : 1
        });
    }
    updatecart();
}

function reset(){
    document.getElementById('stage2').innerHTML = original;
    menuLoad();
    addEvent();
    showTripSelection();
}


function updatecart(){
    loadfood();
    rendertotal();
}

function rendertotal(){
    var totalPrice = 0;
    food.forEach((item)=>{
       totalPrice+= item.fCost * item.quantityofItem;        
    })

    var sline = "";
    temp.forEach(function(item){
        sline += (item + " ");
        seatPrice(item);
        totalPrice +=price;
    })
    document.getElementById('seatSelected').innerText = sline;
    document.getElementById("priceSofar").innerText = " $"+totalPrice;
    

}

// remove food from cart function
function removefromCart(){
    var del
    food.forEach(function(item){
        if(item.quantityofItem == 0){
           dte = item;
           food.pop(del);
        }
    })
    
}

// increment or decrement food units in the cart
function changeUnits(action, btn){
    var unitNumber;
    food = food.map((item)=>{
        unitNumber = item.quantityofItem;

        if(item.itemID == btn.id){
            if(action === "minus" && unitNumber >= 1){
                unitNumber--;
             
                
            }
            else if (action ==="plus"){
                unitNumber++;
            }

        }

        return {
            ...item,
            quantityofItem: unitNumber,
        };
    })
    if(unitNumber == 0) {
        removefromCart();
    } 
    updatecart();
    
}

// load food in the food array to the summary div
function loadfood(){

    if(food.length==0){
        var foodT = document.getElementById('food_table');
        foodT.innerHTML = " ";
    }
    else{
        var foodT = document.getElementById('food_table');
        foodT.innerHTML = " ";
    
        var nrow = document.createElement("TR");
        nrow.setAttribute("id","foodCell");

        var thead = document.createElement("TD");
        var h3 = document.createElement("H3");
        var text = document.createTextNode("Food Summary");
        h3.appendChild(text);
        thead.appendChild(h3);
        nrow.appendChild(thead);
        foodT.appendChild(nrow);
        
        for(var i = 0; i< food.length; i++){
            var newrow = document.createElement("TR");
            newrow.setAttribute("id","foodCell");

            var t1 = document.createElement("TD");
            var lbl = document.createTextNode(food[i].fName);
            t1.appendChild(lbl);

            var t2 = document.createElement("TD");
            var lbl2 = document.createTextNode('$ '+food[i].fCost);
            t2.appendChild(lbl2);

            var t3 = document.createElement("TD");
            t3.setAttribute("id","cell");
            var rem1 = document.createElement("INPUT");
            rem1.setAttribute("type", "button");
            rem1.setAttribute("class","cartbtn");
            rem1.setAttribute("id",food[i].itemID);
            rem1.setAttribute("value","-");
            rem1.setAttribute("onclick","changeUnits('minus',this)");

            var h31 = document.createElement("H3");
            var lbl3 = document.createTextNode(food[i].quantityofItem);
            h31.appendChild(lbl3);
            
            var rem = document.createElement("INPUT");
            rem.setAttribute("type", "button");
            rem.setAttribute("class","cartbtn");
            rem.setAttribute("id",food[i].itemID);
            rem.setAttribute("value","+");
            rem.setAttribute("onclick","changeUnits('plus',this)");

            t3.appendChild(rem1);
            t3.appendChild(h31);
            t3.appendChild(rem);
            
            newrow.appendChild(t1);
            newrow.appendChild(t2);
            newrow.appendChild(t3);
            foodT.appendChild(newrow);

            
    }
 
    }
    

    
    


}

function bookSeat(){

    var xmlhttp;

    if (window.XMLHttpRequest) { 
    xmlhttp = new XMLHttpRequest(); 
    }
    // code for IE6, IE5
    else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }

    xmlhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            loadData(this);
        }
    }
    xmlhttp.open("GET","Bookings.xml", false); 
    xmlhttp.send();


    reset();
    showHome();
    alert("booking confirmed");
    
    

    
}

function loadData(xmlhttp){

    xmlDoc = xmlhttp.responseXML; 
    fullName = document.getElementsByName('fname').value +" "+ document.getElementsByName('lname').value;
    for(var i= 0; i<temp.length; i++){

        var foodstring = food.toString();
        var seatn =  temp[i];
        TSeat.push(temp[i]);

        var ref = "B0"+(bookings.length+1)
        var booking1 = new Booking(ref, boatN,date, time,seatn, fullName, foodstring, totalPrice);
        bookings.push(booking1);

        var newNode = xmlDoc.createElement("Booking");

        var Ref = xmlDoc.createElement("Reference");
        Ref.appendChild(xmlDoc.createTextNode(ref));
    
        var Boat = xmlDoc.createElement("Boat");
        Boat.appendChild(xmlDoc.createTextNode(boatN));
        
        var Date = xmlDoc.createElement("Date");
        Date.appendChild(xmlDoc.createTextNode(date));
        
        var Time = xmlDoc.createElement("Time");
        Time.appendChild(xmlDoc.createTextNode(time));
    
        var Seat = xmlDoc.createElement("Seat");
        Seat.appendChild(xmlDoc.createTextNode(seatn));
    
        var Person = xmlDoc.createElement("Person");
        Person.appendChild(xmlDoc.createTextNode(fullName));
    
        var Food = xmlDoc.createElement("Food");
        Person.appendChild(xmlDoc.createTextNode( foodstring));
    
        var Total = xmlDoc.createElement("Total");
        Person.appendChild(xmlDoc.createTextNode(totalPrice));

        newNode.appendChild(Ref);
        newNode.appendChild(Boat);
        newNode.appendChild(Date);
        newNode.appendChild(Time);
        newNode.appendChild(Seat);
        newNode.appendChild(Person);
        newNode.appendChild(Food);
        newNode.appendChild(Total);
    }

}

// adding click event to the progress bar point
function progressbar(){

    var bul = document.querySelectorAll(".bullet");
    
    progress.addEventListener('click', (e) => {
    if (e.target.classList.contains("bullet") === true) {
        
        for (var i = 0; i < bul.length; i++) {
            if (bul[i] === e.target) {
                var a = i;
                positionCheck(a);
            };       
        };
    };
});

}

// update the visual of the progress bar
function progressUpdate(x)
{
    const progress = document.querySelector('.progress_points');
    const point = document.querySelectorAll('.point');
    const bar = document.querySelector('.bar_filled');
    var bul = document.querySelectorAll(".bullet");
    var lab = document.querySelectorAll(".label");
    var i;
    
    for (i = 0; i < x; i++) {
        bul[i].classList.remove("point--active");
        bul[i].classList.add("point--complete");
        lab[i].classList.add("label_complete");
    };
    for (i = x+1; i < bul.length; i++) {
        bul[i].classList.remove("point--active");
        bul[i].classList.remove("point--complete");
        lab[i].classList.remove("label_complete");
    };
    bul[x].classList.add("point--active");
    lab[x].classList.add("label_complete");
    bar.style.width = x*33.33 + '%';

}

function showTripSelection(){
    stage2.style.display = "none";
    stage1.style.display = "flex";
    stage1_1.style.display = "flex";
    current = 1;

    
}
function showSeat(){
    
    stage2.style.display = "flex";
    boatContainer.style.display = "flex";
    foodContainer.style.display = "none";
    stage1.style.display = "none";
    stage1_1.style.display = "none";
    reviewContainer.style.display = "none";
    bookingInformation.style.display = "block";
    proceed_container.style.display = "block";
    current = 2;
    
}
function showFood(){

    stage2.style.display = "flex";
    boatContainer.style.display = "none";
    foodContainer.style.display = "flex";
    stage1.style.display = "none";
    stage1_1.style.display = "none";
    reviewContainer.style.display = "none";
    bookingInformation.style.display = "block";
    proceed_container.style.display = "block";
    current = 3;
    
    
}
function showReview(){
    proceed_container.style.display = "none";
    stage2.style.display = "flex";
    boatContainer.style.display = "none";
    foodContainer.style.display = "none";
    stage1.style.display = "none";
    reviewContainer.style.display = "flex";
    stage1_1.style.display = "none";
    bookingInformation.style.display = "block";
    current = 4;
   
}

//shows booking div
function showBook(){
    var newC = "black";
    var newB = "#5f616d";
    var oldC = "white";
    var oldB = "#262936";
    
    document.getElementById("book").style.color = newC;
    document.getElementById("book").style.backgroundColor = newB;
    document.getElementById("home").style.color = oldC;
    document.getElementById("home").style.backgroundColor = oldB;

    booking.style.display="block";
    Home.style.display="none";

}

//shows home div
function showHome(){
    var newC = "black";
    var newB = "#5f616d";
    var oldC = "white";
    var oldB = "#262936";

    document.getElementById("home").style.color = newC;
    document.getElementById("home").style.backgroundColor = newB;
    document.getElementById("book").style.color = oldC;
    document.getElementById("book").style.backgroundColor = oldB;

    booking.style.display="none";
    Home.style.display="flex";

}

function positionCheck(dig){

    switch(dig){

        case 0:
            if(confirm("Going back to trip selection means you will lose your current progress")==true){
                showTripSelection();
                reset();
                progressUpdate(dig);
            }          
            break;
        case 1:
            showSeat();
            progressUpdate(dig);
            break;
        case 2:
            if(temp.length==num){
                showFood();
                progressUpdate(dig);
            }
            else{
                alert("Please complete the seat selection");
            }

            break;
        case 3:
            if(current>2){
                showReview();
                progressUpdate(dig);
            }            
            break;
        case 4:
            //checkout
            break;

    }    
}
