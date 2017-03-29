(function($){
  $.fn.pagination = function(options){
    var settings = $.extend({
      numItems: 5,
      moveItems: this.numItems,
      buttons: true,
      className: 'item',
      sliderButtons: false,
      fullButtons: true,
      wrapper: this.selector

    }, options);

    Pagination.setDefault(settings);
    $(document).on('click', '.next', function(){
        Pagination.nextClick(settings.numItems);
    }).on('click', '.prev', function(){
        Pagination.previousClick(settings.numItems);
    }).on('click', '.number', function(){
        Pagination.paginationButtonClick($(this), settings.numItems);
    });
    return this;
  };
}(jQuery));

var Pagination = {
  clickCounter: 0,
  maxNumberClicks: 0,
  totalItemsNumber: 0,
  numItems: 0,
  className: '',

  setDefault: function(settings) {
    var counter = 0,
        max,
        numItems = settings.numItems,
        wrapper = settings.wrapper,
        buttons = settings.buttons,
        className = settings.className,
        sliderButtons = settings.sliderButtons,
        fullButtons = settings.fullButtons;

    this.className = this.classify(className);

    $(this.className).each(function(){
      counter++;
      if(counter > numItems) {
        $(this).addClass('visually-hidden');
      }
    });

    //TODO: style buttons
    if (sliderButtons === true) {
        $(wrapper).prepend("<div class='prev slider-button'></div>").append("<div class='next slider-button'></div>");
    }
    this.totalItemsNumber = counter;
    max = (this.totalItemsNumber / numItems) - 1;
    this.maxNumberClicks = Math.ceil(max);

    if (buttons === true) {
      var buttons = (counter / numItems) + 1;

      this.addButtons(buttons, wrapper, fullButtons);
    }

  },

  nextClick: function(numItems){

    if (this.maxNumberClicks > this.clickCounter) {

      this.clickCounter++;

      this.buttonKeepUp(true);

      this.paginate(numItems, 0);
    }
  },

  previousClick: function(numItems){
    if (this.clickCounter > 0) {

      this.clickCounter--;

      this.buttonKeepUp(false);

      this.paginate(numItems, 0);
    }
  },

  paginate: function(numItems, button, className) {

    if (button != 0){
      var endPoint =  numItems * button,
        startPoint = (endPoint - numItems) + 1,
        counter = 0;
    } else {
      var startPoint = (numItems * this.clickCounter) + 1,
          endPoint = (startPoint + numItems) - 1
          counter = 0;
    }

    $(this.className).each(function(){

      counter++;
      if (counter >= startPoint && counter <= endPoint) {
        $(this).removeClass('visually-hidden').addClass('active');
      } else {
        $(this).addClass('visually-hidden');
      }
    });
  },

  addButtons: function(numButtons, wrapper, fullButtons) {
      $(wrapper).append('<div class="pagination-buttons"></div>');
      if (fullButtons === true) {
        //find unique class to make each pagination-button
         $('.pagination-buttons').append('<div class="pagination-button prev">&laquo;</div>');
      }
      for (var i = 1; i < numButtons; i++) {
        if (i == 1){
            $('.pagination-buttons').append('<div class="pagination-button number active" data-control="'+i+'">' + i + '</div>');
        } else {
            $('.pagination-buttons').append('<div class="pagination-button number" data-control="'+i+'">' + i + '</div>');
        }
      }
      if (fullButtons === true) {
         $('.pagination-buttons').append('<div class="pagination-button next">&raquo;</div>');
      }
  },

  paginationButtonClick: function (button, numItems) {
    $('.active').removeClass('active');
    button.addClass('active');

    var button = $(button).attr('data-control');

    this.clickCounter = button - 1;

    this.paginate(numItems, button);
    },

    classify: function (className) {
        className = "." + className;
        return className;
    },

    buttonKeepUp: function (direction)  {
        var $next = $('.active').next(),
            $prev = $('.active').prev();
        $('.active').removeClass('active');
        if (direction == true) {
            //code for next
            $next.addClass('active');
        }
        if (direction == false) {
            //code for previous
            $prev.addClass('active');
        }
    }
};
