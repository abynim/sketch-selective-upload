var go = function(context) {
  try { SelectiveUpload.go(context); }
  catch(e) {
      if(Mocha.sharedRuntime().loadFrameworkWithName_inDirectory('SelectiveUpload', NSBundle.bundleWithURL(context.plugin.url()).resourceURL().path())) {
          SelectiveUpload.go(context);
      }
  }
}

var getPrefix = function() {
    const defaultsKey = "com.abynim.SelectiveUpload.prefix";
    var currentPrefix = NSUserDefaults.standardUserDefaults().stringForKey(defaultsKey);
    currentPrefix = currentPrefix ? ""+currentPrefix : "--";
    return currentPrefix;
}

var setPrefix = function(context) {
    var UI = require('sketch/ui');
    
    var currentPrefix = getPrefix();
    
    UI.getInputFromUser(
      "When uploading to Sketch Cloud, ignore Artboards with prefix:",
      {
        initialValue: currentPrefix,
        description: "(Case sensitive)"
      },
      (err, value) => {
        if (err) { return }
        var newVal = value ? NSString.stringWithString(value) : NSString.stringWithString("--");
        NSUserDefaults.standardUserDefaults().setObject_forKey(newVal, defaultsKey);
      }
    );
}

var ignore = function(context) {
    
    var prefix = getPrefix();
    
    var artboards;
    
    if(context.command.identifier().hasSuffix("Page")) {
        artboards = context.document.currentPage().artboards();
    } else {
        artboards = context.selection.valueForKeyPath("@distinctUnionOfObjects.parentArtboard");
    }
    
    var shouldReset = context.command.identifier().hasPrefix("reset");
    
    var loop = artboards.objectEnumerator();
    var artboard;
    while(artboard = loop.nextObject()) {
        if(shouldReset) {
            if(artboard.name().hasPrefix(prefix)) {
                var artboardName = ""+artboard.name();
                artboard.setName(artboardName.substr(prefix.length));
            }
        }
        else {
            if(!artboard.name().hasPrefix(prefix)) {
                artboard.setName(prefix + "" + artboard.name());
            }
        }
    }
    
}

var ignorePage = function(context) {
    
    var prefix = getPrefix();
    
    var shouldReset = context.command.identifier().hasPrefix("reset");
    var currentPage = context.document.currentPage();
    if(shouldReset) {
        if(currentPage.name().hasPrefix(prefix)) {
            var pageName = ""+currentPage.name();
            currentPage.setName(pageName.substr(prefix.length));
        }
    }
    else {
        if(!currentPage.name().hasPrefix(prefix)) {
            currentPage.setName(prefix + "" + currentPage.name());
        }
    }
    
}
