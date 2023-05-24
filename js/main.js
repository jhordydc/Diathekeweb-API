$(function () {

    // Busca na API do iTunes
    $('form').submit(function () {
        var busca = $('#busca').val();
        var nResultados = $('#numero-resultados').val();
        var resultado = $('.resultado-busca');
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'https://itunes.apple.com/search?term=' + busca + '&media=music&limit=' + nResultados,
            beforeSend: function () {
                $('.resultado-busca').html('<div class="preloader-wrapper big active">' +
                                                '<div class="spinner-layer spinner-blue-only">' +
                                                    '<div class="circle-clipper left">' +
                                                        '<div class="circle"></div>' +
                                                    '</div>' + 
                                                    '<div class="gap-patch">' +
                                                        '<div class="circle"></div>' +
                                                    '</div>' + 
                                                    '<div class="circle-clipper right">' +
                                                        '<div class="circle"></div>' +
                                                  '</div>' +
                                                '</div>' +
                                            '</div>');
            }, success: function (data) {
                // Se retornar dados na busca
                if(data.results.length) {
                    
                    // console.log(data);
                    $('div').removerClasseBusca();
                    resultado.html('');
                    for (var i in data.results) {
                        var artwork = data.results[i].artworkUrl100;
                        var artwork1200 = artwork.replace('/100x100', '/1200x1200');
                        var dataLancamento = data.results[i].releaseDate;
                        var anoLancamento = dataLancamento.split('-');
                        
                        // Criar o card com informações
                        var card = $(
                                '<div class="pesquisar">' +
                                    '<audio controls data-id-music="' + data.results[i].trackId + '">' +
                                        '<source src="' + data.results[i].previewUrl + '" type="audio/ogg">' +
                                        '<source src="' + data.results[i].previewUrl + '" type="audio/mpeg">' +
                                        'Seu navegador não oferece suporte a este elemento.' +
                                    '</audio>' +
                                    '<div class="card">' +
                                        '<div class="card-image">' +
                                            '<img class="materialboxed" data-caption="' + data.results[i].collectionCensoredName + ' - ' + data.results[i].trackName + '" width="250" src="' + artwork1200 + '">' +
                                            '<span class="card-title ">' + data.results[i].trackName + '</span>' +
                                            '<a class="btn-floating btn-large halfway-fab waves-effect waves-light red play" data-music="' + data.results[i].trackId + '"><i class="material-icons">play_arrow</i></a>' +
                                        '</div>' +
                                        '<div class="card-content">' +
                                            '<p><strong>Artista:</strong> ' + data.results[i].artistName + '<br /><strong>Álbum:</strong> ' + data.results[i].collectionName + '<br /><strong>Ano de Lançamento:</strong> ' + anoLancamento[0] + '</p>' +
                                        '</div>' +
                                        '<div class="card-action">' +
                                            '<a class="left-align" href="' + data.results[i].trackViewUrl + '" target="_blank">Ouvir no Itunes</a>' +
                                            '<span class="tempo-atual right-align">0:00</span> / <span data-music="' + data.results[i].trackId + '" class="duracao">0:00</span>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'
                                );
                                
                        
                        // Ocultar card criado
                        card.hide();

                        // Inserir cards na div de retorno
                        resultado.prepend(card);
                        
                        // Exibe os cards criados que estavam ocultos
                        card.fadeIn();
                        
                        // Ao terminar de tocar a prévia, a classe "tocando" é removida do card
                        $('audio').removerAnimacao();
                        
                    }
                        
                    // Inicia materialbox para exibir capa do álbum em tela cheia
                    $('.materialboxed').materialbox();
                    
                    // Ao dar play, carrega e toca a prévia da música
                    $('.play').tocarPrevia();                    
                } else {
                    // Se não houver resultados, este aviso é exibido e carregamento cancelado
                    Materialize.toast('Não foram encontrado resultados para sua busca!', 4000);
                    resultado.html('');
                }
            }
        });
        return false;
    });

    
    $.fn.extend({
        tocarPrevia: function () {
            $('.play').on('click', function () {
                var idPrevia = $(this).attr('data-music');
                var previa = document.querySelector('[data-id-music="' + idPrevia + '"]');

                if (previa.duration > 0 && !previa.paused) {
                    $(this).html('<i class="material-icons">play_arrow</i>');
                    $(this).siblings('span').removeClass('tocando');
                    previa.pause();
                } else {
                    $('audio').each(function () {
                        this.pause();
                    });
                    $('span').each(function() {
                        $('span').removeClass('tocando');
                    });
                    $('.play').html('<i class="material-icons">play_arrow</i>');
                    $(this).html('<i class="material-icons">pause</i>');
                    previa.play();
                    
                    if(previa.readyState > 0) {
                        $(this).siblings('span').addClass('tocando');
                    } else {
                        while(previa.readyState < 4) {
                            if(previa.readyState > 0) {
                                $(this).siblings('span').addClass('tocando');
                                carregado = true;
                                break;
                            } else {
                                $(this).html('<img style="padding: 10px;" src="img/rolling.gif" />');
                                break;
                            }
                        }
                        if(previa.played.end(0) > 0) {
                            $(this).html('<i class="material-icons">pause</i>');
                        }
                    }
                }
                
                if(previa.ended) {
                    $(this).siblings('span').removeClass('tocando');
                }
                
                previa.onloadedmetadata = function(e) {
                    alert('oi');
                };
            });
        }, 
        removerClasseBusca: function() {
            this.animate({marginTop: '0px'});
            this.removeClass('__busca');
        },
        removerAnimacao: function() {
            this.on('ended', function() {
                $('span').removeClass('tocando');
            });
        }
    });
});
