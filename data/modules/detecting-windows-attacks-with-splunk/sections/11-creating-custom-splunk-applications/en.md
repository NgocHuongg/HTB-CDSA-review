# Creating Custom Splunk Applications

## How To Create A Custom Splunk Application

1. `Access Splunk Web`: Open your web browser and navigate to Splunk Web.
2. `Go to Manage Apps`: From the menu bar at the top, select `Apps` and then choose `Manage Apps`.
	![Splunk Enterprise interface showing Apps menu with options: Search & Reporting, Splunk Secure Gateway, Upgrade Readiness App, Manage Apps, and Find More Apps.](images/image46.png)
3. `Create a New App`: On the `Apps` page, click on `Create app`.
4. `Enter App Details`: On the `Add new` page, complete the properties for your new app:
	- `Name`: Enter the name for your app, for example, `<Your app name>`.
	- `Folder name`: Specify the folder name, which should be similar to `<App_name>`. This will correspond to the app's directory under `$SPLUNK_HOME/etc/apps/`.
	- `Version`: Input "1.0.0".
	- `Description`: Provide a description for your app, for instance, `<App description>`.
	- `Template`: Choose `barebones` from the drop-down menu.
	![App creation form with fields for name, folder name, version, visibility, author, description, template, and upload asset. "Academy hackthebox - Detection of Active Directory Attacks" is the app name. Save and Cancel buttons are present.](images/image20.png)
5. `Save the App`: Click on `Save`. You can verify that your app has been created by going to the `Apps` menu. Your new app should now be listed there. Also, if you navigate to the Splunk Web home page, you'll find your app listed under the `Apps` list as `Academy hackthebox - Detection of Active Directory Attacks`.
	![Splunk Enterprise interface showing Apps menu with options: Search & Reporting, Academy hackthebox - Detection of Active Directory Attacks, Splunk Secure Gateway, Upgrade Readiness App, Manage Apps, and Find More Apps.](images/image7.png)
	![Splunk Enterprise Apps panel with search bar. Listed apps: Search & Reporting and Academy hackthebox - Detection of Active Directory Attacks. Manage option available.](images/image36.png)
6. `Explore the Directory Structure`: Use a file browser to navigate to `$SPLUNK_HOME/etc/apps`. Here you'll find your app directory, which includes the following folders:
	- `/bin`: This is where scripts are stored.
	- `/default`: This directory holds files for configuration, views, dashboards, and app navigation.
  	- `/local`: This directory contains user-modified versions of files for configuration, views, dashboards, and app navigation.
	- `/metadata`: This directory holds permissions files.
	![Terminal showing directory listing for Detection_of_Active_Directory_Attacks in Splunk apps. Folders include bin, default, local, and metadata.](images/image30.png)
7. `View the Navigation File`: The navigation configuration file is an XML file. Using a text editor, open `$SPLUNK_HOME/etc/apps/<your app>/default/data/ui/nav/default.xml`. Here you'll find the default navigation definition for an app:
	```xml
	  <nav search_view="search">
	  <view name="search" default='true' />
 	  <view name="analytics_workspace" />
	  <view name="datasets" />
	  <view name="reports" />
 	  <view name="alerts" />
	  <view name="dashboards" />
      </nav>
  	```
	In this XML, the top-level nav tag acts as the parent. The `search_view` attribute designates the default view for searches. In this case, the `search` view is employed, which is inherited from the `Search & Reporting` app. The next level in the XML hierarchy corresponds to items displayed on the app bar. The list of view tags denotes different views to show. Each of the views corresponds to a view from the Search & Reporting app. The attribute `default='true'` indicates the view to use as the app home page – here, the `search` view serves as the home page.
8. `Create Your First Dashboard`: Go to `dashboards` and click on `Create New Dashboard`. Enter the dashboard name, provide a description if necessary, set permissions, and select `Classic Dashboards`.
	![Splunk Enterprise Dashboards page with options to create a new dashboard. Resources include examples for Dashboard Studio, intro to Dashboard Studio, and intro to Classic Dashboards. No dashboards listed.](images/image50.png)
	
	![Create New Dashboard form with fields for title "Domain Reconnaissance," description, and permissions. Options to build with Classic Dashboards or Dashboard Studio. Create and Cancel buttons available.](images/image54.png)
9. `Configure the Dashboard`: You'll now see the dashboard editor page, where you can configure panels, inputs, etc., to facilitate your monitoring process. Add time input for the dashboard and adjust the default time range to suit your needs. Next, add a statistical table panel, select a time range for the Shared Time Picker, add the Content Title (e.g., `"<Panel name>"`), and input the Search String. To use input in searches, enclose the input token with dollar signs, like `$user$`. Click `Add to Dashboard` when ready. Save your changes.
	![Edit Dashboard interface for "Domain Reconnaissance" with options to add panel, add input, and toggle dark theme. Save, Save as, and Cancel buttons available. No description or panels added.](images/image4.png)
	
	![Settings panel for adding a Time input. Options include label "Time," search on change, token "time," and default time range. Apply and Cancel buttons available.](images/image83.png)
	
	![Add Panel interface for a new Statistics Table. Options include time range, content title "Sysmon Process events," and search string. Add to Dashboard button available.](images/image27.png)
	
	![Dashboard titled "Domain Reconnaissance" displaying Sysmon Process events. Includes columns for time, process, process ID, parent process, parent process ID, destination, and user. Options to edit and export.](images/image12.png)
10. `Dashboard Storage`: All dashboards you've created in your app are stored at `"<AppPath>/local/data/ui/views/dashboard_title.xml"`. To add your dashboard to the navigation bar, simply append the dashboard title to the navigation default page XML: `"<AppPath>/local/data/ui/nav/default.xml"`.
	![Nano editor showing XML navigation structure with views: search (default), domain_reconnaissance, analytics_workspace, datasets, reports, alerts, and dashboards.](images/image21.png)
11. `Restart Splunk`: Reboot your Splunk instance. Once restarted, you should see your dashboard in the navigation bar.
	![Splunk Enterprise dashboard titled "Domain Reconnaissance" with time filter and Sysmon Process events section. Options to edit and export.](images/image55.png)
12. `Grouping Dashboards`: If you wish to group multiple dashboards under a single entry in the navigation bar, use the collection tag.
	![Code snippet showing XML navigation structure with default search view. Includes a collection labeled "Command and Control" with views: c2_investigator and c2_investigator_zeek.](images/image58.png)
	
## Updating & Exploring The "Academy hackthebox - Detection of Active Directory Attacks" Splunk Application

`Detection-of-Active-Directory-Attacks.tar.gz.tar` can be downloaded from the `Resources` section of this module (upper right corner) and used to update the existing `Academy hackthebox - Detection of Active Directory Attacks` Splunk Application by clicking `Apps` -> `Manage Apps` -> `Install app from file` -> `Browse` -> ✓ `Upgrade app. Checking this will overwrite the app if it already exists.` -> `Upload`.

Now, take some time to explore this custom Splunk application and see how it can significantly improve our monitoring capabilities.
