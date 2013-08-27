<?php
/**
 * Plugin for making callflow diagrams
 *
 * @note the js uses SVG/VXML from Raphaël.js @link:raphaeljs.com
 *
 * @author Bojidar Marinov <bojidar.marinov.bg@gmail.com>
 */
class syntax_plugin_callflow extends DokuWiki_Syntax_Plugin {

	function getType(){return "protected";}

	function getSort(){return 151;}

	function connectTo($mode){$this->Lexer->addEntryPattern('<callflow>(?=.*?</callflow>)',$mode,'plugin_callflow');}
	
	function postConnect() { $this->Lexer->addExitPattern('</callflow>','plugin_callflow'); }
	/**
	* Handle the match
	*/
	function handle($match, $state, $pos, &$handler)
	{
		switch ($state) {
			case DOKU_LEXER_ENTER :
			return array($state, array($state, $match));
			case DOKU_LEXER_UNMATCHED :  return array($state, $match);
			case DOKU_LEXER_EXIT :       return array($state, '');
		}
		return array();
	}

	/**
	* Create output
	*/
	function render($mode, &$renderer, $data)
	{
	// $data is what the function handle return'ed.
		if($mode == 'xhtml'){
			list($state,$match) = $data;
			switch ($state) {
				case DOKU_LEXER_ENTER :      $renderer->doc .= "<pre callflow='true' style='border: none; box-shadow: none;background-color: #fff;'>"; break;
				case DOKU_LEXER_UNMATCHED :  $renderer->doc .= $renderer->_xmlEntities($match); break;
				case DOKU_LEXER_EXIT :       $renderer->doc .= "</pre>"; break;
			}
			return true;
		}
		return false;
	}
	
}
