var menu_labels
var commune_valide = false
var osm_state
function start(){
    $('body').css('cursor','progress');
/*      $('#wait_ajax').empty()
                    .css('z-index','20')
                    .css('opacity','0.8')
                    .append($('<span>').append('Recherche des FANTOIRs erronés...'));*/
    $.ajax({
        url: "json/voies_recentes_manquantes.json",
    })
    .done(function( data ){
        $('body').css('cursor','default');

        url_map_org_part1 = 'http://www.openstreetmap.org/'
        url_map_fr_part1 = 'http://tile.openstreetmap.fr/'
        url_bano_part1 = 'http://tile.openstreetmap.fr/~cquest/leaflet/bano.html'
        url_edit_part1 = 'http://www.openstreetmap.org/edit?editor='
        delta = 0.0008

        add_header('table_fantoir_errone',true)
        table = 'table_fantoir_errone'
        for (l=0;l<data.length;l++){
            insee = (data[l][1])
            //Dept
            $('#'+table).append($('<tr>').attr('id',data[l][4]).append($('<td>').text(data[l][0])))
            //Commune (INSEE)
            $('#'+table+' tr:last').append($('<td>').text(data[l][2]+'('+data[l][1]+')'))
            //Fantoir
            $('#'+table+' tr:last').append($('<td>').text(data[l][4]))
            //Voie
            $('#'+table+' tr:last').append($('<td>').text(data[l][3]))
            //Date de création
            $('#'+table+' tr:last').append($('<td>').text(data[l][7]))
            lon = data[l][5]
            lat = data[l][6]
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
    $('#'+table).append($('<tr>').append($('<th>').append('Dept')))
    $('#'+table+' tr').append($('<th>').append('Commune(INSEE)'))
    $('#'+table+' tr').append($('<th>').append('Fantoir'))
    $('#'+table+' tr').append($('<th>').append('Voie'))
    $('#'+table+' tr').append($('<th>').append('Date de création'))
    if (with_edit_and_map_links){
        $('#'+table+' tr').append($('<th>').attr('colspan','3').append('Cartes'))
        $('#'+table+' tr').append($('<th>').attr('colspan','3').append('Édition'))
        $('#'+table+' tr').append($('<th>').attr('colspan','2').append('FANTOIR'))
    }
}
