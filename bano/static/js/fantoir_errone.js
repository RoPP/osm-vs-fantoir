var menu_labels
var commune_valide = false
var osm_state
function start(){
    $('body').css('cursor','progress');
    $('#wait_ajax').empty()
                    .css('z-index','20')
                    .css('opacity','0.8')
                    .append($('<span>').append('Recherche des FANTOIRs erronés...'));
    $.ajax({
        // FIXME
        url: "http://cadastre.openstreetmap.fr/fantoir/fantoir_errone.py",
    })
    .done(function( data ){
        titre_bandeau = ' codes FANTOIR erronés'
        if (data.length == 1){
            titre_bandeau = ' code FANTOIR erroné'
        }
        $('#bandeau h1').append(data.length+titre_bandeau)
        $('#wait_ajax').append($('<span>').append("Ok"));

        $('body').css('cursor','default');
        $('#wait_ajax').css('z-index','1').css('opacity','0');

        url_map_org_part1 = 'http://www.openstreetmap.org/'
        url_map_fr_part1 = 'http://tile.openstreetmap.fr/'
        url_bano_part1 = 'http://tile.openstreetmap.fr/~cquest/leaflet/bano.html'
        url_edit_part1 = 'http://www.openstreetmap.org/edit?editor='
        delta = 0.0008

/*          url_listing_fantoir = './liste_brute_fantoir.html#insee='+$('#input_insee')[0].value
        add_map_link('table_infos_commune',url_listing_fantoir,'FANTOIR')
        $('#table_infos_commune').append($('<tr>').append($('<td>').addClass('cellule_intitule').append('Données OSM en date du')).append($('<td>').addClass('cellule_data').append(cache_hsnr[2])))
*/
        add_header('table_fantoir_errone',true)
        table = 'table_fantoir_errone'
        for (l=0;l<data.length;l++){
            insee = (data[l][0]).substr(0,5)
            //Fantoir
            $('#'+table).append($('<tr>').attr('id',data[l][0]).append($('<td>').addClass('cell_fantoir').text(data[l][0])))
            //Nom OSM
            $('#'+table+' tr:last').append($('<td>').text(data[l][1]))
            lon = data[l][2]
            lat = data[l][3]
            if (lon && lat){
                url_ol_part2 = '?zoom=18&lat='+lat+'&lon='+lon
                url_hash_coords = '18/'+lat+'/'+lon
                xleft   = lon-delta
                xright  = lon+delta
                ybottom = lat-delta
                ytop    = lat+delta
            //visu
                add_map_link(table,url_map_org_part1+'#map='+url_hash_coords,'ORG')
                add_map_link(table,url_map_fr_part1+url_ol_part2,'FR')
                add_map_link(table,url_bano_part1+'#'+url_hash_coords,'BANO')
            //JOSM
                add_josm_link(table,xleft,xright,ybottom,ytop)
            //ID
                add_map_link(table,url_edit_part1+'id#map='+url_hash_coords,'ID')
            //Potlatch
                add_map_link(table,url_edit_part1+'potlatch2#map='+url_hash_coords,'P2')
            //Fantoir
                add_map_link(table,'./index.html#insee='+insee,'Fantoir-OSM '+insee)
                add_map_link(table,'./liste_brute_fantoir.html#insee='+insee,'Fantoir brut '+insee)
            }
        }
    })
};
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
function add_map_link(table,href,text){
    $('#'+table+' tr:last').append($('<td>')
                                .append($('<a>')
                                .attr('href',href)
                                .attr('target','blank')
                                .text(text)))
}
function add_josm_link(table,xl,xr,yb,yt){
    $('#'+table+' tr:last').append($('<td>')
                                .addClass('zone_click')
                                .attr('xleft',xl).attr('xright',xr).attr('ybottom',yb).attr('ytop',yt)
                                .text('JOSM')
                                .click(function(){
                                    srcLoadAndZoom = 'http://127.0.0.1:8111/load_and_zoom?left='+xl+'&right='+xr+'&top='+yt+'&bottom='+yb;
                                    $('<img>').appendTo($('#josm_target')).attr('src',srcLoadAndZoom);
                                    $(this).addClass('clicked');
                                })
                            )
}
function add_header(table,with_edit_and_map_links){
    $('#'+table).append($('<tr>').append($('<th>').append('Code FANTOIR')))
    $('#'+table+' tr').append($('<th>').append('Voie OSM'))
    if (with_edit_and_map_links){
        $('#'+table+' tr').append($('<th>').attr('colspan','3').append('Cartes'))
        $('#'+table+' tr').append($('<th>').attr('colspan','3').append('Édition'))
        $('#'+table+' tr').append($('<th>').attr('colspan','2').append('FANTOIR'))
    }
}

$(document).ready(start());
