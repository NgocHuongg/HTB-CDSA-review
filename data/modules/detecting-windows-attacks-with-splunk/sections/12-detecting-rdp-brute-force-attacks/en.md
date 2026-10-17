# Detecting RDP Brute Force Attacks

We often encounter `Remote Desktop Protocol (RDP) brute force attacks` as a favorite vector for attackers to gain initial foothold in a network. The concept of an RDP brute force attack is relatively straightforward: attackers attempt to login into a Remote Desktop session by systematically guessing and trying different passwords until they find the correct one. This method exploits the fact that many users often have weak or default passwords that are easy to guess.

#### How RDP Traffic Looks Like

![Network packet capture showing RDP session with highlighted sections for authentication, certificate exchange, and connection closure. Displays RDP username in packet details.](images/100.png)

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

- **Related Directory**: `/home/htb-student/module_files/rdp_bruteforce`
- **Related Splunk Index**: `rdp_bruteforce`
- **Related Splunk Sourcetype**: `bro:rdp:json`

---

## Detecting RDP Brute Force Attacks With Splunk & Zeek Logs

Now let's explore how we can identify RDP brute force attacks, using Splunk and Zeek logs.

```shell-session
index="rdp_bruteforce" sourcetype="bro:rdp:json"
| bin _time span=5m
| stats count values(cookie) by _time, id.orig_h, id.resp_h
| where count>30
```

![Log analysis tool showing a search query for RDP brute force events. Displays two events with columns for time, origin IP, response IP, count, and cookie values.](images/101.png)

The knowledge of how to detect brute-force attacks helps build detection logic and alerts. Brute-force attacks focus on finding services that accept credentials, where attackers may attempt to use a default username in combination with a default password, or they might perform reconnaissance through passive information gathering by observing the format of emails as an initial vector for finding a valid username format. Within this section, we focus on detecting brute-force attacks against RDP, which is one of the protocols that threat actors will attack. In the exercise, we will be placed in a position to detect SSH brute-forcing, which may be implemented across Windows hosts, building upon the methods of understanding what services run in our organization and by developing the process of adaptation in various scenarios.
