var tbmailarchive = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
  },


  onMenuItemCommand: function() {
    
    if(GetNumSelectedMessages() == 1)
    {
	var uri = GetFirstSelectedMessage()
	// temporary filename
	var filename;
	// temporary directory
	var tempdir;
	// seperator, os dependable
	var sep;
	var file = Components.classes["@mozilla.org/filespec;1"].
	    createInstance(Components.interfaces.nsIFileSpec);
	var time = new Date();
	var env = Components.classes["@mozilla.org/process/environment;1"]
	    .createInstance(Components.interfaces.nsIEnvironment);
	var pref = Components.classes["@mozilla.org/preferences-service;1"]
	    .getService(Components.interfaces.nsIPrefBranch);


	if( navigator.platform.slice(0,5) == "Linux" )
	{
	    tempdir = "/tmp";
	    sep = "/";
	}
	// windows OS assumed
	else
	{
	    if(!env.exists('TEMP'))
		return;
	    tempdir = env.get('TEMP');
	    sep = "\\";
	}

	try
	{
	    var cmdLine1 = pref.getCharPref("tbmailarchive.cmdLine1");
	}
	catch(e)
	{
	    alert("Error: No command line defined in preferences. Aborting.");
	    return;
	}
	try
	{
	    var cmdLine2 = pref.getCharPref("tbmailarchive.cmdLine2");
	}
	catch(e)
	{
	    cmdLine2 = "";
	}


	// saveMessageToDisk call uses async I/O, so we need a listener
	// to get informed about end of writing
	var urlListener =
	{
	    QueryInterface: function(iid)
	    {
		if( iid.equals(Components.interfaces.nsIUrlListener) )
		{
		    return this;
		}
		else
		{
		    throw Components.results.NS_NOINTERFACE;
		    return 0;
		}
	    },
	    OnStartRunningUrl: function(url)
	    {
	    },

	    // this function is called when msg is written on disk
	    OnStopRunningUrl: function(url, exitCode)
	    {
		var extCmd = Components.classes["@mozilla.org/file/local;1"]
		    .createInstance(Components.interfaces.nsILocalFile);
		var process = Components.classes["@mozilla.org/process/util;1"]
		    .createInstance(Components.interfaces.nsIProcess);
		var extArgs = [];
		extCmd.initWithPath(cmdLine1);
		process.init(extCmd);
		if( cmdLine2.length > 0 )
		{
		    extArgs[0] = cmdLine2;
		    extArgs[1] = filename;
		}
		else
		{
		    extArgs[0] = filename;
		}
		// the process.run method does enclosing of arguments with " automatically
		// so we don't need to to it here
		
		// set first param to true to have TB wait until command finishes
		process.run(false, extArgs, extArgs.length);
	    }
	};

	
	// generate unique temporary filename
	filename = tempdir + sep + time.getTime() + '.eml';
	file.unicodePath = filename	
	var nothing  = {};

	messenger.messageServiceFromURI(uri).SaveMessageToDisk(uri, file, true, urlListener, nothing, false, null);
	

    }
  }
};

window.addEventListener("load", function(e) { tbmailarchive.onLoad(e); }, false); 
