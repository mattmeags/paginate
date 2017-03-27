(function($){
  $.fn.pagination = function(options){
    var settings = $.extend({
      numItems: 5,
      moveItems: this.numItems,
      buttons: false
    }, options);
    Pagination.setDefault(settings.numItems,  this.selector, settings.buttons);
    $(document).on('click', '.next', function(){
        Pagination.nextClick(settings.numItems);
    }).on('click', '.prev', function(){
        Pagination.previousClick(settings.numItems);
    }).on('click', '.pagination-button', function(){
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
  setDefault: function(numItems, wrapper, buttons) {
    var counter = 0,
        max;
    $('.item').each(function(){
      counter++;
      if(counter > numItems) {
        $(this).addClass('visually-hidden');
      }
    });

    //TODO: style buttons
    $(wrapper).prepend("<div class='prev'>Previous</div>").append("<div class='next'>Next</div>");
    this.totalItemsNumber = counter;
    max = (this.totalItemsNumber / numItems) - 1;
    this.maxNumberClicks = Math.ceil(max);

    if (buttons === true) {
      var buttons = (counter / numItems) + 1;

      this.addButtons(buttons, wrapper);
    }

  },

  nextClick: function(numItems){
    if (this.maxNumberClicks > this.clickCounter) {

      this.clickCounter++;

      this.paginate(numItems, 0);
    }
  },

  previousClick: function(numItems){
    if (this.clickCounter > 0) {

      this.clickCounter--;

      this.paginate(numItems, 0);
    }
  },

  paginate: function(numItems, button) {

    if (button != 0){
      var endPoint =  numItems * button,
        startPoint = (endPoint - numItems) + 1,
        counter = 0;
    } else {
      var startPoint = (numItems * this.clickCounter) + 1,
          endPoint = (startPoint + numItems) - 1
          counter = 0;
    }

    $('.item').each(function(){

      counter++;
      if (counter >= startPoint && counter <= endPoint) {
        $(this).removeClass('visually-hidden').addClass('active');
      } else {
        $(this).addClass('visually-hidden');
      }
    });
  },

  addButtons: function(numButtons, wrapper) {
      $(wrapper).append('<div class="pagination-buttons"></div>');
      for (var i = 1; i < numButtons; i++) {
        //alert(i);
        $('.pagination-buttons').append('<div class="pagination-button" data-control="'+i+'">' + i + '</div>');
      }
  },

  paginationButtonClick: function (button, numItems) {
    var button = $(button).attr('data-control');
    this.clickCounter = button - 1;

    this.paginate(numItems, button);
  }
};
