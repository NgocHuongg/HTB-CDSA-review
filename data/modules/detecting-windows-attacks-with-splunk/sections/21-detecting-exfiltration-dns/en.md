# Detecting Exfiltration (DNS)

Attackers employ `DNS-based exfiltration` due to its reliability, stealthiness, and the fact that DNS traffic is often allowed by default in network firewall rules. By embedding data within DNS queries and responses, attackers can bypass security controls and exfiltrate data covertly. Below is a detailed explanation of this technique and detection methods:

#### How DNS Exfiltration Works:

- `Initial Compromise`: The attacker gains access to the victim's network, typically through malware, phishing, or exploiting vulnerabilities.
- `Data Identification and Preparation`: The attacker locates the data they want to exfiltrate and prepares it for transmission. This usually involves encoding or encrypting the data and splitting it into small chunks.
- `Exfiltration via DNS`: The attacker sends the data in the subdomains of DNS queries, utilizing techniques such as DNS tunneling or fast flux. They typically use a domain under their control or a compromised domain for this purpose. The attacker's DNS server receives the queries, extracts the data, and reassembles it.
- `Data Retrieval and Analysis`: After exfiltration, the attacker decodes or decrypts the data and analyzes it.

#### How DNS Exfiltration Traffic Looks Like

![Network packet capture showing DNS queries and responses. Includes source and destination IPs, protocol, and info with standard query details for letsophunt.online.](images/119.png)

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

- **Related Directory**: `/home/htb-student/module_files/dns_exf`
- **Related Splunk Index**: `dns_exf`
- **Related Splunk Sourcetype**: `bro:dns:json`

---

## Detecting DNS Exfiltration With Splunk & Zeek Logs

Now let's explore how we can identify DNS exfiltration, using Splunk and Zeek logs.

```shell-session
index=dns_exf sourcetype="bro:dns:json"
| eval len_query=len(query)
| search len_query>=40 AND query!="*.ip6.arpa*" AND query!="*amazonaws.com*" AND query!="*._googlecast.*" AND query!="_ldap.*"
| bin _time span=24h
| stats count(query) as req_by_day by _time, id.orig_h, id.resp_h
| where req_by_day>60
| table _time, id.orig_h, id.resp_h, req_by_day
```

![Log analysis tool showing a search query for DNS exfiltration events. Displays one event with columns for time, origin IP, response IP, and requests per day.](images/120.png)
