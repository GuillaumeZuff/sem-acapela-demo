// Script principal: démarre lorsque la page est chargée
$(document).ready(function() {
    // première étape: on crée un player acapela
    var config = {
        audioId: 'audioPlayer',
        sourceId: 'mp3Source',
        acapelaUrl: 'acapela.php'
    };
    var player = AcapelaPlayer(config);
    player.onStatusChange(function(data) {
        $('.status').text(data.status);
    });
    $('#play').click(function(e) {
        word = $('#textInput').val();
        console.log("Playing", word);
        if (word && word!=='') {
            player.play(word);
        }
    });
});

