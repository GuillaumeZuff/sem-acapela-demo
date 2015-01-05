// lecteur de voix synthétique
// appelle un script php sur le serveur pour générer un fichier mp3
// Paramètre config:
// - audioId: id de l'élément audio
// - sourceId: id de la source (dans l'élément audio)
// - acapelaUrl: url du script php acapela
var AcapelaPlayer = function(config) {
    // cache pour éviter de générer plusieurs fois les mêmes requêtes
    var cache = {};
    // génèrent des événements - utile pour informer les utilisateurs
    // sur l'état du player (loading=attend une réponse du serveur, ready=prêt/terminé, failed=erreur lors de la dernière requête)
    var listeners = $.Callbacks();

    // place l'url reçue d'accapela dans le player audio html
    var playSound = function(url) {
        // lecteur audio sur la page html
        var player = $('#'+config.audioId).get(0)
        // la source mp3 du player
        var source = $('#'+config.sourceId);
        source.attr('src',url).detach().appendTo(player);
        // on charge la nouvelle url (nécessaire pour rafraîchir)
        player.load()
        // on lit le mp3 qui vient d'être chargé
        player.play()
    };

    // lit le mot passé en paramètre
    var playWord = function(word) {
        // ne fait rien si le mot est vide
        if (!(word && word!=="")) return;
        listeners.fire({status:'loading'});
        // contrôle si le mot est dans le cache
        if (cache[word]) {
            playSound(cache[word]);
            listeners.fire({status:'ready'});
            return;
        } else {
            var data = {
                text: word
            };
            // appelle le script php pour générer un ficher mp3
            var url = config.acapelaUrl;
            $.post(url, data, function(data,textStatus,jqXHR) {
                try {
                    // la réponse est donnée en JSON
                    var answer = JSON.parse(data);
                    if (answer.status === 'OK') {
                        // ok, le mot a pu être généré
                        // on l'ajoute au cache
                        cache[word] = answer.snd_url;
                        // et on le lit
                        playSound(answer.snd_url);
                        listeners.fire({status:'ready'});
                        return;
                    } else {
                        console.log('Erreur de voix synthétisée: '+answer.res);
                    }
                } catch (e) {
                    console.log("Erreur lors de la génération de la voix synthétisée: ",e);
                    console.log("Réponse: ",data);
                }
                listeners.fire({status:'failed'});
            });
        }
    };

    // les fonctions visibles depuis l'extérieur (API)
    return {
        // lit le mot passé en paramètre
        play: function(word) {
            playWord(word);
        },
        // appelle la fonction passée en paramètre à chaque changement de status
        onStatusChange: function(callback) {
            listeners.add(callback);
        }
    }
};
