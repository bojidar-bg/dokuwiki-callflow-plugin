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

        $margin = $this->getConf('margin');
        $txtsize = $this->getConf('txtsize');
        $titlesize = $this->getConf('titlesize');
        $linespacing = $this->getConf('linespacing');
        $colspacing = $this->getConf('colspacing');
        $strokewidth = $this->getConf('strokewidth');
        $strokecolor = $this->getConf('strokecolor');
        $txtcolor = $this->getConf('txtcolor');
        $bgr = $this->getConf('bgr');

        $tooltip_txtcolor = $this->getConf('tooltip_txtcolor');
        $tooltip_txtsize  = $this->getConf('tooltip_txtsize');
        $tooltip_border   = $this->getConf('tooltip_border');
        $tooltip_background   = $this->getConf('tooltip_background');

        $JSINFO['plugin_callflow'] = array(
            'tooltip_txtcolor' => $tooltip_txtcolor,
            'tooltip_txtsize'  => $tooltip_txtsize,
            'tooltip_border'  => $tooltip_border,
            'tooltip_background'  => $tooltip_background,
            'margin' => $margin,
            'txtsize' => $txtsize,
            'titlesize' => $titlesize,
            'linespacing' => $linespacing,
            'colspacing' => $colspacing,
            'strokewidth' => $strokewidth,
            'strokecolor' => $strokecolor,
            'txtcolor' => $txtcolor,
            'bgr' => $bgr
        );
    }
}