<?
class Distribution extends AppModel {
    var $name       = 'Distribution';

    var $belongsTo = array(
        'Repoarches' => array(
            'className'    => 'Repoarches',
            'foreignKey'    => 'repoarch_id'
        )
    );

}
?>
