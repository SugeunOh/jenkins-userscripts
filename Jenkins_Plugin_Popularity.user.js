
// Before you're able to use this, you need to make http://stats.jenkins-ci.org/plugin-installation-trend/latestNumbers.json
// available on your Jenkins server. The easiest solution is to place the file in the 'userContent' folder and update it manually
// or through a script.

(function ($) {
    $.fn.addPopularity = function (pluginInfo) {
        var rows = $(this);
        rows.each(function() {
            var row = $(this);
            var pluginName = "";
            var input = $("input[type=checkbox]", this);
            if (input) {
                var name = input.attr("name");
                if (name && name.startsWith("plugin.") && name.endsWith(".default")) {
                    // is an element
                    pluginName = name.substring(7, name.length - 8);
                } else if (input.attr("url")) {
                    pluginName = input.attr("url").substring(7);
                }
            } else {
                pluginName = $(":first-child", this).attr("data");
            }
            if (pluginName == '') {
                return;
            }
            if (pluginInfo[pluginName] == undefined) {
                pluginInfo[pluginName] = 0;
            }
            // optionally hide plugins with fewer than a specific number of plugins
            // XXX only really makes sense on the 'Available' tab!
            //if (pluginInfo[pluginName] < 2500) {
            //    row.remove();
            //    return;
            //}
            row.append("<td data=" + pluginInfo[pluginName] + ">" + pluginInfo[pluginName] + "</td>");
        });
    };
})(jQuery);


jQuery(document).ready(function(){
    jQuery.noConflict();
    jQuery('table#plugins tr:first-of-type').append("<th onclick='showhideCategories(this,0);'>Installations</th>");

    /*
     * CONFIGURE THIS LINE TO POINT TO THE JSON FILE WITH CURRENT INSTALLATION NUMBERS
     */
    jQuery.getJSON("/userContent/latestNumbers.json", function(data, status) {
        var pluginInfo = data.plugins;
        jQuery('table#plugins tr').addPopularity(pluginInfo);
    });
    
    // tr.plugin only on first two tabs..
    jQuery('table#plugins tr.plugin-category').each(function() {
        $(this).attr('colspan', 5);
    });
});
