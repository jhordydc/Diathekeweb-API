document.getElementById('formulario').addEventListener('click', pesquisarFilmes);

function pesquisarFilmes(e) {
    var filmePesquisa = document.getElementById('pesquisar').value
    buscarFilmes(filmePesquisa)
    e.preventDefault();
}
function buscarFilmes(filmePesquisa) {
    apiKey = '5c80a2a1'
    //url = 'http://www.omdbapi.com/?apikey='
    url = 'https://www.omdbapi.com/?apikey='
    axios.get(`${url}${apiKey}&s=${filmePesquisa}`)    
  .then(function (response) {
    console.log(response);
    var filmes = response.data.Search;
    var mostrarFilmes = '';

    for (var i = 0; i < filmes.length; i++) {
        mostrarFilmes += `
            <div class="col-sm-6 col-md-4">
                <div class="thumbnail">
                    <img src="${filmes[i].Poster}" class="img-thumbnail">
                    <h4>${filmes[i].Title}</h4>
                    <p><a href="#"class="btn btn-primary" role="button" onclick="filmeDetalhes('${filmes[i].imdbID}')">Ver Detalhes</a></p>
                </div>
            </div>
        `;
    }
    document.getElementById('filmes').innerHTML = mostrarFilmes;
  })
  .catch(function (error) {
    console.log(error);
  });
}

function filmeDetalhes(id) {
  sessionStorage.setItem('filmeId', id);
  window.location = 'detalhes.html'
  return false;
}

function mostraFilme() {
  var filmeId = sessionStorage.getItem('filmeId');

  apiKey = '5c80a2a1'
  url = 'https://www.omdbapi.com/?apikey='
  //url = 'http://www.omdbapi.com/?apikey='
    axios.get(`${url}${apiKey}&i=${filmeId}`)    
  .then(function (response) {
    var filme = response.data
    var mostraFilme = `
      <div class="col-md-6">
        <img src="${filme.Poster}" class="img-responsive">
          <h3><strong>${filme.Title}</strong></h3>
      </div>
      <div class="col-md-6">
        <div class="well clearfix">
          <ul class="list-group">
            <li class="list-group-item"><strong>Gênero:</strong> ${filme.Genre}</strong></li>
            <li class="list-group-item"><strong>Lançamento:</strong> ${filme.Released}</strong></li>
            <li class="list-group-item"><strong>Duração:</strong> ${filme.Runtime}</strong></li>
            <li class="list-group-item"><strong>Idioma:</strong> ${filme.Language}</strong></li>
            <li class="list-group-item"><strong>Prêmios:</strong> ${filme.Awards}</strong></li>
            <li class="list-group-item"><strong>Atores:</strong> ${filme.Actors}</strong></li>
          </ul>
          <h3>Descrição</h3>
          ${filme.Plot}
          <hr>
          <a href="http://imdb.com/title/${filme.imdbID}" target="_blank" class="btn btn-success pull-left">Ver no iMDB</a>
          <a href="index.html" class="btn btn-default pull-right">Voltar a Pesquisar</a>
        </div>
      </div>
    `
    document.getElementById('filmes').innerHTML = mostraFilme;
  })
    .catch(function (error) {
      console.log(error);
    });
}