# Detecting Cobalt Strike's PSExec

Cobalt Strike's `psexec` command is an implementation of the popular PsExec tool, which is a part of Microsoft's Sysinternals Suite. It's a lightweight telnet-replacement that lets you execute processes on other systems. Cobalt Strike's version is utilized to execute payloads on remote systems, as part of the post-exploitation process.

When the `psexec` command is invoked within Cobalt Strike, the following steps occur:

- `Service Creation`: The tool first creates a new service on the target system. This service is responsible for executing the desired payload. The service is typically created with a random name to avoid easy detection.
- `File Transfer`: Cobalt Strike then transfers the payload to the target system, often to the `ADMIN$` share. This is typically done using the SMB protocol.
- `Service Execution`: The newly created service is then started, which in turn executes the payload. This payload can be a shellcode, an executable, or any other file type that can be executed.
- `Service Removal`: After the payload has been executed, the service is stopped and deleted from the target system to minimize traces of the intrusion.
- `Communication`: If the payload is a beacon or another type of backdoor, it will typically establish communication back to the Cobalt Strike team server, allowing for further commands to be sent and executed on the compromised system.

Cobalt Strike's `psexec` works over port 445 (SMB), and it requires local administrator privileges on the target system. Therefore, it's often used after initial access has been achieved and privileges have been escalated.

#### How Cobalt Strike PSExec Traffic Looks Like

![Network packet capture showing SMB2 protocol activity. Highlights writing a service executable to a hidden share "ADMIN$" and opening a handle to create a new service. Includes session setup, file creation, and service creation steps.](images/113.png)

**Image Source**: [https://thedfirreport.com/2021/08/29/cobalt-strike-a-defenders-guide/](https://thedfirreport.com/2021/08/29/cobalt-strike-a-defenders-guide/)

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

- **Related Directory**: `/home/htb-student/module_files/cobalt_strike_psexec`
- **Related Splunk Index**: `cobalt_strike_psexec`
- **Related Splunk Sourcetype**: `bro:smb_files:json`

---

## Detecting Cobalt Strike's PSExec With Splunk & Zeek Logs

Now let's explore how we can identify Cobalt Strike's PSExec, using Splunk and Zeek logs.

```shell-session
index="cobalt_strike_psexec"
sourcetype="bro:smb_files:json"
action="SMB::FILE_OPEN" 
name IN ("*.exe", "*.dll", "*.bat")
path IN ("*\\c$", "*\\ADMIN$")
size>0
```

![Log entry showing SMB file open action. Details include time, origin IP, response IP, ports, file name "be5312f.exe," path "\DC\ADMIN$," size, access times, and UID.](images/114.png)
