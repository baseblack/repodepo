

if(!dojo._hasResource["translations.UserViewServices"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
    dojo._hasResource["tranlations.UserViewServices"] = true;
    dojo.provide("translations.UserViewServices");

(function(){

    translations.UserViewServices.phrases     = {
        'Result count': { 
	        'es_ES' : 'Número',
            'af_ZA' : 'Aantal',
            'fr_FR' : 'Total',
	  	    'ms_MY' : 'Hasil Perhitungan',
		    'nl_NL' : 'Aantal',
            'id_ID' : 'Hasil Perhitungan' 
        },
        'Date': { 
	        'es_ES' : 'Fecha',
            'af_ZA' : 'Datum',
            'fr_FR' : 'Date',
	  	    'ms_MY' : 'Tanggal',
		    'nl_NL' : 'Datum',
            'id_ID' : 'Tanggal' 
        },
        'Title': { 
	        'es_ES' : 'Título',
            'af_ZA' : 'Opsomming',
            'fr_FR' : 'Titre',
	  	    'ms_MY' : 'Judul',
		    'nl_NL' : 'Titel',
            'id_ID' : 'Judul' 
        },
        'Description': { 
	        'es_ES' : 'Descripción',
            'af_ZA' : 'Beskrywing',
            'fr_FR' : 'Description',
	  	    'ms_MY' : 'Deskripsi',
		    'nl_NL' : 'Beschrijving',
            'id_ID' : 'Deskripsi' 
        },
        'Amount': { 
	        'es_ES' : 'Importe',
            'af_ZA' : 'Bedrag',
            'fr_FR' : 'Montant',
	  	    'ms_MY' : 'Jumlah',
		    'nl_NL' : 'Bedrag',
            'id_ID' : 'Jumlah' 
        },
        'Add Extra Service': {
	        'es_ES' : 'Añadir Servicio Extra', 
            'af_ZA' : 'Voeg Dienste by',
            'fr_FR' : 'Ajouter un service supplémentaire',
	  	    'ms_MY' : 'Tambah service extra',
		    'nl_NL' : 'Extra dienst toevoegen',
            'id_ID' : 'Tambah service extra' 
        },
        'Save':{ 
	        'es_ES' : 'Guardar',
            'af_ZA' : 'Stoor',
            'fr_FR' : 'Sauver',
	  	    'ms_MY' : 'Simpan',
		    'nl_NL' : 'Opslaan',
            'id_ID' : 'Simpan' 
        },
        'Extra service added OK':{
	        'es_ES' : 'Servicio extra añadido OK', 
            'af_ZA' : 'Ekstra dienste bygevoeg',
            'fr_FR' : 'Le service supplémentaire a été ajouté avec succès',
	  	    'ms_MY' : 'Penambahan service extra berhasil',
		    'nl_NL' : 'Extra dienst succesvol toegevoegd',
            'id_ID' : 'Penambahan service extra berhasil' 
        },
        'Problems adding extra service':{ 
	        'es_ES' : 'Problemas añadiendo servicio extra',
            'af_ZA' : 'Probleme om ekstra dienste by te voeg',
            'fr_FR' : "Des problèmes sont survenus lors de l'ajout du service supplémentaire",
	  	    'ms_MY' : 'Penambahan service extra bermasalah',
		    'nl_NL' : 'Extra dienst toevoegen mislukt',
            'id_ID' : 'Penambahan service extra bermasalah' 
        },
        'No Selection made':{ 
	        'es_ES' : 'No ha seleccionado nada',
            'af_ZA' : 'Niks gekies',
            'fr_FR' : 'Aucun élément sélectionné',
	  	    'ms_MY' : 'Anda belum memilih',
		    'nl_NL' : 'Maak eerst een selectie',
            'id_ID' : 'Anda belum memilih' 
        },
        'Deleting Extra Service(s)':{ 
	        'es_ES' : 'Eliminando Servicio(s) Extra',
            'af_ZA' : 'Verwyder ekstra diens(te)',
            'fr_FR' : 'Service(s) supplémentaire(s) en cours de suppression',
	  	    'ms_MY' : 'Menghapus service extra',
		    'nl_NL' : 'Extra dienst(en) verwijderen',
            'id_ID' : 'Menghapus service extra' 
        },
        'Complete':{ 
	        'es_ES' : 'Completo',
            'af_ZA' : 'Voltooid',
            'fr_FR' : 'Terminé',
	  	    'ms_MY' : 'Komplit',
		    'nl_NL' : 'Voltooid',
            'id_ID' : 'Komplit' 
        },
        'Edit of Extra Service Limited to one' :{ 
	        'es_ES' : 'Edición de Servicio Extra Limitado a uno',
            'af_ZA' : "Slegs een op 'n slag",
            'fr_FR' : 'Un seul service supplémentaire peut être édité à la fois',
	  	    'ms_MY' : 'Edit service extra dibatasi satu',
		    'nl_NL' : 'U kunt slecht een extra dienst per keer wijzigen',
            'id_ID' : 'Edit service extra dibatasi satu' 
        },
        'Edit Extra Service':{ 
	        'es_ES' : 'Editar Servicio Extra',
            'af_ZA' : 'Verander ekstra dienste',
            'fr_FR' : 'Editer un service supplémentaire',
	  	    'ms_MY' : 'Edit service extra',
		    'nl_NL' : 'Extra dienst wijzigen',
            'id_ID' : 'Edit service extra' 
        },
        'Extra service updated OK':{ 
	        'es_ES' : 'Servicio extra actualizado OK',
            'af_ZA' : 'Ekstra dienste opgedateer',
            'fr_FR' : 'Service supplémentaire mis à jour avec succès',
	  	    'ms_MY' : 'Update service extra berhasil',
		    'nl_NL' : 'Extra dienst succesvol gewijzigd',
            'id_ID' : 'Update service extra berhasil' 
        },
        'Problems updating extra service':{ 
	        'es_ES' : 'Problemas actualizando servicio extra',
            'af_ZA' : 'Probleme met verander van ekstra dienste',
            'fr_FR' : 'Des problèmes sont survenus lors de la mise à jour du service',
	  	    'ms_MY' : 'Update service extra bermasalah',
		    'nl_NL' : 'Extra dienst wijzigen mislukt',
            'id_ID' : 'Update service extra bermasalah' 
        }
    };

})();//(function(){

}
