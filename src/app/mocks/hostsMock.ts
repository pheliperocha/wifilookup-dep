import { Host } from '../models/host';

export const HostsMock: Host[] = [{
  ip: '192.168.1.135',
  mac: '',
  hostname: '',
  osNmap: '',
  vendor: '',
  status: 'online',
  scanning: false
}, {
  ip: '192.168.1.1',
  mac: 'E4:18:6B:12:90:EE',
  hostname: '',
  osNmap: 'Netopia 2247 ADSL router',
  vendor: 'ZyXEL Communications',
  status: 'online',
  scanning: false
}, {
  ip: '192.168.1.3',
  mac: 'EA:08:6B:50:BF:7F',
  hostname: 'ZTE Modem',
  osNmap: 'Linux 2.6.23 - 2.6.38',
  vendor: '',
  status: 'inactive',
  scanning: true
}, {
  ip: '192.168.1.7',
  mac: '',
  hostname: 'Teste 1',
  osNmap: '',
  vendor: 'Teste 2',
  status: 'offline',
  scanning: false
}, {
  ip: '192.168.1.6',
  mac: 'D4:63:C6:51:C2:C6',
  hostname: '',
  osNmap: '',
  vendor: 'Motorola Mobility, a Lenovo Company',
  status: 'online',
  scanning: false
}];

//   IP: MAC: OS: HOSTNAME: 1VENDOR:
//
// IP: 192.168.1.7MAC: F0:D7:AA:1F:90:ACOS: Buffalo Cloudstor NAS deviceHOSTNAME: 1VENDOR: Motorola Mobility, a Lenovo Company
//
// IP: 192.168.1.10MAC: 74:E5:43:DB:B5:6FOS: Microsoft Windows Server 2008 SP1 or Windows Server 2008 R2HOSTNAME: 1VENDOR: Liteon Technology
//
// IP: 192.168.1.148MAC: EE:08:6B:F8:F7:70OS: Rebranded surveillance DVR (Hikvision, Q-SEE, EYEsurv, A1Webcams, Foscam)HOSTNAME: 1VENDOR:
//
//   IP: 192.168.1.8MAC: OS: Microsoft Windows 10 10586 - 14393HOSTNAME: 1VENDOR:
//
