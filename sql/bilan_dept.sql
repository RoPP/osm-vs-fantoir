WITH v AS (SELECT insee_com,count(distinct fantoir) voies_rapprochees FROM cumul_voies WHERE insee_com like '38___' GROUP BY insee_com),
a AS (SELECT insee_com,count(distinct fantoir) voies_avec_adresses_rapprochees FROM cumul_adresses WHERE insee_com like '38___' GROUP BY insee_com),
t AS (SELECT code_insee,count(*) voies_fantoir FROM fantoir_voie WHERE code_insee like '38___' AND type_voie in ('1','2') GROUP BY code_insee)
--tl AS (SELECT code_insee,count(*) voies_fantoir FROM fantoir_voie WHERE code_insee like '38___' AND type_voie in ('1','2','3') GROUP BY code_insee)
SELECT v.insee_com "Code INSEE",c.nom "Commune",a.voies_avec_adresses_rapprochees "Voies avec adresses rapprochées",v.voies_rapprochees "Toutes voies rapprochées",t.voies_fantoir "Voies FANTOIR",((a.voies_avec_adresses_rapprochees*100/t.voies_fantoir))::integer "Pourcentage de rapprochement"
--tl.voies_fantoir "Voies et lieux-dits FANTOIR"
FROM v
JOIN communes c
ON v.insee_com = c.insee
JOIN a
ON v.insee_com = a.insee_com
JOIN t
ON v.insee_com = t.code_insee
--JOIN tl
--ON v.insee_com = tl.code_insee
ORDER  BY 6
--ORDER BY (voies_rapprochees / t.voies_fantoir) desc
