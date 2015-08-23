(function($) {

    // Show / hide navigation on small devices
    $('.nav-trigger').click(function() {
        $(this).toggleClass('nav-trigger-a');
        $('.nav ul').toggleClass('nav-visible').slideToggle();
    })
    $(document).on('click', '.nav-visible a', function(e) {
        e.preventDefault();
        $('.nav ul').removeClass('nav-visible').slideUp();
        $('.nav-trigger').removeClass('nav-trigger-a');
    })

    // Main navigation scroll
    $('nav.nav').onePageNav({
        scrollSpeed:500,
        scrollOffset:59,
        easing:'easeInOutQuart',
        begin: function() {
            //Hack so you can click other menu items after the initial click
            $('body').append('<div id="device-dummy" style="height: 1px;"></div>');
        },
        end: function() {
            $('#device-dummy').remove();
        }
    });

    // Custom button scroll
    $(document).on('click','.btn-scroll', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        var targetOffset = $(target).offset();
        $('body').append('<div id="device-dummy" style="height: 1px;"></div>');
        $('html,body').animate({scrollTop:(targetOffset.top - 59)}, 500, 'easeInOutQuart', function() {
            $('#device-dummy').remove();
        });
    });

    // Custom scrollbars
    $('.scroll').mCustomScrollbar();

    // Skills initilaizing
    $('.skills .skill').each(function() {
        var progress = $('.val', this).text();
        $('.progress', this).width(progress);
    });

    // Hide portfolio slideshow by default
    $('.slideshow').slideUp();

    // Clone portfolio items to get a second collection for Quicksand plugin
    var $portfolioClone = $(".works").clone();
    
    // Attempt to call Quicksand on every click event handler
    $(".filter li").click(function(e){
        
        $(".filter li").removeClass("active"); 
        
        // Get the class attribute value of the clicked link
        var $filterClass = $(this).attr("class");

        if ( $filterClass == "all" ) {
            var $filteredPortfolio = $portfolioClone.find("li");
        } else {
            var $filteredPortfolio = $portfolioClone.find("li[data-type~=" + $filterClass + "]");
        }
        
        // Call quicksand
        $(".works").quicksand( $filteredPortfolio, { 
            duration: 400,
            adjustWidth: false
        });

        $(this).addClass("active");

        // Prevent the browser jump to the link anchor
        e.preventDefault();
    })

    // Show portfolio slideshow
    $(document).on('click', '.works li', function() {
        $('.slideshow').slideDown();
        var target = $(this).data('id');
        target = target.substring(3) - 1;
        $('.slideshow .slides').cycle('goto', target);
    })

    // Show / hide testimonials
    $('.testimonials .item').each(function() {
        $('.author', this).click(function() {
            $(this).parent().toggleClass('active').find('.inner', this).slideToggle();
        })
    })

    // MAP SETUP
    // Create an array of styles.
    var stylesArray = [
        {
            stylers: [
                { saturation: -100 }
                
            ]
        },{
            featureType: 'road',
            elementType: 'labels',
            stylers: [
                { visibility: 'off' }
            ]
        }
    ],
        
    // Latitude and longitude for your location goes here
    lat = 55.750497,
    lng = 37.616243,

    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    customMap = new google.maps.StyledMapType(stylesArray,
    {name: 'Styled Map'}),

    // Create a map object, and include the MapTypeId to add
    // to the map type control.
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng( lat, lng ),
        scrollwheel: false,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        }
    },
    map = new google.maps.Map(document.getElementById('map'), mapOptions),
    myLatlng = new google.maps.LatLng( lat, lng ),

    marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: "assets/img/marker.png"
    });
        
    // Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', customMap);
    map.setMapTypeId('map_style');

    // Form validation
    $(".feedback-form").validate({
        errorClass: "inp-error",
        validClass: "inp-success",
        rules: {
            email: {
                email: true
            }
        }
    });

    // Form submit
    $(".feedback-form").submit(function(e){
        $('.message', this).remove();
        if($(".feedback-form").valid()){
            e.preventDefault();
            $(this).prepend('<div class="loading"></div>');
            dataString = $(".feedback-form").serialize();
            $.ajax({
                type: "POST",
                url: "send.php",
                data: dataString,
                success: function(data) {
                    $('.feedback-form .loading').remove();
                    $('.feedback-form').prepend('<div class="message message-ok">Your message was sent successfully!</div>').find('.message').fadeIn();
                },
                error: function(data) {
                    $('.feedback-form .loading').remove();
                    $('.feedback-form').prepend('<div class="message message-error">Your message wasn\'t sent, please try again.</div>').find('.message').fadeIn();
                }
            });
        }
    });

    // Tweets custom styling
    var options = {
        "url": "assets/plugins/tweets-customize/tweets.css"
    };
    CustomizeTwitterWidget(options);

}(jQuery));

(function(doc) {

    var addEvent = 'addEventListener',
        type = 'gesturestart',
        qsa = 'querySelectorAll',
        scales = [1, 1],
        meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

    function fix() {
        meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
        doc.removeEventListener(type, fix, true);
    }

    if ((meta = meta[meta.length - 1]) && addEvent in doc) {
        fix();
        scales = [.25, 1.6];
        doc[addEvent](type, fix, true);
    }

}(document));