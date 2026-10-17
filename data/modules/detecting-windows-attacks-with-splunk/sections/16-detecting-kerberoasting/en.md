# Detecting Kerberoasting

In 2016, a number of blog posts and articles emerged discussing the tactic of querying Service Principal Name (SPN) accounts and their corresponding tickets, an attack that came to be known as `Kerberoasting`. By possessing just one legitimate user account and its password, an attacker could retrieve the SPN tickets and attempt to break them offline.

After examining numerous resources on kerberoasting, it is evident that `RC4` is utilized for ticket encryption behind the scenes. We will exploit this underpinning as a detection point in this section.

**Evidence Source**: [https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/t1208-kerberoasting](https://www.ired.team/offensive-security-experiments/active-directory-kerberos-abuse/t1208-kerberoasting)

#### How Kerberoasting Traffic Looks Like

![Network packet capture showing Kerberos TGS-REQ and TGS-REP packets. Includes kdc-options with flags, enc-part with etype ARCFour-HMAC-MD5, and packet details like time, source, destination, protocol, and length.](images/109.png)

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

- **Related Directory**: `/home/htb-student/module_files/sharphound`
- **Related Splunk Index**: `sharphound`
- **Related Splunk Sourcetype**: `bro:kerberos:json`

---

## Detecting Kerberoasting With Splunk & Zeek Logs

Now let's explore how we can identify Kerberoasting, using Splunk and Zeek logs.

```shell-session
index="sharphound" sourcetype="bro:kerberos:json"
request_type=TGS cipher="rc4-hmac" 
forwardable="true" renewable="true"
| table _time, id.orig_h, id.resp_h, request_type, cipher, forwardable, renewable, client, service
```

![Log analysis tool showing a search query for SharpHound events. Displays 14 events with columns for time, origin IP, response IP, request type, cipher, forwardable, renewable, client, and service.](images/110_new.png)
