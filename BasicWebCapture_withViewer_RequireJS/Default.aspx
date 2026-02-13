<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="BasicWebCapture_withViewer_RequireJS.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="WebDocViewer/jquery-ui-1.14.0.min.css" rel="Stylesheet" type="text/css" />
    <link href="WebDocViewer/atalaWebDocumentViewer.css" rel="Stylesheet" type="text/css" />

    <!-- data-main attribute tells require.js to load app.js after require.js loads. -->
    <script data-main="/scripts/atalaInitialization" src="/scripts/require.js" defer="defer"></script>

</head>
<body>
    <form id="form1" runat="server">
    <div id="scanDiv">
        <h1>Basic WingScan Web Capture Demo</h1>
        <h3>Using WingScan and WITH Viewer</h3>
        <p>Select your scanner and click the scan button... the file will be uploaded to /atala-capture-upload/ with a unique filename (the filename will appear in the status below)</p>
        <p>&nbsp;</p>
        <p>Select Scanner:
            <select class="atala-scanner-list" disabled="disabled" name="scannerList" style="width:22em">
                <option selected="selected">(no scanners available)</option>
            </select>
            &nbsp;
            <!-- DO NOT USE <input type="button" class="atala-scan-button" value="Scan" /> -->
            <input type="button" id="scanNOW" value="Scan" onclick="scanWithSelectedScanner(); return false;" />
        </p>

    </div>
    <div style="width: 900px;">
    <div id="_toolbar1"></div>
    <div id="_containerThumbs" style="width: 180px; height: 600px;
    display: inline-block;"></div>
    <div id="_containerViewer" style="width: 710px; height: 600px;
    display: inline-block;"></div>
    </div>
    </form>
</body>
</html>
