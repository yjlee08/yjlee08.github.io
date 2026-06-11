$(document).ready(function() {

  // Variables
  var $codeSnippets = $('.code-example-body'),
      $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      $popoverLink = $('[data-popover]'),
      navOffsetTop = $nav.offset().top,
      $document = $(document),
      entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      }

  function init() {
    $window.on('scroll', onScroll)
    $window.on('resize', resize)
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
    $('a[href^="#"]').on('click', smoothScroll)
    buildSnippets();
    initTypewriter();
    initFilterNav();
    initLightbox();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#elementtoScrollToID").offset().top
    }, 2000);
});

  function resize() {
    $body.removeClass('has-docked-nav')
    navOffsetTop = $nav.offset().top
    onScroll()
  }

  function onScroll() {
    if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }

  function initTypewriter() {
    var phrases = [
      "How do we push the limits of AI, design it around human needs, and ensure our purpose remains ethical?"
    ];
    
    var phraseIndex = 0;
    var characterIndex = 0;
    var isDeleting = false;
    var $textEl = $("#typewriter-text");
    
    if ($textEl.length === 0) return;

    function type() {
      var currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        characterIndex--;
        $textEl.text(currentPhrase.substring(0, characterIndex));
        
        if (characterIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, 30);
        }
      } else {
        characterIndex++;
        $textEl.text(currentPhrase.substring(0, characterIndex));
        
        if (characterIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(type, 2500);
        } else {
          setTimeout(type, 75);
        }
      }
    }
    
    type();
  }


  function initFilterNav() {
    $('.filter-btn').click(function() {
      var filterValue = $(this).attr('data-filter');
      
      // Update active button state
      $('.filter-btn').removeClass('active');
      $(this).addClass('active');
      
      // Filter cards with a smooth fade effect
      if (filterValue === 'all') {
        $('.custom-card').removeClass('hidden');
      } else {
        $('.custom-card').each(function() {
          if ($(this).hasClass(filterValue)) {
            $(this).removeClass('hidden');
          } else {
            $(this).addClass('hidden');
          }
        });
      }
    });
  }

  function initLightbox() {
    // Open Lightbox
    $('.custom-card.cert-card .card-img-container').click(function(e) {
      e.preventDefault();
      var $img = $(this).find('img');
      var src = $img.attr('src');
      var title = $(this).siblings('.card-title').text();
      var org = $(this).siblings('.card-meta').text();
      
      if (src) {
        $('.lightbox-img').attr('src', src);
        $('.lightbox-caption').html('<strong>' + title + '</strong><br/><span style="font-size:0.85em;color:#ccc;">' + org + '</span>');
        $('.lightbox-modal').addClass('active');
      }
    });

    // Close Lightbox
    $('.lightbox-close, .lightbox-modal').click(function(e) {
      if ($(e.target).hasClass('lightbox-img') || $(e.target).hasClass('lightbox-caption') || ($(e.target).closest('.lightbox-content').length && !$(e.target).hasClass('lightbox-close'))) {
        return;
      }
      $('.lightbox-modal').removeClass('active');
    });
  }

  init();

});