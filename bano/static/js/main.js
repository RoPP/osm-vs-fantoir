var menu_labels
var commune_valide = false
var osm_state
function start(){
    $('.rubrique').click(function() {
        $('.rubrique').removeClass('active');
        $(this).addClass('active');
        $('.table_liste').css({display:'none'})
        $('#'+$(this).attr('cible')).css({display:'block'})
        update_url_tab($(this).parent().children().index($(this)))
    })
    $.ajax({
        url: "/api/fantoir/status"
    })
    .done(function( data ) {
        a_menus_labels = []
        for (c=0;c<data.length;c++){
            menu_labels = '<select>'
            id_label = 0
            for (i=0;i<data.length;i++){
                if (c!=i){
                    menu_labels+='<option value='+data[i].id+'>'+data[i].label+'</option>'
                } else {
                    menu_labels+='<option value='+data[i].id+' selected>'+data[i].label+'</option>'
                    id_label = data[i].id
                }
            }
            menu_labels+='</select>'
            a_menus_labels[id_label] = menu_labels
        }
    })
    insee = check_url_for_insee()
    if (insee){
        $('#input_insee').empty()
        $('#input_insee')[0].value = insee
        requete_fantoir()
    }
    $('#bouton_refresh').click(function(){
                            refresh();
                        })
                        .mouseover(function(){
                            get_osm_state();
                            refresh_infos();
                        })
                        .mouseout(function(){
                            $('#refresh_infos').hide()
                        })
    $('#infobulle_aide').click(function(){
        $('#aide').css('visibility','visible');
    })
    $('#aide > .fermer').click(function(){
        $('#aide').css('visibility','hidden');
    })
};
function refresh_infos(){
    $('#refresh_infos').empty()
                        .append('Mettre à jour avec les données OSM du ')
                        .append($('<span>').append(osm_state))
                        .show()
}
function refresh(){
    if (commune_valide == false){
        return 0;
    }
    $('body').css('cursor','progress');
    $('#wait_ajax').empty()
                    .css('z-index','20')
                    .css('opacity','0.8')
                    .append($('<span>').append('Mise à jour BANO en cours...'));
    $.ajax({
        // FIXME
        url: "http://cadastre.openstreetmap.fr/fantoir/refresh.py?insee="+$('#input_insee')[0].value,
    })
    .done(function( data ){
        if (data == '1'){
            $('#wait_ajax').append($('<span>').append("Ok"));
            requete_fantoir();
        } else {
            alert('Problème lors de la mise à jour')
        }
        $('body').css('cursor','default');
        $('#wait_ajax').css('z-index','1').css('opacity','0');
    })
}
function get_osm_state(){
    $.ajax({
        // FIXME
        url: "http://cadastre.openstreetmap.fr/fantoir/osm_state.py",
        async:false
    })
    .done(function( data ){
        osm_state = data;
    })
}
function requete_fantoir(){
    commune_valide = false;
    $('body').css('cursor','progress');
    $('#input_insee')[0].value = $('#input_insee')[0].value.toUpperCase()
    $('#table_adresses_non_match').empty()
    $('#table_adresses_match').empty()
    $('#table_voies_fantoir_non_match').empty()
    $('#table_voies_match').empty()
    $.ajax({
        // FIXME
        url: "http://cadastre.openstreetmap.fr/fantoir/requete_fantoir.py?insee="+$('#input_insee')[0].value
    })
    .done(function( data ) {
        nom_commune = data[0][0]
        import_cadastre = data[0][1]
        rappr_cadastre = data[0][2]
        rappr_osm = data[0][3]
        cache_hsnr = data[0][4]
        cache_ways = data[0][5]
        lon_commune = data[0][7]
        lat_commune = data[0][8]
        voies_fantoir_adresses_non_match = data[1]
        voies_fantoir_adresses_match = data[2]
        voies_fantoir_seules_non_match = data[3]
        voies_fantoir_seules_match = data[4]

        url_map_org_part1 = 'http://www.openstreetmap.org/'
        url_map_fr_part1 = 'http://tile.openstreetmap.fr/'
        url_bano_part1 = 'http://tile.openstreetmap.fr/~cquest/leaflet/bano.html'
        url_edit_part1 = 'http://www.openstreetmap.org/edit?editor='
        delta = 0.0008

        document.title = nom_commune+' - Correspondance entre FANTOIR et voies OSM'
        $('#table_infos_commune').empty()
        $('.rubrique').empty()

        if (nom_commune.length == 0){
            $('#table_infos_commune').append($('<h2>').append('INSEE '+$('#input_insee')[0].value+' : commune inconnue'))
            $('body').css('cursor','default');
            return 0;
        }
        commune_valide = true;
        if (import_cadastre[0]){
            intitule = 'Cadastre récupéré le'
            date_import_cadastre = import_cadastre[0][2]
        } else {
            intitule = 'Cadastre'
            date_import_cadastre = 'en format image'
        }
        $('#table_infos_commune').append($('<tr>').append($('<td>').addClass('cellule_intitule').append(intitule)).append($('<td>').addClass('cellule_data').append(date_import_cadastre)).append($('<th>').attr('rowspan','4').append($('<h1>').addClass('titre_commune').append((nom_commune)))))
        $('#table_infos_commune').append($('<tr>').append($('<td>').addClass('cellule_intitule').append('Dernier rapprochement le')).append($('<td>').addClass('cellule_data').append(rappr_osm[2])))
        url_hash_coords = '15/'+lat_commune+'/'+lon_commune
        url_ol_part2 = '?zoom=15&lat='+lat_commune+'&lon='+lon_commune
        url_listing_fantoir = './liste_brute_fantoir.html#insee='+$('#input_insee')[0].value
        add_map_link('table_infos_commune',url_map_org_part1+'#map='+url_hash_coords,'ORG')
        add_map_link('table_infos_commune',url_map_fr_part1+url_ol_part2,'FR')
        add_map_link('table_infos_commune',url_bano_part1+'#'+url_hash_coords,'BANO')
        add_map_link('table_infos_commune',url_listing_fantoir,'FANTOIR')
        $('#table_infos_commune').append($('<tr>').append($('<td>').addClass('cellule_intitule').append('Données OSM en date du')).append($('<td>').addClass('cellule_data').append(cache_hsnr[2])))

        $('#rub_adresses_non_match').empty().text(voies_fantoir_adresses_non_match.length+" voies FANTOIR sans rapprochement OSM")
        $('#rub_adresses_match').empty().text(voies_fantoir_adresses_match.length+" voies FANTOIR avec  rapprochement OSM")
        $('#rub_voies_fantoir_non_match').empty().text(voies_fantoir_seules_non_match.length+" voies FANTOIR sans rapprochement OSM")
        $('#rub_voies_match').empty().text(voies_fantoir_seules_match.length+" voies FANTOIR avec rapprochement OSM")
        add_header('table_adresses_non_match',true)
        add_header('table_adresses_match',true)
        add_header('table_voies_fantoir_non_match',true)
        add_header('table_voies_match',true)
        a_data_table = [[voies_fantoir_adresses_non_match,'table_adresses_non_match'],
                        [voies_fantoir_adresses_match,'table_adresses_match'],
                        [voies_fantoir_seules_non_match,'table_voies_fantoir_non_match'],
                        [voies_fantoir_seules_match,'table_voies_match']]
        for (s=0;s<a_data_table.length;s++){
            data = a_data_table[s][0];
            table = a_data_table[s][1];
            for (l=0;l<data.length;l++){
            //Fantoir
                $('#'+table).append($('<tr>').attr('id',data[l][0]).append($('<td>').addClass('cell_fantoir').text(data[l][0])))
            //Nom Fantoir
                $('#'+table+' tr:last').append($('<td>').text(data[l][1]))
            //Nom OSM
                $('#'+table+' tr:last').append($('<td>').text(data[l][2]))
                lon = data[l][3]
                lat = data[l][4]
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
                } else {
                    $('#'+table+' tr:last').append($('<td>').attr('colspan','6'))
                }
                //Statut Fantoir
                add_statut_fantoir(data[l][5])
            }
        }

        tab = check_url_for_tab()
//          var e = jQuery.Event( "click");
//          jQuery($('#rub_adresses_non_match').trigger(e))
        $('#rubriques tr td')[tab].click()
        window.location.hash="#insee="+$('#input_insee')[0].value+"&tab="+tab
        $('body').css('cursor','default');
    })
};
function check_url_for_insee(){
    pattern_insee = new RegExp('^[0-9][0-9abAB][0-9]{3}$')
    var res
    if (window.location.hash){
        if (window.location.hash.split('insee=')[1].split('&')[0]){
            if (pattern_insee.test(window.location.hash.split('insee=')[1].split('&')[0])){
                res = window.location.hash.split('insee=')[1].split('&')[0]
            } else {
                alert(window.location.hash.split('insee=')[1].split('&')[0]+' n\'est pas un code INSEE de commune\n\nAbandon')
            }
        }
    }
    return res
}
function check_url_for_tab(){
    pattern_tab = new RegExp('^[0-3]$')
    var res
    res = 0
    if (window.location.hash){
        if (window.location.hash.split('&tab=')[1]){
            if (window.location.hash.split('tab=')[1].split('&')[0]){
                if (pattern_tab.test(window.location.hash.split('tab=')[1].split('&')[0])) {
                    res = window.location.hash.split('tab=')[1].split('&')[0]
                }
            }
        }
    }
    return res
}
function update_url_tab(t){
    p1 = window.location.hash.split('&tab=')[0]
    p2=''
    if (window.location.hash.split('&tab=')[1]){
        if (window.location.hash.split('&tab=')[1].split('&')[1]){
            p2 = window.location.hash.split('&tab=')[1].split('&')[1]
        }
    }
    window.location.hash = p1+"&tab="+t+p2
    console.log(window.location.hash)
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
    $('#'+table+' tr').append($('<th>').append('Voie FANTOIR'))
    $('#'+table+' tr').append($('<th>').append('Voie OSM'))
    if (with_edit_and_map_links){
        $('#'+table+' tr').append($('<th>').attr('colspan','3').append('Cartes'))
        $('#'+table+' tr').append($('<th>').attr('colspan','3').append('Édition'))
        $('#'+table+' tr').append($('<th>').append('Statut FANTOIR ').append($('<a>').attr('href','http://wiki.openstreetmap.org/wiki/WikiProject_France/WikiProject_Base_Adresses_Nationale_Ouverte_(BANO)#Typologie_des_anomalies_FANTOIR').append('(wiki)')))
    }
}
function add_statut_fantoir(id_statut){
    $('#'+table+' tr:last').removeClass().addClass('statut'+id_statut)
    $('#'+table+' tr:last').append($('<td>').append($(a_menus_labels[id_statut]).change(function() {
        fantoir = (($(this).parents('tr'))[0].id);
        insee = fantoir.substr(0,5);
        statut = $(this)[0].value;
        $.ajax({
            // FIXME
            url: "http://cadastre.openstreetmap.fr/fantoir/statut_fantoir.py?insee="+insee+"&fantoir="+fantoir+"&statut="+statut
        })
        .done(function( data ) {
            if(data == statut){
                $('tr#'+fantoir).removeClass().addClass('statut'+statut)
            } else {
                alert("Souci lors de la mise à jour du statut. Le nouveau statut n'a pas été pris en compte")
            }
        })
    })))
}

$(document).ready(start());
