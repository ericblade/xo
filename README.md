XO

You are welcome to use this code in any fashion that you see fit, just remember
to give credit where credit is due, and follow the LICENSE agreement.

** PLEASE keep in mind that Open Source projects work best for everyone when you
actively contribute!  Pull Requests and Gerrithub Code Review requests are welcome!

Original XO code through the initial commit to this repository is Copyright 2011 - 2014, Eric Blade. All additional code that is not mentioned below, is copyright the author of that code. All contributions to this code are considered to be released under the terms of the LICENSE file here.
The XO icon is copyright Sindre Mehus, from Subsonic.
Additional graphics and Icons are copyright Asle Hoeg-Mikkelsen.

=== To run in Chrome ===

(Windows) Create a new shortcut on your desktop to Chrome.  Edit that shortcut, and add "--disable-web-security" to the Target.
Example: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security

(Unix) run google-chrome --disable-web-security or chromium --disable-web-security (depending on wether you are using chrome or chromium)

(Mac/others) I don't use a Mac, but you should be able to adapt the above instructions.

This might work in Opera, if Opera 20+ supports the --disable-web-security command.

Do NOT use the disable-web-security switch for active browsing!!! Only use it when working with known good files.

Use that shortcut, and load the "index-normal.html" in the repo into your Chrome window, such as:
file:///D:/src/synergv1/app/index-chrome.html

=== Deploying to various platforms ===

Need to spend some time remembering how this works.  I think the "dist.bat" will simply install it
directly to a webOS phone or tablet, I am not sure exactly how packaging for other platforms worked at
this time.
