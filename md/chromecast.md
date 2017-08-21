
# chromecast setup:

### Chromecast device has DNS settings hardcoded, so for now the only option is to redirect DNS requests with a Wifi router with such capability. If your Wifi Router has DD-WRT or OpenWRT firmware you can follow these instructions:

### 1.-To set the Network Address Server Setings (DHCP) to the ProxyDNS servers. (74.207.242.213 and 50.116.28.138)

### 2.- Configure the following Dnsmasq options with the following iptables commands:

iptables -t nat -A PREROUTING -d 8.8.8.8 -j DNAT --to-destination 74.207.242.213 

iptables -t nat -A PREROUTING -d 8.8.4.4 -j DNAT --to-destination 50.116.28.138 

### 3.- DNS requests from chromecast will now be redirected to the unblocking DNS server.

### Make sure [your IP is enabled](/#manage)  

