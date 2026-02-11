# 🚀 STEP-BY-STEP CLEAN SETUP



# 1️⃣ Make Sure Port 80 is Free

Run:

```bash
sudo lsof -i :80
```

If something appears (like node), stop it:

Find PID:

```bash
sudo lsof -i :80
```

Kill it:

```bash
sudo kill -9 <PID>
```

Now check again:

```bash
sudo lsof -i :80
```

It should return nothing.

---

# 2️⃣ Make Sure Frontend is Running on 3000

Start your frontend normally (however you start it).

Then check:

```bash
sudo lsof -i :3000
```

You should see:

```
node  xxxx  ubuntu  TCP 127.0.0.1:3000 (LISTEN)
```

If not, fix that first.

---

# 3️⃣ Start Nginx

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl status nginx
```

You must see:

```
Active: active (running)
```

---

# 4️⃣ Configure Nginx as Reverse Proxy

Open config:

```bash
sudo nano /etc/nginx/sites-available/propso.in
```

Paste this:

```nginx
server {
    listen 80;
    server_name propso.in www.propso.in;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save.

Enable it:

```bash
sudo ln -sf /etc/nginx/sites-available/propso.in /etc/nginx/sites-enabled/
```

Remove default site:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

Test config:

```bash
sudo nginx -t
```

If OK:

```bash
sudo systemctl reload nginx
```

---

# 5️⃣ Test HTTP

Open:

```
http://propso.in
```

If your frontend loads 🎉 → proceed to SSL.

---

# 6️⃣ Install Let’s Encrypt

Install:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

Run:

```bash
sudo certbot --nginx -d propso.in -d www.propso.in
```

Choose:

* Enter email
* Agree → Y
* Redirect HTTP to HTTPS → choose **2**

Certbot will automatically:

* Add SSL block
* Add redirect
* Configure certificates
* Enable auto renew

---

# 7️⃣ Test HTTPS

Open:

```
https://propso.in
```

You should see 🔒 secure.

---

# 8️⃣ Verify Auto Renewal

```bash
sudo certbot renew --dry-run
```

If no errors → auto renew working.

---

# 🔐 Final Production Structure

```
Internet
   ↓
Nginx (80/443)
   ↓
127.0.0.1:3000 (your frontend)
```

---

# ⚠️ Important Security Step

Make sure your frontend binds only to localhost:

In Node:

```js
app.listen(3000, "127.0.0.1");
```

This prevents access via:

```
http://16.16.101.72:3000
```

---

If anything fails, send me output of:

```bash
sudo lsof -i :80
sudo lsof -i :3000
sudo nginx -t
```


