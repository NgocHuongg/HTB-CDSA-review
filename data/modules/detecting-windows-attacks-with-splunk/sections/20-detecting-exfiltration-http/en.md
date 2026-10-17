# Detecting Exfiltration (HTTP)

`Data exfiltration` inside the POST body is a technique that attackers employ to extract sensitive information from a compromised system by disguising it as legitimate web traffic. It involves transmitting the stolen data from the compromised system to an external server controlled by the attacker using HTTP POST requests. Since POST requests are commonly used for legitimate purposes, such as form submissions and file uploads, this method of data exfiltration can be difficult to detect. 

To exfiltrate the data, the attackers send it as the body of an HTTP POST request to their command and control (C2) server. They often use seemingly innocuous URLs and headers to further disguise the malicious traffic. The C2 server receives the POST request, extracts the data from the body, and decodes or decrypts it for further analysis and exploitation.

To detect data exfiltration via POST body, we can employ network monitoring and analysis tools to aggregate all data sent to specific IP addresses and ports. By analyzing the aggregated data, we can identify patterns and anomalies that may indicate data exfiltration attempts.

In this section, we will monitor the volume of outgoing traffic from our network to specific IP addresses and ports. If we observe unusually large or frequent data transfers to a specific destination, it may indicate data exfiltration.

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Let's now navigate to the bottom of this section and click on "Click here to spawn the target system!". Then, access the Splunk interface at https://[Target IP]:8000 and launch the Search & Reporting Splunk application. The vast majority of searches covered from this point up to end of this section can be replicated inside the target, offering a more comprehensive grasp of the topics presented. </p>
    </div>
</div>

<div class="card bg-light">
    <div class="card-body">
				 <p class="mb-0">Additionally, we can access the spawned target via RDP as outlined below. All files, logs, and PCAP files related to the covered attacks can be found in the /home/htb-student and /home/htb-student/module_files directories. </p>
    </div>
</div>

```shell-session
[!bash!]$ xfreerdp /u:htb-student /p:'HTB_@cademy_stdnt!' /v:[Target IP] /dynamic-resolution
```

#### Related Evidence

- **Related Directory**: `/home/htb-student/module_files/cobaltstrike_exfiltration_http`
- **Related Splunk Index**: `cobaltstrike_exfiltration_http`
- **Related Splunk Sourcetype**: `bro:http:json`

---

## Detecting HTTP Exfiltration With Splunk & Zeek Logs

Now let's explore how we can identify HTTP exfiltration, using Splunk and Zeek logs.

```shell-session
index="cobaltstrike_exfiltration_http" sourcetype="bro:http:json" method=POST
| stats sum(request_body_len) as TotalBytes by src, dest, dest_port
| eval TotalBytes = TotalBytes/1024/1024
```

![Log analysis tool showing a search query for Cobalt Strike exfiltration HTTP events. Displays one event with columns for source IP, destination IP, destination port, and total bytes.](images/118.png)
