const best_movies_slider = document.querySelector(".best_movies_group")
const family_movies_slider = document.querySelector(".family_movies_group")
const animation_movies_slider = document.querySelector(".animation_movies_group")
const adventure_movies_slider = document.querySelector(".adventure_movies_group")

let best_movies_url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
let family_movies_url = "http://localhost:8000/api/v1/titles/?genre_contains=Family&sort_by=-imdb_score"
let animation_movies_url = "http://localhost:8000/api/v1/titles/?genre_contains=Animation&sort_by=-imdb_score"
let adventure_movies_url = "http://localhost:8000/api/v1/titles/?genre_contains=Adventure&sort_by=-imdb_score"

let scrollBase = 0;
let scrollPerClick;
let ImagePadding = 40

// function to scroll from the selected_class (best_movies_slider etc)
// depending from screen.width
// scrollTo(top, left) 
// scrollPerClick = images[0].clientWidth + ImagePadding => each image's width
// When we arrive at carousel's end => back to top 
function sliderScrollLeft(selected_class){
    if(scrollBase <= 30){
        selected_class.scrollTo({
            top:0,
            left: 0,
            behavior: "smooth"
        });
        scrollBase = selected_class.scrollWidth-selected_class.clientWidth+scrollPerClick;
    } else {selected_class.scrollTo({
        top:0,
        left: (scrollBase-=scrollPerClick),
        behavior: "smooth"
    });}
}

function sliderScrollRight(selected_class){
    if(scrollBase>selected_class.scrollWidth - selected_class.clientWidth){
        selected_class.scrollTo({
            top:0,
            left: 0,
            behavior: "smooth"
        });
        scrollBase = 0;
    } else if  (scrollBase<=selected_class.scrollWidth - selected_class.clientWidth){
        selected_class.scrollTo({
            top:0,
            left: (scrollBase += scrollPerClick),
            behavior: "smooth"
        });
    }
}

// get bestmovie from api => return json => set attribute id to button with film id
// and image_url for image.
const getBestMovie = fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
    .then(function(res) {
  if (res.ok) {
    return res.json();
  }
    })
    .then(function(value){
        let best_movie = document.querySelector("img");
        best_movie.setAttribute("src",value.results[0].image_url);
        best_movie.setAttribute("id", value.results[0].id);
        best_movie.setAttribute("style", "width: 251px; height: 370px;");
        let best_movie_title=document.getElementById("meilleurFilm_title");
        best_movie_title.innerText = value.results[0].title;
    })
    .catch(function(err){
        console.log("An error append: ", err);
    });
    
// Fetch informations for red button from api with id movie
const getBestMovieWithRedButton = fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
    .then(function(res) {
  if (res.ok) {
    return res.json();
  }
    })
    .then(function(value){
        let best_movie = document.querySelector("img.red_button");
        best_movie.setAttribute("id", value.results[0].id);
    })
    .catch(function(err){
        console.log("An error append: ", err);
    });
    
async function showMovieData(url, className){
    fetch(url)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value){
            let all_results = value.results 
            let results2 = value.next
            const getPage2 = fetch(results2)
                .then(function(res) {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then(function(value){
                    let result6 = value.results[0]
                    let result7 = value.results[1]
                    let result_page2 = []
                    result_page2.push(result6)
                    result_page2.push(result7)
                    let movies = all_results.concat(result_page2)
                    let images = document.getElementsByClassName(className);
                    scrollPerClick = images[0].clientWidth + ImagePadding;
                    movies.map(function(cur,index){
                    images[index].setAttribute("src", cur.image_url);
                    images[index].setAttribute("id", cur.id);
                    });
                })
                .catch(function(err){
                    console.log("An error append fetching second page ", err);
                    });
        })
}

showMovieData(best_movies_url, "best_movies")
showMovieData(family_movies_url, "family_movies")
showMovieData(animation_movies_url, "animation_movies")
showMovieData(adventure_movies_url, "adventure_movies")

// Get the modal
let modal = document.getElementById("myModal");
// Get the button that opens the modal and 
// When the user clicks the button, open modal
// Fetch informations from api with id movie
const imgs = document.querySelectorAll("img.movies, img.best_movie, img.red_button");
for (let i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener("click", function(e) {
        e.preventDefault();
        modal.style.display = "block";
        let id_movie=imgs[i].getAttribute("id");
        let movie_url = `http://localhost:8000/api/v1/titles/${id_movie}`;
        if (id_movie === "image_url_cible") {
            console.log("datas are already loaded");
        } else {
            getMovieInformation(movie_url);
        }
        
  })  
}

// get movie informations for modal box
function getMovieInformation(movie_url){
    fetch(movie_url)
    .then(function(res){
        if(res.ok){
            return res.json()
        }
    }).then(function(value){
        let title_element = document.getElementById("title");
        title_element.innerText = value.title;

        document
            .getElementById("genres")
            .innerText = `Genres: ${value.genres}`;
        document
            .getElementById("countries")
            .innerText = `Countries: ${value.countries}`;
        document
            .getElementById("year")
            .innerText = `Year: ${value.year}`;
        document
            .getElementById("duration")
            .innerText = `Duration: ${value.duration} min`;
        
        let rated_element = document.getElementById("rated");
            if (value.rated = "Not rated or unknow rating"){
                rated_element.innerText = " - "
            }else {
                rated_element.innerText = value.rated
            };
        document
            .getElementById("imdb_score")
            .innerText = `Imdb Score: ${value.imdb_score}`;
        
        let budget_element = document.getElementById("budget")
            if (value.budget === null){
                budget_element.innerText = " - ";
            }else{
            budget_element.innerText = `Budget: ${value.budget}$`;
            };
        document
            .getElementById("directors")
            .innerText =`Directors: ${value.directors}`;
        document
            .getElementById("actors")
            .innerText = value.actors;
        document
            .getElementById("description")
            .innerText = value.description;
        document
            .getElementById("image_url_cible")
            .setAttribute("src",value.image_url);
    })
    .catch(function(err) {
        console.log("An error append", err)
        });
}

// Get the <span> element that closes the modal and
// when the user clicks on <span> (x), close the modal
let span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
