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

  context : {
      buttons: true,
      full: true,
      numButtons: 0
  },

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
    //this.totalItemsNumber = counter;
    this.totalItemsNumber =
    max = (this.totalItemsNumber / numItems) - 1;
    this.maxNumberClicks = Math.ceil(max);

    if (buttons === true) {
      var buttons = (counter / numItems)+1;

      this.context.numButtons = buttons;

      this.addButtons(buttons, wrapper, fullButtons);
    }
    this.cacheDom();
  },

  cacheDom: function() {
      this.$active = $('.active');
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

//TODO: handle bars input
  addButtons: function(numButtons, wrapper, fullButtons) {

      if (fullButtons === false) {
          this.context.full = false;
      }

      this.handlebarsHelpers();

     var source = $("#entry-template").html(),
         template = Handlebars.compile(source),
         html = template(this.context);

        $(wrapper).append(html);

     /* var source,
      tempalte;
      $.ajax({
         url: 'buttons.handlebars',
         cache: true,
         success: function(data) {
             source = data;
             template = Handlebars.compile(source);
             $(wrapper).append(tempalte);
         }
     });*/

  },

  handlebarsHelpers: function(){
    Handlebars.registerHelper('times', function(n, block){
        var accum = '';
        for(var i = 2; i < n; ++i) {
            accum += block.fn(i);
        }
        return accum;
    });

    Handlebars.registerHelper('checkFirst', function(m, options){
        if(m == 1){
            return options.fn(true, m);
        }
    });
  },

  paginationButtonClick: function (button, numItems) {
    this.$active.removeClass('active');
    button.addClass('active');

    var button = $(button).attr('data-control');

    this.clickCounter = button - 1;

    this.paginate(numItems, button);

    this.cacheDom();
    },

    classify: function (className) {
        className = "." + className;
        return className;
    },

    buttonKeepUp: function (direction)  {
        var $next = this.$active.next(),
            $prev = this.$active.prev();
        this.$active.removeClass('active');
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
