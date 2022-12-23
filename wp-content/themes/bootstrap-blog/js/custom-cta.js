//Custom CTA
jQuery(function ($) {
  var customCTA = function () {
    $(".ut-custom-cta a.custom-cta-button").on("click", function (e, o) {
      let _this = $(this);
      let eventCat = $.trim(_this.data("eventCat"));
      let eventAction = $.trim(_this.data("eventAction"));
      let eventLabel = $.trim(_this.data("eventLabel"));

      if (
        typeof eventCat !== "undefined" &&
        typeof eventAction !== "undefined" &&
        typeof eventLabel !== "undefined" &&
        typeof uwGTM !== "undefined"
      ) {
        uwGTM.send("event", eventCat, eventAction, eventLabel, {
          data: {
            ux_element_type: "Custom CTA",
            ux_element_name: "Custom CTA",
          },
        });
      }
    });
  };

  $(document).ready(function () {
    customCTA();
  });
});
