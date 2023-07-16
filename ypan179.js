const ShowHome = () => {
    document.getElementById("Home_Section").style.display = "block";
    document.getElementById("Comment_Section").style.display = "none";
    document.getElementById("Shopping_Cart_Section").style.display = "none";
    document.getElementById("Register_Section").style.display = "none";
    document.getElementById("Login_Section").style.display = "none";
    document.getElementById("Game_Section").style.display = "none";
}
const ShowLogin = () => {
    document.getElementById("Login_Section").style.display = "block";
    document.getElementById("Comment_Section").style.display = "none";
    document.getElementById("Home_Section").style.display = "none";
    document.getElementById("Shopping_Cart_Section").style.display = "none";
    document.getElementById("Register_Section").style.display = "none";
    document.getElementById("Game_Section").style.display = "none";
}
const ShowRegister = () => {
    document.getElementById("Register_Section").style.display = "block";
    document.getElementById("Login_Section").style.display = "none";
    document.getElementById("Comment_Section").style.display = "none";
    document.getElementById("Home_Section").style.display = "none";
    document.getElementById("Shopping_Cart_Section").style.display = "none";
    document.getElementById("Game_Section").style.display = "none";
}
const ShowComment = () => {
    document.getElementById("Register_Section").style.display = "none";
    document.getElementById("Login_Section").style.display = "none";
    document.getElementById("Comment_Section").style.display = "block";
    document.getElementById("Home_Section").style.display = "none";
    document.getElementById("Shopping_Cart_Section").style.display = "none";
    document.getElementById("Game_Section").style.display = "none";
}
const ShowGame = () => {
    document.getElementById("Register_Section").style.display = "none";
    document.getElementById("Login_Section").style.display = "none";
    document.getElementById("Comment_Section").style.display = "none";
    document.getElementById("Home_Section").style.display = "none";
    document.getElementById("Shopping_Cart_Section").style.display = "none";
    document.getElementById("Game_Section").style.display = "block";
}
const ShowShoppingCart = () => {
    document.getElementById("Register_Section").style.display = "none";
    document.getElementById("Login_Section").style.display = "none";
    document.getElementById("Comment_Section").style.display = "none";
    document.getElementById("Home_Section").style.display = "none";
    document.getElementById("Shopping_Cart_Section").style.display = "block";
    document.getElementById("Game_Section").style.display = "none";
    ShowShoppingItems();
}

let Logined_user = '';
let Logined_state = false;

// this is header function
const LogoFetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Logo');
const LogoStreamPromise = LogoFetchPromise.then((response) => response.blob());
const LogoImg = LogoStreamPromise.then((myBlob) => document.getElementById('AG_Logo').src = URL.createObjectURL(myBlob));

const Home_img_FetchPromise = fetch('https://cws.auckland.ac.nz/gas/images/Kb.svg');
const Home_img_StreamPromise = Home_img_FetchPromise.then((response) => response.blob());
const Home_img = Home_img_StreamPromise.then((myBlob) => document.getElementById('Home_img').src = URL.createObjectURL(myBlob));

const Version_FetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Version',
        {
            headers: {
                "Accept" : "application/json",
            },
        }
    )
    .then((response) => response.json())
    .then((data) => document.getElementById("version_number").innerHTML = document.getElementById("version_number").innerHTML + data);

// this is login section
function Login(){
    let username = document.getElementById("Login_username").value;
    let password = document.getElementById("Login_password").value;
    const Login_FetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/VersionA',
    {
        headers:{
            'accept': 'text/plain',
            'Authorization': 'Basic '+btoa(username+":"+password)
        },
    }).then(res => res.text()).then( (data) => {
        if(data !== ""){
            Logined_user = username;
            localStorage.setItem("Login_State", "true");
            localStorage.setItem("username", username);
            localStorage.setItem("password", password);
            Logined_state = true;
            // console.log(localStorage.getItem("username"));
            // console.log(localStorage.getItem("password"));
            document.getElementById('Login_Icon').style.display = 'none';
            document.getElementById('Logout_Icon').style.display = 'inline';
            ShowHome();
        }
        else{
            alert("fail");
        }
    });
}
function Logout(){
    localStorage.clear();
    Logined_state = false;
    Logined_user = "";
    document.getElementById('Login_Icon').style.display = 'inline';
    document.getElementById('Logout_Icon').style.display = 'none';
}

// this is register section
function Register(){
    let info = {'username':document.getElementById('Register_username').value,
                'password': document.getElementById('Register_password').value
    }
    const Register_FetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/Register',
    {
        method: "POST",
        headers:{
            'accept': 'text/plain',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(info)
    }).then(res => res.text()).then(data => document.getElementById("Register_Message").innerText = data);
    
}

// this is comment section
const Post_Comment = () => {
    let User_Comment = {};
    if ( document.getElementById('Comment_Username') === ""){
         User_Comment = {'comment':document.getElementById('User_Comment').value, 'name': ""};
    }else{
         User_Comment = {'comment':document.getElementById('User_Comment').value, 'name': document.getElementById('Comment_Username').value};
    }
    fetch('https://cws.auckland.ac.nz/gas/api/Comment',{
        method: "POST",
        headers:{
            'accept': 'text/plain',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(User_Comment)
    }).then(res => res.text()).then(data => {
        document.getElementById('Comment_Posted').src = 'https://cws.auckland.ac.nz/gas/api/Comments';
    });
}
// this is shopping section
// const search_item = document.getElementById('Search_Item').addEventListener('keydown', DynamicSearch);
// function DynamicSearch(event){
//     let text = search_item.getElementById("Search_Item").value + `${event.code}`;
//     console.log(text);
// }
function ShowShoppingItems(){
    let Current_Html = '';
    let table = document.getElementById('Shopping_Table');
    let Items = [];
    const Shopping_FetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/AllItems');
    const Shopping_StreamPromise = Shopping_FetchPromise.then((response) => response.json());
    const Shopping_Response = Shopping_StreamPromise.then((data) => 
    {   
        Current_Html += AddItems(data);
        table.innerHTML = Current_Html;
    });
}

function Search(){
    let Current_Html = '';
    let table = document.getElementById('Shopping_Table');
    let term = document.getElementById('Search_Item').value;
    if(term.length !== 0){
        const Shopping_FetchPromise = fetch(`https://cws.auckland.ac.nz/gas/api/Items/${term}`);
        const Shopping_StreamPromise = Shopping_FetchPromise.then((response) => response.json());
        const Shopping_Response = Shopping_StreamPromise.then((data) => 
        {   
            if(data.length === 0){
                table.innerHTML = Current_Html;
            }else{
                Current_Html += AddItems(data);
                table.innerHTML = Current_Html;
            }
            
        });
    }else{
        ShowShoppingItems();
    }
}
function AddItems(data){
    let Html_Needed = '';
    for( element in data){
        let id = data[element]['id'];
        let name = data[element]['name'];
        let description = data[element]['description'];
        let price = data[element]['price'];
        // then got to fetch the img from the id
        let Image_url = `https://cws.auckland.ac.nz/gas/api/ItemPhoto/${id}`;
        Html_Needed += `<tr><td><img src="${Image_url}" alt="Image for ItemID ${id}" style="width:400px;"></td><td style="width:100%;"><h3>${name}</h3><p>${description}</p><br><p>$${price}<br><button onclick="Add_Item_To_Cart(${id})">Add Item</button></p></td></tr>`;
    }
    return Html_Needed;
}

function Add_Item_To_Cart(id){
    if(Logined_state){
        const username = localStorage.getItem('username');
        const password = localStorage.getItem("password");
        fetch(`https://cws.auckland.ac.nz/gas/api/PurchaseItem/${id}`,{
        headers:{
            'accept': 'text/plain',
            'Authorization': "Basic "+ btoa(username+":"+password)
        }
        }).then(res => res.json()).then((data) => {
            alert(`User:${data['userName']} have successfully added ItemID:${data['productID']} into your shoppingcart`);
        });
    }else{
        alert("you have not login yet");
    }
}
// this is game session
function OndragStart(ev){//setting the data that we are transfering
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function OndragOver(ev){//permit dropping
    ev.preventDefault();
}

function Ondrop(ev){//got to check if the dropping has img there already or not
    const current_dropping_id = ev.target.id;
    if(current_dropping_id.length === 2){
        if(ev.dataTransfer !== null){//checking the drop object is null or not
            const data = ev.dataTransfer.getData('text/plain');
            ev.target.appendChild(document.getElementById(data));}
            move_state = true;
    }else{
        alert('Invalid Move');
    }
}
function OndropBin(ev){
    if(ev.dataTransfer !== null){
        const data = ev.dataTransfer.getData('text/plain');
        document.getElementById(data).remove();
    }
}
let gameid = "";
let move_state = false;

function PairMe(){
    if (Logined_state){// mean we have a login user
        let move = document.getElementById("ChessBoard");
        if(move.innerHTML !== default_board){
            move.innerHTML = default_board;
        }
        let username = localStorage.getItem('username');
        let password = localStorage.getItem('password');
        const PairMe_FetchPromise = fetch('https://cws.auckland.ac.nz/gas/api/PairMe',
        {
            method:'GET',
            headers:{
                'accept': 'text/plain',
                'Authorization': 'Basic '+btoa(username+":"+password)
            },
        }).then(res => res.json()).then((data) => {
            // console.log(data['gameId']);
            // console.log(data['state']);
            gameid = data['gameId'];
            localStorage.setItem('gameId', data['gameId']);
            if(data['state'] === 'wait' && data['player1'] === username){
                //means the user1 is our otherwise it is there
                // console.log('condition1');
                document.getElementById('Quit').disabled = false;
                document.getElementById('TheirMove').disabled = true;
                document.getElementById('MyMove').disabled = true;
                document.getElementById('GameMessage').innerText = `You are White Chess, and still waiting for another user, gameId is ${gameid}`;
            }else if(data['state'] === 'progress' && data['player2'] === username){
                // console.log('condition2');
                document.getElementById('Quit').disabled = false;
                document.getElementById('TheirMove').disabled = false;
                document.getElementById('MyMove').disabled = true;
                document.getElementById('GameMessage').innerText = `You are Black Chess, and playing with ${data['player1']}, gameId is ${gameid}`;
                
            }else{
                // console.log('condition3');
                document.getElementById('Quit').disabled = false;;
                document.getElementById('MyMove').disabled = false;
                document.getElementById('TheirMove').disabled = true;
                document.getElementById('GameMessage').innerText = `You are White Chess, and playing with ${data['player2']} you can start the move, gameId is ${gameid}`;
                current_move = document.getElementById("ChessBoard").innerHTML;
            }
        })
    }else{
        alert("You got to login to get access of the service");
        ShowLogin();
    }
}

function PostMyMove(){//sending the whole table html.
    let move = document.getElementById("ChessBoard").innerHTML;
    const username = localStorage.getItem('username');
    const password = localStorage.getItem("password");
    let body = {
        "gameId": gameid,
        "move": move
    }
    if(move_state){//means I have not moved yet
        // console.log(move);
        fetch('https://cws.auckland.ac.nz/gas/api/MyMove',{
            method: "POST",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "Basic "+ btoa(username+":"+password)
            },
            body: JSON.stringify(body),
        }).then(res => res.text()).then((data) => {
            document.getElementById("GameMessage").innerText = data;
            document.getElementById("MyMove").disabled = true;
            document.getElementById('TheirMove').disabled = false;
        });
    }else{//means I have move and can post
       alert("You have not move yet");
    }
}
function GetTheirMove(){
    const username = localStorage.getItem('username');
    const password = localStorage.getItem("password");
    fetch(`https://cws.auckland.ac.nz/gas/api/TheirMove?gameId=${gameid}`,{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': "Basic "+ btoa(username+":"+password)
            }
        }).then(res => res.text()).then( (data) => {
            if(data !== "" && data !== "(no such gameId)"){
                document.getElementById("ChessBoard").innerHTML = data;
                document.getElementById("MyMove").disabled = false;
                document.getElementById('TheirMove').disabled = true;
                document.getElementById('Quit').disabled = false;

            }else if( data === "(no such gameId)"){
                document.getElementById("GameMessage").innerText = "Your opponent has left";
                document.getElementById("MyMove").disabled = true;
                document.getElementById('TheirMove').disabled = true;
                document.getElementById('Quit').disabled = false;
            }else{
                document.getElementById("GameMessage").innerText = "Your opponent has not moved yet. Please wait and Request again";
            }
        })
}
function QuitGame(){
    let username = localStorage.getItem('username');
    let password = localStorage.getItem('password');
    fetch(`https://cws.auckland.ac.nz/gas/api/QuitGame?gameId=${gameid}`,{
        headers:{
            'accept': 'text/plain',
            'Authorization': "Basic "+ btoa(`${username}:${password}`)
        }
    }).then(res => res.text()).then((data) => {
        document.getElementById("GameMessage").innerText = data;   
        document.getElementById("MyMove").disabled = true;
        document.getElementById('TheirMove').disabled = true;
        document.getElementById('Quit').disabled = true;
    });
}

function loading(){
    default_board = document.getElementById("ChessBoard").innerHTML;
    ShowComment();
    localStorage.clear();
    current_move = document.getElementById("ChessBoard").innerHTML;
    document.getElementById("MyMove").disabled = true;
    document.getElementById('TheirMove').disabled = true;
    document.getElementById('Quit').disabled = true;
}
window.onload = loading;
