
/* response init */
const message = {
  status: 500,
  error: null,
  date: null,
  metadata: {
    url: null,
    host: null,
    builtinDomain: null,
    version: null,
    template: null,
    devMode: null,
    ajaxLoading: null,
    fluidEngine: null,
    siteTitle: null,
    pageTitle: null,
    description: null,
    thumbnail: null,     
    firstPaint: null,
    firstContentfulPaint: null,
    blockCount: null,
    sectionCount: null
  },
  content: {
    customFavicon: null,
    fonts: [],
    colors: [],
    contrast: [],
    custom404: null,
    placeholder: [],
    spellcheck: [],
    emptyHeadings: [],
    ambiguousLinkText: [],
    sameWindowLinks: [],
    emptyLinks: [],
    missingAltText: [],
    poorAltText: [],
    largeGalleries: [],
    brokenForms: [],
    checkoutTerms: null,
    checkoutReturn: null,
    checkoutPrivacy: null,
    outdatedLibraries: [],
    https: null,
    escapeLogin: null,
    ampEnabled: null,
    preventClickjacking: null,
    cookieNotice: null,
    analyticsCookies: null,
    badge: null
  },
  sitemap: null
};



$("#sitePrompt button").click(function(){

  $("#sitePrompt, #reportTitle").hide();
  $("#status h1").text("Loading...");
  $("#status").fadeIn(2000);
  
  var url = $("#sitePrompt input").val();

	var loading1 = setTimeout(displayLoading, 5000, "Scanning website... hang tight!", false);
	var loading2 = setTimeout(displayLoading, 15000, "Still loading...", false);
	var loading3 = setTimeout(displayLoading, 40000, "Hmm, this is taking longer than expected...", false);
  var timeout = setTimeout(displayLoading, 65000, "[Timeout] Hmm, something went wrong. Please try again later.", true);

  function doneLoading(){
    $("#status").hide();
    clearTimeout(loading1);
    clearTimeout(loading2);
    clearTimeout(loading3);
    clearTimeout(timeout);
  }

	function displayLoading(loadMessage, timeout) {
		$("#status h1").fadeOut("slow", function(){
		  $("#status h1").html(loadMessage).fadeIn("slow");
		});
    if(timeout == true){
      $(".spinner").hide();
    }
	}

  $.get("https://site-audit-b3hxntgzxa-uk.a.run.app/?url=" + url, function(data, statusText){

  })
  .done(function(data) {
    displayResults(data);
    console.log(data);
  })
  .fail(function(jqXHR) {
    doneLoading();
    $("#status h1").text("[" + jqXHR.statusText + "] Hmm, something went wrong. Please try again later.");
  });
});

$("#sitePrompt input").on('keypress', function (e) {
  if(e.which === 13){
      $("#go").click();
  }
});


function displayResults(message){

    $("#results").fadeIn();
    $("header").addClass("fixed");
    $("footer").removeClass("fixed");
    $("#reportTitle").text(message.metadata.host).show();
    $("header #reportOptions").prepend("<p>Generated " + message.date + "</p>").fadeIn();

    // METADATA
    if(message.metadata.version != null){

      let metadataBento = "";

      if(message.metadata.version != null){ // version
        metadataBento += "<div class='bento info'><img src='../icons/version.png' alt='' class='icon'><strong>Version</strong>" + message.metadata.version + "</div>";
      }
      if(message.metadata.template != null /*&& message.metadata.template != "7.1"*/){ // template family
        metadataBento += "<div class='bento info'><img src='../icons/template.png' alt='' class='icon'><strong>Template Family</strong>" + message.metadata.template + "</div>";
      }
      if(message.metadata.builtinDomain != null){ // built-in domain
        metadataBento += "<div class='bento info'><img src='../icons/domain.png' alt='' class='icon'><strong>Built-In Domain</strong>" + message.metadata.builtinDomain + "</div>";
      }
      if(message.metadata.firstPaint != null){
        if(message.metadata.firstPaint != null){ // first paint
          metadataBento += "<div class='bento info'><img src='../icons/paint.png' alt='' class='icon'><strong>First Paint</strong>" + Math.round(message.metadata.firstPaint / 100) / 10 + " seconds</div>";
        }
      }
      if(message.metadata.blockCount != null){ // block count
        metadataBento += "<div class='bento info'><img src='../icons/blocks.png' alt='' class='icon'><strong>Blocks on Page</strong>" + message.metadata.blockCount + "</div>";
      }
      if(message.metadata.sectionCount != null /*&& message.metadata.template == "7.1"*/){ // section count
        metadataBento += "<div class='bento info'><img src='../icons/sections.png' alt='' class='icon'><strong>Sections on Page</strong>" + message.metadata.sectionCount + "</div>";;
      }
      if(message.metadata.devMode != null){ // dev mode
        if(message.metadata.devMode == true){
          metadataBento += "<div class='bento pass'><img src='../icons/devmode.png' alt='' class='icon'><strong>Dev Mode</strong>Active</div>";
        }
        else if(message.metadata.devMode == false){
          metadataBento += "<div class='bento fail'><img src='../icons/devmode.png' alt='' class='icon'><strong>Dev Mode</strong>Deactivated</div>";
        }
      }
      if(message.metadata.ajaxLoading != null){ // ajax loading
        if(message.metadata.ajaxLoading == true){
          metadataBento += "<div class='bento pass'><img src='../icons/ajax.png' alt='' class='icon'><strong>AJAX Loading</strong>Active</div>";
        }
        else if(message.metadata.ajaxLoading == false){
          metadataBento += "<div class='bento fail'><img src='../icons/ajax.png' alt='' class='icon'><strong>AJAX Loading</strong>Deactivated</div>";
        }
      }
      if(message.metadata.fluidEngine != null){ // fluid engine
        if(message.metadata.fluidEngine == true){
          metadataBento += "<div class='bento pass'><img src='../icons/fluid.png' alt='' class='icon'><strong>Fluid Engine</strong>Active</div>";
        }
        else if(message.metadata.fluidEngine == false){
          metadataBento += "<div class='bento fail'><img src='../icons/fluid.png' alt='' class='icon'><strong>Fluid Engine</strong>Deactivated</div>";
        }
      }

      appendResults("info", {
        tags: [],
        title: "Metadata",
        desc: metadataBento
      });
    }

    // SITE PREVIEWS
    if(message.metadata.pageTitle != null){
      let preview = "<h4>Browser Preview:</h4><div id='browserPreview'><img src='https://" + message.metadata.host + "/favicon.ico'>" + message.metadata.pageTitle + "</div>";
      preview += "<h4>Search Engine Preview:</h4><div id='searchPreview'><span>" + message.metadata.url + "</span><strong>" + message.metadata.pageTitle + "</strong>";
      if(message.metadata.description != null){
        preview += "<p>" + message.metadata.description + "</p>";
      }
      else{
        preview += "<p>[DESCRIPTION NOT FOUND] Search engines will auto-generate a description until one is provided in the site's SEO settings.]</p>";
      }
      preview += "</div><h4>Social Sharing Preview:</h4><div id='sharePreview'>";
      if(message.metadata.thumbnail != null){
        preview += "<img src='" + message.metadata.thumbnail + "' alt=''>";
      }
      preview += "<strong>" + message.metadata.pageTitle + "</strong>";
      if(message.metadata.description != null){
        preview += "<p>" + message.metadata.description + "</p>";
      }
      else{
        preview += "<p></p>";
      }
      preview += "</div>";
      appendResults("info", {
        tags: [],
        title: "Site Previews",
        desc: preview
      });

      

    }

    // STYLES
    if(message.content.fonts != null && message.content.colors != null){
      let fontsBento = "";
      for(i=0; i<message.content.fonts.length; i++){
        fontsBento += "<div class='bento info'><strong>" + message.content.fonts[i] + "</strong></div>";
      }
      let colorsBento = "";
      for(i=0; i<message.content.colors.length; i++){
        colorsBento += "<div class='bento info'><div class='colorDot' style='background-color:" + message.content.colors[i] + "'></div><strong>" + message.content.colors[i] + "</strong></div>";
      }

      appendResults("info", results = {
        tags: [],
        title: "Styles",
        desc: "<h4>Fonts Found:</h4>" + fontsBento + "<h4>Colors Found:</h4>" + colorsBento
      });
    }

    // SITEMAP
    if(message.sitemap != null && message.sitemap.status != "500"){
      appendResults("info", {
        tags: [],
        title: "Sitemap",
        desc: "<table id='sitemapTable'><tr id='sitemapHeadings'><th>View</th><th style='width:80%'>Page</th><th>Last Edited</th></tr></table>"
      });
      for(i=0;i<message.sitemap.pages.length;i++){
        let slug = new URL(message.sitemap.pages[i].loc).pathname;
        $("#sitemapTable").append("<tr><td style='padding:0px;'><a href='" + message.sitemap.pages[i].loc + "' target='_blank'><img src='../icons/view.png'></a></td><td>" + slug + "</td><td>" + message.sitemap.pages[i].edited + "</td></tr>");
      }
    }

    // SUGGESTIONS & PASSED AUDITS

    // results template
    /*
    if(false){

      appendResults("pass", results = {
        tags: ["accessibility", "seo", "privacy", "security", "speed", "legal", "brand", "copywriting", "links", "images", "audiovideo", "userinput", "commerce", "customcode", "domain", "settings"],
        title: "Site uses X.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });

      appendResults("fail", results = {
        tags: ["accessibility", "seo", "privacy", "security", "speed", "legal", "brand", "copywriting", "links", "images", "audiovideo", "userinput", "commerce", "customcode", "domain", "settings"],
        title: "Add/Activate/Update X.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
      });

    }*/

    // custom favicon
    if(message.content.customFavicon != null){
      if(message.content.customFavicon == true){
        appendResults("pass", results = {
          tags: ["brand"],
          title: "Site uses a custom favicon.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.customFavicon == false){
        appendResults("fail", results = {
          tags: ["brand"],
          title: "Add a custom favicon.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // badge
    if(message.content.badge != null){
      if(message.content.badge == false){
        appendResults("pass", results = {
          tags: ["settings"],
          title: "Squarespace badge is deactivated.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.badge == true){
        appendResults("fail", results = {
          tags: ["settings"],
          title: "Deactivate Squarespace badge.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // amp
    if(message.content.ampEnabled != null){
      if(message.content.ampEnabled == true){
        appendResults("pass", results = {
          tags: ["seo", "speed", "settings"],
          title: "Site uses AMP for blog posts.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.ampEnabled == false){
        appendResults("fail", results = {
          tags: ["seo", "speed", "settings"],
          title: "Enable AMP for blog posts.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // escape login
    if(message.content.escapeLogin != null){
      if(message.content.escapeLogin == false){
        appendResults("pass", results = {
          tags: ["accessibility", "userinput", "settings"],
          title: "Escape key login is deactivated.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.escapeLogin == true){
        appendResults("fail", results = {
          tags: ["accessibility", "userinput", "settings"],
          title: "Deactivate escape key login.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // https
    if(message.content.https != null){
      if(message.content.https == true){
        appendResults("pass", results = {
          tags: ["security", "domain", "settings"],
          title: "Site uses HTTPS.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.https == false){
        appendResults("fail", results = {
          tags: ["security", "domain", "settings"],
          title: "Enable HTTPS.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // clickjacking
    if(message.content.preventClickjacking != null){
      if(message.content.preventClickjacking == true){
        appendResults("pass", results = {
          tags: ["security", "settings"],
          title: "Embedding by other websites is prohibited.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.preventClickjacking == false){
        appendResults("fail", results = {
          tags: ["security", "settings"],
          title: "Prohibit embedding by other websites.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // cookie notice
    if(message.content.cookieNotice != null){
      if(message.content.cookieNotice == true){
        appendResults("pass", results = {
          tags: ["privacy", "legal", "settings"],
          title: "Cookie notice is enabled.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.cookieNotice == false){
        appendResults("fail", results = {
          tags: ["privacy", "legal", "settings"],
          title: "Enable cookie notice.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // analytics cookies
    if(message.content.analyticsCookies != null){
      if(message.content.analyticsCookies == false){
        appendResults("pass", results = {
          tags: ["privacy", "settings"],
          title: "Analytics cookies are deactivated.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.analyticsCookies == true){
        appendResults("fail", results = {
          tags: ["privacy", "settings"],
          title: "Deactivate analytics cookies.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // custom 404
    if(message.content.custom404 != null){
      if(message.content.custom404 == true){
        appendResults("pass", results = {
          tags: ["brand", "copywriting", "settings"],
          title: "Custom 404 page is active.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else if(message.content.custom404 == false){
        appendResults("fail", results = {
          tags: ["brand", "copywriting", "settings"],
          title: "Set a custom 404 page.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain the suggestion and link to an official Squarespace Help Center guide for more details."
        });
      }
    }

    // placeholder text
    if(message.content.placeholder[0] != null){

      let placeholderErrors = "";
      for(i=0; i<message.content.placeholder.length; i++){
        placeholderErrors += "<li>" + message.content.placeholder[i] + "</li>";
      }

      appendResults("fail", results = {
        tags: ["seo", "copywriting"],
        title: "Update placeholder text.",
        desc: "The following placeholder text was found:<ul>" + placeholderErrors + "</ul>"
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["seo", "copywriting"],
        title: "No placeholder text found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // spellcheck
    if(message.content.spellcheck[0] != null){
      let spellErrors = "";
      for(i=0; i<message.content.spellcheck.length; i++){
        spellErrors += "<li>" + message.content.spellcheck[i] + "</li>";
      }

      appendResults("fail", results = {
        tags: ["copywriting"],
        title: "Check the spelling of unrecognized words.",
        desc: "The following words were not found in the English dictionary:<ul>" + spellErrors + "</ul>"
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["copywriting"],
        title: "No spelling errors found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // ambiguous link text
    if(message.content.ambiguousLinkText[0] != null){
      let ambiguousLinkText = "";
      for(i=0; i<message.content.ambiguousLinkText.length; i++){
        ambiguousLinkText += "<li>" + message.content.ambiguousLinkText[i].link
        if(message.content.ambiguousLinkText[i].near != null){
          ambiguousLinkText += " <span class='near'>(near " + message.content.ambiguousLinkText[i].near + ")</span>";
        }
        ambiguousLinkText += "</li>";
      }
      appendResults("fail", results = {
        tags: ["accessibility", "links"],
        title: "Update ambiguous link text.",
        desc: "The following links have ambiguous text:<ul>" + ambiguousLinkText + "</ul>"
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["accessibility", "links"],
        title: "No ambiguous link text found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // empty links
    if(message.content.emptyLinks[0] != null){
      let emptyLinks = "";
      for(i=0; i<message.content.emptyLinks.length; i++){
        emptyLinks += "<li>link";
        if(message.content.emptyLinks[i].near != null){
          emptyLinks +=  "<span class='near'>(near " + message.content.emptyLinks[i].near + ")</span>";
        }
        emptyLinks += "</li>";
      }
      appendResults("fail", results = {
        tags: ["accessibility", "links"],
        title: "Remove empty links.",
        desc: "The following links are empty:<ul>" + emptyLinks + "</ul>"
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["accessibility", "links"],
        title: "No empty links found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // same window
    if(message.content.sameWindowLinks[0] != null){
      let sameWindow = "";
      for(i=0; i<message.content.sameWindowLinks.length; i++){
        sameWindow += "<li>" + message.content.sameWindowLinks[i].link
        if(message.content.sameWindowLinks[i].near != null){
          sameWindow += " <span class='near'>(near " + message.content.sameWindowLinks[i].near + ")<span>";
        }
        sameWindow += "</li>";
      }
      appendResults("fail", results = {
        tags: ["links"],
        title: "Set external links to open in a new window.",
        desc: "The following external links are not set to open in a new window:<ul>" + sameWindow + "</ul>"
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["links"],
        title: "External links are set to open in a new window.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // empty headings
    if(message.content.emptyHeadings[0] != null){
      let emptyHeadings = "";
      for(i=0; i<message.content.emptyHeadings.length; i++){
        emptyHeadings += "<li>" + message.content.emptyHeadings[i].tag
        if(message.content.emptyHeadings[i].near != null){
          emptyHeadings += " <span class='near'>(near " + message.content.emptyHeadings[i].near + ")</span>";
        }
        emptyHeadings += "</li>";
      }
      appendResults("fail", results = {
        tags: ["accessibility", "copywriting"],
        title: "Remove empty headings.",
        desc: "The following headings are empty:<ul>" + emptyHeadings + "</ul>"
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["accessibility", "copywriting"],
        title: "No empty headings found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // missing alt text
    if(message.content.missingAltText[0] != null){
      let missingAltText = "";
      for(i=0; i<message.content.missingAltText.length; i++){
        missingAltText += "<div class='bento info'><img src='" + message.content.missingAltText[i].src + "' alt=''>";
        if(message.content.missingAltText[i].near != null){
          missingAltText += "<span style='display:block;' class='near'>(near " + message.content.missingAltText[i].near + ")</span>";
        }
        missingAltText += "</div>";
      }
      appendResults("fail", results = {
        tags: ["accessibility", "seo", "images"],
        title: "Add alt text to images.",
        desc: "The following images are missing alt text:" + missingAltText
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["accessibility", "seo", "images"],
        title: "No images without alt text found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // poor alt text
    if(message.content.poorAltText[0] != null){
      let poorAltText = "";
      for(i=0; i<message.content.poorAltText.length; i++){
        poorAltText += "<div class='bento info'><img src='" + message.content.poorAltText[i].src + "' alt=''><strong>&ldquo;" + message.content.poorAltText[i].alt + "&rdquo;</strong>";
        if(message.content.poorAltText[i].near != null){
          poorAltText += "<span style='display:block;' class='near'>(near " + message.content.poorAltText[i].near + ")</span>";
        }
        poorAltText += "</div>";
      }
      appendResults("fail", results = {
        tags: ["accessibility", "seo", "images"],
        title: "Improve image alt text.",
        desc: "The following images have low-quality alt text:" + poorAltText
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["accessibility", "seo", "images"],
        title: "No low-quality alt text found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // large galleries
    if(message.content.largeGalleries[0] != null){
      let largeGalleries = "";
      for(i=0; i<message.content.largeGalleries.length; i++){
        largeGalleries += "<li>" + message.content.largeGalleries[i].count + " images";
        if(message.content.largeGalleries[i].near != null){
          largeGalleries += " <span class='near'>(near " + message.content.largeGalleries[i].near + ")</span>";
        }
        largeGalleries += "</li>";
      }
      appendResults("fail", results = {
        tags: ["speed", "images"],
        title: "Store fewer images in galleries.",
        desc: "The following image galleries contain more than 50 images (which Squarespace recommends as the maximum):<ul>" + largeGalleries + "</ul>"
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["speed", "images"],
        title: "No oversized images galleries found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // broken forms
    if(message.content.brokenForms[0] != null){
      let brokenForms = "";
      for(i=0; i<message.content.brokenForms.length; i++){
        brokenForms += "<li>" + message.content.brokenForms[i].type + " images";
        if(message.content.brokenForms[i].near){
          brokenForms += " <span class='near'>(near " + message.content.brokenForms[i].near + ")</span>";
        }
        brokenForms += "</li>";
      }
      appendResults("fail", results = {
        tags: ["userinput"],
        title: "Set storage options for forms.",
        desc: "The following forms are missing storage settings:<ul>" + brokenForms + "</ul>"
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["userinput"],
        title: "No broken forms found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }
    
    // outdated libraries
    if(message.content.outdatedLibraries[0] != null){
      let outdatedLibraries = "";
      for(i=0; i<message.content.outdatedLibraries.length; i++){
        outdatedLibraries += "<p><strong>" + message.content.outdatedLibraries[i].name + " is out of date!</strong></p>";
        outdatedLibraries += "<ul class='code-list'><li>Version " + message.content.outdatedLibraries[i].version + " is currently installed. It looks something like this within the site's custom code: <code>&lt;script src='" + message.content.outdatedLibraries[i].link + "'&gt;&lt;/script&gt;</code>.</li><li>Consider replacing it with <a href='" + message.content.outdatedLibraries[i].current + "' target='_blank'>the current version of " + message.content.outdatedLibraries[i].name + " found here</a>. Use caution, as upgrading can cause unexpected issues with plugins that may use deprecated features from the outdated version.</li></ul>";
      }
      appendResults("fail", results = {
        tags: ["security", "customcode"],
        title: "Update outdated libraries in custom code.",
        desc: outdatedLibraries
      });
    }
    else{
      appendResults("pass", results = {
        tags: ["security", "customcode"],
        title: "No outdated libraries found.",
        desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
      });
    }

    // checkout policies
    if(message.content.checkoutTerms != null){
      if(message.content.checkoutTerms == true && message.content.checkoutReturn == true && message.content.checkoutPrivacy == true){
        appendResults("pass", results = {
          tags: ["legal", "commerce"],
          title: "Commerce checkout includes terms and policies.",
          desc: "Lorem ipsum dolor sit amet. This is placeholder text that will explain more details."
        });
      }
      else{
        let checkoutPolicies = "";
        if(message.content.checkoutTerms == false){
          checkoutPolicies += "<li>Terms of Service</li>";
        }
        if(message.content.checkoutReturn == false){
          checkoutPolicies += "<li>Return Policy</li>";
        }
        if(message.content.checkoutPrivacy == false){
          checkoutPolicies += "<li>Privacy Policy</li>";
        }
        appendResults("fail", results = {
          tags: ["legal", "commerce"],
          title: "Add terms and policies to commerce checkout.",
          desc: "The following are missing from commerce checkout:<ul>" + checkoutPolicies + "</ul>"
        });
      }
    }

    accordionInit();
    filtersInit();
}

function accordionInit(){
  $(".accordion-panel").slideUp();

    $(".accordion").click(function() {
        if($(this).attr("aria-expanded") == "true"){
            $(this).next(".accordion-panel").slideUp();
            $(this).attr("aria-expanded", "false");
            $(this).children(".accordion-indicator").text("+");
        }
        else{
            $(this).next(".accordion-panel").slideDown();
            $(this).attr("aria-expanded", "true");
            $(this).children(".accordion-indicator").text("-");
        } 
    });
}

function filtersInit(){
  $("#toggleMetadata").click(function(){$("#info").slideToggle();});
  $("#toggleSuggestions").click(function(){$("#fail").slideToggle();});
  $("#togglePassed").click(function(){$("#pass").slideToggle();});

  $("#showAll").click(function(){
    $(".accordion, .accordion-panel").hide();
    $(".accordion").show();
  });
  $("#showAccessibility").click(function(){filterByTag("accessibility")});
  $("#showSEO").click(function(){filterByTag("seo")});
  $("#showPrivacy").click(function(){filterByTag("privacy")});
  $("#showSecurity").click(function(){filterByTag("security")});
  $("#showSpeed").click(function(){filterByTag("speed")});
  $("#showLegal").click(function(){filterByTag("legal")});
  $("#showBrand").click(function(){filterByTag("brand")});
  $("#showCopywriting").click(function(){filterByTag("copywriting")});
  $("#showLinks").click(function(){filterByTag("links")});
  $("#showImages").click(function(){filterByTag("images")});
  $("#showAudioVideo").click(function(){filterByTag("audiovideo")});
  $("#showCommerce").click(function(){filterByTag("commerce")});
  $("#showCustomCode").click(function(){filterByTag("customcode")});
  $("#showDomain").click(function(){filterByTag("domain")});
  $("#showSettings").click(function(){filterByTag("settings")});
  function filterByTag(tag){
    $(".accordion, .accordion-panel").hide();
    $(".accordion").attr("aria-expanded", "false");
    $(".accordion").children(".accordion-indicator").text("+");
    $(".accordion[data-tags*='" + tag + "']").show();
    $("#info .accordion").show();
  }
}

function appendResults(type, results){

  var tagsContent = "";
  for(i=0; i<results.tags.length; i++)
  {
    if(results.tags[i] == "accessibility"){
      tagsContent += "<li class='tooltip'>Accessibility<span class='tooltip-text'>Accessibiliy is the practice of making websites more usable for people with disabilities.</span></li>";
    }
    else if(results.tags[i] == "seo"){
      tagsContent += "<li class='tooltip'>SEO<span class='tooltip-text'>Search Engine Optimization (SEO) is the practice of helping search engines better understand content with the goal of improving site ranking.</span></li>";
    }
    else if(results.tags[i] == "privacy"){
      tagsContent += "<li class='tooltip'>Privacy<span class='tooltip-text'>Privacy is the practice of protecting users by limiting the collection of their personal information.</span></li>";
    }
    else if(results.tags[i] == "security"){
      tagsContent += "<li class='tooltip'>Security<span class='tooltip-text'>Security is the practice of protecting a website and its users from malicious exploitation.</span></li>";
    }
    else if(results.tags[i] == "speed"){
      tagsContent += "<li class='tooltip'>Speed<span class='tooltip-text'>Speed is how fast users can interact with a website by downloading all of its content.</span></li>";
    }
    else if(results.tags[i] == "legal"){
      tagsContent += "<li class='tooltip'>Legal<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "brand"){
      tagsContent += "<li class='tooltip'>Brand<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "copywriting"){
      tagsContent += "<li class='tooltip'>Copywriting<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "links"){
      tagsContent += "<li class='tooltip'>Links<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "images"){
      tagsContent += "<li class='tooltip'>Images<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "audiovideo"){
      tagsContent += "<li class='tooltip'>Audio & Video<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "userinput"){
      tagsContent += "<li class='tooltip'>User Input<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "commerce"){
      tagsContent += "<li class='tooltip'>Commerce<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "customcode"){
      tagsContent += "<li class='tooltip'>Custom Code<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "domain"){
      tagsContent += "<li class='tooltip'>Domain<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
    else if(results.tags[i] == "settings"){
      tagsContent += "<li class='tooltip'>Settings<span class='tooltip-text'>Lorem ipsum! This is placeholder text.</span></li>";
    }
  }

  if(type == "pass"){
    $("#pass").append("<h3 class='accordion' role='button' tabindex='0' aria-expanded='false' data-tags='" + results.tags.toString() + "'><img class='icon' src='../icons/pass.png' alt='Passed'>" + results.title + "<span class='accordion-indicator'>+</span></h3><div class='description accordion-panel'><ul class='tags'>" + tagsContent + "</ul><p>" + results.desc + "</p></div>");
  }
  else if(type == "fail"){
    $("#fail").append("<h3 class='accordion' role='button' tabindex='0' aria-expanded='false' data-tags='" + results.tags.toString() + "'><img class='icon' src='../icons/fail.png' alt='Failed'>" + results.title + "<span class='accordion-indicator'>+</span></h3><div class='description accordion-panel'><ul class='tags'>" + tagsContent + "</ul><p>" + results.desc + "</p></div>");
  }
  else if(type == "info"){
    $("#info").append("<h3 class='accordion' role='button' tabindex='0' aria-expanded='false' data-tags='" + results.tags.toString() + "'><img class='icon' src='../icons/info.png' alt='Info'>" + results.title + "<span class='accordion-indicator'>+</span></h3><div class='description accordion-panel'>" + results.desc + "</div>");
  }
}