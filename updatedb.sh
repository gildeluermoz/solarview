#!/bin/bash

'''
Ce script charge automatiquement les données météo sur le site de Météo France pour les mois utiles 
puis il contruit et peuple la base de données.
Les mois utiles sont les mois depuis les variables startyear et startmonth ci-dessous
Bien penser à copier les données de la régulation manuellement dans le répertoire 
"static/data/regul" avant de lancer celui-ci.
'''

appPath='/home/gil/solaire'

echo 'Téléchargement des données de météo France'
startyear=2017
startmonth=04
currentyear="`date +%Y`"
currentmonth="`date +%m`"
y=$startyear
arraym=( 01 02 03 04 05 06 07 08 09 10 11 12)

while [ $y -le $currentyear ]
do
    
    for m in "${arraym[@]}"
    do
        if  ([ $y -eq $startyear ] && [ $m -ge $startmonth ]) || ([ $y -lt $currentyear ] && [ $y -gt $startyear ]) || ([ $y -eq $currentyear ] && [ $m -le $currentmonth ]) ; then
            if [ ! -f 'static/data/meteofrance/synop.'$y$m'.csv' ] ; then
                wget 'https://donneespubliques.meteofrance.fr/donnees_libres/Txt/Synop/Archive/synop.'$y$m'.csv.gz' -P static/data/meteofrance
                gunzip -d 'static/data/meteofrance/synop.'$y$m'.csv.gz'
            else
                echo 'synop.'$y$m'.csv' exists
            fi
        fi
    done
    y=$[$y+1]
done
for i in "${array[@]}"
do
    if [ ! -f 'static/data/meteofrance/synop.2018'$i'.csv' ]
    then
        url='https://donneespubliques.meteofrance.fr/donnees_libres/Txt/Synop/Archive/synop.2018'$i'.csv.gz'
        if `validate_url $url >/dev/null`; then  
            wget $url -P static/data/meteofrance
            gunzip -d 'static/data/meteofrance/synop.2018'$i'.csv.gz'
        else 
            echo "synop.2018"$i" does not exist"
        fi
    else
        echo $i exists
    fi
done

cd static/data/
echo 'Créaton de la base de données à partir des fichiers de la régulation solaire'
./import_data_regul.py $appPath"/static/data/solar.db" $appPath"/static/data/regul/"
echo 'Done !'

echo 'Import dans la base de données des données Météo France'
./import_data_mf.py $appPath"/static/data/solar.db" $appPath"/static/data/meteofrance/"
echo 'Done !'
cd ../..
