<?php


if(!defined('DOKU_INC')) die();  // no Dokuwiki, no go

class action_plugin_callflow extends DokuWiki_Action_Plugin
{
    /**
     * Register the handle function in the controller
     *
     * @param Doku_event_handler $controller The event controller
     */
    function register(Doku_Event_Handler $controller)
    {
        $controller->register_hook('DOKUWIKI_STARTED', 'AFTER', $this, 'addconfig2js');
    }


    /**
     * @param $event
     * @param $params
     */
    function addconfig2js ($event, $params) {
        global $JSINFO;

        $JSINFO['plugin_callflow'] = array(
            'tooltip_txtcolor' => $this->getConf('tooltip_txtcolor'),
            'tooltip_txtsize'  => $this->getConf('tooltip_txtsize'),
            'tooltip_border'  => $this->getConf('tooltip_border'),
            'tooltip_background'  => $this->getConf('tooltip_background'),
            'margin' => $this->getConf('margin'),
            'txtsize' => $this->getConf('txtsize'),
            'titlesize' => $this->getConf('titlesize'),
            'linespacing' => $this->getConf('linespacing'),
            'colspacing' => $this->getConf('colspacing'),
            'strokewidth' => $this->getConf('strokewidth'),
            'strokecolor' => $this->getConf('strokecolor'),
            'txtcolor' => $this->getConf('txtcolor'),
            'bgr' => $this->getConf('bgr'),
            'note_margin' => $this->getConf('note_margin'),
            'note_rectradius' => $this->getConf('note_rectradius'),
            'note_fill' => $this->getConf('note_fill'),
            'note_align' => $this->getConf('note_align'),
            'cols_minlen' => $this->getConf('cols_minlen'),
            'cols_height' => $this->getConf('cols_height'),
            'cols_rectradius' => $this->getConf('cols_rectradius'),
            'cols_fill' => $this->getConf('cols_fill'),
            'cols_txtcolor' => $this->getConf('cols_txtcolor')

        );
    }
}