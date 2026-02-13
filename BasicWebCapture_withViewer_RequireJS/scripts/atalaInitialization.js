requirejs.config({
    baseUrl: '/',
    paths: {
        'jquery': 'WebDocViewer/jquery-3.5.1.min',
        'jquery-ui': 'WebDocViewer/jquery-ui-1.14.0.min',
        'raphael': 'WebDocViewer/raphael-min',
        'clipboard': 'WebDocViewer/clipboard.min',
        'web-document-viewer': 'WebDocViewer/atalaWebDocumentViewer',
        'web-capture-service': 'WebCapture/atalaWebCapture'
    },
    shim: {
        // Web Capture Service at the moment is non-AMD script and requires a AMD shim config.
        'web-capture-service': {
            deps: ['jquery'],
            exports: 'Atalasoft',
        }
    }
});

requirejs(["web-document-viewer", "jquery"], function RunApp(Atalasoft, jQuery) {
    var _docUrl = '/Images/DocCleanMultipage.tif';
    var _serverUrl = '/WebDocViewerHandler.ashx';
    var _savePath = '/Saves/';
    // Initialize Web Document Viewer
    var viewer = new Atalasoft.Controls.WebDocumentViewer({
        parent: $('#_containerViewer'), // parent container to put the viewer in
        toolbarparent: $('#_toolbar1'), // parent container to put the viewer toolbar in
        serverurl: _serverUrl, // server handler url to send image requests to
        allowannotations: true, // flag to enable annotations
        savepath: 'Saved/', // relative url to save annotation data to
        showscrollbars: true,
        forcepagefit: true
    });
    var thumbs = new Atalasoft.Controls.WebDocumentThumbnailer({
        parent: $('#_containerThumbs'), // parent container to putthe thumbnails in
        serverurl: _serverUrl, // server handler url tosend image requests to
        documenturl: _docUrl, // document url relative to the server handler url
        //annotationsurl: _annUrl, // annotation file to load upon page loading
        allowannotations: true, // flag to enable annotations 
        viewer: viewer, // link actions to the _viewer so they open the same doc
        allowdragdrop: true,
        showscrollbars: true
    });


    // brings the _viewer object back onto the window global namespace so we can access it with existing code
    window._viewer = viewer;
    window._thumbs = thumbs;
    //window._capture = cap;

    // DO all your event binding here
    //window._viewer.bind('documentsaved', function (e) { alert('Document Save: ' + e.success); });
    viewer.bind('documentsaved', function (e) { alert('Document Save: ' + e.success); });


});


requirejs(["web-capture-service", "jquery"], function RunApp(Atalasoft, jQuery) {
    Atalasoft.Controls.Capture.WebScanning.initialize({
        handlerUrl: 'WebCaptureHandler.ashx',
        onUploadCompleted: function (eventName, eventObj) {
            if (eventObj.success) {
                //document.getElementById('resultDiv').innerHTML = "Status: Upload Success... " + eventObj.documentFilename;
                //alert(eventObj.documentFilename);
                _thumbs.openUrl('atala-capture-upload/' + eventObj.documentFilename, '');
            }
        },
        onScanError: scanErrorHandler,
        scanningOptions: { applyVRS: false, pixelType: 0, showScannerUI: false }
    });


    function scanErrorHandler(msg, params) {
        switch (msg) {
            case Atalasoft.Controls.Capture.Errors.badBrowser:
                alert(msg);
                break;
            case Atalasoft.Controls.Capture.Errors.activeX:
                alert(
		        "The ActiveX Scanning Control needs to be installed, updated or enabled.\n" +
		        "When prompted, please allow the WingScan Web Scanning Control to install itself,\n" +
		        "or Manage Add-ons through IE Settings. Refresh your browser when completed.");
                break;
            case Atalasoft.Controls.Capture.Errors.noTwain:
                alert(
	            "TWAIN is not installed on this computer.\n" +
	            "Contact your system administrator.");
                break;
            case Atalasoft.Controls.Capture.Errors.noPlugin:
                var pluginUrl = window.location.protocol + "//" + window.location.host + "/WebCapture/" + params.filename
                alert(
	            "The WingScan Web Scanning plugin is not available. \n\n" +
	            "Please download from : " + pluginUrl + "\n" +
	            "If you are not prompted to install, the plugin may be installed but disabled. \n" +
	            "enable it through Tools... Extensions. \n" +
	            "Refresh your browser when completed.");
                window.open(pluginUrl, '_downloadPlugin');
                break;
            case Atalasoft.Controls.Capture.Errors.oldPlugin:
                var pluginUrl = window.location.protocol + "//" + window.location.host + "/WebCapture/" + params.filename
                alert(
	            "The WingScan Web Scanning plugin is out of date.<br />" +
	            "To download and install the latest version from " +
	            params.filename);
                window.open(pluginUrl, '_downloadPlugin');
                break;
            case "VRS: No license or license expired":
                alert("Scanning aborted with a VRS licensing exception. \n\n" +
	            "VRS is enabled, but no VRS license is present.\n" +
	            "Either turn VRS off in your scanningOptions or \n" +
	            "activate a license with VRS.");
                break;
            default:
                alert(msg);
                break;
        }
    }
});



function scanWithSelectedScanner() {
    let selectedScanner = $('.atala-scanner-list').val();

    if (selectedScanner == "(no scanners available)") {
        alert("No Scanners available - please wait for the list to populate");
    } else {
        Atalasoft.Controls.Capture.WebScanning.scanningOptions.scanner = $('.atala-scanner-list').val();
        Atalasoft.Controls.Capture.WebScanning.scan();
    }
}

