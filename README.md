# gun-mwal — GUN relay prêt pour Render

Ce dépôt lance un **relay GUN** (base de données P2P) derrière Express.
Une fois déployé sur Render, l’endpoint sera :

```
https://<votre-service>.onrender.com/gun
```

En nommant le service **gun-mwal**, l’URL sera : `https://gun-mwal.onrender.com/gun`

---

## Déploiement rapide (Blueprint)

1. **Créez un repo GitHub** avec ces fichiers.
2. Sur Render, cliquez **New > Blueprint** et pointez vers ce repo.
3. Validez le nom `gun-mwal` et déployez.  
   Render déduira les commandes via `render.yaml`.

> Le plan **Starter (ou supérieur)** est requis pour monter un **Persistent Disk**. Sans disque, le système de fichiers est **éphémère**.

## Déploiement manuel (New Web Service)

1. **New > Web Service**, connectez votre repo.
2. Runtime: **Node** ; Region : **Frankfurt (EU)** recommandé.
3. Build command: `npm ci --omit=dev` (ou `npm install --omit=dev`)
4. Start command: `node server.js`
5. Health Check path : `/healthz`
6. (Optionnel, recommandé) **Add Disk**: mount path `/opt/render/project/src/data`, size 1 GB.

## Tester

- Page d’accueil : `/`  
- Santé : `/healthz` (doit renvoyer `{status:"ok"}`)
- Endpoint GUN : `/gun`

Page de test (statique) : ouvrez `/client-test.html` après déploiement.

## Notes

- Le serveur écoute sur `0.0.0.0` et le port `process.env.PORT` comme exigé par Render.
- GUN persiste via **Radisk** dans `./data`. Attachez un **Persistent Disk** pour conserver les données entre redéploiements.
- CORS est **ouvert** (tous domaines). Ajustez selon vos besoins.
