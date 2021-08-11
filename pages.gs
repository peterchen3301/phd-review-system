/*
 * pages.gs
 * 
 */

function setPage(page) {

  var ps=PropertiesService.getUserProperties();

  ps.setProperty('PageTitle', page);

  return ps.getProperty('PageTitle');

}


function initPage() {

  var ps=PropertiesService.getUserProperties();

  ps.setProperty('PageTitle','');

  return ps.getProperty('PageTitle');

}


function getPage() {

  var ps=PropertiesService.getUserProperties();

  var pt=ps.getProperty('PageTitle');

  return pt;

}
