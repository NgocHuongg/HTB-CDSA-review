# Using Splunk Applications


## Splunk Applications

Splunk applications, or apps, are packages that we add to our Splunk Enterprise or Splunk Cloud deployments to extend capabilities and manage specific types of operational data. Each application is tailored to handle data from specific technologies or use cases, effectively acting as a pre-built knowledge package for that data. Apps can provide capabilities ranging from custom data inputs, custom visualizations, dashboards, alerts, reports, and more.

Splunk Apps enable the coexistence of multiple workspaces on a single Splunk instance, catering to different use cases and user roles. These ready-made apps can be found on Splunkbase.

As an integral part of our cybersecurity operations, the Splunk apps designed for Security Information and Event Management (SIEM) purposes provide a range of capabilities to enhance our ability to detect, investigate, and respond to threats. They are designed to ingest, analyze, and visualize security-related data, enabling us to detect complex threats and perform in-depth investigations.

When using these apps in our Splunk environment, we need to consider factors such as data volume, hardware requirements, and licensing. Many apps can be resource-intensive, so we must ensure our Splunk deployment is sized correctly to handle the additional workload. Further, it's also important to ensure we have the correct licenses for any premium apps, and that we are aware of the potential for increased license usage due to the added data inputs.

In this segment, we'll be leveraging the `Sysmon App for Splunk` developed by Mike Haag. 

To download, add, and use this application, follow the steps delineated below:

1. Sign up for a free account at [splunkbase](https://splunkbase.splunk.com/)
	![Splunkbase homepage with text 'Get more out of Splunk with applications' and icons for apps like AWS, Cisco, and Zoom. Options to submit an app or log in.](images/116.png)
2. Once registered, log into your account
3. Head over to the [Sysmon App for Splunk](https://splunkbase.splunk.com/app/3544) page to download the application.
	![Splunkbase page for Sysmon App for Splunk, offering insights and visibility into Sysmon deployments. Includes download button, app screenshots, version 2.0.0 details, compatibility with Splunk Enterprise, and a 5-star rating.](images/117.png)
4. Add the application as follows to your search head.
	![Splunk Enterprise home page with options for Search & Reporting, Splunk Essentials, Splunk Secure Gateway, and Upgrade Readiness App. Manage Apps gear icon highlighted.](images/118.png)
	
	![Splunk Apps page showing a list of apps like SplunkForwarder and Log Event Alert Action. Options to browse more apps, install from file, and create app. Actions include enabling and editing properties.](images/119.png)
	
	![Splunk interface for uploading an app from a file. File selected: sysmon-app-for-splunk_200.tgz. Option to upgrade app if it exists, with 'Upload' and 'Cancel' buttons.](images/120.png)
5. Adjust the application's [macro](https://docs.splunk.com/Documentation/Splunk/latest/Knowledge/Definesearchmacros) so that events are loaded as follows.
	![Splunk Enterprise home page with apps like Search & Reporting, Splunk Essentials, and Sysmon App for Splunk. Settings menu open with options including Advanced Search.](images/121.png)
	
	![Splunk Advanced Search page with options to create and edit search macros and commands. Includes 'Add new' button for search macros and commands.](images/122.png)
	
	![Splunk Enterprise interface showing 'Search macros' with one item: 'sysmon' under 'Sysmon App for Splunk', definition 'sourcetype="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational"'. Options for visibility, owner, and status are displayed](images/123.png)
	
	![Splunk interface for editing 'sysmon' search macro, showing definition field with 'index="main" sourcetype="WinEventLog:Sysmon"', and options for arguments, validation expression, and error message.](images/124.png)

Let's access the Sysmon App for Splunk by locating it in the "Apps" column on the Splunk home page and head over to the `File Activity` tab.
![Splunk interface showing 'File Creation Overview' with a warning about a missing dashboard version. Dropdown set to 'Last 24 hours' and 'Search is waiting for input' messages displayed.](images/125.png)

Let's now specify "All time" on the time picker and click "Submit". Results are generated successfully; however, no results are appearing in the "Top Systems" section.
![Splunk interface showing 'File Creation Overview' with a graph of file creation over time, a list of top files created, and 'Top Systems' section showing 'No results found'. Dropdown set to 'All time' and 'Edit' option visible.](images/126.png)

We can fix that by clicking on "Edit" (upper right hand corner of the screen) and editing the search.
![Splunk interface showing 'File Creation Overview' with a graph of file creation over time, a list of top files created, and 'Top Systems' section showing 'No results found'. Dropdown set to 'All time' and 'Edit search' option visible.](images/127.png)

The Sysmon Events with ID 11 do not contain a field named `Computer`, but they do include a field called `ComputerName`. Let's fix that and click "Apply"
![Splunk 'Edit Search' interface with search string 'sysmon EventCode=11 | top ComputerName', options for time range, auto refresh delay, and refresh indicator. Apply and cancel buttons visible.](images/128.png)

Results should now be generated successfully in the "Top Systems" section.
![Splunk 'File Creation Overview' dashboard with a graph of file creation over time, dropdown set to 'All time', and a list of top files created. Options to edit and save the dashboard are visible.](images/129.png)

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Feel free to explore and experiment with this Splunk application. An excellent exercise is to modify the searches when no results are generated due to non-existent fields being specified, continuing until the desired results are obtained. </p>
    </div>
</div>

---

## Practical Exercises

Navigate to the bottom of this section and click on `Click here to spawn the target system!`

Now, navigate to `http://[Target IP]:8000`, open the `Sysmon App for Splunk` application, and answer the questions below.
