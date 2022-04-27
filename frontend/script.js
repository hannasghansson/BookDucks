let allBooks = [];
let allAudio = [];

let renderBooks = async() =>{

  let responseBook = await axios.get("http://localhost:1337/api/books?populate=*");
  allBooks = responseBook.data.data
  let books = responseBook.data.data
  

   books.forEach(book => {
    let div = document.createElement("div");
    console.log(book)
    book.attributes.genrers.data.forEach(genre => {
      div.innerHTML+= `<span>${genre.attributes.Type}</span>`
    })
    
    var bookPicture = ""
    console.log(book)
    if (book.attributes.Picture.data != null) { bookPicture = `${book.attributes.Picture && `http://localhost:1337${book.attributes.Picture.data.attributes.url}`}` }

    document.querySelector("#bookList").innerHTML += 
    `<div class="bookBox">
      <p class="grade"><i class="fa fa-star" style="font-size:30px; color:goldenrod"></i>${book.attributes.Grades} /5</p> 
      <img src="${bookPicture}">  
      <div class="bookInfo">
        <p class="title">${book.attributes.Titel}</p>
        <p class="author"> Av: ${book.attributes.Author}</p>
        <p class="genre">Genre: ${div.innerHTML}</p>
        <p class="pages">Sidor: ${book.attributes.Pages} st</p>
        <br>
        <p class="lending">Låna boken?</p>
        <p>
        Användarnamn: ${book.attributes.user.data != null ? book.attributes.user.data.attributes.username : "Unknown User"} <br>
        Epost: ${book.attributes.user.data != null ? book.attributes.user.data.attributes.email : "Unknown Email"}
        </p>
      </div>
   </div> `
  });

}

let renderAudioBooks = async() =>{

  let responseAudio = await axios.get("http://localhost:1337/api/audiobooks?populate=*");
  allAudio = responseAudio.data.data
  let audiobooks = responseAudio.data.data
  
   audiobooks.forEach(audio => {
    let div = document.createElement("div");

    audio.attributes.genrers.data.forEach( genre => {
      div.innerHTML+= `<span>${genre.attributes.Type} </span>`
    })

    document.querySelector("#audiobookList").innerHTML += `
    <div class="audioBox">
    <p class="grade"><i class="fa fa-star" style="font-size:30px; color:goldenrod"></i>${audio.attributes.Grade}/5</p> 
    <img src="${audio.attributes.Picture.data && `http://localhost:1337${audio.attributes.Picture.data.attributes.url}`}">  
      <div class="audioInfo">
        <p class="title">${audio.attributes.Titel}</p>
        <p class="author">Av: ${audio.attributes.Author}</p>
        <p class="genre">Genre: ${div.innerHTML}</p>
        <p class="lenght">Längd: ${audio.attributes.Length} min</p>
        <p class="date">Utgivningsdatum: ${audio.attributes.ReleaseDate}</p>
        <br>
        <p class="lending">Låna ljudboken?</p>
        <p>
        Användarnamn: ${audio.attributes.user.data.attributes.username} <br>
        Epost: ${audio.attributes.user.data.attributes.email}
        </p>
      </div>
    </div>`
  });
  
}


// VARIABLER  
let registerContiner = document.querySelector(".registerContiner");
let loginContiner = document.querySelector(".loginContiner");


let username = document.querySelector(".username");
let password = document.querySelector(".password");

let profileContiner = document.querySelector(".profileContiner");
let userInfoContiner = document.querySelector(".userInfoContiner");
let userBookContiner = document.querySelector(".userBookContiner");
let userAudiobookContiner = document.querySelector(".userAudiobookContiner")
let library = document.querySelector(".library");




// Använader vill registera sig
let ToRegisterContinerBtn =  () => {
  registerContiner.classList.remove("hidden")
  loginContiner.classList.add("hidden")
}
document.querySelector("#ToRegisterContinerBtn").addEventListener("click",ToRegisterContinerBtn);


// Registrera ny använader 
let registerBtn = async () => {
 
  let registerUsername = document.querySelector("#registerUsername")
  let registerPassword = document.querySelector("#registerPassword")
  let registerEmail = document.querySelector("#registerEmail")

  const response = await axios.post("http://localhost:1337/api/auth/local/register", {

    username: registerUsername.value,
    email: registerEmail.value,
    password: registerPassword.value
  });
    
  
  registerContiner.classList.add("hidden")
  loginContiner.classList.remove("hidden")
  profileContiner.classList.add("hidden")
   


}
document.querySelector("#registerBtn").addEventListener("click",registerBtn);


// Använader vill logga in, behöver ej skaffa konto.

let ToLoginContinerBtn = () => {
  registerContiner.classList.add("hidden")
  loginContiner.classList.remove("hidden")

}
document.querySelector("#ToLoginContinerBtn").addEventListener("click",ToLoginContinerBtn);


// Logga in använader 
let loginBtn = async () => {
 
  let username = document.querySelector("#username")
  let password = document.querySelector("#password")
 

  let response = await axios.post("http://localhost:1337/api/auth/local", {

    identifier:username.value,
    password:password.value,
    
  });

  let token = response.data.jwt;
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("username", response.data.user.username);
  sessionStorage.setItem("email", response.data.user.email);
  sessionStorage.setItem("id", response.data.user.id);
  sessionStorage.setItem("createdAt", response.data.user.createdAt);
    
  
  registerContiner.classList.add("hidden")
  loginContiner.classList.add("hidden")
  profileContiner.classList.remove("hidden")
  library.classList.remove("hidden")
  await renderBooks();
  await renderAudioBooks();
  await uploadBooks();
  await uploadAudiobooks();
}
document.querySelector("#loginBtn").addEventListener("click",loginBtn);




// POP UP Profilsida
const userInfoBtn = document.querySelector(".userInfoBtn");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const modalUserText = document.querySelector(".modalUserText");


function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

userInfoBtn.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);



modalUserText.innerHTML = `
<h2>Välkommen ${sessionStorage.getItem("username")}!</h2>
<div class="line"></div>
<p>Här kan du se din information:</p>

<p class="UserText">
ID: ${sessionStorage.getItem("id")} <br>
Användarnamn: ${sessionStorage.getItem("username")} <br>
Email: ${sessionStorage.getItem("email")} <br>
Kontot skapades: ${sessionStorage.getItem("createdAt")} <br>
</p>
`

// POP UP Böcker
const userBookBtn = document.querySelector(".userBookBtn");
const modalBook = document.querySelector(".modalBook");
const closeBookbutton = document.querySelector(".close-Bookbutton");
const modalUserBook = document.querySelector(".modalUserBook");



function toggleModalBook() {
  modalBook.classList.toggle("show-modalBook");
}

function windowOnClick(event) {
    if (event.target === modalBook) {
        toggleModalBook();
    }
}


userBookBtn.addEventListener("click", toggleModalBook);
closeBookbutton.addEventListener("click", toggleModalBook);
window.addEventListener("click", windowOnClick);

modalUserBook.innerHTML = `
<h2>Dina tillagda böcker</h2>
<div class="line"></div>
<p>Här kan du se dina nuvarande tillagda böcker</p>
`
// Användarens uppladdade böcker
let uploadBooks = async () => {
  let userID = sessionStorage.getItem("id");
  let {data:{data}} = await axios.get("http://localhost:1337/api/books?populate=*");
  console.log(data)

  const userBookList = data.filter(b => b.attributes.user.data.id == userID)
  userBookList.forEach((item) => {

    let div = document.createElement("div");

    item.attributes.genrers.data.forEach(genre => {
      div.innerHTML+= `<span>${genre.attributes.Type}</span>`
    })

    document.querySelector(".userBookList").innerHTML +=`
    <div class="userbookbox">      
      <ul id="book">
        <li><span class="orangeSpan">${item.attributes.Titel}</span>, ${item.attributes.Author}</li>
      </ul>
    </div>`

  });
};


/* POP UP Ljudböcker*/
const userAudiobookBtn = document.querySelector(".userAudiobookBtn");
const modalAudiobook = document.querySelector(".modalAudiobook");
const closeAudiobookbutton = document.querySelector(".close-Audiobookbutton");
const modalUserAudiobook = document.querySelector(".modalUserAudiobook");


function toggleModalAudiobook() {
  modalAudiobook.classList.toggle("show-modalAudiobookbutton");
}

function windowOnClick(event) {
    if (event.target === modalAudiobook) {
      modalAudiobook();
    }
}

userAudiobookBtn.addEventListener("click", toggleModalAudiobook);
closeAudiobookbutton.addEventListener("click", toggleModalAudiobook);
window.addEventListener("click", windowOnClick);

modalUserAudiobook.innerHTML = `
<h2>Dina tillagda ljudböcker</h2>
<div class="line"></div>
<p>Här kan du se dina nuvarande tillagda ljudböcker</p>
`

// Användarens uppladdade ljudböcker
let uploadAudiobooks =  async() => {
  let userID = sessionStorage.getItem("id");
  let {data:{data}} = await axios.get("http://localhost:1337/api/audiobooks?populate=*");
  
  const userAudiobookList = data.filter(a => a.attributes.user.data.id == userID)
  userAudiobookList.forEach((item) => {

    let div = document.createElement("div");

    item.attributes.genrers.data.forEach(genre => {
      div.innerHTML+= `<span>${genre.attributes.Type}</span>`
    })


    document.querySelector(".userAudiobookList").innerHTML +=`
    <div class="userAudiobookbox">
      <ul id="audio">
        <li><span class="orangeSpan">${item.attributes.Titel}</span>, ${item.attributes.Author}</li>
      </ul>
    </div>`
    
  
  });
};




// POP UP Lägga till bok/Audio
const addBookAudioBtn = document.querySelector(".addBookAudioBtn");
const modalAdd = document.querySelector(".modalAdd");
const closeAddbutton = document.querySelector(".close-Addbutton");
const modalAddBookAudio = document.querySelector(".modalAddBookAudio");


function toggleModalAdd() {
  modalAdd.classList.toggle("show-modalAddbutton");
}

function windowOnClick(event) {
    if (event.target === modalAdd) {
      modalAdd();
    }
}

addBookAudioBtn.addEventListener("click", toggleModalAdd);
closeAddbutton.addEventListener("click", toggleModalAdd);
window.addEventListener("click", windowOnClick);


  modalAddBookAudio.innerHTML = `
  <h2>Lägg till </h2>
  <div class="line"></div>
  <p>Fyll i formuläret och tryck på lägg till </p>

  <div class="AddForm">
    <div class="radioBtn">
      <label for="book">Book</label>
      <input onclick="bookOrAudio(this)" type="radio" name="type" id="book" value="book" checked>

      <label for="audio">Audiobook</label>
      <input onclick="bookOrAudio(this)" type="radio" name="type" id="audio" value="audio">
    </div>

    <div class="text">
      <input type="text" class="addTitle" placeholder="Titel"> <br>
      <input type="text" class="addAuther" placeholder="Författare">
    </div>

      
    <div class="genrersCheckbox">
      <label for="">Drama</label>
      <input type="checkbox" id="dramaGenrers" value="3">
    
      <label for="">Horror</label>
      <input type="checkbox" id="HorrorGenrers" value="4">
    
      <label for="">Humor</label>
      <input type="checkbox" id="HumorGenrers" value="1">
    
      <label for="">Romance</label>
      <input type="checkbox" id="RomanceGenrers" value="2">
    </div>

    <div class="ReleaseLength">
      <input type="date" class="releaseInput hidden" placeholder="Release Year">
      <input type="number" class="lengthInput" placeholder="Pages">
    </div> 


    
    <input type="file" id="ImgInput" class="input-field" />


    <div class="grades">    
      <select name="grades" id="grades" style="width:200px;">
      <label for="grades"><br>1 är lägsta betyg, 5 är högstabetyg</label>
        <option value="1">1 Lägsta betyg</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5 Högsta betyg</option>
      </select>

    </div>

    <div class="addedNewBookOrAudio">
    <button class="addNewBtn" onclick="renderNewBookAudiofromUser()">Lägg till</button>  
    </div>
  </div>
  `

  // Vad som ska visa när man fyller i ljudbok eller bok
  const bookOrAudio = (x) => {
  console.log(x.value);
  if (x.value === "audio"){
    document.querySelector(".releaseInput").classList.remove("hidden")
    document.querySelector(".lengthInput").placeholder = "length"
    document.querySelector(".releaseInput").placeholder = "Release Year"
  
  
  } else {
    document.querySelector(".releaseInput").classList.add("hidden")
    document.querySelector(".lengthInput").placeholder ="Pages"
   
  }
}

// Ladda in det nya boken eller ljudboken till strapi
let renderNewBookAudiofromUser = async () => {

  let checkedGenres = []
  document.querySelectorAll("input[type='checkbox']:checked").forEach(Genrers => {
      checkedGenres.push(+Genrers.value)
  })


  if(document.querySelector("[name='type']:checked").value === ("book")){
    
    
    let Titel = document.querySelector(".addTitle").value;
    let Author = document.querySelector(".addAuther").value;
    let Grades = document.querySelector("#grades").value;
    let Pages = document.querySelector(".lengthInput").value;
    let user = sessionStorage.getItem("id");
    let cover = document.querySelector('#ImgInput').files; // Hämtar bilden ifrån använder uppladdning
    let imgData = new FormData(); //Skapa formdata för att det ska funka och döper den till imgData
    imgData.append('files', cover[0]); //appenda själva bilden till formdataobjektet. key+value
    //let user = document.querySelector(".lending").value;
    

   
    // Ladda upp bilden till strapi
    await axios.post("http://localhost:1337/api/upload", imgData, {

      headers: {
        Authorization:`Bearer ${sessionStorage.getItem("token")}`
      }
    }).then(response => {
    
      axios.post("http://localhost:1337/api/books", {
        data:{
          Titel, 
          Author,
          genrers: checkedGenres,
          Grades,
          Pages,
          Picture: response.data[0].id,
          user

        }
      },
      {
        //config
        headers: {
          Authorization:`Bearer ${sessionStorage.getItem("token")}`
        }
      })
    })
    
    
     
  } else {

    let Titel = document.querySelector(".addTitle").value;
    let Author = document.querySelector(".addAuther").value;
    let Grade = document.querySelector("#grades").value;
    console.log(Grade);
    let Length = document.querySelector(".lengthInput").value;
    let ReleaseDate = document.querySelector(".releaseInput").value; 
    let cover = document.querySelector('#ImgInput').files; // Hämtar bilden ifrån använder uppladdning
    let imgData = new FormData(); //Skapa formdata för att det ska funka och döper den till imgData
    imgData.append('files', cover[0]); //appenda själva bilden till formdataobjektet. key+value
    let user = sessionStorage.getItem("id")

    // Ladda upp bilden till strapi
    axios.post("http://localhost:1337/api/upload", imgData, {

      headers: {
        Authorization:`Bearer ${sessionStorage.getItem("token")}`
      }
    }).then(response => {
      axios.post("http://localhost:1337/api/audiobooks", {
        //body
        data: {
          Titel,
          Author,
          genrers: checkedGenres,
          Grade,
          ReleaseDate,
          Length,
          Picture: response.data[0].id,
          user
        }
      },
      {
        //config
        headers: {
          Authorization:`Bearer ${sessionStorage.getItem("token")}`
        }
      })
    })
  }
}