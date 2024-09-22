function calculateSubnet(ip, cidr) {
    const ipParts = ip.split('.').map(part => parseInt(part));
    const subnetMask = -1 << (32 - cidr);
    console.log(subnetMask)
    const subnetMaskParts = [
        (subnetMask >>> 24) & 255,
        (subnetMask >>> 16) & 255,
        (subnetMask >>> 8) & 255,
        subnetMask & 255
    ];
    // calculate the number of usable IP Address
    const numberOfIPs =  (2 ** (32 - cidr)) - 2;

    // Calculate the network address
    const networkAddressParts = ipParts.map((part, index) => part & subnetMaskParts[index]);

    // Calculate the broadcast address
    const broadcastAddressParts = networkAddressParts.map((part, index) => part | ~subnetMaskParts[index] & 255);

    // Calculate the range of usable IPs
    const firstUsableIPParts = [...networkAddressParts];
    firstUsableIPParts[3] += 1; // First usable IP is network address + 1

    const lastUsableIPParts = [...broadcastAddressParts];
    lastUsableIPParts[3] -= 1; // Last usable IP is broadcast address - 1

    return {
        numberOfIPs: numberOfIPs,
        networkAddress: networkAddressParts.join('.'),
        broadcastAddress: broadcastAddressParts.join('.'),
        firstUsableIP: firstUsableIPParts.join('.'),
        lastUsableIP: lastUsableIPParts.join('.'),
        subnetMask: subnetMaskParts.join('.')
    };
}

document.getElementById('subnet-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const ip = document.getElementById('ip').value;
    const cidr = parseInt(document.getElementById('cidr').value);
    const results = calculateSubnet(ip, cidr);

    const resultsDiv = document.getElementById('results');
    // resultsDiv.innerHTML = `
    //     <p><strong>Network Address:</strong> ${results.networkAddress}</p>
    //     <p><strong>Broadcast Address:</strong> ${results.broadcastAddress}</p>
    //     <p><strong>First Usable IP:</strong> ${results.firstUsableIP}</p>
    //     <p><strong>Last Usable IP:</strong> ${results.lastUsableIP}</p>
    //     <p><strong>Subnet Mask:</strong> ${results.subnetMask}</p>
    // `;
    const NIP = document.getElementById("NIP").innerHTML= `${results.numberOfIPs}`;
    const NAIP = document.getElementById("NA").innerHTML=`${results.networkAddress}`;
    const BAIP = document.getElementById("BA").innerHTML=`${results.broadcastAddress}`;
    const FUIP = document.getElementById("FU").innerHTML=`${results.firstUsableIP}`;
    const LUIP = document.getElementById("LU").innerHTML=`${results.lastUsableIP}`;
    const SMIP = document.getElementById("SM").innerHTML=`${results.subnetMask}`;
})

