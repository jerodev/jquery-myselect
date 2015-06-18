/**
 * jQuery myselect v0.1
 *
 * Author:  Jeroen Deviaene
 * Docs:    https://jerodev.github.io/jquery-myselect
 *
 * Released under the MIT license
 * https://github.com/jerodev/jquery-myselect/blob/master/LICENCE.md
 */

(function( $ ) {
    
    "use strict";

    /**
     *  The default options for this plugin
     */
    var defaults = {
        caret_down: "&#9660;",
        caret_up: "&#9650;",
        closeOnClick: false,
        container_height: "34px",
        delimiter: ", ",
        items_max_height: "240px",
        placeholder: " - Nothing selected - ",
        placeholder_x_selected: "# selected",
        width: "240px",
        x_selected_after: 4,
        
        onChange: null,
        onRender: null,
        onRendered: null
    };


    /**
     *  The actual plugin function
     */
    $.fn.myselect = function( options ){
        
        // Get the myselect settings
        var settings = {};
        if ( typeof options != "string" )
        {
            // Extend the provided settings
            settings = $.extend( settings, defaults, options );
        }
        else if ( $( this ).data( 'myselect' ) )
        {
            // Find the existing settings
            settings = $( this ).data( 'myselect' );
        }
        
        // Add body events for closing the dropdown on blur
        $(document).unbind( 'click' );
        $(document).bind( 'click', closeSelects );
        
        // Make a new select box for each element
        return this.each(function() {
            
            if ( typeof options == "string" )
            {
                callMethod( options, this, settings );
            }
            else
            {
                // Add the options to the select element
                $( this ).data( 'myselect', settings );
                
                // Build the select box
                buildSelect( this, settings );
            }
            
        });
        
    };
    
    
    /**
     *  Get the myselectbox and add it to the DOM
     */
    function buildSelect( select, settings ) {
        // Call the render event
        callCallback( settings.onRender, select );

        // Remove existing myselect boxes for this select before rendering a new one.
        if ( $( select ).next().is( '.myselect-container' ) )
            $( select ).next().remove();
        
        // Build a new selectbox
        var html = buildSelectHtml( select, settings );
        
        // Hide the current selectobx
        $( select ).hide();
        
        // Add the code for the new selectbox
        html.insertAfter( select );
        
        // Call the rendered event
        callCallback( settings.onRendered, select, html.get( 0 ) );
    }
    
    
    /**
     *  Build a new select box and return the html code
     */
    function buildSelectHtml( select, settings ) {
        
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
                    return $( "<span></span>" ).text( getPlaceholder( $( select ) ) );
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
        for ( var i = 0; i < $( select ).find( 'option' ).length; i++ )
        {
            var option = $( select ).find( 'option' ).eq( i );
            
            itemContainer.append(
                $( "<li></li>" ).html( option.html() )
                    .attr( 'data-value', option.attr( 'value' ) )
                    .addClass( option.is( '[selected]' ) ? 'selected' : '' )
                    .click( clickItem )
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
     *  Call a callback function, if it exists
     */
    function callCallback( callback, select, container ) {
        // If this callback is set, execute it!
        if ( callback )
            callback( select, container );
    }
    
    
    /**
     *  Call a special method on the myselect box
     */
    function callMethod( method, select, settings ) {
        switch ( method )
        {
            case "destroy":
                callMethodDestroy( select );
                break;
            
            case "rebuild": 
                buildSelect( select, settings );
                break;
            
            default:
                break;
        }
    }
    
    
    /**
     *  Destroy an existing myselect box and show the default select
     */
    function callMethodDestroy( select ) {
        if ( $( select ).data( 'myselect' ) )
        {
            $( select ).next( '.myselect-container' ).remove();
            $( select ).data( 'myselect', null );
            $( select ).show();
        }
    }
    
    
    /**
     *  The internal click events
     */
    function clickContainer( e ) {
        
        // Prevent the closeSelects form firing
        e.stopPropagation();
        e.preventDefault();
        
        // Get the container of this select
        var container = $( e.target );
        var select = container.prev( 'select' );
        
        // Is the current container open?
        var open = container.is( '.open' );
        
        // CLose all other selects 
        closeSelects();
        
        // Toggle the caret
        container.find( '.select-caret' )
            .html( open ? getSettings( select ).caret_down : getSettings( select ).caret_up );
        
        // Toggle the open class
        if ( open )
        {
            container.removeClass( "open" );
        }
        else
        {
            container.addClass( "open" );
        }
    }
    
    
    /**
     *  Click a selectbox item
     */
    function clickItem( e ) {
        // Prevent the closeSelects form firing
        e.stopPropagation();

        // If this is not a multiselect, unselect all other options
        var $dit = $( e.target );
        var $select = $dit.closest( '.myselect-container' ).prev( 'select' );
        var $option = $select.find( 'option[value=' + $dit.data( 'value' ) + ']' )
            .filter(function() {
                return this.innerHTML == $dit.text();
            });
        if ( $option.siblings( '[selected]' ).length > 0 && !$select.is( '[multiple]' ) )
        {
            $option.siblings().removeAttr( 'selected' );
            $dit.siblings().removeClass( 'selected' );
        }
        
        // Toggle the active class
        $dit.toggleClass( 'selected' );
        
        // toggle the selected property in the select
        if ( $option.is( '[selected]' ) )
        {
            $option.removeAttr( 'selected' ).prop( 'selected', false );
        }
        else
        {
            $option.attr( 'selected', 'selected' ).prop( 'selected', true );
        }
        
        // Edit the selected items in the container placeholder
        var $options = $select.find( 'option[selected]' );
        var $content = $dit.closest( '.myselect-container' ).find( '.content' );
        if ( $options.length )
        {
            // Display 'x selected' after y elements have been selected
            if ( $options.length <= getSettings( $select ).x_selected_after )
            {
                $content.find("span").text( $.map( $options, function( o ) { return o.innerHTML; }).join( getSettings( $select ).delimiter ) );
            }
            else
            {
                $content.find("span").text( getSettings( $select ).placeholder_x_selected.replace( /#/, $options.length ) );
            }
            
            
            $content.removeClass( 'empty' );
        }
        else
        {
            $content.find("span").text( getPlaceholder( $select ) );
            $content.addClass( 'empty' );
        }
        
        // Close the selectbox if there is a close on click
        if ( getSettings($select).closeOnClick && !$select.is( '[multiple]' ) )
            closeSelects( $select );
            
        // Call the onchange event
        callCallback( getSettings($select).onChange, $select.get( 0 ), $select.next( '.myselect-container' ).get( 0 ) );
    }
    
    
    /**
     *  Close all dropdowns
     */
    function closeSelects( $select ) {
        if ( $select instanceof jQuery )
        {
            var container = $( $select ).next('.myselect-container');
            container.removeClass( 'open' );
            container.find( '.select-caret' ).html( getSettings( $select ).caret_down );
        }
        else
        {
            $( ".myselect-container" ).each(function() {
                $( this ).removeClass( 'open' );
                $( this ).find( '.select-caret' ).html( getSettings( $( this ).prev( 'select' ) ).caret_down );
            });
        }
    }
    
    
    /**
     *  Get the placeholder for this select element
     */
    function getPlaceholder( $select ) {
        if ( $select.attr( 'data-placeholder' ) )
            return $select.data( 'placeholder' );
        else
            return getSettings( $select ).placeholder;
    }
    
    
    /**
     *  Get the options for a certain select box
     */
    function getSettings( select ) {
        // Get the options object
        return $( select ).data( 'myselect' );
    }

}( jQuery ) );