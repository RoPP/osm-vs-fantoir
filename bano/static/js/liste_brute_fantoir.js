a_champs_fantoir = ['Fantoir OSM','dept','code_dir','code_com','code_insee','id_voie','rivoli','nature_voie','libelle_voie','type_commune','caractere_rur','caractere_voie','caractere_pop','pop_a_part','pop_fictive','caractere_annul','date_annul','date_creation','code_majic','type_voie','ld_bati','dernier_mot','code INSEE + ID Voie']
function check_url_for_insee(){
    pattern_insee = new RegExp('^[0-9][0-9abAB][0-9]{3}$')
    var res
    if (window.location.hash){
        if (window.location.hash.split('insee=')[1]){
            if (pattern_insee.test(window.location.hash.split('insee=')[1].split('&')[0])){
                res = window.location.hash.split('insee=')[1].split('&')[0]
            } else {
                alert(window.location.hash.split('insee=')[1].split('&')[0]+' n\'est pas un code INSEE de commune\n\nAbandon')
            }
        }
    }
    return res
}
function start(){
    insee = check_url_for_insee()
    if (insee){
        $('#input_insee').empty()
        $('#input_insee')[0].value = insee
        listing_fantoir()
    }
}
function listing_fantoir(){
    $('body').css('cursor','progress');
    $('#input_insee')[0].value = $('#input_insee')[0].value.toUpperCase()
    $.ajax({
        // FIXME
        url: "http://cadastre.openstreetmap.fr/fantoir/listing_fantoir.py?insee="+$('#input_insee')[0].value
    })
    .done(function( data ) {
        nom_commune = data[0][0]
        $('#table_infos_commune').empty()
        $('#listing_fantoir').empty().append($('<thead>').append($('<tr>')))

        if (nom_commune.length == 0){
            $('#table_infos_commune').append($('<h2>').append('INSEE '+$('#input_insee')[0].value+' : commune inconnue'))
            $('body').css('cursor','default');
            return 0;
        }
        document.title = nom_commune+' - Liste FANTOIR 2014'

        $('#table_infos_commune').append($('<tr>').append($('<th>').append($('<h1>').addClass('titre_commune').append((nom_commune+" ("+$('#input_insee')[0].value+")")))))
        fantoir = data[1]
        for (c=0;c<a_champs_fantoir.length;c++){
            $('#listing_fantoir > thead > tr:last').append($('<th>').append(a_champs_fantoir[c]))
        }
        $('#listing_fantoir').append($('<tbody>'))
        for (c=0;c<fantoir.length;c++){
            $('#listing_fantoir').append($('<tr>'))
            for (d=0;d<fantoir[c].length;d++){
                $('tr:last').append($('<td>').attr('title',a_champs_fantoir[d]).append(fantoir[c][d]))
            }
        }
        $('#listing_fantoir').tablesorter();
    })
    window.location.hash="#insee="+$('#input_insee')[0].value
    $('body').css('cursor','default');
}

$(document).ready(start());
