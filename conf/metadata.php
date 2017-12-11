<?php

$meta['margin'] = array('numeric');
$meta['txtsize'] = array('numeric');
$meta['titlesize'] = array('numeric');
$meta['linespacing'] = array('numeric');
$meta['colspacing'] = array('numeric');
$meta['strokewidth'] = array('numeric');
$meta['strokecolor'] = array('string');
$meta['txtcolor'] = array('string');
$meta['bgr'] = array('string');

$meta['cols_minlen'] = array('numeric');
$meta['cols_height'] = array('numeric');
$meta['cols_rectradius'] = array('numeric');
$meta['cols_fill'] = array('string');
$meta['cols_txtcolor'] = array('string');

$meta['note_margin'] = array('numeric');
$meta['note_rectradius'] = array('numeric');
$meta['note_fill'] = array('string');
$meta['note_align'] = array('multichoice', _choices => array('left','center','right'));

$meta['tooltip_txtcolor'] = array('string');
$meta['tooltip_txtsize'] = array('numeric');
$meta['tooltip_border'] = array('string');
$meta['tooltip_background'] = array('string');