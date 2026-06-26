# Legal delivery channels — index

Một KB canon (`../noxh/`) — ba playbook:

| ID | Playbook |
|----|----------|
| `aio_seo` | [aio-seo.md](./aio-seo.md) |
| `inbox_counseling` | [inbox-counseling.md](./inbox-counseling.md) |
| `staff_ops` | [staff-ops.md](./staff-ops.md) |

Machine config: [registry.json](./registry.json)  
Architecture: [docs/NOXH_THREE_CHANNEL_ARCHITECTURE.md](../../docs/NOXH_THREE_CHANNEL_ARCHITECTURE.md)

```bash
node -e "import('./scripts/lib/legal-channel-pack.mjs').then(m=>console.log(JSON.stringify(m.buildChannelPack('staff_ops',{topic:'noxh_documents'}),null,2)))"
```
