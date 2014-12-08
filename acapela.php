<?php
    // ATTENTION: ce fichier est nécessaire pour se connecter au service
    // il n'est pas intégré au code source pour des raisons évidentes de sécurité.
    // Veuillez le créer en suivant le modèle fournit dans le ficher secrets-exemple.php
    include 'secrets.php';

    $url = "http://vaas.acapela-group.com/Services/Synthesizer";
    $data = array(
        'prot_vers' => '2',
        'cl_env' => '',
        'cl_vers' => '2-15',
        'cl_login' => $login,
        'cl_app' => $app,
        'cl_pwd' => $password,
        'req_voice' => $voice,
        'req_text' => $_POST['text']
    );
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
        ),
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    parse_str($result,$output);
    if ($output['res'] == 'OK') {
        echo '{';
        echo '"status": "OK",';
        echo '"res":'.'"'.$output['res'].'",';
        echo '"snd_url":'.'"'.$output['snd_url'].'"';
        echo '}';
    } else {
        echo '{';
        echo '"status": "NOK",';
        echo '"result": "'.$result.'"';
        echo '}';
    }
?>
