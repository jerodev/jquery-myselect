"use strict";

(function( $ ) {

    /**
     *  The default options for this plugin
     */
    var settings = {
        caret_down: "&#9660;",
        caret_up: "&#9650;",
        closeOnClick: false,
        container_height: "34px",
        delimiter: ", ",
        items_max_height: "240px",
        placeholder: " - Nothing selected - ",
        placeholder_x_selected: "# selected",
        width: "240px",
        x_selected_after: 4
    };


    /**
     *  The actual plugin function
     */
    $.fn.myselect = function( options ){
        
        // Extend the provided settings
        settings = $.extend( settings, options );
        
        // Add body events for closing the dropdown on blur
        $(document).unbind( 'click' );
        $(document).bind( 'click', closeSelects );
        
        // Make a new select box for each element
        return this.each(function() {
            
            // Build a new selectbox
            var html = buildSelect( this, settings );
            
            // Hide the current selectobx
            $( this ).hide();
            
            // Add the code for the new selectbox
            html.insertAfter( this );
            
        });
        
    };
    
    
    /**
     *  Build a new select box and return the html code
     */
    function buildSelect( select, settings ) {
        
        // Start with a container
        var container = $( "<div class='myselect-container'></div>" )
            .css({
                height: settings.container_height,
                lineHeight: settings.container_height,
                width: settings.width
            });
        
        // Add events to the container
        container.click( clickContainer );
        
        // Add the content
        container.append(
            $( "<div class='content'></div>" ).append(function() {
                // Any selected options?
                if ($( select ).find( 'option[selected]' ).length)
                {
                    return $( "<span></span>" ).text(
                        $( select ).find( 'option[selected]' ).length + " selected"
                    );
                }
                else
                {
                    $(this).addClass( 'empty' );
                    return $( "<span></span>" ).text( settings.placeholder );
                }
            })
            .append(
                $( "<div></div>" ).addClass( "select-caret" ).html( settings.caret_down )    
            )
        );

        // Create a dropdown container
        var ddContainer = $( "<div class='ddContainer'></div>" ).css({
            width: settings.width,
            top: settings.container_height
        });
        
        // Create an item container
        var itemContainer = $( "<ul class='itemContainer'></ul>" ).css('max-height', settings.items_max_height);
        
        // Add the items
        for (var i = 0; i < $( select ).find( 'option' ).length; i++)
        {
            var option = $( select ).find( 'option' ).eq( i );
            
            itemContainer.append(
                $( "<li></li>" ).html( option.html() )
                    .attr( 'data-value', option.attr( 'value' ) )
                    .addClass(option.is(['selected']) ? 'selected' : '')
                    .click(clickItem)
            );
        }
        
        // Merge all containers
        container = container.append(
            ddContainer.append(
                itemContainer    
            )
        );
        
        // Return the container and all components
        return container;
    }
    
    
    
    
    /**
     *  The internal click events
     */
    function clickContainer( e ) {
        
        // Prevent the closeSelects form firing
        e.stopPropagation();
        
        // CLose all other selects 
        closeSelects();
        
        // Get the container of this select
        var container = $( this );
        
        // Toggle the caret
        container.find( '.select-caret' )
            .html( container.is( ".open" ) ? settings.caret_down : settings.caret_up );
        
        // Toggle the open class
        container.toggleClass( "open" );
    }
    
    
    /**
     *  Close all dropdowns
     */
    function closeSelects() {
        $( ".myselect-container" ).each(function(){
            $( this ).removeClass( 'open' );
            $( this ).find( '.select-caret' ).html( settings.caret_down );
        });
    }
    
    
    /**
     *  Click a selectbox item
     */
    function clickItem( e ) {
        // Prevent the closeSelects form firing
        e.stopPropagation();

        // If this is not a multiselect, unselect all other options
        var select = $( this ).closest( '.myselect-container' ).prev( 'select' );
        var dit = $(this);
        var option = select.find( 'option[value=' + $(this).data( 'value' ) + ']' )
            .filter(function(){
                return this.innerHTML == dit.text();
            });
        if ( option.siblings('[selected]').length > 0 && !select.is( '[multiple]' ) )
        {
            option.siblings().removeAttr( 'selected' );
            $(this).siblings().removeClass( 'selected' );
        }
        
        // Toggle the active class
        $( this ).toggleClass( 'selected' );
        
        // toggle the selected property in the select
        if ( option.is( '[selected]' ) )
        {
            option.removeAttr( 'selected' ).prop( 'selected', false );
        }
        else
        {
            option.attr( 'selected', 'selected' ).prop( 'selected', true );
        }
        
        // Edit the selected items in the container placeholder
        var options = select.find( 'option[selected]' );
        var content = $( this ).closest( '.myselect-container' ).find( '.content' );
        if ( options.length )
        {
            // Display 'x selected' after y elements have been selected
            if (options.length <= settings.x_selected_after)
            {
                content.find("span").text( $.map( options, function( o ) { return o.innerHTML; }).join( settings.delimiter ) );
            }
            else
            {
                content.find("span").text(settings.placeholder_x_selected.replace(/#/, options.length));
            }
            
            
            content.removeClass( 'empty' );
        }
        else
        {
            content.find("span").text(settings.placeholder);
            content.addClass( 'empty' );
        }
    }

}(jQuery));