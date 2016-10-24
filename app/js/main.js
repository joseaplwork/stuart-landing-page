$(document).ready(function() {

  // Mobile menu
  $('.st-nav-toggle').click(function(e) {
    e.preventDefault();
    $('.st-nav').toggleClass('open');
  });
  
  // Desktop menu
  $('.st-nested-nav').click(function(e) {
    e.preventDefault();
    $(this).find('.st-sub-menu').toggleClass('open');
  });

  $('.st-nested-nav').focusout(function (e) {
    e.preventDefault();
    if ($(this).has(document.activeElement).length == 0) {
      $(this).find('.st-sub-menu').removeClass('open');
    }
  });
});