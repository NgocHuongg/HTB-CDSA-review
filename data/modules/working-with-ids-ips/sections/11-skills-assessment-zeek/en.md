# Skills Assessment - Zeek

## Intrusion Detection With Zeek: Detecting Gootkit's SSL Certificate

**PCAP source**: [https://www.malware-traffic-analysis.net/2016/07/08/index.html](https://web.archive.org/web/20230128061716/https://www.malware-traffic-analysis.net/2016/07/08/index.html)

**Attack description and possible detection points**: [https://www.malware-traffic-analysis.net/2016/07/08/index.html](https://web.archive.org/web/20230128061716/https://www.malware-traffic-analysis.net/2016/07/08/index.html) <-- Focus on the SSL certificate parts.

`Neutrino`, a notorious exploit kit, and `Gootkit`, a potent banking trojan, collaborated in the past to perpetrate cyberattacks.

The `Neutrino` exploit kit opened the gate, and then `Gootkit` begun to communicate over the network using SSL/TLS encryption. It's within these encrypted communications that we encountered a particularly striking detail - the SSL certificates used by `Gootkit` contained the Common Name (`CN`) "`My Company Ltd.`".

Cybercriminals frequently employ self-signed or non-trusted CA issued certificates to foster encrypted communication. These certificates often feature bogus or generic details. In this case, the common name `My Company Ltd.` stands out as an anomaly we can use to identify this specific `Gootkit` infection delivered via the `Neutrino` exploit kit.

---

Review the previously referenced resource that discusses the network traces resulting from `Gootkit` communications, and then proceed to address the following question.
