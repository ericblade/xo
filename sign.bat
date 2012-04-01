del /y /q xobb.zip
"c:\Program Files\7-Zip\7z.exe" u -xr!*.bat -xr!*.zip -xr!.git* xobb.zip *
set JAVA_HOME="c:\program files (x86)\Research In Motion\BlackBerry WebWorks SDK for TabletOS 2.2.0.5\jre"
"c:\program files (x86)\Research In Motion\BlackBerry WebWorks SDK for TabletOS 2.2.0.5\bbwp\bbwp" c:\users\eric\ripplesites\xo\xobb.zip -o c:\temp\xobb -gcsk endgame -gp12 endgame
"c:\program files (x86)\Research In Motion\BlackBerry WebWorks SDK for TabletOS 2.2.0.5\bbwp\blackberry-tablet-sdk\bin\blackberry-deploy" -installApp -password a -device 169.254.0.1 -package c:\temp\xobb\xobb.bar