
var menu_labels
var a_champs_stats = ['Format','Code INSEE','Commune','Voies avec adresses<br/>rapprochées (a)','Toutes voies<br/>rapprochées (b)...','...dont voies rapprochées sur<br/>lieux-dits FANTOIR','Voies FANTOIR (c)','Voies et lieux-dits<br/>FANTOIR (d)','Pct adresses /<br/>voies FANTOIR (a/c)','Pct voies /<br/>voies FANTOIR (b/c)','Pct voies /<br/>voies et lieux-dits FANTOIR (b/d)','Indice 2020']
function is_valid_dept(d){
    pattern_dept = new RegExp('^([01]|[3-8])([0-9])$|^2([aAbB]|[1-9])$|^9([0-5]|7[1-4]|76)$')
    var res
    if (pattern_dept.test(d)){
        res = d
    }
    return res
}
function check_url_for_dept(){
    var res
    if (window.location.hash){
        if (window.location.hash.split('dept=')[1]){
            if (is_valid_dept(window.location.hash.split('dept=')[1].split('&')[0])){
                res = window.location.hash.split('dept=')[1].split('&')[0]
            } else {
                alert(window.location.hash.split('dept=')[1].split('&')[0]+' n\'est pas un numero de département valide\n\nAbandon')
            }
        }
    }
    return res
}
function start(){
    $('#infobulle_aide').click(function(){
        $('#aide').css('visibility','visible');
    })
    $('#aide > .fermer').click(function(){
        $('#aide').css('visibility','hidden');
    })
    dept = check_url_for_dept()
    if (dept){
        $('#input_dept').empty()
        $('#input_dept')[0].value = dept
        requete_stats_dept();
    }
}
function requete_stats_dept(){
    if (!is_valid_dept($('#input_dept')[0].value)){
        alert($('#input_dept')[0].value+" n'est pas un numéro de département valide\n\nAbandon")
        return;
    }
    $('body').css('cursor','progress');
    $('#input_dept')[0].value = $('#input_dept')[0].value.toUpperCase()
    $.ajax({
        // FIXME
        url: "http://cadastre.openstreetmap.fr/fantoir/stats_dept.py?dept="+$('#input_dept')[0].value
    })
    .done(function( data ) {
        nom_dept = data[0][0][1]
        $('#table_infos_dept').empty()
        $('#stats_dept').empty().append($('<thead>').append($('<tr>')))

        if (nom_dept.length == 0){
            $('#table_infos_dept').append($('<h2>').append('dept '+$('#input_dept')[0].value+' : département inconnu'))
            $('body').css('cursor','default');
            return 0;
        }
        document.title = nom_dept+' - Avancement du rapprochement des voies par commune'

        $('#table_infos_dept').append($('<tr>').append($('<th>').append($('<h1>').addClass('titre_dept').append((nom_dept+" ("+$('#input_dept')[0].value+")")))))
        stats = data[1]
        for (c=0;c<a_champs_stats.length;c++){
            $('#stats_dept > thead > tr:last').append($('<th>').append(a_champs_stats[c]))
        }
        $('#stats_dept').append($('<tbody>'))
        for (c=0;c<stats.length;c++){
            $('#stats_dept').append($('<tr>'))
            for (d=0;d<stats[c].length;d++){
                if (d==1){
                    $('#stats_dept tr:last').append($('<td>')
                                            .attr('title',(a_champs_stats[d]).replace('<br\/>',' '))
                                            .append($('<a>')
                                            .attr('href','http://cadastre.openstreetmap.fr/fantoir/#insee='+stats[c][1])
                                            .text(stats[c][1])))
                } else {
                    $('#stats_dept tr:last').append($('<td>').attr('title',(a_champs_stats[d]).replace('<br\/>',' ')).append(stats[c][d]))
                }
                // style des cellules de format
                $('#stats_dept tr:last td:first').addClass(stats[c][0])
            }
        }
        $('#stats_dept').tablesorter();
        $('body').css('cursor','default');
    })
    window.location.hash="#dept="+$('#input_dept')[0].value
}

$(document).ready(start());
