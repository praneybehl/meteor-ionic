IonNavigation = {
  skipTransitions: false
};

Template.ionNavView.created = function () {
  Session.setDefault('ionNavDirection', 'forward');

  if (Platform.isAndroid()) {
    this.transition = 'android';
  } else {
    this.transition = 'ios';
  }

  // Allow overriding the transition
  if (this.data && this.data.transition) {
    this.transition = this.data.transition;
  }

  if (this.transition === 'ios') {
    this.transitionDuration = 450;
  } else {
    this.transitionDuration = 200;
  }
};

Template.ionNavView.rendered = function () {
  var template = this;

  this.find('[data-nav-container]')._uihooks = {
    insertElement: function(node, next) {
      var $node = $(node);
      if (!template.transition || !$node.hasClass('view') || IonNavigation.skipTransitions) {
        $node.insertBefore(next);
        return;
      }

      $node.insertBefore(next).addClass('nav-view-entering nav-view-stage');
      Meteor.setTimeout(function() {
        $node.removeClass('nav-view-stage').addClass('nav-view-active');
      }, 16);

      Meteor.setTimeout(function () {
        $(this).removeClass('nav-view-entering');
        $('[data-nav-container]').removeClass('nav-view-direction-back').addClass('nav-view-direction-forward');
      }, template.transitionDuration + 16);
    },

    removeElement: function(node) {
      var $node = $(node);
      if (!template.transition || !$node.hasClass('view') || IonNavigation.skipTransitions) {
        $node.remove();
        return;
      }

      $node.addClass('nav-view-leaving nav-view-stage');
      Meteor.setTimeout(function() {
        $node.removeClass('nav-view-stage').addClass('nav-view-active');
      }, 16);

      Meteor.setTimeout(function () {
        $node.remove();
        Session.set('ionNavDirection', 'forward');
      }, template.transitionDuration + 16);
    }
  };
};

Template.ionNavView.helpers({
  transition: function () {
    return Template.instance().transition;
  }
});
